import { destination, trips } from "@/constants/dashboardPage";
import {
  Plus,
  ChevronRight,
  MoreHorizontal,
  Compass,
  Calendar,
  Users,
  Star,
} from "lucide-react";
import Card from "@/components/card/Card";
import CardList from "@/components/card/CardList";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-8">
        {/* User Content */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, Sarah! ✨
            </h1>
            <p className="mt-1 text-gray-500">Where will you go next?</p>
          </div>
          <button onClick={() => navigate("/plan")} className="from-primary to-primary/80 shadow-primary/30 flex items-center gap-2 rounded-2xl bg-gradient-to-r px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
            <Plus className="h-5 w-5" />
            Plan New Trip
          </button>
        </div>

        {/* Quick Destination Card */}
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Quick Destinations
            </h2>
            <button className="text-primary flex items-center gap-1 text-sm transition-all hover:gap-2">
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destination.map((destination) => (
              <Card
                country={destination.country}
                description={destination.description}
                href={destination.href}
                location={destination.location}
              />
            ))}

            {/* Add new destination */}
            <div className="hover:border-primary hover:bg-primary/5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/50 p-6 transition-all">
              <div className="group-hover:bg-primary/10 rounded-full bg-gray-100 p-3 transition-colors">
                <Plus className="group-hover:text-primary h-6 w-6 text-gray-400" />
              </div>
              <p className="mt-2 text-sm text-gray-500">Add new destination</p>
            </div>
          </div>
        </div>

        <div className="mb-10 grid gap-6 lg:grid-cols-2">
          {/* My Trip */}
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
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {trips.map((trip) => (
                <CardList
                  title={trip.title}
                  dateRange={trip.dateRange}
                  numFriend={trip.numFriend}
                />
              ))}
            </div>
          </div>

          {/* Community Guides 区域 */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-xl p-2">
                  <Users className="text-primary h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Community Guides
                </h2>
              </div>
              <button className="text-primary flex items-center gap-1 text-sm">
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Guide item 1 */}
              <div className="flex gap-4 rounded-xl p-3 transition-all hover:bg-gray-50">
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop"
                    alt="guide"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">
                      Hidden Gems of Kyoto
                    </h3>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-500">4.9</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    By TravelWithMike • 2.3k readers
                  </p>
                  <button className="text-primary mt-2 flex items-center gap-1 text-xs">
                    Read Guide <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
              {/* Guide item 2 */}
              <div className="flex gap-4 rounded-xl p-3 transition-all hover:bg-gray-50">
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1528164344705-47542687000d?w=100&h=100&fit=crop"
                    alt="guide"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">
                      Ultimate Seoul Food Tour
                    </h3>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-500">4.8</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    By KFoodie • 1.8k readers
                  </p>
                  <button className="text-primary mt-2 flex items-center gap-1 text-xs">
                    Read Guide <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom recommendation field */}
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
                <p className="text-sm text-gray-500">
                  Based on your travel preferences
                </p>
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
