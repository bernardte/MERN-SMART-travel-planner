import TravelGuide from "../models/community.model";
import TripPlan from "../models/tripPlan.model";
import { successApiResponse } from "../utils/succes_api_response";
import { AppError } from "../utils/error_api_response";
import type { Request, Response } from "express";
import { uploadToCloudinary } from "../utils/helpers/uploadToCloudinary";
import cloudinary from "../config/cloudinary";

const createPost = async (req: Request, res: Response) => {
  const { title, description, country, tags, privacy, authorId, itineraryId } =
    req.body;

  if (!title || !description || !country || !authorId || !itineraryId) {
    throw new AppError(400, "All field are required!");
  }
  const parsedTags = Array.isArray(tags) ? tags : [tags];

  if (!req.file) {
    throw new AppError(400, "Thumbnail image is required!");
  }

  const { url, public_id } = await uploadToCloudinary(
    req.file.buffer,
    "travel_guide",
  );

  //! Create new post
  const newPost = await TravelGuide.create({
    title,
    description,
    country,
    thumbnailImage: url,
    thumbnailImagePublicId: public_id,
    tags: parsedTags,
    privacy,
    authorId,
    itineraryId,
  });

  successApiResponse(res, 201, "Post created successfully", newPost);
};

const fetchUserItinerary = async (
  req: Request<{ authorId: string }>,
  res: Response,
) => {
  const { authorId } = req.params;

  if (!authorId) throw new AppError(400, "User ID are required");

  const itineraries = await TripPlan.find({
    userId: authorId,
  })
    .select("_id country title")
    .sort({ createdAt: -1 });

  if (itineraries.length === 0)
    throw new AppError(404, "Itineraries not found");

  successApiResponse(res, 200, "Itineraries found", itineraries);
};
const getAllPublicPost = async (req: Request, res: Response) => {
  const allPublicPost = await TravelGuide.find({
    privacy: "public",
  })
    .populate("authorId", "username name email profilePicture")
    .populate("itineraryId")
    .sort({ createdAt: -1 });

  if (allPublicPost.length === 0) {
    throw new AppError(404, "All public post not found");
  }

  //! normalize data
  const normalized = allPublicPost.map((post) => {
    const obj = post.toObject();

    return {
      ...obj,

      // ✅ rename
      author: obj.authorId,
      authorId: undefined,

      // ✅ numbers
      likes: obj.likes?.length || 0,
      saves: obj.postSavedByUser?.length || 0,

      // ✅ stats
      stats: {
        views: obj.views || 0,
      },
      createdAt: obj.createdAt,

      // ✅ itinerary
      itinerary: obj.itineraryId
        ? {
            _id: obj.itineraryId,
            title: obj.title,
            country: obj.country,
          }
        : null,
    };
  });

  successApiResponse(res, 200, "", normalized);
};
const deleteOwnPost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userId = req.user?._id;

  const post = await TravelGuide.findById(postId);

  if (!post) {
    throw new AppError(404, "Post not found");
  }

  if(!userId){
    throw new AppError(401, "Unauthorized");
  }

  if (post.authorId.toString() !== userId?.toString()) {
    throw new AppError(403, "You are not allowed to delete this post");
  }

  // delete image from cloudinary
  if (post.thumbnailImagePublicId) {
    try {
      // extract public_id from URL
      // const parts = post.thumbnailImage.split("/");
      // const fileWithExt = parts[parts.length - 1];
      // const publicId = `travel_guide/${fileWithExt?.split(".")[0]}`;
      await cloudinary.uploader.destroy(post.thumbnailImagePublicId);
    } catch (err) {
      console.log("Cloudinary delete error:", err);
    }

    await TravelGuide.findByIdAndDelete(postId);

    successApiResponse(res, 200, "Post deleted successfully");
  }
};

export default {
  createPost,
  fetchUserItinerary,
  getAllPublicPost,
  deleteOwnPost,
};
