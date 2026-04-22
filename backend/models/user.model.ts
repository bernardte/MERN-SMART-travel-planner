import mongoose, { type ObjectId } from "mongoose";

export interface IUser {
  _id: ObjectId;
  name: string;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  resetToken?: string | null;
  resetTokenExpiration?: Date | null;
}


const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiration: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
