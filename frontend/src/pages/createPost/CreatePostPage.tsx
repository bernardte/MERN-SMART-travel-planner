import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronDown,
  ChevronRight,
  Ellipsis,
  Pen,
  Plus,
  Landmark,
  MapPin,
  Calendar,
  Clock,
  Trash2,
  Eye,
  Save,
  Sparkles,
  Globe,
  ListChecks,
  Text,
  X,
  Search,
  Navigation,
  Utensils,
  Coffee,
  Sunset,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useToast from "@/hooks/useToast";

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

//! Custom marker icons for different categories
const createCustomIcon = (color: string) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
    className: "custom-marker",
    iconSize: [28, 28],
    popupAnchor: [0, -14],
  });
};

// Types for data structure
export interface ListItem {
  id: string;
  text: string;
  type: "text" | "checklist";
  checked?: boolean;
}

export interface Place {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  category: "restaurant" | "attraction" | "cafe" | "viewpoint" | "other";
  address?: string;
  timeEstimate?: string;
}

export interface RouteStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  order: number;
}

export interface DaySection {
  id: string;
  type: "day";
  title: string;
  route: RouteStop[];
  places: Place[];
  listItems: ListItem[];
  notes: string;
  isOpen: boolean;
}

export interface TipsSection {
  id: string;
  type: "tips";
  title: string;
  content: string;
  isOpen: boolean;
}

export type Section = TipsSection | DaySection;

//! Search component - standalone search that adds directly to selected section
function MapSearch({
  onAddLocation,
  selectedSectionForAdd,
  setSelectedSectionForAdd,
}: {
  onAddLocation: (
    lat: number,
    lng: number,
    name: string,
    type: "route" | "place",
  ) => void;
  selectedSectionForAdd: { sectionId: string; type: "route" | "place" } | null;
  setSelectedSectionForAdd: React.Dispatch<
    React.SetStateAction<{ sectionId: string; type: "route" | "place" } | null>
  >;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const map = useMap();
  const hasShownToast = useRef(false);
  const { showToast } =  useToast();


  useEffect(() => {
    if (selectedSectionForAdd && !hasShownToast.current) {
      hasShownToast.current = true;
      showToast(
        "info",
        `Ready to add ${selectedSectionForAdd.type} to ${selectedSectionForAdd.sectionId}`,
      );
    }
    if (!selectedSectionForAdd) {
      hasShownToast.current = false;
    }
  }, [selectedSectionForAdd, showToast]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`,
      );
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        map.setView([lat, lng], 14);
      } else {
        showToast("error", "No results found. Try a different search term.");
      }
    } catch (error) {
      console.error("Search failed:", error);
      showToast("error", "Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelectResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    map.setView([lat, lng], 16);
    setShowResults(false);
    setSearchQuery("");

    if (selectedSectionForAdd) {
      const name = result.display_name.split(",")[0];
      onAddLocation(lat, lng, name, selectedSectionForAdd.type);
      setSelectedSectionForAdd(null);
      showToast("success", `${selectedSectionForAdd.type} added successfully!`);
    }
  };

  return (
    <div className="absolute top-4 right-4 left-4 z-[1000]">
      <div className="rounded-lg bg-white shadow-lg">
        <div className="flex items-center px-3 py-2">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              selectedSectionForAdd
                ? `Search and add to ${selectedSectionForAdd.type}...`
                : "Search for places, cities, landmarks..."
            }
            className="ml-2 flex-1 border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="mr-1">
              <X size={14} className="text-gray-400" />
            </button>
          )}
          <Button
            size="sm"
            onClick={handleSearch}
            disabled={isSearching}
            className="ml-2 gap-1 rounded-md bg-blue-600 px-3 text-white hover:bg-blue-700"
          >
            <Search size={14} />
            {isSearching ? "..." : "Search"}
          </Button>
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full right-0 left-0 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            {searchResults.map((result, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectResult(result)}
                className="w-full border-b border-gray-100 px-4 py-2 text-left text-sm hover:bg-blue-50"
              >
                <p className="font-medium text-gray-800">
                  {result.display_name.split(",")[0]}
                </p>
                <p className="text-xs text-gray-500">{result.display_name}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active selection indicator */}
      {selectedSectionForAdd && (
        <div className="mt-2 rounded-lg bg-blue-600 p-2 text-center text-xs text-white shadow-lg">
          <p>
            Ready to add {selectedSectionForAdd.type} to "
            {selectedSectionForAdd.sectionId}"
          </p>
          <button
            onClick={() => setSelectedSectionForAdd(null)}
            className="mt-1 text-white/80 underline"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

// Component to center map on markers
function MapController({
  markers,
}: {
  markers: Array<{ lat: number; lng: number }>;
}) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);
  return null;
}

const CreatePostPage = () => {
  const [guideTitle, setGuideTitle] = useState<string>(
    "Ultimate Edinburgh Travel Guide",
  );
  const [authorIntro, setAuthorIntro] = useState<string>(
    "Living in Edinburgh for 5 years, exploring every hidden gem this beautiful city has to offer.",
  );
  const [sections, setSections] = useState<Section[]>([
    {
      id: "tips",
      type: "tips",
      title: "General Tips",
      content:
        "💡 Book Edinburgh Castle tickets 2 weeks in advance\n🚇 The city is very walkable, but buses are frequent\n🍜 Try haggis at least once!\n📸 Best photo spots: Calton Hill at sunset\n💰 Free museums: National Museum of Scotland",
      isOpen: true,
    },
    {
      id: "day1",
      type: "day",
      title: "Day 1: Historic Edinburgh",
      route: [
        {
          id: "route1",
          name: "Edinburgh Castle",
          lat: 55.9486,
          lng: -3.1999,
          order: 1,
        },
        {
          id: "route2",
          name: "Royal Mile",
          lat: 55.9504,
          lng: -3.1891,
          order: 2,
        },
        {
          id: "route3",
          name: "Holyrood Palace",
          lat: 55.9525,
          lng: -3.1725,
          order: 3,
        },
      ],
      places: [
        {
          id: "place1",
          name: "Edinburgh Castle",
          description: "Historic fortress",
          lat: 55.9486,
          lng: -3.1999,
          category: "attraction",
          address: "Castlehill, Edinburgh EH1 2NG",
          timeEstimate: "2-3 hours",
        },
        {
          id: "place2",
          name: "The Royal Mile",
          description: "Historic street",
          lat: 55.9504,
          lng: -3.1891,
          category: "attraction",
          timeEstimate: "1-2 hours",
        },
        {
          id: "place4",
          name: "The Witchery by the Castle",
          description: "Award-winning restaurant",
          lat: 55.9492,
          lng: -3.1954,
          category: "restaurant",
          timeEstimate: "1.5-2 hours",
        },
      ],
      listItems: [
        {
          id: "item1",
          text: "Book castle tickets online",
          type: "checklist",
          checked: false,
        },
        {
          id: "item2",
          text: "Wear comfortable walking shoes",
          type: "checklist",
          checked: false,
        },
        {
          id: "item3",
          text: "Try a whisky tasting at The Scotch Whisky Experience",
          type: "text",
        },
      ],
      notes:
        "Start early to avoid crowds at the castle. The Royal Mile has many hidden closes worth exploring.",
      isOpen: true,
    },
    {
      id: "day2",
      type: "day",
      title: "Day 2: Hidden Gems & Views",
      route: [
        {
          id: "route4",
          name: "Calton Hill",
          lat: 55.9548,
          lng: -3.1828,
          order: 1,
        },
        {
          id: "route5",
          name: "Dean Village",
          lat: 55.9519,
          lng: -3.2165,
          order: 2,
        },
      ],
      places: [
        {
          id: "place3",
          name: "Calton Hill",
          description: "Sunset viewpoint",
          lat: 55.9548,
          lng: -3.1828,
          category: "viewpoint",
          timeEstimate: "30-45 min",
        },
        {
          id: "place5",
          name: "Fortitude Coffee",
          description: "Specialty coffee",
          lat: 55.9565,
          lng: -3.1888,
          category: "cafe",
          timeEstimate: "15-30 min",
        },
      ],
      listItems: [
        {
          id: "item4",
          text: "Pack a picnic for Calton Hill sunset",
          type: "checklist",
          checked: false,
        },
        {
          id: "item5",
          text: "Visit Stockbridge Market (Sundays only)",
          type: "text",
        },
      ],
      notes:
        "Dean Village is a hidden gem - don't miss the waterfall at the mill.",
      isOpen: false,
    },
  ]);

  const [activeListType, setActiveListType] = useState<{
    sectionId: string;
    type: "text" | "checklist";
  } | null>(null);
  const [selectedSectionForAdd, setSelectedSectionForAdd] = useState<{
    sectionId: string;
    type: "route" | "place";
  } | null>(null);
  const { showToast } = useToast();
  const titleInputRef = useRef<HTMLTextAreaElement>(null);
  const [isAddingDay, setIsAddingDay] = useState(false);

  // Get all map markers from all open sections
  const getAllMapMarkers = () => {
    const markers: Array<{
      lat: number;
      lng: number;
      title: string;
      type: string;
      category?: string;
    }> = [];
    sections.forEach((section) => {
      if (section.type === "day" && section.isOpen) {
        section.route.forEach((stop) => {
          markers.push({
            lat: stop.lat,
            lng: stop.lng,
            title: stop.name,
            type: "route",
          });
        });
        section.places.forEach((place) => {
          markers.push({
            lat: place.lat,
            lng: place.lng,
            title: place.name,
            type: "place",
            category: place.category,
          });
        });
      }
    });
    return markers;
  };

  const getRoutePolylines = () => {
    const polylines: Array<{
      positions: [number, number][];
      color: string;
      dayId: string;
    }> = [];
    sections.forEach((section) => {
      if (section.type === "day" && section.route.length > 1) {
        const positions = section.route.map(
          (stop) => [stop.lat, stop.lng] as [number, number],
        );
        polylines.push({ positions, color: "#3b82f6", dayId: section.id });
      }
    });
    return polylines;
  };

  const updateSectionTitle = (id: string, newTitle: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, title: newTitle } : section,
      ),
    );
  };

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, isOpen: !section.isOpen } : section,
      ),
    );
  };

  const updateTipsContent = (id: string, content: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id && section.type === "tips"
          ? { ...section, content }
          : section,
      ),
    );
  };

  const updateDayNotes = (id: string, notes: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id && section.type === "day"
          ? { ...section, notes }
          : section,
      ),
    );
  };

  const addListItem = (sectionId: string, itemType: "text" | "checklist") => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId && section.type === "day") {
          const newItem: ListItem = {
            id: `item_${Date.now()}_${Math.random()}`,
            text: "",
            type: itemType,
            checked: false,
          };
          return { ...section, listItems: [...section.listItems, newItem] };
        }
        return section;
      }),
    );
    setActiveListType(null);
  };

  const updateListItem = (sectionId: string, itemId: string, text: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId && section.type === "day") {
          return {
            ...section,
            listItems: section.listItems.map((item) =>
              item.id === itemId ? { ...item, text } : item,
            ),
          };
        }
        return section;
      }),
    );
  };

  const toggleChecklistItem = (sectionId: string, itemId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId && section.type === "day") {
          return {
            ...section,
            listItems: section.listItems.map((item) =>
              item.id === itemId && item.type === "checklist"
                ? { ...item, checked: !item.checked }
                : item,
            ),
          };
        }
        return section;
      }),
    );
  };

  const deleteListItem = (sectionId: string, itemId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId && section.type === "day") {
          return {
            ...section,
            listItems: section.listItems.filter((item) => item.id !== itemId),
          };
        }
        return section;
      }),
    );
  };

  const addRouteStop = (sectionId: string, stop: RouteStop) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId && section.type === "day") {
          const newOrder = section.route.length + 1;
          return {
            ...section,
            route: [...section.route, { ...stop, order: newOrder }],
          };
        }
        return section;
      }),
    );
  };

  const addPlace = (sectionId: string, place: Place) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId && section.type === "day") {
          return { ...section, places: [...section.places, place] };
        }
        return section;
      }),
    );
  };

  const deleteRouteStop = (sectionId: string, stopId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId && section.type === "day") {
          const newRoute = section.route.filter((stop) => stop.id !== stopId);
          newRoute.forEach((stop, idx) => {
            stop.order = idx + 1;
          });
          return { ...section, route: newRoute };
        }
        return section;
      }),
    );
  };

  const deletePlace = (sectionId: string, placeId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId && section.type === "day") {
          return {
            ...section,
            places: section.places.filter((place) => place.id !== placeId),
          };
        }
        return section;
      }),
    );
  };

  const addNewDay = () => {
    setIsAddingDay(true);
    setTimeout(() => {
      const newDayId = `day_${Date.now()}`;
      const dayNumber = sections.filter((s) => s.type === "day").length + 1;
      const newDay: DaySection = {
        id: newDayId,
        type: "day",
        title: `Day ${dayNumber}`,
        route: [],
        places: [],
        listItems: [],
        notes: "",
        isOpen: true,
      };
      setSections((prev) => [...prev, newDay]);
      setIsAddingDay(false);
      showToast("success", `Day ${dayNumber} added successfully!`);
    }, 300);
  };

  const deleteSection = (id: string) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
    showToast("info", "Section deleted");
  };

  const handleAddLocation = (
    lat: number,
    lng: number,
    name: string,
    type: "route" | "place",
  ) => {
    if (selectedSectionForAdd) {
      const newId = `${Date.now()}_${Math.random()}`;
      if (type === "route") {
        const newStop: RouteStop = {
          id: newId,
          name: name,
          lat: lat,
          lng: lng,
          order: 0,
        };
        addRouteStop(selectedSectionForAdd.sectionId, newStop);
        showToast("success",`Route stop "${name}" added!`);
      } else {
        const category = prompt(
          "Enter category (restaurant/attraction/cafe/viewpoint/other):",
          "attraction",
        ) as any;
        const newPlace: Place = {
          id: newId,
          name: name,
          lat: lat,
          lng: lng,
          category: category || "other",
          timeEstimate: prompt("Estimated time (e.g., '1-2 hours'):") || "",
        };
        addPlace(selectedSectionForAdd.sectionId, newPlace);
        showToast("success", `Place "${name}" added!`);
      }
      setSelectedSectionForAdd(null);
    }
  };

  const exportGuideData = () => {
    const guideData = {
      title: guideTitle,
      author: {
        name: "Alexandra Chen",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
        role: "Travel Creator",
      },
      authorIntro: authorIntro,
      sections: sections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log("Guide data for database:", JSON.stringify(guideData, null, 2));
    showToast("success", "Guide data saved to console!");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "restaurant":
        return <Utensils size={12} />;
      case "cafe":
        return <Coffee size={12} />;
      case "viewpoint":
        return <Sunset size={12} />;
      case "attraction":
        return <Landmark size={12} />;
      default:
        return <MapPin size={12} />;
    }
  };

  return (
    <div className="relative flex min-h-screen w-full">
      {/* Left-side bar - guide create with shadow */}
      <aside className="scrollbar-thin scrollbar-thumb-gray-300 relative z-20 flex w-1/2 flex-col gap-6 overflow-y-auto bg-white/95 pb-24 shadow-2xl">
        {/* Hero Image Section */}
        <section className="relative z-10 flex min-h-[55vh] justify-center">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=700&fit=crop"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          {/* Header overlay card */}
          <div className="absolute -bottom-20 z-12 flex w-4/5 flex-col rounded-2xl bg-white shadow-2xl transition-all duration-300">
            <div className="p-6 pb-3">
              <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-blue-600 uppercase">
                <Sparkles size={12} />
                <span>Create Your Travel Guide</span>
              </div>
              <Textarea
                ref={titleInputRef}
                rows={1}
                value={guideTitle}
                onChange={(e) => setGuideTitle(e.target.value)}
                placeholder="Give your guide a captivating title..."
                className="mt-2 w-full resize-none border-none bg-transparent p-0 text-3xl leading-tight font-bold tracking-tight text-gray-800 outline-none placeholder:text-gray-300 focus:ring-0"
              />
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="group relative h-10 w-10 overflow-hidden rounded-full shadow-md ring-2 ring-white transition-all hover:ring-blue-300">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-700">Alexandra Chen</p>
                  <p className="text-xs text-gray-400">Travel Creator</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 rounded-full bg-gray-100 px-4 text-gray-600 hover:bg-gray-200"
              >
                <Plus size={14} />
                <span className="text-xs">Collaborators</span>
              </Button>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="relative z-10 mt-16 flex flex-col justify-center px-8">
          {/* Author Intro Card */}
          <div className="mx-auto w-4/5">
            <div className="relative rounded-2xl bg-gradient-to-r from-blue-50/80 to-cyan-50/80 p-5">
              <div className="absolute top-4 right-4 text-blue-200">
                <Globe size={20} />
              </div>
              <p className="mb-2 text-xs font-semibold tracking-wider text-blue-600 uppercase">
                About the author
              </p>
              <Textarea
                rows={2}
                value={authorIntro}
                onChange={(e) => setAuthorIntro(e.target.value)}
                placeholder="Share your connection to this place..."
                className="w-full resize-none rounded-xl border-none bg-white/60 p-0 text-sm text-gray-600 italic outline-none placeholder:text-gray-400 focus:ring-0"
              />
            </div>
          </div>

          {/* Dynamic Sections */}
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="group animate-fadeInUp mx-auto w-4/5"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Section Header */}
              <div className="mt-6 flex items-center justify-between rounded-xl py-2 transition-all hover:bg-gray-50">
                <div className="flex flex-1 items-center gap-3">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="rounded-full p-1 text-gray-400 transition-all hover:bg-gray-100 hover:text-blue-500"
                  >
                    {section.isOpen ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-cyan-50 text-blue-500">
                      {section.type === "tips" ? (
                        <Sparkles size={14} />
                      ) : (
                        <Calendar size={14} />
                      )}
                    </div>
                    <Input
                      value={section.title}
                      onChange={(e) =>
                        updateSectionTitle(section.id, e.target.value)
                      }
                      placeholder="Section title"
                      className="w-auto min-w-[120px] resize-none border-none bg-transparent px-2 py-1 text-lg font-semibold text-gray-700 outline-none focus:ring-0"
                    />
                    <button className="rounded-md p-1 text-gray-300 opacity-0 transition-all group-hover:opacity-100 hover:text-gray-500">
                      <Pen size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-all group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-500"
                    onClick={() => deleteSection(section.id)}
                  >
                    <Trash2 size={15} />
                  </Button>
                  <button className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100">
                    <Ellipsis size={16} />
                  </button>
                </div>
              </div>

              {/* Section Content */}
              {section.isOpen && (
                <div className="animate-slideDown pl-9">
                  {section.type === "tips" && (
                    <div className="overflow-hidden rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50/70 to-yellow-50/30">
                      <div className="border-b border-amber-100 bg-amber-100/30 px-4 py-2">
                        <span className="text-xs font-medium text-amber-700">
                          ✨ Insider Knowledge
                        </span>
                      </div>
                      <Textarea
                        rows={6}
                        value={section.content}
                        onChange={(e) =>
                          updateTipsContent(section.id, e.target.value)
                        }
                        className="w-full resize-none border-none bg-transparent p-4 text-sm text-gray-600 outline-none focus:ring-0"
                      />
                    </div>
                  )}

                  {section.type === "day" && (
                    <div className="space-y-4">
                      {/* Route Card */}
                      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-blue-50 p-1.5 text-blue-500">
                              <Navigation size={14} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              Route Stops ({section.route.length})
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs text-blue-500 transition-all hover:scale-105 hover:bg-blue-50"
                            onClick={() =>
                              setSelectedSectionForAdd({
                                sectionId: section.id,
                                type: "route",
                              })
                            }
                          >
                            <Plus size={12} /> Add stop
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {section.route.length === 0 ? (
                            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
                              <div className="h-5 w-5 rounded-full border-2 border-blue-300" />
                              <span className="text-gray-400">
                                Click "Add stop" then search on the map to add a
                                route stop
                              </span>
                            </div>
                          ) : (
                            section.route.map((stop, idx) => (
                              <div
                                key={stop.id}
                                className="flex items-center justify-between gap-2"
                              >
                                <div className="flex flex-1 items-center gap-2">
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                                    {idx + 1}
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    {stop.name}
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    deleteRouteStop(section.id, stop.id)
                                  }
                                  className="text-gray-400 opacity-0 transition-opacity group-hover/route:opacity-100 hover:text-red-500"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Places Card */}
                      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-emerald-50 p-1.5 text-emerald-500">
                              <Landmark size={14} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              Places ({section.places.length})
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs text-blue-500 transition-all hover:scale-105 hover:bg-blue-50"
                            onClick={() =>
                              setSelectedSectionForAdd({
                                sectionId: section.id,
                                type: "place",
                              })
                            }
                          >
                            <Plus size={12} /> Add place
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {section.places.length === 0 ? (
                            <p className="py-4 text-center text-sm text-gray-400">
                              No places added. Click "Add place" then search on
                              the map.
                            </p>
                          ) : (
                            section.places.map((place) => (
                              <div
                                key={place.id}
                                className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="text-blue-500">
                                    {getCategoryIcon(place.category)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">
                                      {place.name}
                                    </p>
                                    <p className="text-xs text-gray-400 capitalize">
                                      {place.category}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    deletePlace(section.id, place.id)
                                  }
                                  className="text-gray-400 transition-colors hover:text-red-500"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* List Component */}
                      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-purple-50 p-1.5 text-purple-500">
                              <ListChecks size={14} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              Reminders & Notes
                            </span>
                          </div>
                          <div className="flex gap-1">
                            {activeListType?.sectionId === section.id ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 gap-1 text-xs text-gray-500"
                                onClick={() => setActiveListType(null)}
                              >
                                <X size={12} /> Cancel
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 gap-1 text-xs text-gray-500 transition-all hover:scale-105 hover:text-blue-600"
                                  onClick={() =>
                                    addListItem(section.id, "text")
                                  }
                                >
                                  <Text size={12} /> Text
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 gap-1 text-xs text-gray-500 transition-all hover:scale-105 hover:text-purple-600"
                                  onClick={() =>
                                    addListItem(section.id, "checklist")
                                  }
                                >
                                  <ListChecks size={12} /> Reminder
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {section.listItems.length === 0 ? (
                            <p className="py-4 text-center text-sm text-gray-400">
                              No items yet. Add a text note or reminder.
                            </p>
                          ) : (
                            section.listItems.map((item) => (
                              <div
                                key={item.id}
                                className="group/item flex items-center gap-2 rounded-lg p-1.5 transition-all hover:bg-gray-50"
                              >
                                {item.type === "checklist" ? (
                                  <Checkbox
                                    checked={item.checked}
                                    onCheckedChange={() =>
                                      toggleChecklistItem(section.id, item.id)
                                    }
                                    className="h-4 w-4 border-gray-300 data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500"
                                  />
                                ) : (
                                  <div className="w-4" />
                                )}
                                <Input
                                  value={item.text}
                                  onChange={(e) =>
                                    updateListItem(
                                      section.id,
                                      item.id,
                                      e.target.value,
                                    )
                                  }
                                  placeholder={
                                    item.type === "checklist"
                                      ? "Reminder for travelers..."
                                      : "Add a note..."
                                  }
                                  className={`h-auto flex-1 border-none bg-transparent p-0 text-sm outline-none focus:ring-0 ${
                                    item.type === "checklist" && item.checked
                                      ? "text-gray-400"
                                      : "text-gray-700"
                                  }`}
                                />
                                <button
                                  onClick={() =>
                                    deleteListItem(section.id, item.id)
                                  }
                                  className="opacity-0 transition-opacity group-hover/item:opacity-100"
                                >
                                  <Trash2
                                    size={12}
                                    className="text-gray-400 transition-colors hover:text-red-500"
                                  />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="flex items-start gap-2 rounded-lg bg-gray-50/50 p-3 text-sm text-gray-400 transition-all hover:bg-gray-50">
                        <Clock size={14} className="mt-0.5 flex-shrink-0" />
                        <Textarea
                          rows={2}
                          value={section.notes}
                          onChange={(e) =>
                            updateDayNotes(section.id, e.target.value)
                          }
                          placeholder="Add estimated times, opening hours, or personal recommendations..."
                          className="min-h-[60px] w-full resize-none border-none bg-transparent p-0 text-sm text-gray-500 outline-none focus:ring-0"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Add Day Button with Animation */}
          <div className="mx-auto mt-6 w-4/5">
            <button
              onClick={addNewDay}
              disabled={isAddingDay}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white/50 py-4 text-gray-500 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50/20 hover:text-blue-600 disabled:opacity-50"
            >
              {isAddingDay ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  <span className="text-sm font-medium">Adding...</span>
                </>
              ) : (
                <>
                  <Plus
                    size={18}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="text-sm font-medium">Add new day</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mx-auto mt-10 flex w-4/5 gap-3 pb-16">
            <Button
              className="flex-1 gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 py-5 text-sm font-medium text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
              onClick={exportGuideData}
            >
              <Save size={16} /> Save Guide
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-gray-200 bg-white px-6 py-5 text-sm font-medium transition-all hover:scale-[1.02] hover:border-blue-200 hover:bg-blue-50"
            >
              <Eye size={16} /> Preview
            </Button>
          </div>
        </section>
      </aside>

      {/* Right-side bar - Full background map */}
      <div className="relative h-screen w-1/2 flex-1">
        {/* Map Container - full coverage */}
        <MapContainer
          center={[55.9533, -3.1883]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          className="absolute inset-0 z-0"
        >
          {/* use openstreepmap style tile layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Search component */}
          <MapSearch
            onAddLocation={handleAddLocation}
            selectedSectionForAdd={selectedSectionForAdd}
            setSelectedSectionForAdd={setSelectedSectionForAdd}
          />
          {/* Route Polylines */}
          {getRoutePolylines().map((polyline, idx) => (
            <Polyline
              key={idx}
              positions={polyline.positions}
              color="#3b82f6"
              weight={4}
              opacity={0.7}
              dashArray="5, 10"
            />
          ))}
          {/* Markers */}
          {getAllMapMarkers().map((marker, idx) => {
            const markerColor =
              marker.type === "route"
                ? "#3b82f6"
                : marker.category === "restaurant"
                  ? "#ef4444"
                  : marker.category === "cafe"
                    ? "#f59e0b"
                    : marker.category === "viewpoint"
                      ? "#10b981"
                      : "#8b5cf6";
            return (
              <Marker
                key={idx}
                position={[marker.lat, marker.lng]}
                icon={createCustomIcon(markerColor)}
              >
                <Popup>
                  <div className="max-w-[200px] text-sm">
                    <p className="font-semibold text-gray-800">
                      {marker.title}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {marker.type === "route" ? "Route Stop" : marker.category}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
          <MapController markers={getAllMapMarkers()} />
        </MapContainer>

        {/* Bottom Stats Bar */}
        <div className="pointer-events-none absolute right-4 bottom-4 left-4 z-10 flex items-center justify-between rounded-lg bg-black/60 px-4 py-2 text-xs text-white backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {getAllMapMarkers().length} locations
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />{" "}
              {sections.filter((s) => s.type === "day").length} days
            </span>
            <span className="flex items-center gap-1">
              <Navigation size={12} />{" "}
              {getRoutePolylines().reduce(
                (acc, p) => acc + p.positions.length - 1,
                0,
              )}{" "}
              routes
            </span>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              Route
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              Place
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        .animate-in {
          animation: slideInFromRight 0.3s ease-out forwards;
        }
        .slide-in-from-right-5 {
          animation: slideInFromRight 0.3s ease-out forwards;
        }
        .leaflet-container {
          background: #e5e7eb;
        }
        .custom-marker {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default CreatePostPage;
