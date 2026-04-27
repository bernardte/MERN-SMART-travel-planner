import type { Types } from "mongoose";
import type { ISections } from "../../models/section.model";

export interface createTravelGuideDTO {
  title: string;
  authorIntro: string;
  tripId: string;
  sections: string; //* due to frontend sending as JSON.stringify() will convert to a string when passing.
}
