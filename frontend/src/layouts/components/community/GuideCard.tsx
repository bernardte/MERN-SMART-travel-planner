import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Edit3,
  CheckCircle,
  Trash2,
  Copy,
  Eye,
  Loader2,
  MapPin,
  TrendingUp,
  UserCheck,
  UserPlus2,
} from "lucide-react";
const preloadProfile = () => import("@/pages/profile/ProfilePage");
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useToast from "@/hooks/useToast";
import type { TravelGuide } from "@/types/interface.type";
import useAuthStore from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import useFollowStore from "@/stores/useFollowStore";
import { useShallow } from "zustand/shallow";

const GuideCard: React.FC<{
  guide: TravelGuide;
  onLike: (_id: string) => void;
  onSave: (_id: string) => void;
  onShare: (_id: string) => void;
  onDelete?: (_id: string) => void;
  onEdit?: (_id: string) => void;
  isLoading?: boolean;
}> = ({ guide, onLike, onSave, onShare, onDelete, onEdit, isLoading }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { showToast } = useToast();

  const { toggleFollow, followMap, loadingMap } = useFollowStore(
  useShallow((state) => ({
      toggleFollow: state.toggleFollow,
      followMap: state.followingMap,
      loadingMap: state.loadingMap,
    })),
  );

  const isFollowing = guide.author?._id ? followMap[guide.author._id] : false;

  const isLoadingFollow = guide.author?._id
    ? loadingMap[guide.author._id]
    : false;
  const handleLike = () => {
    onLike(guide?._id);
  };

  const handleSave = () => {
    onSave(guide?._id);
  };

  const handleShare = () => {
    onShare(guide?._id);
    showToast("info", "Link has been copied to your clipboard");
  };

  const handleDelete = () => {
    if (onDelete) onDelete(guide?._id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-cyan-50/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* Animated gradient border */}
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            padding: "1px",
            borderRadius: "inherit",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        <div className="relative overflow-hidden rounded-xl bg-white">
          {/* Image Section */}
          <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-cyan-100 to-blue-100">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
              </div>
            )}
            <img
              src={guide.thumbnailImage}
              alt={guide.title}
              className={cn(
                "h-full w-full object-cover transition-all duration-500 group-hover:scale-110",
                !imageLoaded && "opacity-0",
                imageLoaded && "opacity-100",
              )}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className="border-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg">
                <MapPin className="mr-1 h-3 w-3" />
                {guide.country}
              </Badge>
              {(guide.stats?.views ?? 0) > 1000 && (
                <Badge className="border-0 bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Popular
                </Badge>
              )}
            </div>

            {/* Menu Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-black/60"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer">
                  <MessageCircle className="mr-2 h-4 w-4 text-cyan-600" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleShare}
                  className="cursor-pointer"
                >
                  <Share2 className="mr-2 h-4 w-4 text-cyan-600" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Copy className="mr-2 h-4 w-4 text-cyan-600" />
                  Copy Link
                </DropdownMenuItem>
                {guide.author?._id === user?._id && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onEdit?.(guide?._id)}
                      className="cursor-pointer"
                    >
                      <Edit3 className="mr-2 h-4 w-4 text-blue-600" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="cursor-pointer text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Stats Overlay */}
            <div className="absolute right-3 bottom-3 left-3 flex justify-between">
              <div className="flex gap-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {guide.stats?.views?.toLocaleString() || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {guide.likes?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>

          <CardContent className="p-5">
            {/* Author & Location */}
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <Link
                  to={`/profile/${guide.author.username}`}
                  onMouseEnter={preloadProfile}
                >
                  <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-cyan-500/20">
                    <AvatarImage
                      src={
                        guide.author?.profilePicture ??
                        "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
                      }
                    />
                    <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                      {guide.author?.name?.[0] ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-gray-900">
                      {guide.author?.name}
                    </span>
                    <CheckCircle className="h-3.5 w-3.5 fill-cyan-500 text-white" />
                  </div>
                  <span className="text-xs text-gray-400">
                    @{guide.author?.username}
                  </span>
                </div>
                {user?._id && user?._id !== guide.author?._id && (
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    onClick={() =>
                      guide.author._id && toggleFollow(guide.author._id)
                    }
                    disabled={isLoadingFollow}
                  >
                    {isLoadingFollow ? (
                      "Loading..."
                    ) : isFollowing ? (
                      <>
                        <UserCheck />
                        <span>following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus2 />
                        <span>Follow</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
              <Badge
                variant="outline"
                className="border-cyan-200 bg-cyan-50 text-xs text-cyan-600"
              >
                {guide.privacy === "public" ? "Public" : "Private"}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="mb-2 line-clamp-2 cursor-pointer text-lg font-bold text-gray-900 transition-colors duration-300 hover:text-cyan-600">
              {guide.title}
            </h3>

            {/* Description */}
            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-500">
              {guide.description}
            </p>

            {/* Tags */}
            <div className="mb-4 flex flex-wrap gap-2">
              {guide.tags?.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer border-0 bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 transition-all duration-300 hover:scale-105 hover:bg-cyan-100"
                >
                  #{tag}
                </Badge>
              ))}
              {guide.tags?.length > 3 && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer border-0 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 transition-all duration-300 hover:scale-105 hover:bg-gray-200"
                >
                  +{guide.tags.length - 3} more
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-cyan-100 pt-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="group/like h-auto gap-2 p-0 text-sm font-medium text-gray-600 transition-all duration-300 hover:text-red-500"
                  onClick={handleLike}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-all duration-300 group-hover/like:scale-110",
                      guide.isLiked
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400 group-hover/like:text-red-500",
                    )}
                  />
                  <span className={guide.isLiked ? "text-red-500" : ""}>
                    {guide.likes?.toLocaleString() || 0}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="group/save h-auto gap-2 p-0 text-sm font-medium text-gray-600 transition-all duration-300 hover:text-cyan-600"
                  onClick={handleSave}
                >
                  <Bookmark
                    className={cn(
                      "h-5 w-5 transition-all duration-300 group-hover/save:scale-110",
                      guide.isSaved
                        ? "fill-cyan-500 text-cyan-500"
                        : "text-gray-400 group-hover/save:text-cyan-500",
                    )}
                  />
                  <span className={guide.isSaved ? "text-cyan-500" : ""}>
                    Save
                  </span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto gap-1 p-0 text-sm font-medium text-gray-500 transition-all duration-300 hover:text-cyan-600"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Delete Confirmation Dialog with cyan/blue theme */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-cyan-200 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">
              Delete this post?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              This action cannot be undone. This will permanently delete your
              post and remove it from the community feed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className={cn(
                "border-0 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
                isLoading && "cursor-not-allowed opacity-50",
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default React.memo(GuideCard);
