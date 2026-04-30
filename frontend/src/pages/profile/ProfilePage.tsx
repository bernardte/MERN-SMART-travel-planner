import { useState, useRef, useEffect } from "react";
import useAuthStore from "@/stores/useAuthStore";
import {
  AtSign,
  Mail,
  Sparkles,
  Camera,
  Users,
  UserPlus,
  UserCheck,
  MapPin,
  Calendar,
  Link2,
  Settings,
  Edit3,
  Check,
  X,
  Bookmark,
  Globe,
  Lock,
  Heart,
  Eye,
  MessageCircle,
  TrendingUp,
  Filter,
  Grid3x3,
  List,
  Clock,
} from "lucide-react";
import useToast from "@/hooks/useToast";
import { getItinerariesByUserIdApi } from "@/api/travel_guide.api";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture ||
      "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState(user?.bio || "");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"overview" | "guides" | "saved">(
    "guides",
  );
  const [userGuides, setUserGuides] = useState([]);
  const [isLoadingGuides, setIsLoadingGuides] = useState(false);

  // Mock data - replace with actual API calls
  const [stats, setStats] = useState({
    followers: 1247,
    following: 342,
    totalGuides: 28,
    totalLikes: 4589,
    totalViews: 12567,
  });

  const displayName = user
    ? String(user.name || user.username || "Traveler")
    : "Traveler";
  const username = user ? String(user.username || "traveler") : "traveler";
  const email = user ? String(user.email || "No email provided") : "";
  const bio =
    user?.bio ||
    "Passionate traveler exploring hidden gems around the world. ✈️🌍";
  const joinDate = user?.createdAt
    ? new Date(user.createdAt)
    : new Date("2024-03-01");

  useEffect(() => {
    fetchUserGuides();
  }, []);

  const fetchUserGuides = async () => {
    setIsLoadingGuides(true);
    try {
      // Replace with actual API call
      const data = await getItinerariesByUserIdApi(user?._id);
      setUserGuides(data);

      // Mock data for demonstration
      setTimeout(() => {
        setUserGuides(mockGuides);
        setIsLoadingGuides(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching guides:", error);
      showToast("error", "Failed to load travel guides");
      setIsLoadingGuides(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("error", "Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
        showToast("success", "Profile picture updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFollow = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsFollowing(!isFollowing);
      setStats((prev) => ({
        ...prev,
        followers: isFollowing ? prev.followers - 1 : prev.followers + 1,
      }));
      showToast(
        "success",
        isFollowing ? "Unfollowed successfully" : "Followed successfully",
      );
      setIsLoading(false);
    }, 500);
  };

  const handleSaveName = () => {
    if (editedName.trim()) {
      showToast("success", "Name updated successfully!");
      setIsEditingName(false);
    }
  };

  const handleSaveBio = () => {
    showToast("success", "Bio updated successfully!");
    setIsEditingBio(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      {/* GitHub-style Profile Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto py-3">
            <div className="flex items-center gap-3">
              <img
                src={profilePicture}
                alt={displayName}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
              />
              <span className="font-semibold text-gray-900">{displayName}</span>
            </div>
            <nav className="ml-auto flex items-center gap-1">
              <button
                onClick={() => setActiveTab("guides")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === "guides"
                    ? "bg-cyan-50 text-cyan-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Travel Guides
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === "saved"
                    ? "bg-cyan-50 text-cyan-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Saved
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
          {/* Sidebar - GitHub style */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="relative mb-4">
                <div className="group relative inline-block">
                  <img
                    src={profilePicture}
                    alt={displayName}
                    className="h-24 w-24 rounded-full object-cover shadow-lg ring-4 ring-white"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute right-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 p-1.5 text-white shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>

              <div className="mb-4">
                {isEditingName ? (
                  <div className="mb-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-lg font-semibold focus:border-cyan-500 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="rounded-lg bg-green-500 p-1.5 text-white hover:bg-green-600"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setIsEditingName(false)}
                      className="rounded-lg bg-red-500 p-1.5 text-white hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="mb-1 flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {displayName}
                    </h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="rounded-full p-1 text-gray-400 transition-all hover:bg-gray-100 hover:text-cyan-600"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <AtSign className="h-4 w-4" />
                  <span>{username}</span>
                </div>
              </div>

              {isEditingBio ? (
                <div className="mb-4 space-y-2">
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                    placeholder="Write your bio..."
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleSaveBio}
                      className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-xs font-medium text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="group relative mb-4">
                  <p className="text-sm leading-relaxed text-gray-600">
                    {editedBio || bio}
                  </p>
                  <button
                    onClick={() => setIsEditingBio(true)}
                    className="absolute top-0 right-0 rounded-full p-1 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-100 hover:text-cyan-600"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined{" "}
                    {joinDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {user?.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user?.website && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Link2 className="h-4 w-4" />
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 hover:underline"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{email}</span>
                </div>
              </div>

              <button
                onClick={handleFollow}
                disabled={isLoading}
                className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
                  isFollowing
                    ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md hover:shadow-lg"
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="h-4 w-4" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Follow
                  </>
                )}
              </button>
            </div>

            {/* Stats Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Guides</span>
                  <span className="font-semibold text-gray-900">
                    {stats.totalGuides}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Likes</span>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(stats.totalLikes)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Views</span>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(stats.totalViews)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                  <span className="text-sm text-gray-600">Followers</span>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(stats.followers)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Following</span>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(stats.following)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Travel Guides */}
          <div className="space-y-6">
            {/* Tab Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg p-2 transition-all ${
                    viewMode === "grid"
                      ? "bg-cyan-100 text-cyan-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Grid3x3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg p-2 transition-all ${
                    viewMode === "list"
                      ? "bg-cyan-100 text-cyan-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:shadow-md">
                  New Guide
                </button>
              </div>
            </div>

            {/* Guides Grid/List */}
            {isLoadingGuides ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
              </div>
            ) : userGuides.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center">
                <Bookmark className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No travel guides yet
                </h3>
                <p className="text-sm text-gray-500">
                  Create your first travel guide to share with the community.
                </p>
                <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white">
                  Create Guide
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {userGuides.map((guide) => (
                  <GuideCard key={guide._id} guide={guide} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {userGuides.map((guide) => (
                  <GuideListItem key={guide._id} guide={guide} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Guide Card Component (Grid View)
const GuideCard = ({ guide }) => {
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-cyan-100 to-blue-100">
        <img
          src={guide.thumbnailImage}
          alt={guide.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          {guide.privacy === "public" ? (
            <Globe className="h-4 w-4 text-white drop-shadow-lg" />
          ) : (
            <Lock className="h-4 w-4 text-white drop-shadow-lg" />
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          <span>{guide.country}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>{guide.likes?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{guide.views || 0}</span>
          </div>
        </div>
        <h3 className="mb-1 line-clamp-1 font-semibold text-gray-900 transition-colors hover:text-cyan-600">
          {guide.title}
        </h3>
        <p className="line-clamp-2 text-sm text-gray-500">
          {guide.description}
        </p>
      </div>
    </div>
  );
};

// Guide List Item Component (List View)
const GuideListItem = ({ guide }) => {
  return (
    <div className="group flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100">
        <img
          src={guide.thumbnailImage}
          alt={guide.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          <span>{guide.country}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>{guide.likes?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{guide.views || 0}</span>
          </div>
        </div>
        <h3 className="mb-1 line-clamp-1 font-semibold text-gray-900 transition-colors hover:text-cyan-600">
          {guide.title}
        </h3>
        <p className="line-clamp-1 text-sm text-gray-500">
          {guide.description}
        </p>
      </div>
      <button className="opacity-0 transition-opacity group-hover:opacity-100">
        <MessageCircle className="h-5 w-5 text-gray-400 hover:text-cyan-600" />
      </button>
    </div>
  );
};

// Mock data
const mockGuides = [
  {
    _id: "1",
    title: "Hidden Temples of Kyoto: A Local's Guide",
    country: "Japan",
    description:
      "Discover the lesser-known temples and shrines that most tourists miss...",
    thumbnailImage:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
    privacy: "public",
    likes: [{ userId: "user1" }, { userId: "user2" }],
    views: 5230,
    tags: ["temples", "culture"],
  },
  {
    _id: "2",
    title: "Mediterranean Coastal Road Trip",
    country: "Greece",
    description: "A 10-day journey along the stunning Greek coastline...",
    thumbnailImage:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077",
    privacy: "public",
    likes: [{ userId: "user1" }],
    views: 3421,
    tags: ["roadtrip", "coastal"],
  },
];

export default ProfilePage;
