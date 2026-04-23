import { CalendarDays, Compass, MapPin, Plane, Users } from "lucide-react";

const recentTrips = [
  {
    title: "Kyoto Cherry Blossom Journey",
    destination: "Kyoto, Japan",
    date: "Mar 12, 2026",
    companions: "3 friends",
  },
  {
    title: "Weekend Escape in Santorini",
    destination: "Santorini, Greece",
    date: "Jan 24, 2026",
    companions: "Solo trip",
  },
  {
    title: "Cultural Tour of Seoul",
    destination: "Seoul, South Korea",
    date: "Nov 05, 2025",
    companions: "Family group",
  },
];

const HistoryPage = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 pt-24 pb-14">
      <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase">
            Travel History
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Your past adventures
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Browse recent trips and revisit your favorite memories.
          </p>
        </div>

        <div className="space-y-4">
          {recentTrips.map((trip, index) => (
            <article
              key={trip.title}
              className="group rounded-2xl border border-gray-100 bg-white/90 p-5 shadow-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:ring-indigo-100"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                    <Plane className="h-3.5 w-3.5" />
                    Trip #{String(index + 1).padStart(2, "0")}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {trip.title}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {trip.destination}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      {trip.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {trip.companions}
                    </span>
                  </div>
                </div>

                <button className="inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md">
                  <Compass className="h-4 w-4" />
                  View details
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistoryPage;
