import type { Request, Response } from "express";
import type { CreatTripPlanDTO } from "../types/DTO/travel_guide.dto";
import { AppError } from "../utils/error_api_response";
import mongoose from "mongoose";
import { successApiResponse } from "../utils/succes_api_response";
import Trip from "../models/trip.model";
import TripPlan from "../models/tripPlan.model";

const createTrip = async (
  req: Request<{}, {}, CreatTripPlanDTO>,
  res: Response,
) => {
  const title = req.body.title as string;
  const authorIntro = req.body.authorIntro as string;
  const tripId = req.body.tripId as string;
  const sections = JSON.parse(req.body.sections as string);
  const user = req.user;

  if (!title || !title.trim() || !sections || sections.length === 0) {
    throw new AppError(400, "Title and sections are required");
  }

  if (!tripId || !mongoose.Types.ObjectId.isValid(tripId)) {
    throw new AppError(400, "Invalid tripId");
  }

  const tripObjectId = new mongoose.Types.ObjectId(tripId);
  const existingGuide = await TripPlan.findOne({ tripId: tripObjectId });

  if (existingGuide) {
    throw new AppError(400, "Guide already exists for this trip");
  }

  const trip = await Trip.findById(tripObjectId).select("country isTravelGuideCreated");
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
  trip.isTravelGuideCreated = true;
  await trip.save();

  successApiResponse(res, 201, "Travel guide created successfully!", newGuide);
};

const getTripPlan = async (req: Request, res: Response) => {
  const tripPlanId = req.params.tripPlanId as string;

  if (!tripPlanId || !mongoose.Types.ObjectId.isValid(tripPlanId)) {
    throw new AppError(400, "Invalid tripPlanId");
  }

  const tripPlan = await TripPlan.findById(new mongoose.Types.ObjectId(tripPlanId));
  if (!tripPlan) throw new AppError(404, "Trip plan not found");

  successApiResponse(res, 200, "Trip plan fetched successfully!", tripPlan);
};

const updateTripPlan = async (
  req: Request<{ tripPlanId: string }, {}, CreatTripPlanDTO>,
  res: Response,
) => {
  const tripPlanId = req.params.tripPlanId as string;
  const title = req.body.title as string;
  const authorIntro = req.body.authorIntro as string;
  const sections = JSON.parse(req.body.sections as string);
  const user = req.user;

  if (!tripPlanId || !mongoose.Types.ObjectId.isValid(tripPlanId)) {
    throw new AppError(400, "Invalid tripPlanId");
  }

  const tripPlan = await TripPlan.findById(new mongoose.Types.ObjectId(tripPlanId));
  if (!tripPlan) throw new AppError(404, "Trip plan not found");

  if (tripPlan.userId.toString() !== user?._id.toString()) {
    throw new AppError(403, "Unauthorized");
  }

  if (title) tripPlan.title = title;
  if (authorIntro !== undefined) tripPlan.authorIntro = authorIntro;
  if (sections && sections.length > 0) tripPlan.sections = sections;

  await tripPlan.save();

  successApiResponse(res, 200, "Trip plan updated successfully!", tripPlan);
};

export default {
  createTrip,
  getTripPlan,
  updateTripPlan,
};