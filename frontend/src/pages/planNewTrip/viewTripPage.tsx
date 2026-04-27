import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSpecificTripApi } from "@/api/trip.api";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Globe,
  StickyNote,
  Plane,
  Loader2,
  Clock,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon
const iconProto = L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: string };
delete iconProto._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const formatDateShort = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// ─── Custom pin icon ──────────────────────────────────────────────────────────

const makeIcon = (idx: number) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        background: linear-gradient(135deg, #3b82f6, #06b6d4);
        color: white; width: 28px; height: 28px;
        border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 700;
        box-shadow: 0 3px 10px rgba(59,130,246,0.45); border: 2px solid white;
      ">
        <span style="transform: rotate(45deg)">${idx + 1}</span>
      </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });

// ─── Map Controller ───────────────────────────────────────────────────────────

const MapController = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

// ─── Component ────────────────────────────────────────────────────────────────

const ViewTripPage = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<ITrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  useEffect(() => {
  let cancelled = false;

  const fetchTrip = async () => {
    if (!id) return;

    try {
      const data = await getSpecificTripApi(id);

      if (!cancelled) {
        setTrip(data);

        if (data.days.length > 0) {
          setActiveDate(data.days[0].date);

          const firstLoc = data.days[0].locations[0];
          if (firstLoc) {
            setMapCenter([firstLoc.lat, firstLoc.lng]);
            setMapZoom(12);
          }
        }
      }
    } catch{
      if (!cancelled) setTrip(null);
    } finally {
      if (!cancelled) setIsLoading(false);
    }
  };

  fetchTrip();

  return () => {
    cancelled = true;
  };
}, [id]);

  const activeDay = trip?.days.find((d) => d.date === activeDate);

  const allMarkers = trip?.days.flatMap((d) => d.locations) ?? [];
  const totalDays = trip?.days.length ?? 0;
  const totalLocs = allMarkers.length;

  return (
    <div style={{ display: "flex", height: "100dvh", width: "100%", overflow: "hidden" }}>

      {/* ── LEFT PANEL ────────────────────────────────────────────────── */}
      <aside style={{ width: "40%", flexShrink: 0, display: "flex", flexDirection: "column", height: "100%", borderRight: "1px solid #f1f5f9", background: "#f8fafc", overflow: "hidden" }}>

        {/* Top bar */}
        <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-5 py-3.5">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <Plane className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-800">TravelBuddy</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          )}

          {/* Not found */}
          {!isLoading && !trip && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Globe className="mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm font-semibold text-gray-500">Trip not found</p>
              <Link to="/dashboard" className="mt-3 text-xs text-blue-500 underline">
                Go back to dashboard
              </Link>
            </div>
          )}

          {/* Trip content */}
          {!isLoading && trip && (
            <>
              {/* Trip Header */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                    Read Only
                  </span>
                </div>
                <h1 className="text-2xl font-bold leading-tight text-gray-900">
                  Trip to{" "}
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    {trip.country}
                  </span>
                </h1>

                {/* Stats row */}
                <div className="mt-3 flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-gray-100">
                    <Calendar className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-xs text-gray-600">
                      {formatDateShort(trip.startDate)} – {formatDateShort(trip.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-gray-100">
                    <Clock className="h-3.5 w-3.5 text-cyan-500" />
                    <span className="text-xs text-gray-600">
                      {totalDays} day{totalDays !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-gray-100">
                    <MapPin className="h-3.5 w-3.5 text-purple-500" />
                    <span className="text-xs text-gray-600">
                      {totalLocs} location{totalLocs !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Day Tabs */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Itinerary
                </p>
                <div className="flex flex-wrap gap-2">
                    {trip.days.map((day, i) => (
                        <button
                        key={day.date}
                        onClick={() => {
                            // Update the active date
                            setActiveDate(day.date);
                            
                            // Update map center immediately if the day has locations
                            const firstLoc = day.locations[0];
                            if (firstLoc) {
                            setMapCenter([firstLoc.lat, firstLoc.lng]);
                            setMapZoom(12);
                            }
                        }}
                        className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                            activeDate === day.date
                            ? "border-blue-400 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-200"
                            : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                        >
                        <span className="text-xs opacity-75">Day {i + 1}</span>
                        <br />
                        <span className="text-xs">
                            {new Date(day.date + "T00:00:00").toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            })}
                        </span>
                        {day.locations.length > 0 && (
                            <span
                            className={`ml-1.5 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                activeDate === day.date
                                ? "bg-white/30 text-white"
                                : "bg-blue-100 text-blue-600"
                            }`}
                            >
                            {day.locations.length}
                            </span>
                        )}
                        </button>
                    ))}
                    </div>
              </div>

              {/* Active Day Locations */}
              {activeDay && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-700">
                    {formatDate(activeDay.date)}
                  </p>

                  {activeDay.locations.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/60 py-8 text-center">
                      <MapPin className="mb-2 h-6 w-6 text-gray-300" />
                      <p className="text-xs text-gray-400">No locations for this day</p>
                    </div>
                  )}

                  {activeDay.locations.map((loc, idx) => (
                    <div
                      key={loc.id}
                      onClick={() => {
                        setMapCenter([loc.lat, loc.lng]);
                        setMapZoom(15);
                      }}
                      className="cursor-pointer space-y-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        {/* Number badge */}
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-xs font-bold text-white shadow-md">
                          {idx + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-blue-500" />
                            <p className="truncate text-sm font-semibold text-gray-800">
                              {loc.name}
                            </p>
                          </div>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>

                      {/* Note */}
                      {loc.note && (
                        <div className="flex items-start gap-1.5 rounded-xl bg-amber-50 px-3 py-2">
                          <StickyNote className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-400" />
                          <p className="text-xs text-amber-700">{loc.note}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </aside>

      {/* ── RIGHT PANEL — MAP ─────────────────────────────────────────────── */}
      <main style={{ position: "relative", flex: 1, overflow: "hidden", height: "100%" }}>
        {/* Pin count badge */}
        {allMarkers.length > 0 && (
          <div className="absolute left-4 top-4 z-[1000] rounded-2xl bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm">
            <p className="text-xs font-semibold text-gray-500">
              {allMarkers.length} location{allMarkers.length !== 1 ? "s" : ""} pinned
            </p>
          </div>
        )}

        {/* Click hint */}
        {allMarkers.length > 0 && (
          <div className="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2 rounded-2xl bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm">
            <p className="text-xs text-gray-500">Click a location card to zoom in</p>
          </div>
        )}

        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={mapCenter} zoom={mapZoom} />

          {allMarkers.map((loc, idx) => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={makeIcon(idx)}>
              <Popup>
                <div className="min-w-[140px]">
                  <p className="font-semibold text-gray-800">{loc.name}</p>
                  {loc.note && <p className="mt-1 text-xs text-gray-500">{loc.note}</p>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>
    </div>
  );
};

export default ViewTripPage;