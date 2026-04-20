import User from "../models/user.model";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error_api_response";

interface DecodedToken extends JwtPayload {
  _id: string;
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken;
    if(!token){
        throw new AppError(401, "Unauthorized");
    }

    const decoded = jwt.verify(token, env.JWT_ACCESS_TOKEN) as DecodedToken;

    const user = await User.findById(decoded._id).select('-password');

    if(!user) throw new AppError(401, "User not found, authorization denied");


    req.user = user;
    next();

  } catch (error) {
    next(error)
  }
};