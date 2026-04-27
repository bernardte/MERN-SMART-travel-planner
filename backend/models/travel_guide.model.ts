import mongoose, { Types } from "mongoose";
import { sectionSchema } from "./section.model";

export interface ITravelGuide {
  _id: Types.ObjectId;

  // 🔗 Link to Trip
  tripId: Types.ObjectId;
  userId: Types.ObjectId;

  // 📌 Guide Info
  title: string;
  authorName: string;
  authorAvatar?: string;
  authorIntro: string;

  // 🌍 Content
  sections: any[]; // mixed (tips + day)

  // 🌏 Meta
  country?: string;

  // ❤️ Social
  likesCount: number;
  averageRating: number;
  totalRatings: number;
  thumbnailImage: String;

  // 🔐 Visibility
  publishStatus: "publish" | "private";
  reviews: {
    user: Types.ObjectId;
    username: string;
    rating: Number;
    comment: String;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const travelGuideSchema = new mongoose.Schema<ITravelGuide>(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },

    authorName: String,
    authorAvatar: String,
    authorIntro: String,

    sections: [sectionSchema],

    country: String,
    thumbnailImage: String,

    likesCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: { type: String },
        tripId: { type: mongoose.Schema.Types.ObjectId },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    publishStatus: {
      type: String,
      enum: ["publish", "private"],
      default: "private",
    },
  },
  { timestamps: true },
);

travelGuideSchema.index({ userId: 1 });
travelGuideSchema.index({ publishStatus: 1 });
travelGuideSchema.index({ country: 1 });

const TravelGuide = mongoose.model<ITravelGuide>(
  "TravelGuide",
  travelGuideSchema,
);

export default TravelGuide;
