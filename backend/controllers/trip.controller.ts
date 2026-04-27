import type { Request, Response } from "express";
import mongoose from "mongoose";
import Trip from "../models/trip.model";
import { successApiResponse } from "../utils/succes_api_response";
import { AppError } from "../utils/error_api_response";
import type { SaveTripBodyDTO } from "../types/DTO/trip.dto";

const saveTrip = async (
  req: Request<{}, {}, SaveTripBodyDTO>,
  res: Response,
): Promise<void> => {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const userId = req.user._id;
  const { country, startDate, endDate, days } = req.body;

  if (!country?.trim()) throw new AppError(400, "Country is required.");
  if (!startDate?.trim() || !endDate?.trim())
    throw new AppError(400, "Start date and end date are required.");
  if (!Array.isArray(days) || days.length === 0)
    throw new AppError(400, "At least one day is required.");

  const trip = await Trip.create({ userId, country, startDate, endDate, days });
  successApiResponse(res, 201, "Trip saved successfully", { trip });
};

const getMyTrips = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const userId = req.user._id;

  const trips = await Trip.find({ userId }).sort({ createdAt: -1 });
  successApiResponse(res, 200, "Trips fetched successfully", { trips });
};

const getTripById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const userId = req.user._id;
  const { id } = req.params;

  const trip = await Trip.findOne({
    _id: id,
    userId,
  } as any);

  if (!trip) throw new AppError(404, "Trip not found.");
  successApiResponse(res, 200, "Trip fetched successfully", { trip });
};

const updateTrip = async (
  req: Request<{ id: string }, {}, SaveTripBodyDTO>,
  res: Response,
): Promise<void> => {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const userId = req.user._id;
  const { id } = req.params;
  const { country, startDate, endDate, days } = req.body;

  if (!country?.trim()) throw new AppError(400, "Country is required.");
  if (!startDate?.trim() || !endDate?.trim())
    throw new AppError(400, "Start date and end date are required.");

  const trip = await Trip.findOneAndUpdate(
    { _id: id, userId } as any,
    { country, startDate, endDate, days },
    { new: true },
  );

  if (!trip) throw new AppError(404, "Trip not found or not authorized.");
  successApiResponse(res, 200, "Trip updated successfully", { trip });
};

const deleteTrip = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const userId = req.user._id;
  const { id } = req.params;

  const trip = await Trip.findOneAndDelete({
    _id: id,
    userId,
  } as any);

  if (!trip) throw new AppError(404, "Trip not found or not authorized.");
  successApiResponse(res, 200, "Trip deleted successfully");
};

export default {
  saveTrip,
  getMyTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};