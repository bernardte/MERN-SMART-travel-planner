import type { Request, Response } from "express";
import User from "../models/user.model";
import { successApiResponse } from "../utils/succes_api_response";
import { AppError } from "../utils/error_api_response";
import bcrypt from "bcryptjs";
import type { UserLoginDTO, UserRegisterDTO } from "../types/DTO/user.dto";
import generateTokensAndSetCookies from "../utils/auth/generate_tokens_and_set_cookies";
import { env } from "../config/env";
import mongoose from "mongoose";
import CommunityTravelGuide from "../models/community.model";

const registerAccount = async (
  req: Request<{}, {}, UserRegisterDTO>,
  res: Response,
): Promise<void> => {
  const { name, username, email, password } = req.body;

  if (
    !name?.trim() ||
    !username?.trim() ||
    !email?.trim() ||
    !password?.trim()
  ) {
    throw new AppError(400, "All fields are required.");
  }

  if (password.length < 8) {
    throw new AppError(409, "Password must be at least 8 characters long");
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    throw new AppError(409, "Invalid email format");
  }

  // check email exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new AppError(409, "Email or username already in use.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  if (!newUser) {
    throw new AppError(500, "Failed to create user.");
  }

  successApiResponse(res, 201, "Account registered successfully", {
    _id: newUser._id,
    name: newUser.name,
    username: newUser.username,
    email: newUser.email,
  });
};

const loginAccount = async (
  req: Request<{}, {}, UserLoginDTO>,
  res: Response,
) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    throw new AppError(400, "Email and password are required.");
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new AppError(401, "Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password.");
  }

  const { accessToken } = generateTokensAndSetCookies(user._id, res);
  successApiResponse(res, 200, "Login successful", {
    _id: user._id,
    username: user.username,
    email: user.email,
    token: accessToken,
  });
};

const logoutAccount = async (
  req: Request<{}, {}, UserLoginDTO>,
  res: Response,
) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: env.NODE_ENV == "production" ? "none" : "lax",
    secure: env.NODE_ENV == "production",
    expires: new Date(Date.now()),
    maxAge: 1,
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: env.NODE_ENV == "production" ? "none" : "lax",
    secure: env.NODE_ENV == "production",
    expires: new Date(Date.now()),
    maxAge: 1,
  });

  successApiResponse(res, 201, "Logout successfully");
};

const getLoginUser = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const user = await User.findById({ _id: userId }).select("-password");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  successApiResponse(res, 200, "User found", {
    user,
  });
};

const followAndUnfollowUser = async (req: Request, res: Response) => {
  const currentUserId = req.user?._id; // current user
  const targetUserId = req.params?.userId as string; // target user

  if (!currentUserId || !targetUserId) {
    throw new AppError(400, "User ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    throw new AppError(400, "Invalid userID");
  }

  if (currentUserId.toString() === targetUserId) {
    throw new AppError(400, "You cannot follow yourself");
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) {
    throw new AppError(404, "User not found");
  }

  const isFollowing = currentUser.following.some(
    (id) => id.toString() === targetUserId,
  );

  if (isFollowing) {
    // remove the target user from the following
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId,
    );

    // remove the followers of the current user
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId.toString(),
    );

    // save
    await currentUser.save();
    await targetUser.save();

    successApiResponse(res, 200, "User unfollowed successfully", {
      isFollowing: isFollowing,
      followersCount: targetUser.followers.length,
    });
    return;
  }
  // current user add target user to the following
  currentUser.following.push(targetUser._id);
  // target user add current user to the followers
  targetUser.followers.push(currentUser._id);

  await currentUser.save();
  await targetUser.save();

  successApiResponse(res, 200, "User followed successfully", {
    isFollowing: !isFollowing,
    followersCount: targetUser.followers.length,
  });
};

const getUserProfile = async (req: Request, res: Response) => {
  const { username } = req.params;

  if(!username) throw new AppError(400, "Invalid username");

  const user = await User.findOne({
    username,
  }).select("-password -__v -resetToken -resetTokenExpiration");

  if(!user) throw new AppError(404, "User not found");

  successApiResponse(res, 200, "", user);
}

const getUserPublishTravelGuide = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if(!userId) throw new AppError(400, "Invalid userID");

  const travelGuide = await CommunityTravelGuide.find({ authorId: userId });

  if(!travelGuide) throw new AppError(404, "Travel guide not found");

  successApiResponse(res, 200, "travel guide found", travelGuide);
}

export default {
  registerAccount,
  loginAccount,
  logoutAccount,
  getLoginUser,
  followAndUnfollowUser,
  getUserProfile,
  getUserPublishTravelGuide,
};
