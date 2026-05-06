import { useEffect, useState } from "react";
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

  const handleDelete = async (tripId: string) => {
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
                        onClick={() => handleDelete(trip._id)}
                        disabled={deletingId === trip._id}
                        className="rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-400 disabled:opacity-50"
                      >
                        {deletingId === trip._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Bottom row: View + Edit + Share buttons */}
                    <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
                      <button
                        onClick={() => navigate(`/trips/${trip._id}`)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Trip
                      </button>
                      <button
                        onClick={() => navigate(`/trips/${trip._id}/edit`)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-1.5 text-xs font-semibold text-gray-600 transition-all hover:scale-[1.02] hover:border-violet-300 hover:text-violet-500"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit Trip
                      </button>

                      {trip.isTravelGuideCreated ? (
                        <Button
                          onClick={() =>
                            navigate(`/edit-travel-guide/${trip.tripPlanId}`)
                          }
                        >
                          Edit Travel Guide
                        </Button>
                      ) : (
                        <button
                          onClick={() =>
                            navigate(`/create-travel-guide/${trip._id}`)
                          }
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-1.5 text-xs font-semibold text-gray-600 transition-all hover:scale-[1.02] hover:border-blue-300 hover:text-blue-500"
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
                      navigate(`/trip-plan/view/${guide.itineraryId}`)
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
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-2 shadow-md">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  From People You Follow ✨
                </h2>
              </div>
            </div>
          )}

          {loadingFollowers ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
            </div>
          ) : followerGuides.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white/40 py-10 text-center backdrop-blur-sm">
              <Compass className="mx-auto mb-2 h-10 w-10 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">
                No guides from followed users yet
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Follow more travellers to see their stories!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {followerGuides.map((guide) => (
                <div
                  key={guide._id}
                  onClick={() =>
                    navigate(`/trip-plan/view/${guide.itineraryId}`)
                  }
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
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
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          {guide.country || "Global"}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <img
                            src={
                              (guide.author.profilePicture) ||
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
                      <div className="mt-3 flex items-center justify-between">
                        <button className="inline-flex items-center gap-1 text-xs font-medium text-blue-500 transition-all group-hover:gap-2">
                          Read guide
                          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <div className="flex -space-x-2">
                          {/* decorative avatars - just for style */}
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 ring-2 ring-white" />
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 ring-2 ring-white" />
                        </div>
                      </div>
                    </div>
                  </div>
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
