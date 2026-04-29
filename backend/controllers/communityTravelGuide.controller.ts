import TravelGuide from "../models/community.model";
import TripPlan from "../models/tripPlan.model";
import { successApiResponse } from "../utils/succes_api_response";
import { AppError } from "../utils/error_api_response";
import type { Request, Response } from "express";
import { uploadToCloudinary } from "../utils/helpers/uploadToCloudinary";
import { deleteFromCloudinary } from "../utils/helpers/deleteFromCloudinary";

const createPost = async (req: Request, res: Response) => {
  const { title, description, country, tags, privacy, authorId, itineraryId } =
    req.body;

  console.log(req.body);

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
    saves: 0,
    views: 0,
  });

  const populated = await TravelGuide.findById(newPost._id)
    .populate("authorId", "username name email profilePicture")
    .populate("itineraryId");

  const obj = populated!.toObject();

  const normalized = {
    ...obj,
    author: obj.authorId,
    authorId: undefined,
    likes: obj.likes?.length || 0,
    saves: obj.postSavedByUser?.length || 0,
    stats: {
      views: obj.views || 0,
    },
    itinerary: obj.itineraryId
      ? {
          _id: obj.itineraryId._id,
          title: obj.title,
          country: obj.country,
        }
      : null,
  };

  successApiResponse(res, 201, "Post created successfully", normalized);
};

const editPost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { title, description, country, tags, privacy, authorId, itineraryId } =
    req.body;

  if (!postId) throw new AppError(400, "Post ID are required");

  // Check if post exists
  const existingPost = await TravelGuide.findById(postId);

  if (!existingPost) throw new AppError(404, "Post not found");

  // Update only provided fields (PATCH behavior)
  if (title !== undefined) existingPost.title = title;
  if (description !== undefined) existingPost.description = description;
  if (authorId !== undefined) existingPost.authorId = authorId;
  if (country !== undefined) existingPost.country = country;
  if (privacy !== undefined) existingPost.privacy = privacy;
  if (itineraryId !== undefined) existingPost.itineraryId = itineraryId;

  if (tags !== undefined) {
    if (Array.isArray(tags)) {
      existingPost.tags = tags;
    } else {
      try {
        existingPost.tags = JSON.parse(tags);
      } catch {
        existingPost.tags = [];
      }
    }
  }

  // image update
  if (req.file?.buffer) {
    const existingPublicId = existingPost.thumbnailImagePublicId;

    if (existingPublicId) {
      await deleteFromCloudinary(existingPublicId);
    }

    const { url, public_id } = await uploadToCloudinary(req.file.buffer);
    existingPost.thumbnailImage = url;
    existingPost.thumbnailImagePublicId = public_id;
  }

  const updatedPost = await existingPost.save();
  console.log(updatedPost);

  successApiResponse(res, 200, "updated successfully", updatedPost);
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

  successApiResponse(res, 200, "Itineraries found", itineraries);
};

const getAllPublicPost = async (req: Request, res: Response) => {
  const allPublicPost = await TravelGuide.find({
    privacy: "public",
  })
    .populate("authorId", "username name email profilePicture")
    .sort({ createdAt: -1 });

  console.log(allPublicPost);


  //! normalize data
  const normalized = allPublicPost.map((post) => {
    const obj = post.toObject();

    return {
      ...obj,

      //  rename
      author: obj.authorId,
      authorId: undefined,

      //  numbers
      likes: obj.likes?.length || 0,
      saves: obj.postSavedByUser?.length || 0,

      // stats
      stats: {
        views: obj.views || 0,
      },
      createdAt: obj.createdAt,

      //  itinerary
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
  // extract public_id from URL
  // const parts = post.thumbnailImage.split("/");
  // const fileWithExt = parts[parts.length - 1];
  // const publicId = `travel_guide/${fileWithExt?.split(".")[0]}`;
  if (post.thumbnailImagePublicId) {
    await deleteFromCloudinary(post.thumbnailImagePublicId)
    await TravelGuide.findByIdAndDelete(postId);
    successApiResponse(res, 200, "Post deleted successfully");
  }
};

export default {
  createPost,
  editPost,
  fetchUserItinerary,
  getAllPublicPost,
  deleteOwnPost,
};
