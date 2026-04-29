import type { Request, Response } from "express";
import type { CreatTripPlanDTO } from "../types/DTO/travel_guide.dto";
import { AppError } from "../utils/error_api_response";
import mongoose from "mongoose";
import { successApiResponse } from "../utils/succes_api_response";
import Trip from "../models/trip.model";
import { mongoDBObjectIDConverter } from "../utils/helpers/mongoDBObjectIDConverter";
import TripPlan from "../models/tripPlan.model";

const createTrip = async (
  req: Request<{}, {}, CreatTripPlanDTO>,
  res: Response,
) => {
  const { title, authorIntro, tripId } = req.body;
  const sections = JSON.parse(req.body.sections);
  const user = req.user;

  if (!title || !title.trim() || !sections || sections.length === 0) {
    throw new AppError(400, "Title and sections are required");
  }

  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    throw new AppError(400, "Invalid tripId");
  }

  const tripObjectId = mongoDBObjectIDConverter(tripId);

  const existingGuide = await TripPlan.findOne({ tripId: tripObjectId });

  if (existingGuide) {
    throw new AppError(400, "Guide already exists for this trip");
  }

  const trip = await Trip.findById(tripObjectId).select(
    "country isTravelGuideCreated",
  );
  if (!trip?.country) throw new AppError(400, "Trip not found");

  const newGuide = new TripPlan({
    title,
    authorIntro,
    tripId: tripObjectId,
    userId: user?._id,
    country: trip.country,
    authorName: user?.name,
    authorAvatar: user?.profilePicture ?? "",
    sections: sections,
    publishStatus: "private",
  });

  await newGuide.save();

  // update trip
  trip.isTravelGuideCreated = true;
  await trip.save();
  successApiResponse(res, 201, "Travel guide created successfully!", newGuide);
};


export default {
  createTrip,
};
