import { useEffect, useState } from "react";
import { destination } from "@/constants/dashboardPage";
import {
  Plus,
  ChevronRight,
  MoreHorizontal,
  Compass,
  Calendar,
  Users,
  Star,
  MapPin,
  Trash2,
  Loader2,
  Share2,
  Eye,
  Pencil,
} from "lucide-react";
import Card from "@/components/card/Card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

interface ILocation {
  id: string;
  name: string;
  note: string;
  lat: number;
  lng: number;
}

interface IDay {
  date: string;
  locations: ILocation[];
}

interface ITrip {
  _id: string;
  country: string;
  startDate: string;
  endDate: string;
  days: IDay[];
  createdAt: string;
}

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
  const [trips, setTrips] = useState<ITrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    axios
      .get("/api/trips/my-trips", { withCredentials: true })
      .then((res) => {
        if (!cancelled) setTrips(res.data.data.trips);
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load your trips.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleDelete = async (tripId: string) => {
    setDeletingId(tripId);
    try {
      await axios.delete(`/api/trips/${tripId}`, { withCredentials: true });
      setTrips((prev) => prev.filter((t) => t._id !== tripId));
      toast.success("Trip deleted.");
    } catch {
      toast.error("Failed to delete trip.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back! ✨</h1>
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
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Quick Destinations</h2>
            <button className="text-primary flex items-center gap-1 text-sm transition-all hover:gap-2">
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destination.map((dest) => (
              <Card
                key={dest.location}
                country={dest.country}
                description={dest.description}
                href={dest.href}
                location={dest.location}
              />
            ))}
            <div className="hover:border-primary hover:bg-primary/5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/50 p-6 transition-all">
              <div className="rounded-full bg-gray-100 p-3 transition-colors">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <p className="mt-2 text-sm text-gray-500">Add new destination</p>
            </div>
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
                <h2 className="text-xl font-semibold text-gray-800">MY TRIPS</h2>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
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
                <p className="text-sm font-medium text-gray-500">No trips yet</p>
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
                          {trip.days.length} day{trip.days.length !== 1 ? "s" : ""} •{" "}
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
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/trips/${trip._id}/edit`)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-1.5 text-xs font-semibold text-gray-600 transition-all hover:scale-[1.02] hover:border-violet-300 hover:text-violet-500"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => toast.info("Hello YuHang i put a toast here temporary here for you, rmb change to navigate to link to other page")}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-1.5 text-xs font-semibold text-gray-600 transition-all hover:scale-[1.02] hover:border-blue-300 hover:text-blue-500"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Community Guides 区域 */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-xl p-2">
                  <Users className="text-primary h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Community Guides</h2>
              </div>
              <button className="text-primary flex items-center gap-1 text-sm">
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                {
                  img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop",
                  title: "Hidden Gems of Kyoto",
                  author: "TravelWithMike",
                  readers: "2.3k",
                  rating: "4.9",
                },
                {
                  img: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=100&h=100&fit=crop",
                  title: "Ultimate Seoul Food Tour",
                  author: "KFoodie",
                  readers: "1.8k",
                  rating: "4.8",
                },
              ].map((guide) => (
                <div
                  key={guide.title}
                  className="flex gap-4 rounded-xl p-3 transition-all hover:bg-gray-50"
                >
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
                    <img src={guide.img} alt="guide" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-800">{guide.title}</h3>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-500">{guide.rating}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      By {guide.author} • {guide.readers} readers
                    </p>
                    <button className="text-primary mt-2 flex items-center gap-1 text-xs">
                      Read Guide <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                  Discover personalized recommendations
                </h3>
                <p className="text-sm text-gray-500">Based on your travel preferences</p>
              </div>
            </div>
            <button className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium text-white transition-all">
              Explore Now
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;