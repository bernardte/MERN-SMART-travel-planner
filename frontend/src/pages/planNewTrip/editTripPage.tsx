import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  MapPin,
  Trash2,
  ArrowLeft,
  Calendar,
  Search,
  Globe,
  StickyNote,
  ChevronRight,
  Plane,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { editTripApi } from "@/api/trip.api";
import useToast from "@/hooks/useToast";

// Fix Leaflet icon
const iconProto = L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: string };
delete iconProto._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ─── Types ───────────────────────────────────────────────────────────────────

interface LocationEntry {
  id: string;
  name: string;
  note: string;
  lat: number;
  lng: number;
}

export interface DayEntry {
  date: string;
  locations: LocationEntry[];
}

// ─── Geocoding ────────────────────────────────────────────────────────────────

const FALLBACK_COORDS: [number, number] = [48.8566, 2.3522];

const mockGeocode = async (location: string, country: string): Promise<[number, number]> => {
  const query = encodeURIComponent(`${location}, ${country}`);
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`
    );
    const data = await res.json();
    if (data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } catch { /* fall through */ }
  return FALLBACK_COORDS;
};

const countryGeocode = async (country: string): Promise<[number, number]> => {
  const query = encodeURIComponent(country);
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`
    );
    const data = await res.json();
    if (data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } catch { /* fall through */ }
  return [20, 0];
};

// ─── Map Controller ───────────────────────────────────────────────────────────

const MapController = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.4 });
  }, [center, zoom, map]);
  return null;
};

// ─── Utilities ────────────────────────────────────────────────────────────────

const generateDateRange = (start: string, end: string): string[] => {
  if (!start || !end) return [];
  const dates: string[] = [];
  const cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    dates.push(cur.toISOString().split("T")[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
};

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

// ─── Custom pin icon ──────────────────────────────────────────────────────────

const makeIcon = (idx: number) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        background: linear-gradient(135deg, #7c3aed, #a855f7);
        color: white; width: 28px; height: 28px;
        border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 700;
        box-shadow: 0 3px 10px rgba(124,58,237,0.45); border: 2px solid white;
      ">
        <span style="transform: rotate(45deg)">${idx + 1}</span>
      </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });

// ─── Component ────────────────────────────────────────────────────────────────

const EditTripPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoadingTrip, setIsLoadingTrip] = useState(true);
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [itinerary, setItinerary] = useState<DayEntry[]>([]);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();


  // ── Load existing trip ────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    axios
      .get(`/api/trips/${id}`, { withCredentials: true })
      .then((res) => {
        if (!cancelled) {
          const trip = res.data.data.trip;
          setCountry(trip.country);
          setStartDate(trip.startDate);
          setEndDate(trip.endDate);
          setItinerary(trip.days);
          setActiveDate(trip.days[0]?.date ?? null);
          // Pan to first location
          const firstLoc = trip.days[0]?.locations[0];
          if (firstLoc) {
            setMapCenter([firstLoc.lat, firstLoc.lng]);
            setMapZoom(11);
          } else {
            // Pan to country
            countryGeocode(trip.country)
              .then((coords) => { if (!cancelled) { setMapCenter(coords); setMapZoom(5); } })
              .catch(() => { /* ignore */ });
          }
        }
      })
      .catch(() => {
        if (!cancelled) showToast("error", "Failed to load trip.");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingTrip(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  // ── Derived itinerary ─────────────────────────────────────────────────────
  const derivedItinerary = useMemo<DayEntry[]>(() => {
    if (!startDate || !endDate) return [];
    const dates = generateDateRange(startDate, endDate);
    return dates.map((d) => itinerary.find((e) => e.date === d) ?? { date: d, locations: [] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const handleStartDate = (value: string) => {
    setStartDate(value);
    if (!value || !endDate) return;
    const dates = generateDateRange(value, endDate);
    setItinerary(dates.map((d) => itinerary.find((e) => e.date === d) ?? { date: d, locations: [] }));
    setActiveDate(dates[0] ?? null);
  };

  const handleEndDate = (value: string) => {
    setEndDate(value);
    if (!startDate || !value) return;
    const dates = generateDateRange(startDate, value);
    setItinerary(dates.map((d) => itinerary.find((e) => e.date === d) ?? { date: d, locations: [] }));
    setActiveDate((prev) => (prev && dates.includes(prev) ? prev : (dates[0] ?? null)));
  };

  // Pan map when country changes
  useEffect(() => {
    if (!country || isLoadingTrip) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      countryGeocode(country)
        .then((coords) => { if (!cancelled) { setMapCenter(coords); setMapZoom(5); } })
        .catch(() => { /* ignore */ });
    }, 600);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [country, isLoadingTrip]);

  const activeDay = itinerary.find((d) => d.date === activeDate);

  const addLocation = async () => {
    if (!locationInput.trim() || !activeDate) return;
    setIsAddingLocation(true);
    const coords = await mockGeocode(locationInput, country);
    const newLoc: LocationEntry = {
      id: crypto.randomUUID(),
      name: locationInput.trim(),
      note: "",
      lat: coords[0],
      lng: coords[1],
    };
    setItinerary((prev) =>
      prev.map((d) =>
        d.date === activeDate ? { ...d, locations: [...d.locations, newLoc] } : d
      )
    );
    setMapCenter(coords);
    setMapZoom(13);
    setLocationInput("");
    setIsAddingLocation(false);
  };

  const removeLocation = (locId: string) => {
    setItinerary((prev) =>
      prev.map((d) =>
        d.date === activeDate
          ? { ...d, locations: d.locations.filter((l) => l.id !== locId) }
          : d
      )
    );
  };

  const updateNote = (locId: string, note: string) => {
    setItinerary((prev) =>
      prev.map((d) =>
        d.date === activeDate
          ? { ...d, locations: d.locations.map((l) => (l.id === locId ? { ...l, note } : l)) }
          : d
      )
    );
  };

  // ── Save (PUT) ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!country.trim()) { showToast("error", "Please enter a destination."); return; }
    if (!startDate || !endDate) { showToast("error", "Please select your travel dates."); return; }
    if (!id) return;
    setIsSaving(true);
    try {
      await editTripApi(country, startDate, endDate, itinerary, id);
      showToast("success","Trip updated! Redirecting to dashboard…");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch {
      showToast("error", "Failed to update trip. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const allMarkers = itinerary.flatMap((d) => d.locations);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoadingTrip) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100dvh", width: "100%", overflow: "hidden" }}>
      {/* ── LEFT PANEL ──────────────────────────────────────────────────── */}
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
          {/* Edit badge */}
          <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-600">
            Editing
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
              <Plane className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-800">TravelBuddy</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto space-y-5 px-5 py-5">

          {/* Trip Title */}
          <div>
            <h1 className="text-2xl font-bold leading-tight text-gray-900">
              {country ? (
                <>
                  Editing trip to{" "}
                  <span className="bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
                    {country}
                  </span>
                </>
              ) : (
                <span className="text-gray-400">Edit your trip</span>
              )}
            </h1>
            {derivedItinerary.length > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                {derivedItinerary.length} day{derivedItinerary.length !== 1 ? "s" : ""} •{" "}
                {itinerary.reduce((a, d) => a + d.locations.length, 0)} locations
              </p>
            )}
          </div>

          {/* ── Inputs ── */}
          <div className="space-y-3">
            {/* Country */}
            <div className="relative">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-400">
                Destination
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Country or city…"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>

            {/* Dates */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-400">
                Dates
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleStartDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-300" />
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => handleEndDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Day Tabs ── */}
          {derivedItinerary.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Places to visit
              </p>
              <div className="flex flex-wrap gap-2">
                {derivedItinerary.map((day, i) => (
                  <button
                    key={day.date}
                    onClick={() => setActiveDate(day.date)}
                    className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                      activeDate === day.date
                        ? "border-violet-400 bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-md shadow-violet-200"
                        : "border-gray-200 bg-white text-gray-600 hover:border-violet-300 hover:bg-violet-50"
                    }`}
                  >
                    <span className="text-xs opacity-75">Day {i + 1}</span>
                    <br />
                    <span className="text-xs">{formatDate(day.date)}</span>
                    {day.locations.length > 0 && (
                      <span
                        className={`ml-1.5 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                          activeDate === day.date
                            ? "bg-white/30 text-white"
                            : "bg-violet-100 text-violet-600"
                        }`}
                      >
                        {day.locations.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Active Day Locations ── */}
          {activeDay && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">{formatDate(activeDay.date)}</p>
                <span className="text-xs text-gray-400">
                  {activeDay.locations.length} stop{activeDay.locations.length !== 1 ? "s" : ""}
                </span>
              </div>

              {activeDay.locations.map((loc, idx) => (
                <div
                  key={loc.id}
                  className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-500 text-xs font-bold text-white shadow-md">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-violet-500" />
                        <p className="truncate text-sm font-semibold text-gray-800">{loc.name}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeLocation(loc.id)}
                      className="rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
                      <StickyNote className="h-3 w-3" />
                      Note
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Add a note about this stop…"
                      value={loc.note}
                      onChange={(e) => updateNote(loc.id, e.target.value)}
                      className="w-full resize-none rounded-xl border border-gray-100 bg-slate-50 px-3 py-2 text-xs text-gray-700 placeholder-gray-400 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-50"
                    />
                  </div>
                </div>
              ))}

              {/* Add location */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Add a location…"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addLocation()}
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                <button
                  onClick={addLocation}
                  disabled={!locationInput.trim() || isAddingLocation}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-200 transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isAddingLocation ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {derivedItinerary.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/60 py-12 text-center">
              <div className="mb-3 rounded-full bg-violet-50 p-4">
                <Calendar className="h-7 w-7 text-violet-400" />
              </div>
              <p className="text-sm font-semibold text-gray-600">Select your travel dates</p>
              <p className="mt-1 text-xs text-gray-400">Your itinerary will appear here</p>
            </div>
          )}
        </div>

        {/* Save button */}
        {derivedItinerary.length > 0 && (
          <div className="border-t border-gray-100 bg-white px-5 py-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:hover:scale-100"
            >
              {isSaving ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {isSaving ? "Saving changes…" : "Save Changes ✨"}
            </button>
          </div>
        )}
      </aside>

      {/* ── RIGHT PANEL — MAP ──────────────────────────────────────────────── */}
      <main style={{ position: "relative", flex: 1, overflow: "hidden", height: "100%" }}>
        {allMarkers.length > 0 && (
          <div className="absolute left-4 top-4 z-[1000] rounded-2xl bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm">
            <p className="text-xs font-semibold text-gray-500">
              {allMarkers.length} location{allMarkers.length !== 1 ? "s" : ""} pinned
            </p>
          </div>
        )}

        {!country && (
          <div className="pointer-events-none absolute inset-0 z-[999] flex flex-col items-center justify-center bg-slate-100/60 backdrop-blur-sm">
            <div className="rounded-3xl bg-white/80 px-8 py-6 text-center shadow-xl backdrop-blur">
              <Globe className="mx-auto mb-3 h-10 w-10 text-violet-400 opacity-80" />
              <p className="text-base font-semibold text-gray-700">Enter a destination</p>
              <p className="mt-1 text-xs text-gray-400">Your locations will be pinned here</p>
            </div>
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

export default EditTripPage;