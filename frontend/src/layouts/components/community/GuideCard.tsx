import React, { useState, type SetStateAction } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Clock,
  Star,
  Users,
  Edit3,
  Lock,
  CheckCircle,
  Trash2,
  Copy,
  Eye,
  Loader2,
} from "lucide-react";

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
  const [isLiked, setIsLiked] = useState(guide.isLiked || false);
  const [likesCount, setLikesCount] = useState(guide.likes);
  const [isSaved, setIsSaved] = useState(guide.isSaved || false);
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    onLike(guide?._id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(guide?._id);
  };

  const handleShare = () => {
    onShare(guide?._id);
    showToast("info", "Link has been copied to your clipboard");
  };

  const handleDelete = () => {
    if (onDelete) onDelete(guide?._id);
    setShowDeleteDialog(false);
    showToast("success", "Your post has been successfully deleted");
  };

  return (
    <>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Image Section */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <img
            src={guide.thumbnailImage}
            alt={guide.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-black/60 text-white hover:bg-black/60">
              {guide.country}
            </Badge>
          </div>

          {/* Menu Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <MessageCircle className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              {guide.author?._id === user?._id && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEdit?.(guide?._id)}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Stats Overlay */}
          <div className="absolute right-3 bottom-3 left-3 flex justify-between text-xs text-white">
            <div className="flex gap-2">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {guide.stats?.views || 0}
              </span>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Author & Location */}
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={
                    guide.author?.profilePicture ??
                    "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
                  }
                />
                <AvatarFallback>{guide.author?.name[0] ?? ""}</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium">
                  {guide.author?.name}
                </span>
                <CheckCircle className="h-3 w-3 fill-blue-500 text-white" />
                <span className="text-muted-foreground text-xs">
                  {guide.author?.username}
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="hover:text-primary mb-2 line-clamp-2 cursor-pointer text-base font-semibold">
            {guide.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground mb-3 line-clamp-2 text-xs">
            {guide.description}
          </p>

          {/* Tags */}
          <div className="mb-3 flex flex-wrap gap-1">
            {guide.tags?.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-3">
                #{tag}
              </Badge>
            ))}

            {guide.tags?.length > 3 && (
              <Badge variant="secondary" className="px-3 py-3">
                +{guide.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto gap-1 p-0 text-xs"
                onClick={handleLike}
              >
                <Heart
                  className={`h-4 w-4 transition-all ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                />
                <span>{likesCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto gap-1 p-0 text-xs"
                onClick={handleSave}
              >
                <Bookmark
                  className={`h-4 w-4 transition-all ${isSaved ? "fill-primary text-primary" : ""}`}
                />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto gap-1 p-0 text-xs"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              <span>{guide.shares}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post and remove it from the community feed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className={cn(
                "bg-red-600 hover:bg-red-700",
                isLoading && "bg-gray-300",
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Loading...
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

export default GuideCard;
