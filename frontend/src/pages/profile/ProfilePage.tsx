import { useState, useRef, useEffect } from "react";
import useAuthStore from "@/stores/useAuthStore";
import {
  AtSign,
  Mail,
  Camera,
  UserPlus,
  UserCheck,
  MapPin,
  Calendar,
  Edit3,
  Check,
  X,
  Bookmark,
  Globe,
  Lock,
  Heart,
  Eye,
  Filter,
  Grid3x3,
  List,
  Share2,
  Link2,
  Sparkles,
  TrendingUp,
  Loader2,
} from "lucide-react";
import useToast from "@/hooks/useToast";
import {
  getUserPublishTravelGuideApi,
  getUserProfileApi,
  // updateUserProfileApi,
  // uploadProfilePictureApi,
} from "@/api/user.api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import useFollowUnfollow from "@/hooks/useFollowAndUnfollow";
import type { TravelGuide, User } from "@/types/interface.type";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = useAuthStore((state) => state.user);
  const { targetUsername } = useParams();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profilePicture, setProfilePicture] = useState("");
  const [editedName, setEditedName] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [userGuides, setUserGuides] = useState<TravelGuide[]>([]);
  const [isLoadingGuides, setIsLoadingGuides] = useState(false);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"guides" | "saved">("guides");

  const { following, loading, handleFollowUnfollow, followerCount } =
    useFollowUnfollow(profileUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserProfileApi(targetUsername!);
        setProfileUser(data);
        setProfilePicture(data.profilePicture);
        setEditedName(data.name);
        setEditedBio(data.bio);
      } catch (err) {
        showToast("error", "Failed to load user");
      }
    };

    if (targetUsername) fetchUser();
  }, [targetUsername]);

  useEffect(() => {
    const fetchGuides = async () => {
      if (!profileUser?._id) return;

      setIsLoadingGuides(true);
      try {
        const result = await getUserPublishTravelGuideApi(profileUser._id);
        setUserGuides(result.data.data);
      } catch {
        showToast("error", "Failed to load guides");
      } finally {
        setIsLoadingGuides(false);
      }
    };

    fetchGuides();
  }, [profileUser]);

  // const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   // Check if user is viewing their own profile
  //   if (!isOwnProfile) {
  //     showToast("error", "You cannot edit another user's profile");
  //     return;
  //   }

  //   // Validate file type
  //   if (!file.type.startsWith("image/")) {
  //     showToast("error", "Please upload an image file");
  //     return;
  //   }

  //   // Validate file size (max 5MB)
  //   if (file.size > 5 * 1024 * 1024) {
  //     showToast("error", "Image size should be less than 5MB");
  //     return;
  //   }

  //   setIsUploadingAvatar(true);
  //   const formData = new FormData();
  //   formData.append("profilePicture", file);

  //   try {
  //     const response = await uploadProfilePictureApi(formData);
  //     setProfilePicture(response.data.url);
  //     // Update the profileUser state as well
  //     setProfileUser((prev) =>
  //       prev ? { ...prev, profilePicture: response.data.url } : null,
  //     );
  //     showToast("success", "Profile picture updated successfully!");
  //   } catch (error) {
  //     console.error("Error uploading avatar:", error);
  //     showToast("error", "Failed to update profile picture");
  //   } finally {
  //     setIsUploadingAvatar(false);
  //     // Reset file input
  //     if (fileInputRef.current) fileInputRef.current.value = "";
  //   }
  // };

  // const handleSaveName = async () => {
  //   if (!editedName.trim()) {
  //     showToast("error", "Name cannot be empty");
  //     return;
  //   }

  //   try {
  //     await updateUserProfileApi({ name: editedName });
  //     setProfileUser((prev) => (prev ? { ...prev, name: editedName } : null));
  //     showToast("success", "Name updated successfully!");
  //     setIsEditingName(false);
  //   } catch (error) {
  //     console.error("Error updating name:", error);
  //     showToast("error", "Failed to update name");
  //   }
  // };

  // const handleSaveBio = async () => {
  //   try {
  //     await updateUserProfileApi({ bio: editedBio });
  //     setProfileUser((prev) => (prev ? { ...prev, bio: editedBio } : null));
  //     showToast("success", "Bio updated successfully!");
  //     setIsEditingBio(false);
  //   } catch (error) {
  //     console.error("Error updating bio:", error);
  //     showToast("error", "Failed to update bio");
  //   }
  // };

  const formatNumber = (num: number) => {
    if (!num) return 0;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  // const totalStats = {
  //   totalGuides: userGuides.length,
  //   totalLikes: userGuides.reduce((sum, g) => sum + (g.likes?.length || 0), 0),
  //   totalViews: userGuides.reduce((sum, g) => sum + (g.views || 0), 0),
  // };

  if (!profileUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayName = profileUser.name || profileUser.username;
  const username = profileUser.username;
  const email = profileUser.email;
  const bio = profileUser.bio || "No bio yet";
  const joinDate = new Date(profileUser.createdAt);
  const isOwnProfile = currentUser?._id === profileUser._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto py-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 ring-2 ring-white">
                <AvatarImage src={profilePicture} />
                <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                  {displayName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
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
                Travel Guides ({userGuides.length})
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
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="relative mb-4">
                <div className="group relative inline-block">
                  <Avatar className="h-24 w-24 shadow-lg ring-4 ring-white">
                    <AvatarImage src={profilePicture} />
                    <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-3xl text-white">
                      {displayName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Camera button for avatar upload - only visible on own profile */}
                  {isOwnProfile && (
                    <>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className="absolute right-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 p-2 text-white shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50"
                      >
                        {isUploadingAvatar ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        // onChange={handleAvatarUpload}
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="mb-4">
                {isEditingName && isOwnProfile ? (
                  <div className="mb-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-lg font-semibold focus:border-cyan-500 focus:outline-none"
                      autoFocus
                    />
                    {/* <button
                      onClick={handleSaveName}
                      className="rounded-lg bg-green-500 p-1.5 text-white hover:bg-green-600"
                    >
                      <Check className="h-4 w-4" />
                    </button> */}
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
                    {isOwnProfile && (
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="rounded-full p-1 text-gray-400 transition-all hover:bg-gray-100 hover:text-cyan-600"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <AtSign className="h-4 w-4" />
                  <span>@{username}</span>
                </div>
              </div>

              {isEditingBio && isOwnProfile ? (
                <div className="mb-4 space-y-2">
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                    placeholder="Write your bio..."
                  />
                  {/* <div className="flex justify-end gap-2">
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
                  </div> */}
                </div>
              ) : (
                <div className="group relative mb-4">
                  <p className="text-sm leading-relaxed text-gray-600">{bio}</p>
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditingBio(true)}
                      className="absolute top-0 right-0 rounded-full p-1 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-100 hover:text-cyan-600"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                  )}
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
                {/* {profileUser.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{profileUser.location}</span>
                  </div>
                )}
                {profileUser.website && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Link2 className="h-4 w-4" />
                    <a
                      href={profileUser.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 hover:underline"
                    >
                      {profileUser.website}
                    </a>
                  </div>
                )} */}
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{email}</span>
                </div>
              </div>

              {/* Follow Button - only show for other users */}
              {!isOwnProfile && (
                <button
                  onClick={handleFollowUnfollow}
                  disabled={loading}
                  className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
                    following
                      ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md hover:shadow-lg"
                  }`}
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : following ? (
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
              )}
            </div>

            {/* Stats Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Public Guides</span>
                  <span className="font-semibold text-gray-900">
                    {/* {totalStats.totalGuides} */}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Likes</span>
                  <span className="font-semibold text-gray-900">
                    {/* {formatNumber(totalStats.totalLikes)} */}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Views</span>
                  <span className="font-semibold text-gray-900">
                    {/* {formatNumber(totalStats.totalViews)} */}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                  <span className="text-sm text-gray-600">Followers</span>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(followerCount || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tip Banner for own profile */}
            {isOwnProfile && (
              <div className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 p-4 text-white">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Complete your profile</p>
                    <p className="mt-1 text-xs text-white/90">
                      Add your location and website to connect with more
                      travelers.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Toolbar */}
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
              {isOwnProfile && (
                <Button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:shadow-md">
                  New Guide
                </Button>
              )}
            </div>

            {/* Guides Content */}
            {activeTab === "guides" && (
              <>
                {isLoadingGuides ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
                  </div>
                ) : userGuides.length === 0 ? (
                  <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center">
                    <Bookmark className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      No public travel guides yet
                    </h3>
                    <p className="text-sm text-gray-500">
                      {isOwnProfile
                        ? "Create your first travel guide and share it with the community."
                        : `@${username} hasn't published any travel guides yet.`}
                    </p>
                    {isOwnProfile && (
                      <Button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white">
                        Create Guide
                      </Button>
                    )}
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid gap-6 md:grid-cols-2">
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
              </>
            )}

            {/* Saved Tab */}
            {activeTab === "saved" && (
              <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center">
                <Bookmark className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Saved travel guides
                </h3>
                <p className="text-sm text-gray-500">
                  Guides you save will appear here for quick access.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Guide Card Component (Grid View)
const GuideCard = ({ guide }: { guide: TravelGuide }) => {
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
        {(guide.views || 0) > 1000 && (
          <div className="absolute top-2 left-2">
            <Badge className="border-0 bg-gradient-to-r from-amber-400 to-orange-500 text-white">
              <TrendingUp className="mr-1 h-3 w-3" />
              Popular
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <div className="border-2 flex items-center gap-1 px-2 rounded-2xl bg-teal-500 py-1">
            <MapPin className="h-5 w-5 text-white" />
            <span className="text-md text-white">{guide.country}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
            <span>
              {Array.isArray(guide.likes)
                ? guide.likes.length
                : guide.likes || 0}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-5 w-5" />
            <span>{guide.views || 0}</span>
          </div>
        </div>
        <h3 className="mb-1 line-clamp-1 text-2xl font-semibold text-gray-900 transition-colors hover:text-cyan-600">
          {guide.title}
        </h3>
        <p className="text-md line-clamp-2 text-gray-500">
          {guide.description}
        </p>
      </div>
    </div>
  );
};

// Guide List Item Component (List View)
const GuideListItem = ({ guide }: { guide: TravelGuide }) => {
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
            <Heart className="h-3 w-3 fill-red-500 text-red-500" />
            <span>
              {Array.isArray(guide.likes)
                ? guide.likes.length
                : guide.likes || 0}
            </span>
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
        <Share2 className="h-5 w-5 text-gray-400 hover:text-cyan-600" />
      </button>
    </div>
  );
};

export default ProfilePage;
