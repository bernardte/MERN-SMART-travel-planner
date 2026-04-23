import type { Request, Response } from "express";
import User from "../models/user.model";
import { successApiResponse } from "../utils/succes_api_response";
import { AppError } from "../utils/error_api_response";
import bcrypt from "bcryptjs";
import type { UserLoginDTO, UserRegisterDTO } from "../types/DTO/user.dto";
import generateTokensAndSetCookies from "../utils/auth/generate_tokens_and_set_cookies";
import { env } from "../config/env";

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

export default {
  registerAccount,
  loginAccount,
  logoutAccount,
  getLoginUser,
};
