import type { TravelGuide } from "@/types/interface.type";

export const normalizeTravelGuide = (item: any): TravelGuide => {
  return {
    _id: item._id,
    title: item.title,
    description: item.description,
    country: item.country,
    thumbnailImage: item.thumbnailImage,

    // 🔥 map authorId → author
    author: {
      _id: item.authorId?._id,
      name: item.authorId?.name,
      username: item.authorId?.username,
    },

    tags: item.tags || [],

    // backend array → frontend number
    likes: item.likes?.length || 0,
    saves: item.saves || 0,
    shares: 0,

    isLiked: false,
    isSaved: false,

    privacy: item.privacy,

    createdAt: new Date(item.createdAt),
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,

    stats: {
      views: item.views || 0,
    },

    // 🔥 map itineraryId → itinerary
    itinerary: item.itineraryId
      ? {
          _id: item.itineraryId._id,
          title: item.itineraryId.title,
          country: item.itineraryId.country,
        }
      : undefined,
  };
};
