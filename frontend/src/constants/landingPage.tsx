import type { ReactNode } from "react";
import {
  Compass,
  Users,
  Camera,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react";

interface NavigationItems {
  label: string;
  link: string;
}

export const navigationItems: NavigationItems[] = [
  { label: "Home", link: "/" },
  { label: "Community Guide", link: "/community" },
  { label: "Dashboard", link: "/dashboard" },
];


export interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface Destination {
  name: string;
  country: string;
  image: string;
  rating: number;
  slug: string;
}

export interface Guide {
  title: string;
  author: string;
  avatar: string;
  rating: number;
  reads: string;
}

export interface Testimonial {
  name: string;
  location: string;
  avatar: string;
  rating: number;
  comment: string;
}

// features
export const features: Feature[] = [
  {
    icon: <Compass className="h-6 w-6" />,
    title: "Smart Trip Planning",
    description:
      "AI-powered itinerary builder that creates personalized travel plans based on your preferences and budget.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community Insights",
    description:
      "Access authentic reviews, tips, and guides from real travelers who've been there.",
  },
  {
    icon: <Camera className="h-6 w-6" />,
    title: "Visual Discovery",
    description:
      "Explore destinations through stunning photos and videos from our global community.",
  },
  // {
  //   icon: <TrendingUp className="h-6 w-6" />,
  //   title: "Price Tracking",
  //   description:
  //     "Get alerts when flight and hotel prices drop for your dream destinations.",
  // },
  // {
  //   icon: <Calendar className="h-6 w-6" />,
  //   title: "Itinerary Sharing",
  //   description:
  //     "Share your travel plans with friends and collaborate on group trips.",
  // },
  // {
  //   icon: <Award className="h-6 w-6" />,
  //   title: "Travel Badges",
  //   description:
  //     "Earn achievements and recognition as you explore new places and share experiences.",
  // },
];

//destinations
export const destinations: Destination[] = [
  {
    name: "Bali",
    country: "Indonesia",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=500&fit=crop",
    rating: 4.9,
    slug: "bali",
  },
  {
    name: "Paris",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=500&fit=crop",
    rating: 4.8,
    slug: "paris",
  },
  {
    name: "Tokyo",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&h=500&fit=crop",
    rating: 4.9,
    slug: "tokyo",
  },
  {
    name: "Santorini",
    country: "Greece",
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=500&fit=crop",
    rating: 4.8,
    slug: "santorini",
  },
];

// guides
export const guides: Guide[] = [
  {
    title: "Hidden Cafés in Tokyo",
    author: "Sarah Chen",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop",
    rating: 4.9,
    reads: "2.3k",
  },
  {
    title: "Budget Travel in Europe",
    author: "Mike Johnson",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop",
    rating: 4.8,
    reads: "1.8k",
  },
  {
    title: "Solo Female Travel Tips",
    author: "Emma Watson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop",
    rating: 4.9,
    reads: "3.1k",
  },
];


//  testimonials
// testimonials
export const testimonials: Testimonial[] = [
  {
    name: "Jessica Park",
    location: "New York, USA",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
    rating: 5,
    comment:
      "TravelBuddy completely transformed how I plan my trips. The community guides are incredibly helpful and the itinerary builder saved me hours of research!",
  },
  {
    name: "David Kim",
    location: "Seoul, South Korea",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
    rating: 5,
    comment:
      "Best travel platform I've ever used. Found amazing hidden gems in places I've visited multiple times. The price tracking feature alone is worth it!",
  },
  {
    name: "Maria Garcia",
    location: "Barcelona, Spain",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
    rating: 5,
    comment:
      "The community is so supportive and knowledgeable. I've made travel friends from around the world and discovered destinations I never knew existed.",
  },
  {
    name: "Ethan Wilson",
    location: "Sydney, Australia",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
    rating: 5,
    comment:
      "I planned my two-week Japan trip in one evening. Hotels, routes, attractions — everything was organized beautifully.",
  },
  {
    name: "Sophie Laurent",
    location: "Paris, France",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop",
    rating: 4,
    comment:
      "I love how easy it is to discover authentic local experiences instead of tourist traps. It feels like traveling smarter.",
  },
  {
    name: "Noah Tan",
    location: "Singapore",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop",
    rating: 5,
    comment:
      "The clean interface and smart recommendations make this my go-to app before every vacation.",
  },
  {
    name: "Olivia Brown",
    location: "Toronto, Canada",
    avatar:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&h=80&fit=crop",
    rating: 5,
    comment:
      "TravelBuddy helped me find amazing cafés, hidden neighborhoods, and budget stays I would never have found myself.",
  },
  {
    name: "Lucas Mendes",
    location: "Rio de Janeiro, Brazil",
    avatar:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=80&h=80&fit=crop",
    rating: 4,
    comment:
      "The itinerary sharing feature made planning a family holiday so much easier. Everyone could collaborate in one place.",
  },
  {
    name: "Aisha Rahman",
    location: "Kuala Lumpur, Malaysia",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop",
    rating: 5,
    comment:
      "I use it for weekend getaways. Fast planning, beautiful destination ideas, and very accurate budget suggestions.",
  },
  {
    name: "Daniel Rossi",
    location: "Milan, Italy",
    avatar:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=80&h=80&fit=crop",
    rating: 5,
    comment:
      "This platform feels premium. Smooth design, practical features, and genuinely useful travel recommendations.",
  },
];