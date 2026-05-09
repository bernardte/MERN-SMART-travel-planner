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
  Grid3x3,
  List,
  Share2,
  Sparkles,
  TrendingUp,
  Loader2,
  Users,
  BookOpen,
  BarChart3,
} from "lucide-react";
import useToast from "@/hooks/useToast";
import {
  getUserPublishTravelGuideApi,
  getUserProfileApi,
  updateUserProfileApi,
  userProfileStatsApi,
} from "@/api/user.api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { TravelGuide, User } from "@/types/interface.type";
import { useParams } from "react-router-dom";
import { useShallow } from "zustand/shallow";
import useFollowStore from "@/stores/useFollowStore";
import PostModal from "@/layouts/components/community/PostModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProfilePage = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      setUser: state.setUser,
    })),
  );

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
  const [totalStats, setTotalStats] = useState<Record<string, number>>({
    totalGuides: 0,
    totalViews: 0,
    totalLikes: 0,
  });
   const [createModalOpen, setCreateModalOpen] = useState(false)
  const { toggleFollow, followingMap, loadingMap } = useFollowStore(
    useShallow((state) => ({
      toggleFollow: state.toggleFollow,
      followingMap: state.followingMap,
      loadingMap: state.loadingMap,
    })),
  );

  const isFollowing = profileUser ? followingMap[profileUser._id] : false;

  const isLoadingFollow = profileUser ? loadingMap[profileUser._id] : false;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserProfileApi(targetUsername!);
        setProfileUser(data);
        setProfilePicture(data.profilePicture);
        setEditedName(data.username);
        setEditedBio(data.bio);
      } catch (err) {
        showToast("error", "Failed to load user");
      }
    };

    const fetchUserStats = async () => {
      try {
        const data = await userProfileStatsApi(targetUsername!);
        setTotalStats({
          totalGuides: data.totalGuides,
          totalViews: data.totalViews,
          totalLikes: data.totalLikes,
        });
      } catch (error) {
        showToast("error", "Failed to load user stats");
      }
    };

    if (targetUsername) Promise.all([fetchUser(), fetchUserStats()]);
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isOwnProfile) {
      showToast("error", "You cannot edit another user's profile");
      return;
    }

    if (!file.type.startsWith("image/")) {
      showToast("error", "Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Image size should be less than 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    if (!currentUser.user) return;

    try {
      const data = await updateUserProfileApi({ profilePicture: file });
      setProfilePicture(data.profilePicture);
      setProfileUser((prev) =>
        prev ? { ...prev, profilePicture: data.profilePicture } : null,
      );
      currentUser.setUser({
        ...currentUser.user,
        profilePicture: data.profilePicture,
      });
      showToast("success", "Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      showToast("error", "Failed to update profile picture");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      showToast("error", "Name cannot be empty");
      return;
    }

    if (!currentUser.user) return;

    try {
      await updateUserProfileApi({ username: editedName });
      setProfileUser((prev) => (prev ? { ...prev, name: editedName } : null));
      currentUser.setUser({
        ...currentUser.user,
        username: editedName,
      });
      showToast("success", "Name updated successfully!");
      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating name:", error);
      showToast("error", "Failed to update name");
    }
  };

  const handleSaveBio = async () => {
    if (!currentUser.user) return;

    try {
      await updateUserProfileApi({ bio: editedBio });
      setProfileUser((prev) => (prev ? { ...prev, bio: editedBio } : null));
      currentUser.setUser({
        ...currentUser.user,
        bio: editedBio,
      });
      showToast("success", "Bio updated successfully!");
      setIsEditingBio(false);
    } catch (error) {
      console.error("Error updating bio:", error);
      showToast("error", "Failed to update bio");
    }
  };

  const formatNumber = (num: number) => {
    if (!num) return 0;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  const handleGuideCreated = (res: TravelGuide) => {
    const newGuide = res;
    // only add public posts into community page
    if (newGuide.privacy !== "public") return;
    setUserGuides((prev) => [newGuide, ...prev]);
  };;


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
  const isOwnProfile = currentUser.user?._id === profileUser._id;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50/40">
      {/* Subtle background pattern (travel dots) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#0e7490_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.03]"></div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-20 border-b border-gray-200/60 bg-white/70 shadow-sm backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto py-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 shadow-md ring-2 ring-white">
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
                    ? "bg-cyan-50 text-cyan-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Travel Guides ({userGuides.length})
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === "saved"
                    ? "bg-cyan-50 text-cyan-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Saved
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-xl shadow-cyan-500/5 backdrop-blur-sm transition-all hover:shadow-cyan-500/10">
              <div className="relative mb-4">
                <div className="group relative inline-block">
                  <Avatar className="h-24 w-24 shadow-lg ring-4 ring-white/80 ring-offset-2 ring-offset-transparent transition-all duration-300 group-hover:ring-cyan-200">
                    <AvatarImage src={profilePicture} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-3xl text-white">
                      {displayName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {isOwnProfile && (
                    <>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className="absolute -right-1 -bottom-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 p-2 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-cyan-500/30 disabled:opacity-50"
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
                        onChange={handleAvatarUpload}
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
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-lg font-semibold focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="rounded-lg bg-green-500 p-1.5 text-white transition-colors hover:bg-green-600"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setIsEditingName(false)}
                      className="rounded-lg bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="mb-1 flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {displayName}
                    </h1>
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <AtSign className="h-4 w-4" />
                  <span>{username}</span>
                  {isOwnProfile && (
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setIsEditingName(true)}
                            className="rounded-full p-1 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-cyan-600 active:scale-95"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        </TooltipTrigger>

                        <TooltipContent
                          side="top"
                          sideOffset={5}
                          className="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 rounded-md bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white shadow-md"
                        >
                          <p>✨ Update username</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>

              {isEditingBio && isOwnProfile ? (
                <div className="mb-4 space-y-2">
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 focus:outline-none"
                    placeholder="Write your bio..."
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleSaveBio}
                      className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-xs font-medium text-white shadow-md transition-all hover:shadow-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
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
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{email}</span>
                </div>
              </div>

              {!isOwnProfile && (
                <button
                  onClick={() =>
                    profileUser?._id && toggleFollow(profileUser?._id)
                  }
                  disabled={isLoadingFollow}
                  className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
                    isFollowing
                      ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md hover:shadow-lg hover:shadow-cyan-500/20"
                  }`}
                >
                  {isLoadingFollow ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : isFollowing ? (
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
            <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-xl shadow-cyan-500/5 backdrop-blur-sm">
              {/* Subtle decorative gradient */}
              <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-gradient-to-bl from-cyan-100/40 to-transparent" />

              <h3 className="relative mb-5 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <BarChart3 className="h-4 w-4 text-cyan-500" />
                Statistics
              </h3>

              <div className="relative space-y-4">
                {/* Public Guides */}
                <div className="group flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-blue-100">
                      <BookOpen className="h-4 w-4 text-cyan-600" />
                    </div>
                    <span className="text-sm text-gray-600">Public Guides</span>
                  </div>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {totalStats.totalGuides ?? 0}
                  </span>
                </div>

                <div className="border-t border-gray-100" />

                {/* Total Likes */}
                <div className="group flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-rose-100">
                      <Heart className="h-4 w-4 text-red-500" />
                    </div>
                    <span className="text-sm text-gray-600">Total Likes</span>
                  </div>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {formatNumber(totalStats.totalLikes) ?? 0}
                  </span>
                </div>

                <div className="border-t border-gray-100" />

                {/* Total Views */}
                <div className="group flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-50 to-orange-100">
                      <Eye className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-sm text-gray-600">Total Views</span>
                  </div>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {formatNumber(totalStats.totalViews) ?? 0}
                  </span>
                </div>

                <div className="border-t border-gray-100" />

                {/* Followers */}
                <div className="group flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-50 to-violet-100">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-600">Followers</span>
                  </div>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {formatNumber(profileUser.followers?.length ?? 0)}
                  </span>
                </div>

                <div className="group flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-50 to-yellow-100">
                      <UserCheck className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-sm text-gray-600">Following</span>
                  </div>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {formatNumber(profileUser.following?.length ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tip Banner for own profile */}
            {isOwnProfile && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 p-4 text-white shadow-lg shadow-cyan-500/20">
                <div className="absolute top-0 right-0 opacity-10">
                  <MapPin className="-mt-4 -mr-4 h-20 w-20" />
                </div>
                <div className="relative flex items-start gap-3">
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
                      ? "bg-cyan-100 text-cyan-700 shadow-sm"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Grid3x3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg p-2 transition-all ${
                    viewMode === "list"
                      ? "bg-cyan-100 text-cyan-700 shadow-sm"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              {isOwnProfile && (
                <Button
                  onClick={() => setCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <Sparkles className="h-4 w-4" />
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
                  <div className="rounded-2xl border border-gray-100 bg-white/90 py-20 text-center shadow-xl shadow-cyan-500/5 backdrop-blur-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50">
                      <Bookmark className="h-8 w-8 text-cyan-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      No public travel guides yet
                    </h3>
                    <p className="text-sm text-gray-500">
                      {isOwnProfile
                        ? "Create your first travel guide and share it with the community."
                        : `@${username} hasn't published any travel guides yet.`}
                    </p>
                    {isOwnProfile && (
                      <Button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg hover:shadow-cyan-500/20">
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
              <div className="rounded-2xl border border-gray-100 bg-white/90 py-20 text-center shadow-xl shadow-cyan-500/5 backdrop-blur-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50">
                  <Bookmark className="h-8 w-8 text-cyan-400" />
                </div>
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
      {createModalOpen && (
        <PostModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onPostCreated={handleGuideCreated}
          mode="create"
        />
      )}
    </div>
  );
};

// Guide Card Component (Grid View) – enhanced with travel vibes
const GuideCard = ({ guide }: { guide: TravelGuide }) => {
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg shadow-cyan-500/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10">
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-cyan-100 to-blue-100">
        <img
          src={guide.thumbnailImage}
          alt={guide.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
            <Badge className="border-0 bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md">
              <TrendingUp className="mr-1 h-3 w-3" />
              Popular
            </Badge>
          </div>
        )}
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-teal-700">
            <MapPin className="h-3.5 w-3.5 text-teal-500" />
            <span className="font-medium">{guide.country}</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 fill-red-400 text-red-400" />
            <span>
              {Array.isArray(guide.likes)
                ? guide.likes.length
                : guide.likes || 0}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4 text-gray-400" />
            <span>{guide.views || 0}</span>
          </div>
        </div>
        <h3 className="mb-1 line-clamp-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-cyan-600">
          {guide.title}
        </h3>
        <p className="line-clamp-2 text-sm text-gray-500">
          {guide.description}
        </p>
      </div>
    </div>
  );
};

// Guide List Item Component (List View) – enhanced with travel vibes
const GuideListItem = ({ guide }: { guide: TravelGuide }) => {
  return (
    <div className="group flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-lg shadow-cyan-500/5 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10">
      <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100">
        <img
          src={guide.thumbnailImage}
          alt={guide.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-teal-700">
            <MapPin className="h-3.5 w-3.5 text-teal-500" />
            <span className="font-medium">{guide.country}</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 fill-red-400 text-red-400" />
            <span>
              {Array.isArray(guide.likes)
                ? guide.likes.length
                : guide.likes || 0}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4 text-gray-400" />
            <span>{guide.views || 0}</span>
          </div>
        </div>
        <h3 className="mb-1 line-clamp-1 font-semibold text-gray-900 transition-colors group-hover:text-cyan-600">
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
