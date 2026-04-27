// TravelPlanPost.tsx
import React, { useState } from "react";
import {
  MapPin,
  CalendarDays,
  Compass,
  PlusCircle,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  X,
  ChevronRight,
  ChevronLeft,
  Globe,
  Users,
  TrendingUp,
  Clock,
  Star,
  Award,
  Plane,
  Hotel,
  Car,
  Utensils,
  Paperclip,
  Link2,
  FileText,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Settings,
  Eye,
  Save,
  FileSpreadsheet,
  Coffee,
  Mountain,
  Camera,
  Sun,
  Cloud,
  Map,
  Navigation,
  Send,
  Edit3,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

// Shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Types
interface DayPlan {
  day: number;
  title: string;
  description: string;
  activities: string[];
  image?: string;
  accommodation?: string;
  meals?: string[];
}

interface Attachment {
  id: string;
  type:
    | "flight"
    | "lodging"
    | "rental_car"
    | "restaurant"
    | "attachment"
    | "other";
  title: string;
  url: string;
  description?: string;
}

interface TravelPlan {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
    username: string;
    bio?: string;
  };
  coverImage: string;
  destination: string;
  countries: string[];
  startDate: string;
  endDate: string;
  duration: string;
  overview: string;
  generalTips: string;
  days: DayPlan[];
  attachments: Attachment[];
  likes: number;
  comments: number;
  saves: number;
  views: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: Date;
}

// Mock data
const mockPlan: TravelPlan = {
  id: "1",
  title: "Ultimate Scandinavia & Central Europe Adventure",
  author: {
    name: "Alex Thompson",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    username: "@alex_adventures",
    bio: "Travel photographer | 45 countries | Based in London",
  },
  coverImage:
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=600&fit=crop",
  destination: "Scandinavia & Central Europe",
  countries: [
    "Iceland",
    "Norway",
    "United Kingdom",
    "Denmark",
    "Netherlands",
    "Germany",
    "Czechia",
    "Austria",
    "France",
    "Italy",
    "Spain",
    "Portugal",
  ],
  startDate: "2024-06-01",
  endDate: "2024-06-28",
  duration: "28 days",
  overview:
    "An epic 4-week journey through the stunning fjords of Norway, the geothermal wonders of Iceland, and the historic cities of Central Europe. This route combines nature, culture, and amazing food experiences.",
  generalTips:
    "Pack layers! The weather varies dramatically. Book trains in advance for better prices. Get a Eurail pass if you're doing multiple countries. Learn basic phrases in each language - locals appreciate it!",
  days: [
    {
      day: 1,
      title: "Arrival in Reykjavik",
      description:
        "Land in Iceland's capital, pick up rental car, explore the city center",
      activities: [
        "Hallgrímskirkja Church",
        "Sun Voyager sculpture",
        "Harpa Concert Hall",
        "Blue Lagoon (optional)",
      ],
      accommodation: "Center Hotels Plaza",
      meals: ["Breakfast: Hotel", "Lunch: Café Loki", "Dinner: Seabaron"],
    },
    {
      day: 2,
      title: "Golden Circle Tour",
      description:
        "Iceland's most famous route featuring geothermal wonders and waterfalls",
      activities: [
        "Þingvellir National Park",
        "Gullfoss Waterfall",
        "Geysir geothermal area",
        "Kerid Crater",
      ],
      accommodation: "Same hotel in Reykjavik",
    },
    {
      day: 3,
      title: "Oslo Exploration",
      description: "Fly to Oslo, explore the Norwegian capital",
      activities: [
        "Vigeland Sculpture Park",
        "Oslo Opera House",
        "Akershus Fortress",
        "Viking Ship Museum",
      ],
      accommodation: "Clarion Hotel The Hub",
    },
  ],
  attachments: [
    {
      id: "1",
      type: "flight",
      title: "Reykjavik to Oslo Flight",
      url: "https://example.com/flight",
      description: "SAS Airlines - Booking reference: ABC123",
    },
    {
      id: "2",
      type: "lodging",
      title: "Center Hotels Plaza",
      url: "https://example.com/hotel",
      description: "Reykjavik - 4 nights",
    },
    {
      id: "3",
      type: "rental_car",
      title: "Iceland Car Rental",
      url: "https://example.com/car",
      description: "4x4 for Golden Circle",
    },
    {
      id: "4",
      type: "restaurant",
      title: "Seabaron Restaurant",
      url: "https://example.com/restaurant",
      description: "Famous lobster soup",
    },
  ],
  likes: 1234,
  comments: 89,
  saves: 456,
  views: 5678,
  createdAt: new Date("2024-03-15"),
};

// Create Post Modal Component
const CreatePlanModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanCreated: (plan: TravelPlan) => void;
}> = ({ open, onOpenChange, onPlanCreated }) => {
  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [generalTips, setGeneralTips] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [countries, setCountries] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState<DayPlan[]>([
    { day: 1, title: "", description: "", activities: [] },
  ]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(URL.createObjectURL(file));
    }
  };

  const addDay = () => {
    setDays([
      ...days,
      { day: days.length + 1, title: "", description: "", activities: [] },
    ]);
  };

  const removeDay = (index: number) => {
    setDays(days.filter((_, i) => i !== index));
  };

  const updateDay = (index: number, field: keyof DayPlan, value: any) => {
    const updated = [...days];
    updated[index] = { ...updated[index], [field]: value };
    setDays(updated);
  };

  const handleSubmit = () => {
    const newPlan: TravelPlan = {
      id: Date.now().toString(),
      title,
      author: {
        name: "Current User",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
        username: "@traveler",
      },
      coverImage:
        coverImage ||
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop",
      destination: title.split(" ").slice(0, 3).join(" "),
      countries: countries.split(",").map((c) => c.trim()),
      startDate,
      endDate,
      duration: `${Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days`,
      overview,
      generalTips,
      days,
      attachments,
      likes: 0,
      comments: 0,
      saves: 0,
      views: 0,
      createdAt: new Date(),
    };
    onPlanCreated(newPlan);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Compass className="text-primary h-6 w-6" />
            Create Trip Plan
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Plan Title *
            </label>
            <Input
              placeholder="e.g., Ultimate Scandinavia Adventure"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Cover Image
            </label>
            {coverImage && (
              <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => setCoverImage("")}
                  className="absolute top-2 right-2 rounded-full bg-black/50 p-1"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file:bg-primary/10 file:mr-2 file:rounded-full file:border-0 file:px-3 file:py-1 file:text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Countries (comma separated)
              </label>
              <Input
                placeholder="Iceland, Norway, Denmark"
                value={countries}
                onChange={(e) => setCountries(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Map Preview
              </label>
              <div className="flex h-10 items-center gap-1 rounded-md border bg-gray-50 px-3 text-sm text-gray-500">
                <Globe className="h-4 w-4" />{" "}
                {countries
                  ? `${countries.split(",").length} countries selected`
                  : "Add countries to see map"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Overview</label>
            <Textarea
              placeholder="Describe your overall journey..."
              rows={3}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              General Tips
            </label>
            <Textarea
              placeholder="Share useful tips for fellow travelers..."
              rows={2}
              value={generalTips}
              onChange={(e) => setGeneralTips(e.target.value)}
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium">Daily Itinerary</label>
              <Button
                size="sm"
                variant="outline"
                onClick={addDay}
                className="gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Day
              </Button>
            </div>
            <div className="space-y-3">
              {days.map((day, idx) => (
                <div key={idx} className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Day {day.day}</span>
                    {days.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeDay(idx)}
                        className="h-6 w-6 p-0 text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    placeholder="Title (e.g., Arrival in Reykjavik)"
                    value={day.title}
                    onChange={(e) => updateDay(idx, "title", e.target.value)}
                    className="mb-2 text-sm"
                  />
                  <Textarea
                    placeholder="Description"
                    rows={2}
                    value={day.description}
                    onChange={(e) =>
                      updateDay(idx, "description", e.target.value)
                    }
                    className="mb-2 text-sm"
                  />
                  <Input
                    placeholder="Activities (comma separated)"
                    value={day.activities.join(", ")}
                    onChange={(e) =>
                      updateDay(
                        idx,
                        "activities",
                        e.target.value.split(",").map((s) => s.trim()),
                      )
                    }
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Attachments (Flights, Hotels, etc.)
            </label>
            <div className="rounded-lg border p-3 text-center text-gray-500">
              <Paperclip className="mx-auto mb-1 h-6 w-6" />
              <p className="text-xs">
                Add links to flights, hotels, rental cars, restaurants
              </p>
              <Button size="sm" variant="ghost" className="mt-2 text-xs">
                + Add Attachment
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title}>
            Publish Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Plan View Component (Main Display)
const TravelPlanView: React.FC<{
  plan: TravelPlan;
  onLike: () => void;
  onSave: () => void;
}> = ({ plan, onLike, onSave }) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "days" | "attachments"
  >("overview");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header with Cover Image */}
      <div className="relative mb-8 overflow-hidden rounded-2xl shadow-xl">
        <img
          src={plan.coverImage}
          alt={plan.title}
          className="h-64 w-full object-cover md:h-96"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
          <Badge className="mb-2 bg-white/20 text-white backdrop-blur-sm">
            {plan.duration} journey
          </Badge>
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">{plan.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {plan.countries.length} countries
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {plan.startDate} - {plan.endDate}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {plan.views} views
            </span>
          </div>
        </div>
      </div>

      {/* Author & Actions Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={plan.author.avatar} />
            <AvatarFallback>{plan.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{plan.author.name}</p>
            <p className="text-sm text-gray-500">{plan.author.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2" onClick={onLike}>
            <Heart
              className={`h-5 w-5 ${plan.isLiked ? "fill-red-500 text-red-500" : ""}`}
            />
            <span>{plan.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageCircle className="h-5 w-5" />
            <span>{plan.comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2" onClick={onSave}>
            <Bookmark
              className={`h-5 w-5 ${plan.isSaved ? "fill-primary text-primary" : ""}`}
            />
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Country Map Visualization */}
      <div className="mb-8 rounded-xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Globe className="text-primary h-5 w-5" />
          <span className="font-semibold">Route Map</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {plan.countries.map((country, idx) => (
            <React.Fragment key={country}>
              <Badge
                variant="outline"
                className={`cursor-pointer rounded-full px-3 py-1.5 ${selectedCountry === country ? "bg-primary text-white" : "bg-white"}`}
                onClick={() =>
                  setSelectedCountry(
                    selectedCountry === country ? null : country,
                  )
                }
              >
                {country}
              </Badge>
              {idx < plan.countries.length - 1 && (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>
        {selectedCountry && (
          <div className="mt-3 rounded-lg bg-white p-3 text-sm">
            <p className="font-medium">{selectedCountry}</p>
            <p className="text-gray-500">
              Click on days tab to see detailed itinerary for this country
            </p>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as any)}
        className="mb-6"
      >
        <TabsList className="w-full justify-start gap-6 rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:border-primary rounded-none px-4 pb-3 data-[state=active]:border-b-2"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="days"
            className="data-[state=active]:border-primary rounded-none px-4 pb-3 data-[state=active]:border-b-2"
          >
            Daily Plan
          </TabsTrigger>
          <TabsTrigger
            value="attachments"
            className="data-[state=active]:border-primary rounded-none px-4 pb-3 data-[state=active]:border-b-2"
          >
            Attachments
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-3 text-lg font-semibold">About this trip</h3>
              <p className="leading-relaxed text-gray-600">{plan.overview}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <Award className="text-primary h-5 w-5" /> General Tips
              </h3>
              <p className="leading-relaxed text-gray-600">
                {plan.generalTips}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="mb-3 text-lg font-semibold">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="text-center">
                  <div className="text-primary text-2xl font-bold">
                    {plan.duration}
                  </div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-primary text-2xl font-bold">
                    {plan.countries.length}
                  </div>
                  <div className="text-xs text-gray-500">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-primary text-2xl font-bold">
                    {plan.days.length}
                  </div>
                  <div className="text-xs text-gray-500">Days planned</div>
                </div>
                <div className="text-center">
                  <div className="text-primary text-2xl font-bold">
                    {plan.attachments.length}
                  </div>
                  <div className="text-xs text-gray-500">Bookings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Daily Plan Tab */}
      {activeTab === "days" && (
        <div className="space-y-4">
          {plan.days.map((day, idx) => (
            <Card key={idx} className="overflow-hidden">
              <div className="border-primary border-l-4 bg-gradient-to-r from-gray-50 to-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xl font-bold">Day {day.day}</h3>
                  <Badge variant="outline" className="rounded-full">
                    {day.title}
                  </Badge>
                </div>
                <p className="mb-3 text-gray-600">{day.description}</p>
                {day.activities.length > 0 && (
                  <div className="mb-3">
                    <p className="text-primary mb-1 text-sm font-medium">
                      Activities:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {day.activities.map((act, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="rounded-full"
                        >
                          {act}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {day.accommodation && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <Hotel className="h-4 w-4" /> Stay: {day.accommodation}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Attachments Tab */}
      {activeTab === "attachments" && (
        <div className="grid gap-3">
          {plan.attachments.map((att) => (
            <Card
              key={att.id}
              className="cursor-pointer transition-all hover:shadow-md"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  {att.type === "flight" && (
                    <Plane className="text-primary h-5 w-5" />
                  )}
                  {att.type === "lodging" && (
                    <Hotel className="text-primary h-5 w-5" />
                  )}
                  {att.type === "rental_car" && (
                    <Car className="text-primary h-5 w-5" />
                  )}
                  {att.type === "restaurant" && (
                    <Utensils className="text-primary h-5 w-5" />
                  )}
                  {(att.type === "attachment" || att.type === "other") && (
                    <Paperclip className="text-primary h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{att.title}</p>
                  {att.description && (
                    <p className="text-xs text-gray-500">{att.description}</p>
                  )}
                </div>
                <Link2 className="h-4 w-4 text-gray-400" />
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" className="mt-2 gap-2">
            <PlusCircle className="h-4 w-4" />
            Add your own booking
          </Button>
        </div>
      )}

      {/* Comments Section */}
      <Separator className="my-8" />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Comments ({plan.comments})</h3>
        <div className="flex gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Input
            placeholder="Share your thoughts or ask questions..."
            className="flex-1 rounded-full"
          />
          <Button size="sm" className="rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main Feed Component
const TravelGuideFeed: React.FC = () => {
  const [plans, setPlans] = useState<TravelPlan[]>([mockPlan]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TravelPlan | null>(null);

  const handleLike = (id: string) => {
    setPlans(
      plans.map((p) =>
        p.id === id
          ? {
              ...p,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
              isLiked: !p.isLiked,
            }
          : p,
      ),
    );
  };

  const handleSave = (id: string) => {
    setPlans(
      plans.map((p) =>
        p.id === id
          ? {
              ...p,
              saves: p.isSaved ? p.saves - 1 : p.saves + 1,
              isSaved: !p.isSaved,
            }
          : p,
      ),
    );
  };

  const handlePlanCreated = (newPlan: TravelPlan) => {
    setPlans([newPlan, ...plans]);
  };

  if (selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Button
          variant="ghost"
          className="fixed top-4 left-4 z-10 gap-1 rounded-full bg-white shadow-md"
          onClick={() => setSelectedPlan(null)}
        >
          <ChevronLeft className="h-4 w-4" /> Back to feed
        </Button>
        <TravelPlanView
          plan={selectedPlan}
          onLike={() => handleLike(selectedPlan.id)}
          onSave={() => handleSave(selectedPlan.id)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-4 py-16 text-center">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm">
            <Compass className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">
              Share Your Journey
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Trip Plans
          </h1>
          <p className="mb-6 text-lg text-white/90">
            Create detailed itineraries, share tips, and inspire other travelers
          </p>
          <Button
            size="lg"
            className="gap-2 rounded-full bg-white text-indigo-600 shadow-lg hover:bg-gray-100"
            onClick={() => setCreateModalOpen(true)}
          >
            <PlusCircle className="h-5 w-5" />
            Create New Plan
          </Button>
        </div>
      </div>

      {/* Feed Grid */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Trip Plans</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="gap-1">
              <TrendingUp className="h-4 w-4" />
              Popular
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <Clock className="h-4 w-4" />
              Latest
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl"
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={plan.coverImage}
                  alt={plan.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm">
                  {plan.duration}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {plan.countries.slice(0, 3).join(", ")}
                    {plan.countries.length > 3 &&
                      ` +${plan.countries.length - 3}`}
                  </span>
                </div>
                <h3 className="mb-2 line-clamp-1 text-lg font-semibold">
                  {plan.title}
                </h3>
                <p className="mb-3 line-clamp-2 text-sm text-gray-500">
                  {plan.overview}
                </p>
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto gap-1 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(plan.id);
                      }}
                    >
                      <Heart
                        className={`h-4 w-4 ${plan.isLiked ? "fill-red-500 text-red-500" : ""}`}
                      />
                      <span className="text-xs">{plan.likes}</span>
                    </Button>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <MessageCircle className="h-3 w-3" />
                      {plan.comments}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto gap-1 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(plan.id);
                      }}
                    >
                      <Bookmark
                        className={`h-4 w-4 ${plan.isSaved ? "fill-primary text-primary" : ""}`}
                      />
                    </Button>
                  </div>
                  <span className="text-xs text-gray-400">
                    <Eye className="inline h-3 w-3" /> {plan.views}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <CreatePlanModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onPlanCreated={handlePlanCreated}
      />
    </div>
  );
};

export default TravelGuideFeed;
