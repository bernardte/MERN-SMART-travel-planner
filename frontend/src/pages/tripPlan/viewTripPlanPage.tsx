import {
  Landmark, MapPin, Calendar, Sparkles, Globe, Text, X,
  Navigation, Loader2, Award, Camera, UtensilsCrossed,
  Coffee as CoffeeIcon, Clock, MapPinned, Route, CheckSquare, Square,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useToast from "@/hooks/useToast";
import { useParams, useNavigate } from "react-router-dom";
import { LoadingState } from "@/layouts/components/loading/LoadingState";
import { getTripPlanApi } from "@/api/trip.api";
import type { Section, DaySection } from "@/pages/tripPlan/TripPlanPage";

// ─── Leaflet setup ─────────────────────────────────────────────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const CATEGORY_COLORS: Record<string, string> = {
  restaurant: "#ef4444", cafe: "#f59e0b", viewpoint: "#10b981",
  attraction: "#8b5cf6", other: "#6b7280", route: "#3b82f6",
};

const createCustomIcon = (color: string) => L.divIcon({
  html: `<div style="background:${color};width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.2)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg></div>`,
  className: "custom-marker", iconSize: [36, 36], popupAnchor: [0, -18],
});

function MapController({ markers }: { markers: Array<{ lat: number; lng: number }> }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);
  return null;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "restaurant": return <UtensilsCrossed size={14} className="text-red-500" />;
    case "cafe": return <CoffeeIcon size={14} className="text-amber-500" />;
    case "viewpoint": return <Camera size={14} className="text-emerald-500" />;
    case "attraction": return <Landmark size={14} className="text-purple-500" />;
    default: return <MapPin size={14} className="text-gray-500" />;
  }
};

const ViewTripPlanPage = () => {
  const { tripPlanId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [guideTitle, setGuideTitle] = useState("");
  const [authorIntro, setAuthorIntro] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!tripPlanId) return;
    
    const fetchPlan = async () => {
      try {
        setIsLoading(true);
        const res = await getTripPlanApi(tripPlanId);
        const plan = res.data.data;
        setGuideTitle(plan.title ?? "");
        setAuthorIntro(plan.authorIntro ?? "");
        setAuthorName(plan.authorName ?? "");
        setAuthorAvatar(plan.authorAvatar ?? "");
        if (plan.thumbnailImage) setCoverImage(plan.thumbnailImage);
        const loadedSections = plan.sections ?? [];
        setSections(loadedSections);
        // all sections open by default
        const openMap: Record<string, boolean> = {};
        loadedSections.forEach((s: Section) => { openMap[s.id] = true; });
        setOpenSections(openMap);
      } catch {
        showToast("error", "Failed to load trip plan");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, [tripPlanId]);

  const toggleSection = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const getAllMapMarkers = () => {
    const markers: Array<{ lat: number; lng: number; title: string; type: string; category?: string; note?: string }> = [];
    sections.forEach((section) => {
      if (section.type === "day") {
        section.route.forEach((stop) => markers.push({ lat: stop.lat, lng: stop.lng, title: stop.name, type: "route", note: stop.note }));
        section.places.forEach((place) => markers.push({ lat: place.lat, lng: place.lng, title: place.name, type: "place", category: place.category }));
      }
    });
    return markers;
  };

  const getRoutePolylines = () =>
    sections.filter((s) => s.type === "day").map((s) => ({
      positions: (s as DaySection).route.map((stop) => [stop.lat, stop.lng] as [number, number]),
      color: "#6366f1",
    }));

  if (isLoading) return <LoadingState />;

  const allMarkers = getAllMapMarkers();

  return (
    <div className="relative flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">

      {/* ── Left panel ── */}
      <aside className="relative z-20 mx-4 my-17 flex h-screen w-[52%] flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl"
        style={{ scrollbarWidth: "thin" }}>

        {/* Hero */}
        <div className="relative h-64 flex-shrink-0 overflow-hidden rounded-t-3xl">
          <img
            src={coverImage || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=600&fit=crop"}
            className="h-full w-full object-cover" alt="Cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Back button */}
          <button onClick={() => navigate(-1)}
            className="absolute top-4 left-4 rounded-full bg-black/50 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/70">
            ← Back
          </button>

          <div className="absolute right-0 bottom-0 left-0 p-8">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/30 backdrop-blur">
                <Sparkles size={12} className="text-indigo-200" />
              </div>
              <span className="text-xs font-semibold tracking-widest text-indigo-200 uppercase">Travel Guide</span>
            </div>
            <h1 className="text-3xl leading-tight font-bold text-white"
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
              {guideTitle}
            </h1>
          </div>
        </div>

        {/* Author strip */}
        <div className="flex items-center gap-4 border-b border-gray-100 px-8 py-5">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-60 blur-sm" />
            <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white">
              <img src={authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"}
                className="h-full w-full object-cover" alt="Author" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{authorName || "Travel Creator"}</p>
            <p className="text-xs text-gray-400">Travel Guide Creator</p>
          </div>
        </div>

        {/* Author intro */}
        {authorIntro && (
          <div className="px-8 pt-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5 shadow-sm">
              <Award size={18} className="absolute top-4 right-4 text-indigo-300" />
              <p className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-widest text-indigo-500 uppercase">
                <Globe size={12} /> About the author
              </p>
              <p className="text-sm text-gray-600 italic">{authorIntro}</p>
            </div>
          </div>
        )}

        {/* Sections — READ ONLY */}
        <div className="flex flex-col gap-5 px-8 py-6 pb-10">
          {sections.map((section, idx) => (
            <div key={section.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              style={{ animationDelay: `${idx * 50}ms` }}>

              {/* Section header */}
              <button onClick={() => toggleSection(section.id)}
                className={`flex w-full items-center justify-between px-5 py-4 text-left transition-all ${section.type === "day" ? "bg-gradient-to-r from-indigo-50/80 to-white" : "bg-gradient-to-r from-amber-50/80 to-white"}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${section.type === "day" ? "bg-indigo-100 text-indigo-600" : "bg-amber-100 text-amber-600"}`}>
                    {section.type === "day" ? <Calendar size={16} /> : <Sparkles size={16} />}
                  </div>
                  <span className="text-base font-semibold text-gray-800">{section.title}</span>
                </div>
                <span className="text-xs text-gray-400">{openSections[section.id] ? "▲" : "▼"}</span>
              </button>

              {/* Section body */}
              {openSections[section.id] && (
                <div className="space-y-4 px-5 py-5">
                  {section.type === "tips" ? (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                      {section.content || <span className="text-gray-400 italic">No tips added.</span>}
                    </p>
                  ) : (
                    <>
                      {/* Route stops */}
                      {section.route.length > 0 && (
                        <div className="space-y-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <Route size={14} className="text-blue-600" />
                            <p className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">Route</p>
                          </div>
                          {section.route.map((stop) => (
                            <div key={stop.id} className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-[11px] font-bold text-blue-700">
                                {stop.order}
                              </div>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-gray-800">{stop.name}</span>
                                {stop.note && <p className="mt-0.5 text-xs text-gray-500">{stop.note}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Places */}
                      {section.places.length > 0 && (
                        <div className="space-y-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <MapPinned size={14} className="text-purple-600" />
                            <p className="text-[10px] font-bold tracking-widest text-purple-600 uppercase">Places</p>
                          </div>
                          {section.places.map((place) => (
                            <div key={place.id} className="flex items-start gap-3">
                              <div className="mt-0.5 flex-shrink-0">{getCategoryIcon(place.category)}</div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-800">{place.name}</span>
                                  {place.timeEstimate && (
                                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                      <Clock size={10} /> {place.timeEstimate}
                                    </span>
                                  )}
                                </div>
                                {place.description && <p className="text-xs text-gray-500">{place.description}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Notes */}
                      {section.notes && (
                        <div className="rounded-xl bg-gray-50 p-4">
                          <p className="mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Notes</p>
                          <p className="whitespace-pre-wrap text-sm text-gray-600">{section.notes}</p>
                        </div>
                      )}

                      {/* List items */}
                      {section.listItems.length > 0 && (
                        <div className="space-y-2">
                          {section.listItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 rounded-lg p-2">
                              {item.type === "checklist" ? (
                                item.checked
                                  ? <CheckSquare size={16} className="flex-shrink-0 text-indigo-500" />
                                  : <Square size={16} className="flex-shrink-0 text-gray-300" />
                              ) : (
                                <Text size={14} className="flex-shrink-0 text-gray-400" />
                              )}
                              <span className={`text-sm ${item.checked ? "text-gray-400 line-through" : "text-gray-700"}`}>
                                {item.text || <span className="text-gray-300 italic">Empty item</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* ── Right panel: Map ── */}
      <div className="relative my-17 mr-4 h-screen flex-1">
        <div className="absolute inset-0 overflow-hidden rounded-3xl shadow-2xl">
          <MapContainer
            center={allMarkers.length > 0 ? [allMarkers[0].lat, allMarkers[0].lng] : [51.505, -0.09]}
            zoom={13} style={{ height: "100%", width: "100%" }} className="z-0">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {getRoutePolylines().map((poly, idx) => (
              <Polyline key={idx} positions={poly.positions} color={poly.color} weight={5} opacity={0.8} dashArray="8, 8" />
            ))}
            {allMarkers.map((marker, idx) => {
              const color = marker.type === "route" ? CATEGORY_COLORS.route : (CATEGORY_COLORS[marker.category || "other"] ?? CATEGORY_COLORS.other);
              return (
                <Marker key={idx} position={[marker.lat, marker.lng]} icon={createCustomIcon(color)}>
                  <Popup>
                    <div className="max-w-[220px] rounded-lg p-1">
                      <div className="mb-1 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                        <p className="text-sm font-semibold text-gray-800">{marker.title}</p>
                      </div>
                      <p className="text-[11px] text-gray-500 capitalize">
                        {marker.type === "route" ? "Route stop" : marker.category}
                      </p>
                      {marker.note && <p className="mt-2 border-t border-gray-100 pt-1 text-xs text-gray-600">{marker.note}</p>}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
            <MapController markers={allMarkers} />
          </MapContainer>
        </div>

        {/* Map stats bar */}
        <div className="pointer-events-none absolute right-5 bottom-5 left-5 z-10">
          <div className="flex items-center justify-between rounded-2xl bg-black/70 px-5 py-3 text-xs text-white shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-2">
                <MapPin size={12} className="text-indigo-400" />
                <span className="font-medium">{allMarkers.length} locations</span>
              </span>
              <div className="h-4 w-px bg-white/20" />
              <span className="flex items-center gap-2">
                <Calendar size={12} className="text-indigo-400" />
                <span className="font-medium">{sections.filter((s) => s.type === "day").length} days</span>
              </span>
              <div className="h-4 w-px bg-white/20" />
              <span className="flex items-center gap-2">
                <Navigation size={12} className="text-indigo-400" />
                <span className="font-medium">
                  {getRoutePolylines().reduce((acc, p) => acc + Math.max(0, p.positions.length - 1), 0)} routes
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {[{ color: "#6366f1", label: "Route" }, { color: "#8b5cf6", label: "Attraction" },
                { color: "#ef4444", label: "Restaurant" }, { color: "#f59e0b", label: "Cafe" },
                { color: "#10b981", label: "Viewpoint" }].map(({ color, label }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                  <span className="text-[11px]">{label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-marker { background: transparent !important; border: none !important; }
        .custom-marker:hover { transform: scale(1.1); z-index: 1000 !important; }
        .leaflet-popup-content-wrapper { border-radius: 12px; padding: 0; }
        .leaflet-popup-content { margin: 12px; }
        aside::-webkit-scrollbar { width: 5px; }
        aside::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        aside::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        aside::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default ViewTripPlanPage;