import React, { useEffect, useState } from "react";
import {
  Heart,
  Compass,
  Search,
  PlusCircle,
  Clock,
  ChevronRight,
  Flame,
  Sparkles,
  TrendingUp,
  MapPin,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreatePostModal from "@/layouts/components/community/CreatePostModal";
import GuideCard from "@/layouts/components/community/GuideCard";
import type { TravelGuide } from "@/types/interface.type";
import useCommunityTravelGuideStore from "@/stores/useCommunityTravelGuideStore";
import { useShallow } from "zustand/shallow";
import { LoadingState } from "@/layouts/components/loading/LoadingState";
import useToast from "@/hooks/useToast";
import { motion, AnimatePresence } from "framer-motion";

const TravelCommunityGuidesPage: React.FC = () => {
  const [guides, setGuides] = useState<TravelGuide[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"likes" | "recent" | "trending">(
    "likes",
  );
  const {
    getAllPublicPost,
    publicPostLoading,
    error,
    publicPost,
    deleteOwnPost,
    deletePostLoading,
  } = useCommunityTravelGuideStore(
    useShallow((state) => ({
      getAllPublicPost: state.getAllPublicPost,
      publicPostLoading: state.loading.publicPost,
      error: state.error,
      publicPost: state.publicPost,
      deleteOwnPost: state.deleteOwnPost,
      deletePostLoading: state.loading.deletePost,
    })),
  );
  const { showToast } = useToast();

  useEffect(() => {
    getAllPublicPost();
  }, [getAllPublicPost]);

  useEffect(() => {
    if (publicPost) {
      setGuides(publicPost);
    }
  }, [publicPost]);

  const countries = [
    "all",
    "Japan",
    "China",
    "Korea",
    "Thailand",
    "France",
    "Italy",
    "Spain",
  ];

  const filteredGuides = guides
    .filter(
      (guide) =>
        selectedCountry === "all" ||
        guide.country.toLowerCase().trim() ===
          selectedCountry.toLowerCase().trim(),
    )
    .filter((guide) => {
      const title = guide.title ?? "";
      const description = guide.description ?? "";
      const tags = guide.tags ?? [];

      return (
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tags.some((tag) =>
          (tag ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
        )
      );
    })
    .sort((a, b) => {
      if (sortBy === "likes") return b.likes - a.likes;
      if (sortBy === "trending")
        return (b.stats?.views || 0) - (a.stats?.views || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleLike = (id: string) => {
    setGuides(
      guides.map((guide) =>
        guide._id === id
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
        guide._id === id
          ? {
              ...guide,
              saves: guide.isSaved ? guide.saves - 1 : guide.saves + 1,
              isSaved: !guide.isSaved,
            }
          : guide,
      ),
    );
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/guide/${id}`;
    navigator.clipboard.writeText(url);
  };

  const handleDelete = (postId: string) => {
    deleteOwnPost(postId);
  };

  const handleGuideCreated = (newGuide: TravelGuide) => {
    setGuides([newGuide, ...guides]);
  };

  if (publicPostLoading) return <LoadingState />;

  if (error) {
    showToast("error", "Unexpected error occur");
    showToast("error", "Error loading data");
    return;
  }

  const getSortIcon = () => {
    switch (sortBy) {
      case "likes":
        return <Heart className="h-4 w-4" />;
      case "trending":
        return <Flame className="h-4 w-4" />;
      case "recent":
        return <Clock className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "likes":
        return "Most Liked";
      case "trending":
        return "Trending";
      case "recent":
        return "Most Recent";
      default:
        return "Sort by";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 ml-4 md:m-0">
      {/* Animated Background Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r from-blue-200/30 to-cyan-200/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-cyan-200/30 to-blue-200/30 blur-3xl"
        />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-100/10 to-cyan-100/10 blur-3xl" />
      </div>

      {/* Floating Action Button for Mobile */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="fixed right-6 bottom-6 z-50 lg:hidden"
      >
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="group h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30 transition-all hover:scale-110 hover:shadow-xl"
        >
          <PlusCircle className="h-6 w-6 transition-transform group-hover:rotate-90" />
        </Button>
      </motion.div>

      <div className="relative container mx-auto max-w-7xl px-4 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-300 to-cyan-400 p-8 shadow-2xl"
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute -top-24 -right-24 h-48 w-48 animate-pulse rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 animate-pulse rounded-full bg-white/20 blur-3xl delay-1000" />

          <div className="relative flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-2 lg:justify-start"
              >
                <Sparkles className="h-6 w-6 text-yellow-300" />
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                  Travel Community
                </span>
              </motion.div>
              <h1 className="text-4xl font-bold text-white lg:text-5xl">
                Discover Amazing
                <span className="block bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent">
                  Travel Stories
                </span>
              </h1>
              <p className="text-lg text-white/90">
                Explore itineraries, tips, and hidden gems from travelers around
                the world
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-gray-400 to-gray-600"
                      style={{
                        backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
                        backgroundSize: "cover",
                      }}
                    />
                  ))}
                </div>
                <p className="text-sm text-white/80">
                  +2.5k travelers sharing their stories
                </p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Button
                onClick={() => setCreateModalOpen(true)}
                className="group bg-white px-3 py-6 text-blue-600 shadow-lg hover:bg-white/90 hover:shadow-xl"
              >
                <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                Share Your Story
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-md flex-1"
          >
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search guides by title, description, or tags..."
              className="border-2 pl-9 transition-all focus:border-blue-500 focus:shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            {/* Enhanced Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 border-2 hover:border-blue-500 hover:bg-blue-50"
                >
                  {getSortIcon()}
                  <span>{getSortLabel()}</span>
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setSortBy("likes")}
                  className={`gap-2 ${sortBy === "likes" ? "bg-blue-50 text-blue-600" : ""}`}
                >
                  <Heart className="h-4 w-4" />
                  Most Liked
                  {sortBy === "likes" && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("trending")}
                  className={`gap-2 ${sortBy === "trending" ? "bg-blue-50 text-blue-600" : ""}`}
                >
                  <Flame className="h-4 w-4" />
                  Trending
                  {sortBy === "trending" && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("recent")}
                  className={`gap-2 ${sortBy === "recent" ? "bg-blue-50 text-blue-600" : ""}`}
                >
                  <Clock className="h-4 w-4" />
                  Most Recent
                  {sortBy === "recent" && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>

        {/* Country Filters - Animated with Blue/Cyan theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {countries.map((country, index) => (
            <motion.div
              key={country}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge
                variant={selectedCountry === country ? "default" : "outline"}
                className={`cursor-pointer px-5 py-4 text-sm capitalize transition-all ${
                  selectedCountry === country
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
                    : "hover:border-blue-300 hover:bg-blue-50"
                }`}
                onClick={() => setSelectedCountry(country)}
              >
                {country === "all" ? (
                  <>
                    <Sparkles className="mr-1 h-3 w-3" />
                    All
                  </>
                ) : (
                  <>
                    <MapPin className="mr-1 h-3 w-3" />
                    {country}
                  </>
                )}
              </Badge>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-gradient-to-r from-blue-50/50 to-cyan-50/50 p-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-2 shadow-md">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {filteredGuides.length}
                </p>
                <p className="text-muted-foreground text-xs">Travel Stories</p>
              </div>
            </div>
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-blue-300 to-transparent" />
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 p-2 shadow-md">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-900">
                  {guides
                    .reduce((sum, g) => sum + (g.likes || 0), 0)
                    .toLocaleString()}
                </p>
                <p className="text-muted-foreground text-xs">Total Likes</p>
              </div>
            </div>
          </div>
          {searchQuery && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-blue-600"
            >
              Found {filteredGuides.length} results for "{searchQuery}"
            </motion.p>
          )}
        </motion.div>

        {/* Guides Grid with Animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredGuides.map((guide, index) => (
              <motion.div
                key={guide._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <GuideCard
                  guide={guide}
                  onLike={handleLike}
                  onSave={handleSave}
                  onShare={handleShare}
                  onDelete={handleDelete}
                  isLoading={deletePostLoading}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State with Animation */}
        <AnimatePresence>
          {filteredGuides.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-12 text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-cyan-100">
                  <Compass className="h-10 w-10 text-blue-600" />
                </div>
              </motion.div>
              <h3 className="mt-4 text-xl font-semibold text-blue-900">
                No guides found
              </h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filters, or be the first to share
                your adventure!
              </p>
              <Button
                className="mt-6 gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30 hover:shadow-xl"
                onClick={() => setCreateModalOpen(true)}
              >
                <PlusCircle className="h-4 w-4" />
                Create your first guide
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More */}
        {filteredGuides.length > 0 && filteredGuides.length < guides.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Button
              variant="outline"
              className="group gap-2 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
            >
              Load more stories
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onPostCreated={handleGuideCreated}
      />
    </div>
  );
};

export default TravelCommunityGuidesPage;
