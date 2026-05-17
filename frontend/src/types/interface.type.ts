export interface User {
  _id: string;
  email: string;
  username: string;
  name: string;
  profilePicture?: string;
  bio?: string;
  followers: string[];
  following: string[];
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostUserSummary {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
}

//! Interface of Location and Date is part of Trip attribute
//! Location -> Date -> Trip
export interface ILocation {
  id: string;
  name: string;
  note: string;
  lat: number;
  lng: number;
}
export interface IDay {
  date: string;
  locations: ILocation[];
}
export interface Trip {
  _id: string;
  userId: User;
  country: string;
  startDate: string;
  endDate: string;
  days: IDay[];
  isTravelGuideCreated: boolean;
  createdAt: string;
  tripPlanId?: string;
}

export interface Comment {
  _id?: string;
  user: User;
  content: string;
  createdAt: string;
}

// Types for data structure
export interface ListItem {
  id: string;
  text: string;
  type: "text" | "checklist";
  checked?: boolean;
}

export interface Place {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  category: "restaurant" | "attraction" | "cafe" | "viewpoint" | "other";
  address?: string;
  timeEstimate?: string;
  locationImageUrl?: string;
}

export interface RouteStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  order: number;
}

export interface DaySection {
  id: string;
  type: "day";
  title: string;
  route: RouteStop[];
  places: Place[];
  listItems: ListItem[];
  notes: string;
  isOpen: boolean;
}

export interface TipsSection {
  id: string;
  type: "tips";
  title: string;
  content: string;
  isOpen: boolean;
}

export type Section = TipsSection | DaySection;

//! community post
export interface TravelGuide {
  _id: string;
  title: string;
  description: string;
  country: string;
  thumbnailImage: string;
  imagePreviews?: string[];
  author?: PostUserSummary; // 🔥 mapped from authorId
  tags: string[];
  likes: number;
  postLikedByUser: string[]; // 🔥 length of backend likes[]
  saves: number;
  views: number;
  shares: number;
  isLiked?: boolean;
  isSaved?: boolean;
  itineraryId: {
    _id: string;
  };
  privacy: "public" | "private";
  createdAt: Date;
  updatedAt?: Date;
  stats?: {
    views: number;
  };
  itinerary?: {
    _id: string;
    country: string;
    title: string;
  };
}

export type CreateTravelGuide = Omit<
  TravelGuide,
  "_id" | "createdAt" | "updatedAt"
>;

//! Landing Page
export interface PopularDestination {
  topGuide: {
    _id: string;
    thumbnailImage: string;
    description: string;
  };
  country: string;
}