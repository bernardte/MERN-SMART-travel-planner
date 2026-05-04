import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronDown, ChevronRight, Pen, Plus, Landmark, MapPin, Calendar,
  Trash2, Eye, Save, Sparkles, Globe, ListChecks, Text, X, Navigation,
  Search, Loader2, Star, Award, Camera, Mountain,
  Coffee as CoffeeIcon, UtensilsCrossed, Building2, Clock, MapPinned, Route,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useToast from "@/hooks/useToast";
import { useParams, useNavigate } from "react-router-dom";
import { LoadingState } from "@/layouts/components/loading/LoadingState";
import { getTripPlanApi, updateTripPlanApi } from "@/api/trip.api";
import useAuthStore from "@/stores/useAuthStore";
import type {
  Section, DaySection, TipsSection, ListItem, Place, RouteStop,
} from "@/pages/tripPlan/TripPlanPage";

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

const CATEGORY_GRADIENTS: Record<string, string> = {
  restaurant: "from-red-500 to-red-600", cafe: "from-amber-500 to-amber-600",
  viewpoint: "from-emerald-500 to-emerald-600", attraction: "from-purple-500 to-purple-600",
  other: "from-gray-500 to-gray-600", route: "from-blue-500 to-blue-600",
};

const createCustomIcon = (color: string, iconType?: string) => {
  const svgPaths: Record<string, string> = {
    restaurant: '<path d="M3 3h2v8h4V3h2v8a6 6 0 0 1-12 0V3z M15 3v8a4 4 0 0 0 4 4h2V3h-2v8h-2V3z"/>',
    cafe: '<path d="M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z M6 1v3 M10 1v3 M14 1v3"/>',
    viewpoint: '<circle cx="12" cy="12" r="10"/><path d="M12 2v20 M2 12h20"/>',
    attraction: '<path d="M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5"/>',
    default: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>',
  };
  const path = svgPaths[iconType || "default"] ?? svgPaths.default;
  return L.divIcon({
    html: `<div style="background:${color};width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.2)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg></div>`,
    className: "custom-marker", iconSize: [36, 36], popupAnchor: [0, -18],
  });
};

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

// ─── Nominatim ────────────────────────────────────────────────────────────────
interface NominatimResult {
  place_id: number; display_name: string; lat: string; lon: string;
}
async function searchPlaces(query: string): Promise<NominatimResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  return res.json();
}

// ─── Category helpers ─────────────────────────────────────────────────────────
type PlaceCategory = Place["category"];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "restaurant": return <UtensilsCrossed size={14} className="text-red-500" />;
    case "cafe": return <CoffeeIcon size={14} className="text-amber-500" />;
    case "viewpoint": return <Camera size={14} className="text-emerald-500" />;
    case "attraction": return <Landmark size={14} className="text-purple-500" />;
    default: return <MapPin size={14} className="text-gray-500" />;
  }
};

// ─── Add Place Modal ──────────────────────────────────────────────────────────
function AddPlaceModal({ isOpen, onClose, onAdd, sectionId }: {
  isOpen: boolean; onClose: () => void;
  onAdd: (sectionId: string, place: Place) => void; sectionId: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selected, setSelected] = useState<NominatimResult | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<PlaceCategory>("attraction");
  const [timeEstimate, setTimeEstimate] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQueryChange = (val: string) => {
    setQuery(val); setSelected(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try { const data = await searchPlaces(val); setResults(data); }
      finally { setIsSearching(false); }
    }, 500);
  };

  const handleSelect = (r: NominatimResult) => {
    setSelected(r); setQuery(r.display_name);
    setName(r.display_name.split(",")[0]); setResults([]);
  };

  const reset = () => {
    setQuery(""); setResults([]); setSelected(null);
    setName(""); setDescription(""); setCategory("attraction"); setTimeEstimate("");
  };

  const handleSubmit = () => {
    if (!selected) { alert("Please select a location first."); return; }
    if (!name.trim()) { alert("Please enter a place name."); return; }
    const newPlace: Place = {
      id: `place_${Date.now()}_${Math.random()}`, order: 0, name: name.trim(),
      description: description || undefined, lat: parseFloat(selected.lat),
      lng: parseFloat(selected.lon), category, address: selected.display_name,
      timeEstimate: timeEstimate || undefined,
    };
    onAdd(sectionId, newPlace); onClose(); reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-lg overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="relative bg-gradient-to-br from-blue-500 to-cyan-500 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <MapPin size={18} className="text-white" />
              </div>
              <h2 className="text-lg font-semibold text-white">Add New Place</h2>
            </div>
            <button onClick={() => { reset(); onClose(); }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>
        <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-6">
          {/* Search */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              <Search size={12} /> Search Location
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
                {isSearching ? <Loader2 size={16} className="animate-spin text-indigo-400" />
                  : <Search size={16} className="text-gray-400" />}
              </div>
              <input type="text" value={query} onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search for a place…"
                className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:outline-none" />
              {selected && (
                <div className="absolute top-1/2 right-4 -translate-y-1/2">
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">✓ Selected</span>
                </div>
              )}
            </div>
            {results.length > 0 && (
              <div className="mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                {results.map((r) => (
                  <button key={r.place_id} onClick={() => handleSelect(r)}
                    className="w-full border-b border-gray-50 px-4 py-3 text-left text-sm last:border-0 hover:bg-blue-50">
                    <p className="font-medium text-gray-800">{r.display_name.split(",")[0]}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{r.display_name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Name */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              <Pen size={12} /> Place Name
            </label>
            <input type="text" placeholder="e.g., Eiffel Tower" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:outline-none" />
          </div>
          {/* Category */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              <Star size={12} /> Category
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(["attraction", "restaurant", "cafe", "viewpoint", "other"] as PlaceCategory[]).map((cat) => {
                const icons: Record<PlaceCategory, React.ReactNode> = {
                  attraction: <Building2 size={14} />, restaurant: <UtensilsCrossed size={14} />,
                  cafe: <CoffeeIcon size={14} />, viewpoint: <Mountain size={14} />, other: <MapPin size={14} />,
                };
                return (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-2.5 text-xs font-medium transition-all ${category === cat
                      ? `border-blue-400 bg-gradient-to-br ${CATEGORY_GRADIENTS[cat]} scale-105 text-white shadow-md`
                      : "border-gray-200 text-gray-600 hover:border-indigo-200 hover:bg-indigo-50"}`}>
                    {icons[cat]}
                    <span className="text-[11px] capitalize">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Description & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                <Text size={12} /> Description
              </label>
              <textarea placeholder="Optional notes…" value={description}
                onChange={(e) => setDescription(e.target.value)} rows={2}
                className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                <Clock size={12} /> Time Estimate
              </label>
              <input type="text" placeholder="e.g., 1–2 hours" value={timeEstimate}
                onChange={(e) => setTimeEstimate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:outline-none" />
            </div>
          </div>
          {selected && (
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex gap-4">
                <div className="flex-1 text-center">
                  <p className="mb-1 text-xs font-medium text-gray-500">Latitude</p>
                  <p className="font-mono text-sm font-semibold text-gray-700">{parseFloat(selected.lat).toFixed(6)}</p>
                </div>
                <div className="w-px bg-gray-300" />
                <div className="flex-1 text-center">
                  <p className="mb-1 text-xs font-medium text-gray-500">Longitude</p>
                  <p className="font-mono text-sm font-semibold text-gray-700">{parseFloat(selected.lon).toFixed(6)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button onClick={() => { reset(); onClose(); }}
            className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="flex-1 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 py-2.5 text-sm font-medium text-white shadow-md hover:shadow-lg">
            Add Place
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Title Modal ─────────────────────────────────────────────────────────
function EditTitleModal({ isOpen, onClose, onSave, currentTitle }: {
  isOpen: boolean; onClose: () => void;
  onSave: (newTitle: string) => void; currentTitle: string;
}) {
  const [title, setTitle] = useState(currentTitle);
  useEffect(() => { if (isOpen) setTitle(currentTitle); }, [isOpen, currentTitle]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit Day Title</h2>
        </div>
        <div className="p-6">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && title.trim()) { onSave(title); onClose(); } }}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            placeholder="Enter day title" autoFocus />
        </div>
        <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 bg-white py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={() => { if (title.trim()) { onSave(title); onClose(); } }}
            className="flex-1 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Edit Page ───────────────────────────────────────────────────────────
const EditTripPlanPage = () => {
  const { tripPlanId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingDay, setIsAddingDay] = useState(false);

  const [guideTitle, setGuideTitle] = useState("");
  const [authorIntro, setAuthorIntro] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sections, setSections] = useState<Section[]>([]);

  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [selectedSectionForPlace, setSelectedSectionForPlace] = useState<string | null>(null);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [editingTitleSection, setEditingTitleSection] = useState<{ id: string; title: string } | null>(null);
  const [activeListType, setActiveListType] = useState<{ sectionId: string; type: "text" | "checklist" } | null>(null);

  // ── Fetch existing trip plan ──
  useEffect(() => {
    console.log("tripPlanId from params:", tripPlanId);
    if (!tripPlanId) return;
    const fetch = async () => {
      try {
        setIsLoading(true);
        const res = await getTripPlanApi(tripPlanId);
        console.log("trip plan response:", res);
        const plan = res.data.data;
        setGuideTitle(plan.title ?? "");
        setAuthorIntro(plan.authorIntro ?? "");
        if (plan.thumbnailImage) setCoverImage(plan.thumbnailImage);
        setSections(
          (plan.sections ?? []).map((s: Section) => ({ ...s, isOpen: true }))
        );
      } catch {
        showToast("error", "Failed to load trip plan");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [tripPlanId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setCoverImage(URL.createObjectURL(file));
  };

  // ── Map helpers ──
  const getAllMapMarkers = () => {
    const markers: Array<{ lat: number; lng: number; title: string; type: string; category?: string; note?: string }> = [];
    sections.forEach((section) => {
      if (section.type === "day" && section.isOpen) {
        section.route.forEach((stop) => markers.push({ lat: stop.lat, lng: stop.lng, title: stop.name, type: "route", note: stop.note }));
        section.places.forEach((place) => markers.push({ lat: place.lat, lng: place.lng, title: place.name, type: "place", category: place.category }));
      }
    });
    return markers;
  };

  const getRoutePolylines = () =>
    sections.filter((s) => s.type === "day").map((s) => ({
      positions: (s as DaySection).route.map((stop) => [stop.lat, stop.lng] as [number, number]),
      color: "#6366f1", day: s.title,
    }));

  // ── Section mutations (same as TripPlanPage) ──
  const updateSectionTitle = (id: string, newTitle: string) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s)));

  const toggleSection = (id: string) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, isOpen: !s.isOpen } : s)));

  const updateTipsContent = (id: string, content: string) =>
    setSections((prev) => prev.map((s) => s.id === id && s.type === "tips" ? { ...s, content } : s));

  const updateDayNotes = (id: string, notes: string) =>
    setSections((prev) => prev.map((s) => s.id === id && s.type === "day" ? { ...s, notes } : s));

  const addListItem = (sectionId: string, itemType: "text" | "checklist") => {
    setSections((prev) => prev.map((s) => {
      if (s.id === sectionId && s.type === "day") {
        const newItem: ListItem = {
          id: `item_${Date.now()}_${Math.random()}`, order: s.listItems.length + 1,
          text: "", type: itemType, checked: false,
        };
        return { ...s, listItems: [...s.listItems, newItem] };
      }
      return s;
    }));
    setActiveListType(null);
  };

  const updateListItem = (sectionId: string, itemId: string, text: string) =>
    setSections((prev) => prev.map((s) =>
      s.id === sectionId && s.type === "day"
        ? { ...s, listItems: s.listItems.map((item) => item.id === itemId ? { ...item, text } : item) }
        : s));

  const toggleChecklistItem = (sectionId: string, itemId: string) =>
    setSections((prev) => prev.map((s) =>
      s.id === sectionId && s.type === "day"
        ? { ...s, listItems: s.listItems.map((item) => item.id === itemId && item.type === "checklist" ? { ...item, checked: !item.checked } : item) }
        : s));

  const deleteListItem = (sectionId: string, itemId: string) =>
    setSections((prev) => prev.map((s) =>
      s.id === sectionId && s.type === "day"
        ? { ...s, listItems: s.listItems.filter((item) => item.id !== itemId) }
        : s));

  const addPlace = (sectionId: string, place: Place) => {
    setSections((prev) => prev.map((s) => {
      if (s.id === sectionId && s.type === "day") {
        return { ...s, places: [...s.places, { ...place, order: s.places.length + 1 }] };
      }
      return s;
    }));
    showToast("success", `"${place.name}" added!`);
  };

  const deletePlace = (sectionId: string, placeId: string) =>
    setSections((prev) => prev.map((s) =>
      s.id === sectionId && s.type === "day"
        ? { ...s, places: s.places.filter((p) => p.id !== placeId) }
        : s));

  const addNewDay = () => {
    setIsAddingDay(true);
    setTimeout(() => {
      const dayNumber = sections.filter((s) => s.type === "day").length + 1;
      const newDay: DaySection = {
        id: `day${dayNumber}_${Date.now()}`, type: "day",
        title: `Day ${dayNumber}: New Day`, route: [], places: [], listItems: [], notes: "", isOpen: true,
      };
      setSections((prev) => [...prev, newDay]);
      setIsAddingDay(false);
      showToast("success", `Day ${dayNumber} added!`);
    }, 300);
  };

  const deleteSection = (id: string) => {
    if (id === "tips") { showToast("error", "Cannot delete tips section"); return; }
    setSections((prev) => prev.filter((s) => s.id !== id));
    showToast("info", "Section deleted");
  };

  // ── Save (UPDATE) ──
  const saveGuideToBackend = async () => {
    if (!tripPlanId) return;
    setIsSaving(true);
    try {
      await updateTripPlanApi(tripPlanId, {
        title: guideTitle,
        authorIntro,
        sections,
        ...(imageFile && { thumbnailImage: imageFile }),
      });
      showToast("success", "Guide updated!");
      navigate("/dashboard");
    } catch {
      showToast("error", "Failed to update guide");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingState />;

  const allMarkers = getAllMapMarkers();

  return (
    <div className="relative flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modals */}
      <AddPlaceModal
        isOpen={isPlaceModalOpen}
        onClose={() => { setIsPlaceModalOpen(false); setSelectedSectionForPlace(null); }}
        onAdd={addPlace}
        sectionId={selectedSectionForPlace || ""}
      />
      <EditTitleModal
        isOpen={isTitleModalOpen}
        onClose={() => { setIsTitleModalOpen(false); setEditingTitleSection(null); }}
        onSave={(newTitle) => { if (editingTitleSection) updateSectionTitle(editingTitleSection.id, newTitle); }}
        currentTitle={editingTitleSection?.title || ""}
      />

      {/* ── Left panel ── */}
      <aside className="relative z-20 mx-4 my-17 flex h-screen w-[52%] flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl"
        style={{ scrollbarWidth: "thin" }}>

        {/* Hero */}
        <div className="relative h-64 flex-shrink-0 overflow-hidden rounded-t-3xl">
          <img
            src={coverImage || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=600&fit=crop"}
            className="h-full w-full object-cover" alt="Cover" />
          <input type="file" accept="image/*" className="hidden" id="coverUpload" onChange={handleImageUpload} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <label htmlFor="coverUpload"
            className="absolute top-4 right-4 cursor-pointer rounded-full bg-black/50 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/70">
            <div className="flex items-center gap-2"><Camera size={14} /> Change Cover</div>
          </label>
          {/* Edit badge */}
          <div className="absolute top-4 left-4 rounded-full bg-orange-500/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            ✏️ Editing
          </div>
          <div className="absolute right-0 bottom-0 left-0 p-8">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/30 backdrop-blur">
                <Sparkles size={12} className="text-indigo-200" />
              </div>
              <span className="text-xs font-semibold tracking-widest text-indigo-200 uppercase">Travel Guide</span>
            </div>
            <textarea rows={2} value={guideTitle} onChange={(e) => setGuideTitle(e.target.value)}
              placeholder="Give your guide a title…"
              className="w-full resize-none border-none bg-transparent p-0 text-3xl leading-tight font-bold text-white outline-none placeholder:text-white/40 focus:ring-0"
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }} />
          </div>
        </div>

        {/* Author strip */}
        <div className="flex items-center gap-4 border-b border-gray-100 px-8 py-5">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-60 blur-sm" />
            <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white">
              <img src={user?.profilePicture ?? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"}
                className="h-full w-full object-cover" alt="Author" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{user?.username || "Travel Creator"}</p>
            <p className="text-xs text-gray-400">Travel Guide Creator</p>
          </div>
        </div>

        {/* Author intro */}
        <div className="px-8 pt-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5 shadow-sm">
            <Award size={18} className="absolute top-4 right-4 text-indigo-300" />
            <p className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-widest text-indigo-500 uppercase">
              <Globe size={12} /> About the author
            </p>
            <textarea rows={2} value={authorIntro} onChange={(e) => setAuthorIntro(e.target.value)}
              placeholder="Share your connection to this place…"
              className="w-full resize-none border-none bg-transparent p-0 text-sm text-gray-600 italic outline-none placeholder:text-gray-400 focus:ring-0" />
          </div>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-5 px-8 py-6 pb-32">
          {sections.map((section, idx) => (
            <div key={section.id}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
              style={{ animationDelay: `${idx * 50}ms` }}>

              {/* Section header */}
              <div className={`flex items-center justify-between px-5 py-4 transition-all ${section.type === "day" ? "bg-gradient-to-r from-indigo-50/80 to-white" : "bg-gradient-to-r from-amber-50/80 to-white"}`}>
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${section.type === "day" ? "bg-indigo-100 text-indigo-600" : "bg-amber-100 text-amber-600"}`}>
                    {section.type === "day" ? <Calendar size={16} /> : <Sparkles size={16} />}
                  </div>
                  <span className="text-base font-semibold text-gray-800">{section.title}</span>
                  {section.type === "day" && (
                    <button onClick={() => { setEditingTitleSection({ id: section.id, title: section.title }); setIsTitleModalOpen(true); }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-indigo-100">
                      <Pen size={12} className="text-indigo-400" />
                    </button>
                  )}
                </div>
                <div className="flex flex-shrink-0 items-center gap-1">
                  <button onClick={() => toggleSection(section.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/70">
                    {section.isOpen ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-500" />}
                  </button>
                  {section.id !== "tips" && (
                    <button onClick={() => deleteSection(section.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-50">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Section body */}
              {section.isOpen && (
                <div className="space-y-4 px-5 py-5">
                  {section.type === "tips" ? (
                    <textarea value={section.content} onChange={(e) => updateTipsContent(section.id, e.target.value)}
                      placeholder="Write your tips here…"
                      className="min-h-[120px] w-full resize-none rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 focus:border-amber-200 focus:ring-2 focus:ring-amber-100 focus:outline-none" />
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
                            <p className="text-[10px] font-bold tracking-widest text-purple-600 uppercase">Added Places</p>
                          </div>
                          {section.places.map((place) => (
                            <div key={place.id} className="group/place flex items-start gap-3">
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
                              <button onClick={() => deletePlace(section.id, place.id)}
                                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full opacity-0 transition-all group-hover/place:opacity-100 hover:bg-red-100">
                                <X size={11} className="text-red-400" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Notes */}
                      <textarea value={section.notes} onChange={(e) => updateDayNotes(section.id, e.target.value)}
                        placeholder="📝 Notes for this day…"
                        className="min-h-[80px] w-full resize-none rounded-xl border border-gray-100 bg-gray-50/80 p-4 text-sm text-gray-700 focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 focus:outline-none" />

                      {/* List items */}
                      {section.listItems.length > 0 && (
                        <div className="space-y-2">
                          {section.listItems.map((item) => (
                            <div key={item.id} className="group/item flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50">
                              {item.type === "checklist" ? (
                                <Checkbox checked={item.checked} onCheckedChange={() => toggleChecklistItem(section.id, item.id)} className="flex-shrink-0" />
                              ) : (
                                <Text size={14} className="flex-shrink-0 text-gray-400" />
                              )}
                              <input type="text" value={item.text}
                                onChange={(e) => updateListItem(section.id, item.id, e.target.value)}
                                placeholder={item.type === "checklist" ? "Checklist item…" : "Text note…"}
                                className="flex-1 border-b border-gray-200 bg-transparent px-2 py-1 text-sm outline-none focus:border-indigo-400" />
                              <button onClick={() => deleteListItem(section.id, item.id)}
                                className="flex h-6 w-6 items-center justify-center rounded opacity-0 transition-all group-hover/item:opacity-100 hover:bg-red-100">
                                <X size={11} className="text-red-400" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add item / place row */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        {activeListType?.sectionId === section.id ? (
                          <div className="flex gap-2">
                            <button onClick={() => addListItem(section.id, "text")}
                              className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200">
                              <Text size={12} /> Text
                            </button>
                            <button onClick={() => addListItem(section.id, "checklist")}
                              className="flex items-center gap-2 rounded-xl bg-indigo-100 px-4 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-200">
                              <ListChecks size={12} /> Checklist
                            </button>
                            <button onClick={() => setActiveListType(null)}
                              className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-200">
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setActiveListType({ sectionId: section.id, type: "text" })}
                            className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium text-gray-500 hover:bg-indigo-50 hover:text-indigo-600">
                            <Plus size={12} /> Add item
                          </button>
                        )}
                        <button onClick={() => { setSelectedSectionForPlace(section.id); setIsPlaceModalOpen(true); }}
                          className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium text-gray-500 hover:bg-purple-50 hover:text-purple-600">
                          <MapPin size={12} /> Add place
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Add day */}
          <button onClick={addNewDay} disabled={isAddingDay}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-white/50 py-5 text-gray-400 transition-all duration-300 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-indigo-500 disabled:opacity-50">
            {isAddingDay ? (
              <><Loader2 size={18} className="animate-spin" /><span className="text-sm font-medium">Adding…</span></>
            ) : (
              <><div className="rounded-full bg-gray-100 p-1 group-hover:bg-indigo-100"><Plus size={16} /></div>
                <span className="text-sm font-medium">Add new day</span></>
            )}
          </button>
        </div>

        {/* Sticky footer */}
        <div className="sticky right-0 bottom-0 left-0 z-10 flex gap-3 border-t border-gray-100 bg-white/95 px-8 py-5 shadow-lg backdrop-blur-lg">
          <button onClick={saveGuideToBackend} disabled={isSaving}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-60">
            {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
              : <><Save size={16} /> Save changes</>}
          </button>
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
                <Marker key={idx} position={[marker.lat, marker.lng]}
                  icon={createCustomIcon(color, marker.type === "route" ? "route" : marker.category)}>
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

export default EditTripPlanPage;