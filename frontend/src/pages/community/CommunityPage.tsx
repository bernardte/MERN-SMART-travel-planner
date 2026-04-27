// TravelCommunityGuides.tsx
import React, { useState } from "react";
import {
  Heart,
  MapPin,
  CalendarDays,
  Compass,
  TrendingUp,
  Bell,
  Search,
  Home,
  PlusCircle,
  User,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  X,
  Hash,
  Clock,
  Star,
  Sunrise,
  ChevronRight,
  ChevronLeft,
  Link2,
  Flame,
  Users,
  Camera,
  Edit3,
  Send,
} from "lucide-react";

// Shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
interface TravelGuide {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  thumbnailImage: string;
  location: string;
  country: string;
  description: string;
  tags: string[];
  likes: number;
  comments: number;
  saves: number;
  createdAt: Date;
  isLiked?: boolean;
  isSaved?: boolean;
  itinerary?: {
    duration: string;
    budget: string;
    season: string;
    highlights: string[];
  };
}

// Mock data for guide posts (grid layout like the reference image)
const mockGuides: TravelGuide[] = [
  {
    id: "1",
    title: "My Best Tips to Japan",
    author: {
      name: "Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      username: "@wanderlust_sarah",
    },
    thumbnailImage:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop",
    location: "Tokyo, Kyoto, Osaka",
    country: "Japan",
    description:
      "Essential tips for first-time visitors: transportation, etiquette, hidden gems, and food recommendations that won't break the bank.",
    tags: ["japan", "tips", "first-time"],
    likes: 1234,
    comments: 89,
    saves: 456,
    createdAt: new Date("2024-03-15"),
    itinerary: {
      duration: "10 days",
      budget: "$$ - Moderate",
      season: "Spring/Fall",
      highlights: [
        "Fushimi Inari",
        "Arashiyama Bamboo",
        "Shibuya Sky",
        "Nara Deer Park",
      ],
    },
  },
  {
    id: "2",
    title: "Itinerary to China (ShenZhen)",
    author: {
      name: "Michael Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      username: "@mike_explores",
    },
    thumbnailImage:
      "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600&h=400&fit=crop",
    location: "Shenzhen, China",
    country: "China",
    description:
      "5-day tech city adventure: from Huaqiangbei electronics market to OCT Loft creative park and Dameisha beach.",
    tags: ["china", "shenzhen", "tech", "cityguide"],
    likes: 892,
    comments: 45,
    saves: 234,
    createdAt: new Date("2024-03-14"),
    itinerary: {
      duration: "5 days",
      budget: "$ - Budget",
      season: "Winter",
      highlights: [
        "Huaqiangbei",
        "OCT Loft",
        "Window of the World",
        "Dameisha Beach",
      ],
    },
  },
  {
    id: "3",
    title: "Narita - Kyoto Free Guide",
    author: {
      name: "Emma Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      username: "@emma_adventures",
    },
    thumbnailImage:
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=400&fit=crop",
    location: "Narita to Kyoto",
    country: "Japan",
    description:
      "Complete free guide from Narita Airport to Kyoto including JR Pass tips, must-see temples, and budget accommodations.",
    tags: ["japan", "kyoto", "free-guide", "budget"],
    likes: 2156,
    comments: 123,
    saves: 789,
    createdAt: new Date("2024-03-13"),
    itinerary: {
      duration: "7 days",
      budget: "$ - Budget",
      season: "Any",
      highlights: [
        "Kinkaku-ji",
        "Fushimi Inari",
        "Arashiyama",
        "Gion District",
      ],
    },
  },
  {
    id: "4",
    title: "Bangkok Street Food Paradise",
    author: {
      name: "Lisa Wong",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      username: "@lisa_eats_world",
    },
    thumbnailImage:
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=400&fit=crop",
    location: "Bangkok, Thailand",
    country: "Thailand",
    description:
      "Ultimate street food guide: 20 must-try dishes, best night markets, and food tours under $30/day.",
    tags: ["thailand", "street-food", "budget-eats"],
    likes: 3456,
    comments: 267,
    saves: 1234,
    createdAt: new Date("2024-03-12"),
  },
  {
    id: "5",
    title: "Paris Hidden Gems",
    author: {
      name: "Sophie Martin",
      avatar:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop",
      username: "@sophie_in_paris",
    },
    thumbnailImage:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
    location: "Paris, France",
    country: "France",
    description:
      "Beyond the Eiffel Tower: secret courtyards, local bakeries, and artistic neighborhoods locals love.",
    tags: ["paris", "hidden-gems", "france"],
    likes: 1876,
    comments: 98,
    saves: 567,
    createdAt: new Date("2024-03-11"),
  },
  {
    id: "6",
    title: "Korea 7-Day Itinerary",
    author: {
      name: "Ji-hoon Park",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      username: "@jihoon_travels",
    },
    thumbnailImage:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=400&fit=crop",
    location: "Seoul, Busan, Jeju",
    country: "Korea",
    description:
      "Perfect week in Korea: Seoul's palaces, Busan's beaches, and Jeju's volcanic landscapes.",
    tags: ["korea", "itinerary", "seoul", "busanz"],
    likes: 2341,
    comments: 156,
    saves: 892,
    createdAt: new Date("2024-03-10"),
  },
];

// Create Post Modal Component
const CreateGuideModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGuideCreated: (guide: TravelGuide) => void;
}> = ({ open, onOpenChange, onGuideCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [tags, setTags] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");
  const [season, setSeason] = useState("");
  const [highlights, setHighlights] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setThumbnailImage(imageUrl);
    }
  };

  const handleSubmit = () => {
    const newGuide: TravelGuide = {
      id: Date.now().toString(),
      title,
      author: {
        name: "Current User",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
        username: "@travel_buddy",
      },
      thumbnailImage:
        thumbnailImage ||
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
      location,
      country,
      description,
      tags: tags.split(",").map((t) => t.trim()),
      likes: 0,
      comments: 0,
      saves: 0,
      createdAt: new Date(),
      itinerary:
        duration || budget || season || highlights
          ? {
              duration,
              budget,
              season,
              highlights: highlights.split(",").map((h) => h.trim()),
            }
          : undefined,
    };
    onGuideCreated(newGuide);
    onOpenChange(false);
    // Reset form
    setTitle("");
    setDescription("");
    setThumbnailImage("");
    setLocation("");
    setCountry("");
    setTags("");
    setDuration("");
    setBudget("");
    setSeason("");
    setHighlights("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            ✨ Create Travel Guide
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Title *</label>
            <Input
              placeholder="e.g., My Best Tips to Japan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description *
            </label>
            <Textarea
              placeholder="Share your travel tips, itinerary details, hidden gems..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Thumbnail Image
            </label>
            {thumbnailImage && (
              <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={thumbnailImage}
                  alt="Thumbnail"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => setThumbnailImage("")}
                  className="absolute top-2 right-2 rounded-full bg-black/50 p-1"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file:bg-primary/10 file:mr-2 file:rounded-full file:border-0 file:px-3 file:py-1 file:text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block flex items-center gap-1 text-sm font-medium">
                <MapPin className="h-4 w-4" /> Location
              </label>
              <Input
                placeholder="e.g., Tokyo, Japan"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Country</label>
              <Input
                placeholder="e.g., Japan"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block flex items-center gap-1 text-sm font-medium">
              <Hash className="h-4 w-4" /> Tags (comma separated)
            </label>
            <Input
              placeholder="japan, budget, solo-travel"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="border-t pt-4">
            <label className="mb-3 block flex items-center gap-2 text-sm font-medium">
              <CalendarDays className="h-4 w-4" /> Trip Details (Optional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Duration (e.g., 10 days)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger>
                  <SelectValue placeholder="Budget Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$ - Budget">$ - Budget</SelectItem>
                  <SelectItem value="$$ - Moderate">$$ - Moderate</SelectItem>
                  <SelectItem value="$$$ - Expensive">
                    $$$ - Expensive
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Best season (e.g., Spring)"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
              />
              <Input
                placeholder="Highlights (comma separated)"
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title || !description}>
            Publish Guide
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Guide Card Component (Grid Item)
const GuideCard: React.FC<{
  guide: TravelGuide;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}> = ({ guide, onLike, onSave }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState(guide.comments);

  const handleAddComment = () => {
    if (commentText.trim()) {
      setLocalComments((prev) => prev + 1);
      setCommentText("");
    }
  };

  return (
    <>
      <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <img
            src={guide.thumbnailImage}
            alt={guide.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onClick={() => setShowDetailModal(true)}
          />
          <Badge className="absolute top-3 left-3 bg-black/60 text-white hover:bg-black/60">
            {guide.country}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={guide.author.avatar} />
                <AvatarFallback>{guide.author.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground text-xs">
                {guide.author.username}
              </span>
            </div>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <MapPin className="h-3 w-3" />
              <span>{guide.location.split(",")[0]}</span>
            </div>
          </div>

          <h3
            className="hover:text-primary mb-2 line-clamp-2 text-base font-semibold"
            onClick={() => setShowDetailModal(true)}
          >
            {guide.title}
          </h3>

          <p className="text-muted-foreground mb-3 line-clamp-2 text-xs">
            {guide.description}
          </p>

          <div className="mb-3 flex flex-wrap gap-1">
            {guide.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="px-1.5 text-[10px]">
                #{tag}
              </Badge>
            ))}
          </div>

          {guide.itinerary && (
            <div className="text-muted-foreground mb-3 flex flex-wrap gap-2 text-[10px]">
              {guide.itinerary.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {guide.itinerary.duration}
                </span>
              )}
              {guide.itinerary.budget && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {guide.itinerary.budget}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto gap-1 p-0 text-xs"
                onClick={() => onLike(guide.id)}
              >
                <Heart
                  className={`h-4 w-4 ${guide.isLiked ? "fill-red-500 text-red-500" : ""}`}
                />
                <span>{guide.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto gap-1 p-0 text-xs"
                onClick={() => setShowDetailModal(true)}
              >
                <MessageCircle className="h-4 w-4" />
                <span>{localComments}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto gap-1 p-0 text-xs"
                onClick={() => onSave(guide.id)}
              >
                <Bookmark
                  className={`h-4 w-4 ${guide.isSaved ? "fill-primary text-primary" : ""}`}
                />
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{guide.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img
              src={guide.thumbnailImage}
              alt={guide.title}
              className="aspect-video w-full rounded-lg object-cover"
            />
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={guide.author.avatar} />
                <AvatarFallback>{guide.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{guide.author.name}</p>
                <p className="text-muted-foreground text-xs">
                  {guide.author.username}
                </p>
              </div>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>{guide.location}</span>
            </div>
            <p className="text-sm">{guide.description}</p>
            {guide.itinerary && (
              <div className="bg-muted rounded-lg p-3">
                <p className="mb-2 text-sm font-semibold">📋 Trip Details</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {guide.itinerary.duration && (
                    <div>📅 {guide.itinerary.duration}</div>
                  )}
                  {guide.itinerary.budget && (
                    <div>💰 {guide.itinerary.budget}</div>
                  )}
                  {guide.itinerary.season && (
                    <div>🌸 {guide.itinerary.season}</div>
                  )}
                </div>
                {guide.itinerary.highlights.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium">✨ Highlights:</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {guide.itinerary.highlights.map((h, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {h}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <Separator className="my-2" />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Input
                  placeholder="Add a comment..."
                  className="flex-1"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                />
                <Button size="sm" onClick={handleAddComment}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => onLike(guide.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${guide.isLiked ? "fill-red-500 text-red-500" : ""}`}
                  />
                  {guide.likes} likes
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => onSave(guide.id)}
                >
                  <Bookmark
                    className={`h-4 w-4 ${guide.isSaved ? "fill-primary text-primary" : ""}`}
                  />
                  {guide.saves} saves
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Separator component
const Separator: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-border h-px ${className || ""}`} />
);

// Main Community Guides Component
const TravelCommunityGuidesPage: React.FC = () => {
  const [guides, setGuides] = useState<TravelGuide[]>(mockGuides);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"likes" | "recent">("likes");

  const countries = [
    "all",
    "Japan",
    "China",
    "Korea",
    "America",
    "Thailand",
    "France",
  ];

  const filteredGuides = guides
    .filter(
      (guide) => selectedCountry === "all" || guide.country === selectedCountry,
    )
    .filter(
      (guide) =>
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    )
    .sort((a, b) => {
      if (sortBy === "likes") return b.likes - a.likes;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  const handleLike = (id: string) => {
    setGuides(
      guides.map((guide) =>
        guide.id === id
          ? {
              ...guide,
              likes: guide.isLiked ? guide.likes - 1 : guide.likes + 1,
              isLiked: !guide.isLiked,
            }
          : guide,
      ),
    );
  };

  const handleSave = (id: string) => {
    setGuides(
      guides.map((guide) =>
        guide.id === id
          ? {
              ...guide,
              saves: guide.isSaved ? guide.saves - 1 : guide.saves + 1,
              isSaved: !guide.isSaved,
            }
          : guide,
      ),
    );
  };

  const handleGuideCreated = (newGuide: TravelGuide) => {
    setGuides([newGuide, ...guides]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/20">
      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-3xl font-bold text-transparent">
            Community Guides
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover travel itineraries, tips, and hidden gems shared by fellow
            explorers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search guides..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Sort by:</span>
            <Tabs
              value={sortBy}
              onValueChange={(v) => setSortBy(v as "likes" | "recent")}
              className="w-auto"
            >
              <TabsList className="h-8">
                <TabsTrigger value="likes" className="text-xs">
                  Most likes
                </TabsTrigger>
                <TabsTrigger value="recent" className="text-xs">
                  Most recent
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Country Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {countries.map((country) => (
            <Badge
              key={country}
              variant={selectedCountry === country ? "default" : "outline"}
              className="cursor-pointer px-6 py-5 text-sm capitalize "
              onClick={() => setSelectedCountry(country)}
            >
              {country === "all" ? "All" : country}
            </Badge>
          ))}
        </div>

        {/* Guides Grid - 3 columns like reference image */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map((guide) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              onLike={handleLike}
              onSave={handleSave}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredGuides.length === 0 && (
          <div className="py-12 text-center">
            <Compass className="text-muted-foreground mx-auto h-12 w-12" />
            <h3 className="mt-4 text-lg font-semibold">No guides found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
            <Button className="mt-4" onClick={() => setCreateModalOpen(true)}>
              Create your first guide
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredGuides.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline" className="gap-2">
              Load more <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Create Guide Modal */}
      <CreateGuideModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onGuideCreated={handleGuideCreated}
      />
    </div>
  );
};

export default TravelCommunityGuidesPage;
