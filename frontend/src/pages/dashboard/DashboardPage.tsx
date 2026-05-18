import { useCallback, useEffect, useState } from "react";
import { getTripApi, deleteTripApi } from "@/api/trip.api";
import {
  Plus,
  ChevronRight,
  Compass,
  Calendar,
  Users,
  MapPin,
  Trash2,
  Loader2,
  Eye,
  Pencil,
  FileEdit,
  CalendarDays,
  Globe,
  Route,
  MoreHorizontal,
  Share2,
  Copy,
  Edit3,
  Heart,
  Bookmark,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useToast from "@/hooks/useToast";
import useAuthStore from "@/stores/useAuthStore";
import type { IDay, TravelGuide, Trip } from "@/types/interface.type";
import { Button } from "@/components/ui/button";
import {
  getFollowersTravelGuideApi,
  getRecommendedTravelGuideApi,
} from "@/api/travel_guide.api";
import StatsCard from "@/components/card/Card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PostModal from "@/layouts/components/community/PostModal";
import {
  likedAndUnlikedPostApi,
  savedPost,
  deleteOwnPostApi,
} from "@/api/travel_guide.api";
import { cn } from "@/lib/utils";

const formatDateRange = (start: string, end: string) => {
  const fmt = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  return `${fmt(start)} – ${fmt(end)}`;
};

const totalLocations = (days: IDay[]) =>
  days.reduce((a, d) => a + d.locations.length, 0);

const DashboardPage = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [recommendCommunityGuide, setRecommendCommunityGuide] = useState<
    TravelGuide[]
  >([]);
  const [followerGuides, setFollowerGuides] = useState<TravelGuide[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const totalTrip = trips.length;
  const totalDay = trips.reduce((sum, t) => sum + t.days.length, 0);
  const totalCountries = new Set(trips.map((t) => t.country)).size;
  const totalTravelPlaces = trips.reduce(
    (sum, t) => sum + t.days.reduce((dSum, d) => dSum + d.locations.length, 0),
    0,
  );
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<TravelGuide | null>(null);
  //! update the useEffect when the user follow and unfollow in view trip plan
  const isGuideAuthor = followerGuides.some(
    (guide) => guide.author?._id === user?._id,
  );
  console.log(isGuideAuthor);
  const statisCard = [
    {
      title: "Total Trip",
      value: totalTrip,
      icon: <Route className="h-5 w-5" />,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Total Days",
      value: totalDay,
      icon: <CalendarDays className="h-5 w-5" />,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Total Country",
      value: totalCountries,
      icon: <Globe className="h-5 w-5" />,
      gradient: "from-rose-500 to-pink-500",
    },
    {
      title: "Travel Places",
      value: totalTravelPlaces,
      icon: <MapPin className="h-5 w-5" />,
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  useEffect(() => {
    let cancelled = false;
    const fetchTrips = async () => {
      try {
        const data = await getTripApi();
        console.log("trips data:", data.data.trips);
        if (!cancelled) {
          setTrips(data.data.trips);
        }
      } catch {
        if (!cancelled) {
          showToast("error", `"Failed to fetch trip data"`);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchTrips();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const fetchRecommendedTravelGuide = async () => {
      try {
        const data = await getRecommendedTravelGuideApi();
        console.log(data);
        setRecommendCommunityGuide(data);
      } catch (error: any) {
        console.log(error.response.data.message);
      }
    };

    fetchRecommendedTravelGuide();
  }, []);

  const handleTripDelete = async (tripId: string) => {
    setDeletingId(tripId);

    try {
      await deleteTripApi(tripId);

      setTrips((prev) => prev.filter((t) => t._id !== tripId));
      showToast("success", "Trip deleted.");
    } catch {
      showToast("error", "Failed to delete trip.");
    } finally {
      setDeletingId(null);
    }
  };

  // Fetch travel guides from followed users
  useEffect(() => {
    const fetchFollowerGuides = async () => {
      try {
        // TODO: Replace with your actual API endpoint
        const result = await getFollowersTravelGuideApi();
        setFollowerGuides(result);
      } catch (error) {
        console.error("Failed to fetch follower guides:", error);
        showToast("error", "Could not load guides from followed users");
      } finally {
        setLoadingFollowers(false);
      }
    };

    fetchFollowerGuides();
  }, []);

  const handleLike = useCallback(
    async (id: string) => {
      if (!user) {
        showToast("info", "Please login to like post");
        return;
      }

      try {
        const data = await likedAndUnlikedPostApi(id);

        setFollowerGuides((prev) =>
          prev.map((guide) =>
            guide._id === id
              ? {
                  ...guide,
                  likes: data.likes,
                  isLiked: data.isLiked,
                }
              : guide,
          ),
        );
      } catch {
        showToast("error", "Unexpected error occurs");
      }
    },
    [user, showToast],
  );

  const handleSave = useCallback(
    async (id: string) => {
      if (!user) {
        showToast("info", "Please login to save post");
        return;
      }

      try {
        const data = await savedPost(id);

        setFollowerGuides((prev) =>
          prev.map((guide) =>
            guide._id === id
              ? {
                  ...guide,
                  saves: data.saves,
                  isSaved: data.isSaved,
                }
              : guide,
          ),
        );
      } catch {
        showToast("error", "Unexpected error occurs");
      }
    },
    [user, showToast],
  );
  const handleShare = async (id: string) => {
    const url = `${window.location.origin}/guide/${id}`;

    try {
      await navigator.clipboard.writeText(url);

      showToast("success", "Guide link copied");
    } catch {
      showToast("error", "Failed to copy link");
    }
  };

  const handleGuideDelete = async (postId: string) => {
    try {
      await deleteOwnPostApi(postId);

      setFollowerGuides((prev) => prev.filter((guide) => guide._id !== postId));

      showToast("success", "Guide deleted successfully");
    } catch {
      showToast("error", "Failed to delete guide");
    } 
  };

  //! frontend store the specific guide before preparing pass to post modal
  const handleEdit = (postId: string) => {
    const guide = followerGuides.find((g) => g._id === postId);

    if (!guide) return;

    setSelectedGuide(guide);
    setEditModalOpen(true);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back {user?.username}! ✨
            </h1>
            <p className="mt-1 text-gray-500">Where will you go next?</p>
          </div>
          <button
            onClick={() => navigate("/plan")}
            className="from-primary to-primary/80 shadow-primary/30 flex items-center gap-2 rounded-2xl bg-gradient-to-r px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            Plan New Trip
          </button>
        </div>

        {/* Quick Destination Cards */}
        <div className="mb-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statisCard.map((card) => (
              <StatsCard
                key={card.title}
                title={card.title}
                value={card.value}
                icon={card.icon}
                gradient={card.gradient}
              />
            ))}
          </div>
        </div>

        <div className="mb-10 grid gap-6 lg:grid-cols-2">
          {/* My Trips */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-xl p-2">
                  <Calendar className="text-primary h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  MY TRIPS
                </h2>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
              </div>
            )}

            {/* Empty */}
            {!isLoading && trips.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-10 text-center">
                <Calendar className="mb-2 h-8 w-8 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">
                  No trips yet
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Click "Plan New Trip" to get started!
                </p>
              </div>
            )}

            {/* Trip list */}
            {!isLoading && trips.length > 0 && (
              <div className="space-y-3">
                {trips.map((trip) => (
                  <div
                    key={trip._id}
                    className="rounded-xl border border-gray-100 bg-slate-50 p-3 transition-all hover:shadow-sm"
                  >
                    {/* Top row: icon + info + delete */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {trip.country}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateRange(trip.startDate, trip.endDate)}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {trip.days.length} day
                          {trip.days.length !== 1 ? "s" : ""} •{" "}
                          {totalLocations(trip.days)} location
                          {totalLocations(trip.days) !== 1 ? "s" : ""}
                        </p>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => handleTripDelete(trip._id)}
                        disabled={deletingId === trip._id}
                        className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-400 disabled:opacity-50 sm:p-1.5"
                      >
                        {deletingId === trip._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Bottom row: View + Edit + Share buttons */}
                    <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3 sm:flex-row sm:gap-2">
                      <button
                        onClick={() => navigate(`/trips/${trip._id}`)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:scale-[1.02] sm:flex-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Trip
                      </button>
                      <button
                        onClick={() => navigate(`/trips/${trip._id}/edit`)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-1.5 text-xs font-semibold text-gray-600 transition-all hover:scale-[1.02] sm:flex-1"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit Trip
                      </button>
                      {trip.isTravelGuideCreated ? (
                        <Button
                          onClick={() =>
                            navigate(`/edit-travel-guide/${trip.tripPlanId}`)
                          }
                          className="w-full sm:flex-1"
                        >
                          Edit Travel Guide
                        </Button>
                      ) : (
                        <button
                          onClick={() =>
                            navigate(`/create-travel-guide/${trip._id}`)
                          }
                          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-1.5 text-xs font-semibold text-gray-600 transition-all hover:scale-[1.02] sm:flex-1"
                        >
                          <FileEdit className="h-3.5 w-3.5" />
                          Travel Guide Editor
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommend Community Guides  */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-xl p-2">
                  <Users className="text-primary h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Recommended Community Guides
                </h2>
              </div>
              <button
                onClick={() => navigate("/community-guide")}
                className="text-primary text-sm font-medium hover:underline"
              >
                View All →
              </button>
            </div>

            {recommendCommunityGuide.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Compass className="mb-2 h-10 w-10 text-gray-300" />
                <p className="text-sm text-gray-500">No recommendations yet</p>
                <p className="text-xs text-gray-400">Check back later!</p>
              </div>
            ) : (
              <div className="custom-scrollbar max-h-[480px] space-y-4 overflow-y-auto pr-1">
                {recommendCommunityGuide.slice(0, 5).map((guide) => (
                  <div
                    key={guide._id}
                    onClick={() =>
                      navigate(`/trip-plan/view/${guide.itinerary?._id}`)
                    }
                    className="group flex cursor-pointer gap-4 rounded-xl p-3 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 hover:shadow-sm"
                  >
                    {/* Thumbnail */}
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl shadow-sm">
                      <img
                        src={guide.thumbnailImage || "/placeholder-image.jpg"}
                        alt={guide.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-gray-800">
                          {guide.title}
                        </h3>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          {guide.country || "Travel"}
                        </span>
                      </div>

                      <p className="mb-2 line-clamp-2 text-xs text-gray-500">
                        {guide.description || "No description available"}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Users className="h-3 w-3" />
                          <span>
                            By {guide.author?.username || "Community"}
                          </span>
                        </div>
                        <button className="text-primary flex items-center gap-1 text-xs font-medium transition-all group-hover:gap-2">
                          Read Guide
                          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Follower Travel Guides - Special Design */}
        <div className="mb-10">
          {followerGuides.length !== 0 && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex items-center gap-3">
                {/* Modern gradient icon container with pulse effect */}
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 opacity-40 blur-md" />
                  <div className="relative rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5 shadow-lg shadow-blue-200/50">
                    <Users className="h-5 w-5 text-white drop-shadow-sm" />
                  </div>
                </div>

                {/* Title with modern typography and animated gradient underline */}
                <div>
                  <h2 className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                    {isGuideAuthor
                      ? "Your Private Post"
                      : "Private Posts from People You Follow"}
                  </h2>
                  <div className="mt-0.5 h-0.5 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 group-hover:w-full" />
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="group flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md hover:ring-blue-200"
              >
                <span>Create Private Post</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )}

          {loadingFollowers ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
            </div>
          ) : followerGuides.length === 0 ? (
            <EmptyGuidesState setCreateModalOpen={setCreateModalOpen} />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {followerGuides.map((guide) => (
                <div
                  key={guide._id}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  {/* Gradient border effect on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-cyan-300 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative h-full rounded-2xl bg-white p-1">
                    <div className="overflow-hidden rounded-xl">
                      <img
                        src={guide.thumbnailImage || "/placeholder-image.jpg"}
                        alt={guide.title}
                        className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Menu Button */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-black/60"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => handleShare(guide._id)}
                          className="cursor-pointer"
                        >
                          <Share2 className="mr-2 h-4 w-4 text-cyan-600" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Copy className="mr-2 h-4 w-4 text-cyan-600" />
                          Copy Link
                        </DropdownMenuItem>
                        {guide.author?._id === user?._id && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleEdit(guide._id)}
                              className="cursor-pointer"
                            >
                              <Edit3 className="mr-2 h-4 w-4 text-blue-600" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setShowDeleteDialog(true)}
                              className="cursor-pointer text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          {guide.country || "Global"}
                        </span>
                        <div
                          onClick={() =>
                            navigate(`/profile/${guide.author?.username}`)
                          }
                          className="flex cursor-pointer items-center gap-1.5"
                        >
                          <img
                            src={
                              guide.author?.profilePicture ||
                              "https://ui-avatars.com/api/?background=8b5cf6&color=fff&rounded=true"
                            }
                            alt="author"
                            className="h-5 w-5 rounded-full ring-2 ring-white"
                          />
                          <span className="text-xs text-gray-500">
                            @{(guide.author as any)?.username || "traveler"}
                          </span>
                        </div>
                      </div>
                      <h3 className="line-clamp-1 text-sm font-bold text-gray-800">
                        {guide.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                        {guide.description}
                      </p>
                      {guide.tags?.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="mt-3 border-0 bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 transition-all duration-300 hover:scale-105 hover:bg-cyan-100"
                        >
                          #{tag}
                        </Badge>
                      ))}
                      {guide.tags?.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="border-0 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 transition-all duration-300 hover:scale-105 hover:bg-gray-200"
                        >
                          +{guide.tags.length - 3} more
                        </Badge>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <button
                          onClick={() =>
                            navigate(`/trip-plan/view/${guide.itinerary?._id}`)
                          }
                          className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-blue-500 transition-all group-hover:gap-2"
                        >
                          Read guide
                          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <div className="flex -space-x-2">
                          {/* decorative avatars - just for style */}
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 ring-2 ring-white" />
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 ring-2 ring-white" />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-2 flex items-center justify-between border-t border-blue-200 pt-4">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="group/like h-auto gap-2 p-0 text-sm font-medium text-gray-600 transition-all duration-300 hover:text-red-500"
                            onClick={() => handleLike(guide._id)}
                          >
                            <Heart
                              className={cn(
                                "h-5 w-5 transition-all duration-300 group-hover/like:scale-110",
                                guide.isLiked
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-400 group-hover/like:text-red-500",
                              )}
                            />
                            <span
                              className={guide.isLiked ? "text-red-500" : ""}
                            >
                              {guide.likes?.toLocaleString() || 0}
                            </span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="group/save h-auto gap-2 p-0 text-sm font-medium text-gray-600 transition-all duration-300 hover:text-cyan-600"
                            onClick={() => handleSave(guide?._id)}
                          >
                            <Bookmark
                              className={cn(
                                "h-5 w-5 transition-all duration-300 group-hover/save:scale-110",
                                guide.isSaved
                                  ? "fill-cyan-500 text-cyan-500"
                                  : "text-gray-400 group-hover/save:text-cyan-500",
                              )}
                            />
                            <span
                              className={guide.isSaved ? "text-cyan-500" : ""}
                            >
                              Save
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Delete Confirmation Dialog with cyan/blue theme */}
                  <AlertDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                  >
                    <AlertDialogContent className="border-cyan-200 shadow-xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900">
                          Delete this post?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-500">
                          This action cannot be undone. This will permanently
                          delete your post and remove it from the community
                          feed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-200 hover:bg-gray-50">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleGuideDelete(guide._id)}
                          className={cn(
                            "border-0 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
                            isLoading && "cursor-not-allowed opacity-50",
                          )}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom banner */}
        <div className="from-primary/5 to-primary/5 rounded-2xl bg-gradient-to-r via-purple-50/50 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white p-3 shadow-md">
                <Compass className="text-primary h-6 w-6" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  Discover more travel ideas
                </h3>
                <p className="text-sm text-gray-500">
                  Explore guides shared by the community
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/community-guide")}
              className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium text-white transition-all"
            >
              Explore Guides
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {createModalOpen && (
        <PostModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          mode="create"
          privacy="private"
          onPostCreated={(createdGuide) => {
            // only add if current user should see it
            const canView =
              createdGuide.privacy === "public" ||
              createdGuide.author?._id === user?._id;

            if (!canView) return;

            setFollowerGuides((prev) => [createdGuide, ...prev]);
          }}
        />
      )}
      {editModalOpen && (
        <PostModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          initialData={selectedGuide}
          mode="edit"
          onPostUpdated={(updatedGuide) => {
            setFollowerGuides((prev) =>
              prev.map((g) => (g._id === updatedGuide._id ? updatedGuide : g)),
            );
          }}
        />
      )}
    </div>
  );
};

<style>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
`}</style>;

export default DashboardPage;
interface EmptyGuidesStateProps {
  setCreateModalOpen: (open: boolean) => void;
}

export function EmptyGuidesState({
  setCreateModalOpen,
}: EmptyGuidesStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-white/40 py-10 text-center backdrop-blur-sm transition-all duration-300 hover:border-gray-300">
      {/* Animated compass icon with soft glow */}
      <div className="relative mb-3">
        <div className="absolute inset-0 animate-pulse rounded-full bg-blue-400/20 blur-md" />
        <Compass className="relative mx-auto h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm" />
      </div>

      {/* More elegant primary text */}
      <p className="bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-base font-medium text-transparent dark:from-gray-200 dark:to-gray-400">
        No guides from followed users yet
      </p>

      {/* Softer secondary text */}
      <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-gray-400">
        Follow more travellers to see their stories, or be the first to share
        yours.
      </p>

      {/* Refined button with better hover effect */}
      <Button
        onClick={() => setCreateModalOpen(true)}
        variant="outline"
        className="group mt-5 flex items-center gap-2 rounded-full border-blue-200 bg-blue-50/50 px-5 py-2 text-sm font-medium text-blue-700 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-100/70 hover:shadow-md hover:shadow-blue-100/50 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:border-blue-700"
      >
        <span>Create Your First Private Post</span>
        <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Button>
    </div>
  );
}
