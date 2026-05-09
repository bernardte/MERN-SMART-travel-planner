import { getUserFavouriteTravelGuideApi } from "@/api/favourite.api";
import type { TravelGuide } from "@/types/interface.type";
import {
  Bookmark,
  Heart,
  Share2,
  MapPin,
  Eye,
  Globe,
  Lock,
  Tag,
  Sparkles,
  ArrowRight,
  Calendar,
  TrendingUp,
  UserPlus2,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@/components/ui/button";
import useToast from "@/hooks/useToast";
import { likedAndUnlikedPostApi, savedPost } from "@/api/travel_guide.api";
import { useShallow } from "zustand/shallow";
import useFollowStore from "@/stores/useFollowStore";
import useAuthStore from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);

const SavedPostsPage = () => {
  const [favouriteGuide, setFavouriteGuide] = useState<TravelGuide[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { showToast } = useToast();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const currentUser = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { toggleFollow, followMap, loadingMap } = useFollowStore(
    useShallow((state) => ({
      toggleFollow: state.toggleFollow,
      followMap: state.followingMap,
      loadingMap: state.loadingMap,
    })),
  );

  useEffect(() => {
    const handleGetFavouriteTravelGuide = async () => {
      const data = await getUserFavouriteTravelGuideApi();
      setFavouriteGuide(data);
    };

    handleGetFavouriteTravelGuide();
  }, []);

  const handleLike = async (postId: string) => {
    console.log(postId);
    if (loadingId) return;

    setLoadingId(postId);
    try {
      const data = await likedAndUnlikedPostApi(postId);
      setFavouriteGuide((prev) =>
        prev.map((guide) =>
          guide._id === postId
            ? {
                ...guide,
                likes: data.likes,
                isLiked: data.isLiked,
              }
            : guide,
        ),
      );
    } catch (error) {
      showToast("error", "Unexpected error occurs");
    } finally {
      setLoadingId(null);
    }
  };

  const handleSavePost = async (postId: string) => {
    if (loadingId) return;
    setLoadingId(postId);
    try {
      const data = await savedPost(postId);

      setFavouriteGuide((prev) =>
        prev.map((guide) =>
          guide._id === postId
            ? {
                ...guide,
                saves: data.saves,
                isSaved: data.isSaved,
              }
            : guide,
        ),
      );
    } catch (error) {
      showToast("error", "Unexpected error occurs");
    } finally {
      setLoadingId(null);
    }
  };

  const formatDate = (dateString: Date) => {
    if (dateString) return dayjs(dateString).fromNow();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="bg-grid-white/10 absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={`animate-${i}`}
              className="animate-float absolute rounded-full bg-white/20"
              style={{
                width: Math.random() * 4 + 2 + "px",
                height: Math.random() * 4 + 2 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                animationDelay: Math.random() * 5 + "s",
                animationDuration: Math.random() * 10 + 5 + "s",
              }}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex animate-bounce items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Your Personal Collection
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              Saved Adventures
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
              Curated community travel guides you've bookmarked for your future
              adventures around the world.
            </p>
            {favouriteGuide.length > 0 && (
              <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-2 backdrop-blur-sm">
                <Bookmark className="h-5 w-5 text-white" />
                <span className="text-lg font-semibold text-white">
                  {favouriteGuide.length} saved{" "}
                  {favouriteGuide.length === 1 ? "guide" : "guides"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Curved bottom edge */}
        <div className="absolute right-0 bottom-0 left-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-full md:h-16"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Content Section - Clean List Layout */}
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 lg:px-8">
        {favouriteGuide.length === 0 ? (
          // Empty State
          <div className="relative py-20 text-center">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-100/30 to-blue-100/30 blur-3xl" />
            </div>
            <div className="mx-auto mb-8 flex h-40 w-40 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 shadow-2xl">
              <Bookmark className="h-16 w-16 text-cyan-600" strokeWidth={1.5} />
            </div>
            <h3 className="mb-3 text-3xl font-bold text-slate-900">
              Your travel wishlist is empty
            </h3>
            <p className="mx-auto max-w-md text-base text-slate-500">
              Start exploring community travel guides and save your favorites
              for later. Your saved adventures will appear here.
            </p>
            <button
              onClick={() => navigate("/community-guide")}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <Sparkles className="h-5 w-5" />
              Explore guides
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        ) : (
          // List View - No cards, clean timeline style
          <div className="space-y-12">
            {favouriteGuide.map((post, index) => {
              const isFollowing = post.author?._id
                ? followMap[post.author._id]
                : false;

              const isLoadingFollow = post.author?._id
                ? loadingMap[post.author._id]
                : false;

              console.log("privacy: ", post);

              return (
                <div
                  key={post._id}
                  className="group relative"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Timeline connector */}
                  {index !== favouriteGuide.length - 1 && (
                    <div className="absolute top-24 bottom-0 left-8 w-px bg-gradient-to-b from-cyan-200 via-blue-200 to-transparent" />
                  )}

                  {/* Timeline dot */}
                  <div className="absolute top-6 left-6 -translate-x-1/2">
                    <div
                      className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full transition-all duration-500 ${
                        hoveredIndex === index
                          ? "scale-150 bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg"
                          : "bg-cyan-400"
                      }`}
                    >
                      <div
                        className={`absolute h-3 w-3 rounded-full bg-white transition-all duration-500 ${
                          hoveredIndex === index ? "scale-0" : "scale-100"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="ml-14">
                    <div className="rounded-3xl border-2 border-blue-200 bg-blue-500/10 transition-all duration-500 hover:bg-gradient-to-br hover:from-white hover:to-cyan-50/50">
                      <div className="p-6 md:p-8">
                        {/* Top Row */}
                        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            {/* Author Avatar */}
                            <div
                              className="relative cursor-pointer"
                              onClick={() =>
                                navigate(`/profile/${post.author.username}`)
                              }
                            >
                              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                              <img
                                src={
                                  post.author?.profilePicture ??
                                  "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
                                }
                                className="relative h-12 w-12 rounded-full object-cover shadow-md ring-2 ring-white"
                                alt="Profile Picture"
                              />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-slate-900">
                                  {post.author?.name}
                                </span>
                                {post.author._id !== currentUser?._id && (
                                  <Button
                                    variant={
                                      isFollowing ? "outline" : "default"
                                    }
                                    onClick={() =>
                                      post.author?._id &&
                                      toggleFollow(post.author._id)
                                    }
                                    disabled={isLoadingFollow}
                                  >
                                    {isLoadingFollow ? (
                                      "Loading..."
                                    ) : isFollowing ? (
                                      <>
                                        <UserCheck />
                                        <span>following</span>
                                      </>
                                    ) : (
                                      <>
                                        <UserPlus2 />
                                        <span>Follow</span>
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                              <div className="mt-1 flex items-center gap-3">
                                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                  <Eye className="h-3 w-3" />
                                  {Number(
                                    post.views ?? 0,
                                  ).toLocaleString()}{" "}
                                  views
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                  <Calendar className="h-3 w-3" />
                                  Created{" "}
                                  {/* {dayjs(post.createdAt).format("MMM D, YYYY")} */}
                                  {formatDate(post.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                post.privacy === "public"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {post.privacy === "public" ? (
                                <>
                                  <Globe className="h-3 w-3" />
                                  Public
                                </>
                              ) : (
                                <>
                                  <Lock className="h-3 w-3" />
                                  Private
                                </>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Main Content - Horizontal layout on larger screens */}
                        <div className="flex flex-col gap-6 md:flex-row">
                          {/* Thumbnail */}
                          <div className="flex-shrink-0 md:w-72">
                            <div className="group/image relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 shadow-md">
                              <div className="aspect-video w-full">
                                <img
                                  src={post.thumbnailImage}
                                  alt={post.title}
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover/image:scale-110"
                                  onError={(e) => {
                                    const img = e.target as HTMLImageElement;
                                    if (img) {
                                      const parent =
                                        img.parentElement as HTMLElement;
                                      img.style.display = "none";
                                      if (parent) {
                                        parent.classList.add(
                                          "flex",
                                          "items-center",
                                          "justify-center",
                                        );
                                        parent.innerHTML =
                                          '<span class="text-cyan-400 text-4xl">📍</span>';
                                      }
                                    }
                                  }}
                                />
                              </div>
                              {/* Overlay gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/image:opacity-100" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            {/* Location Badge */}
                            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1">
                              <MapPin className="h-3.5 w-3.5 text-cyan-600" />
                              <span className="text-xs font-medium text-cyan-700">
                                {post.country}
                              </span>
                            </div>

                            {/* Title */}
                            <h2 className="mb-3 cursor-pointer text-2xl font-bold text-slate-900 transition-colors duration-300 hover:text-cyan-600">
                              {post.title}
                            </h2>

                            {/* Description */}
                            <p className="mb-4 line-clamp-2 leading-relaxed text-slate-600">
                              {post.description}
                            </p>

                            {/* Tags */}
                            <div className="mb-6 flex flex-wrap gap-2">
                              {post.tags.slice(0, 4).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition-all duration-300 hover:bg-cyan-100 hover:text-cyan-700"
                                >
                                  <Tag className="h-3 w-3" />
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > 4 && (
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                                  +{post.tags.length - 4}
                                </span>
                              )}
                            </div>

                            {/* Stats and Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                              <div className="flex items-center gap-6">
                                {/* Like Button */}
                                <Button
                                  variant={"ghost"}
                                  onClick={() =>
                                    post._id && handleLike(post._id)
                                  }
                                  className="group/like inline-flex items-center gap-2 transition-all duration-300"
                                >
                                  <Heart
                                    className={`h-5 w-5 transition-all duration-300 ${
                                      post.isLiked
                                        ? "fill-red-500 text-red-500"
                                        : "text-slate-400 group-hover/like:text-red-500"
                                    }`}
                                  />
                                  <span
                                    className={`text-sm font-medium ${
                                      post.isLiked
                                        ? "text-red-500"
                                        : "text-slate-500"
                                    }`}
                                  >
                                    {Number(post.likes ?? 0).toLocaleString()}
                                  </span>
                                </Button>

                                {/* Save Button */}
                                <Button
                                  variant={"ghost"}
                                  onClick={() =>
                                    post._id && handleSavePost(post._id)
                                  }
                                  className="group/save inline-flex items-center gap-2 transition-all duration-300"
                                >
                                  <Bookmark
                                    className={`h-5 w-5 transition-all duration-300 ${
                                      post.isSaved
                                        ? "fill-cyan-500 text-cyan-500"
                                        : "text-slate-400 group-hover/save:text-cyan-500"
                                    }`}
                                  />
                                  <span
                                    className={`text-sm font-medium ${
                                      post.isSaved
                                        ? "text-cyan-500"
                                        : "text-slate-500"
                                    }`}
                                  >
                                    Saved
                                  </span>
                                </Button>

                                {/* Trending indicator */}
                                {post.views > 1000 && (
                                  <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                                    <TrendingUp className="h-3.5 w-3.5" />
                                    Trending
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                <Button
                                  onClick={() => {
                                    navigate(
                                      `/trip-plan/view/${post.itineraryId}`,
                                    );
                                  }}
                                  className="group/btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                  Read guide
                                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                                </Button>
                                <button className="rounded-full p-2 text-slate-400 transition-all duration-300 hover:bg-slate-100 hover:text-slate-600">
                                  <Share2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SavedPostsPage;
