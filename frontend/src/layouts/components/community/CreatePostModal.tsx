import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useToast from "@/hooks/useToast";
import {
  Camera,
  Edit3,
  Globe,
  Hash,
  Loader2,
  Send,
  Lock,
  X,
  Map,
  Check,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import useAuthStore from "@/stores/useAuthStore";
import useCommunityTravelGuideStore from "@/stores/useCommunityTravelGuideStore";
import { useShallow } from "zustand/shallow";
import type { TravelGuide } from "@/types/interface.type";
import { Label } from "@/components/ui/label";
import { createTravelGuide } from "@/api/travel_guide.api";
import { createTravelGuideSchema } from "@/lib/zod/travelGuideSchema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ImageUploader: React.FC<{
  images: File[];
  previews: string[];
  onAdd: (files: FileList) => void;
  onRemove: (index: number) => void;
  maxImages?: number;
}> = ({ images, previews, onAdd, onRemove, maxImages = 1 }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {previews.map((preview, index) => (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-lg border bg-gray-50"
          >
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => onRemove(index)}
              className="absolute top-1 right-1 rounded-full bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3 text-white" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="hover:border-primary hover:bg-primary/5 flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all"
          >
            <Camera className="h-6 w-6 text-gray-400" />
            <span className="text-xs text-gray-500">Add photo</span>
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) onAdd(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
};

// TagInput Component for flexible tag management
const TagInput: React.FC<{
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}> = ({ tags, onTagsChange, placeholder = "Add tags..." }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = inputValue.trim();

      if (newTag && !tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      onTagsChange(tags.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="border-input bg-background ring-offset-background focus-within:ring-ring flex flex-wrap gap-2 rounded-md border px-3 py-2 focus-within:ring-2 focus-within:ring-offset-2">
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary" className="gap-1 px-2 py-1">
          <Hash className="h-3 w-3" />
          {tag}
          <button
            onClick={() => removeTag(index)}
            className="hover:bg-muted-foreground/20 ml-1 rounded-full"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="placeholder:text-muted-foreground min-w-[120px] flex-1 bg-transparent outline-none"
      />
    </div>
  );
};

interface DraftPost {
  title: string;
  content: string;
  images: File[];
  imagePreviews: string[];
  country: string;
  tags: string[];
  privacy: "public" | "private";
  itineraryId?: string;
  itineraryTitle?: string;
}

const CreatePostModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: (post: TravelGuide) => void;
}> = ({ open, onOpenChange, onPostCreated }) => {
  const [draft, setDraft] = useState<DraftPost>({
    title: "",
    content: "",
    images: [],
    imagePreviews: [],
    country: "",
    tags: [],
    privacy: "public",
    itineraryId: "",
    itineraryTitle: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const { itineraries, itinerariesLoading, error, getSpecificUserItineraries } =
    useCommunityTravelGuideStore(
      useShallow((state) => ({
        itineraries: state.itineraries,
        itinerariesLoading: state.loading.itineraries,
        error: state.error,
        getSpecificUserItineraries: state.getSpecificUserItineraries,
      })),
    );

  // Fetch user's itineraries when modal opens
  useEffect(() => {
    if (open && user?._id) {
      getSpecificUserItineraries(user?._id);
    }
  }, [open, user?._id]);

  if (error) {
    showToast("error", "Failed to fetch user itineraries");
    return;
  }

  const handleImageAdd = (files: FileList) => {
    const file = files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setDraft({
      ...draft,
      images: [file],
      imagePreviews: [preview],
    });
  };

  const handleImageRemove = (index: number) => {
    URL.revokeObjectURL(draft.imagePreviews[index]);
    setDraft({
      ...draft,
      images: draft.images.filter((_, i) => i !== index),
      imagePreviews: draft.imagePreviews.filter((_, i) => i !== index),
    });
  };

  const handleItinerarySelect = (value: string) => {
    if (!itineraries) return;

    if (value === "none") {
      setDraft({
        ...draft,
        itineraryId: "",
        itineraryTitle: "",
        country: "",
      });
      return;
    }

    const selectedItinerary = itineraries.find((i) => i._id === value);

    if (!selectedItinerary) return;

    setDraft({
      ...draft,
      itineraryId: value,
      itineraryTitle: selectedItinerary.title,
      country: selectedItinerary.country,
    });
  };

  const handleSubmit = async () => {
    if (!user?._id) return;
    console.log(draft.images[0]);

    const rawData = {
      title: draft.title,
      description: draft.content,
      country: draft.country || "Unknown",
      authorId: user?._id,
      tags: draft.tags,
      privacy: draft.privacy,
      itineraryId: draft.itineraryId,
    };

    const result = createTravelGuideSchema.safeParse(rawData);

    if (!result.success) {
      showToast("error", result.error.issues[0]?.message || "Invalid input");
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadProgress(0);

      const payload = {
        ...result.data,
        ...(draft.images[0] && { image: draft.images[0] }),
      };

      const created = await createTravelGuide(payload, (progress) =>
        setUploadProgress(progress),
      );

      onPostCreated(created);
      showToast("success", "Post published successfully");
      onOpenChange(false);

      setDraft({
        title: "",
        content: "",
        images: [],
        imagePreviews: [],
        country: "",
        tags: [],
        privacy: "public",
        itineraryId: "",
        itineraryTitle: "",
      });
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to publish post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Edit3 className="h-5 w-5" />
            Create a Post
          </DialogTitle>
          <DialogDescription>
            Share your travel experiences, tips, or questions with the community
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 p-4">
            {/* Title */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Title *</Label>
              <Input
                placeholder="e.g., 10 Days in Paradise: My Bali Adventure"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className="text-lg"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Content *</Label>
              <Textarea
                placeholder="Share your experience, tips, or ask a question..."
                value={draft.content}
                onChange={(e) =>
                  setDraft({ ...draft, content: e.target.value })
                }
                rows={6}
                className="resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Thumbnail Image</Label>
              <ImageUploader
                images={draft.images}
                previews={draft.imagePreviews}
                onAdd={handleImageAdd}
                onRemove={handleImageRemove}
                maxImages={1}
              />
            </div>

            {/* Itinerary Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-sm font-medium">
                <Map className="h-4 w-4" /> Related Itinerary
              </Label>
              <Select
                value={draft.itineraryId}
                onValueChange={handleItinerarySelect}
                disabled={itinerariesLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      itinerariesLoading
                        ? "Loading your itineraries..."
                        : "Select an itinerary to link (optional)"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {itineraries?.map((itinerary) => (
                    <SelectItem key={itinerary._id} value={itinerary._id!}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{itinerary.title}</span>
                        {itinerary.country && (
                          <span className="text-xs text-gray-500">
                            {itinerary.country}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {draft.itineraryTitle && (
                <p className="text-muted-foreground text-xs">
                  This post will be linked to your itinerary:{" "}
                  <strong>{draft.itineraryTitle}</strong>
                </p>
              )}
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Country</Label>
                <Input
                  placeholder="e.g., Japan"
                  value={draft.country}
                  onChange={(e) =>
                    setDraft({ ...draft, country: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Tags - New Flexible Tag Input */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-sm font-medium">
                <Hash className="h-4 w-4" /> Tags
              </Label>
              <TagInput
                tags={draft.tags}
                onTagsChange={(tags) => setDraft({ ...draft, tags })}
                placeholder="Type a tag and press Enter or comma..."
              />
              <p className="text-muted-foreground text-xs">
                Press Enter or comma to add a tag. Click the X to remove.
              </p>
            </div>

            {/* Beautiful Privacy Settings */}
            <div className="space-y-3 rounded-lg border p-4">
              <Label className="text-sm font-medium">Privacy Settings</Label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, privacy: "public" })}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border-2 p-3 text-left transition-all",
                    draft.privacy === "public"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 rounded-full p-1",
                      draft.privacy === "public"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted",
                    )}
                  >
                    <Globe className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Public</span>
                      {draft.privacy === "public" && (
                        <Check className="text-primary h-4 w-4" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Anyone can see your post
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, privacy: "private" })}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border-2 p-3 text-left transition-all",
                    draft.privacy === "private"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 rounded-full p-1",
                      draft.privacy === "private"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted",
                    )}
                  >
                    <Lock className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Only followers</span>
                      {draft.privacy === "private" && (
                        <Check className="text-primary h-4 w-4" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Only followers can see this post
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Upload Progress */}
            {isSubmitting && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-muted-foreground text-center text-sm">
                  Publishing your post... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="border-t px-6 py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Publish Post
                </>
              )}
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
