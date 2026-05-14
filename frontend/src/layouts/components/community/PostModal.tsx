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
  PenIcon,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import useAuthStore from "@/stores/useAuthStore";
import useCommunityTravelGuideStore from "@/stores/useCommunityTravelGuideStore";
import { useShallow } from "zustand/shallow";
import type { TravelGuide } from "@/types/interface.type";
import { Label } from "@/components/ui/label";
import {
  createTravelGuideApi,
  updateTravelGuideApi,
} from "@/api/travel_guide.api";
import type {
  TravelGuideCreate,
  TravelGuideEdit,
} from "@/lib/zod/travelGuideSchema";
import {
  travelGuideCreateSchema,
  travelGuideEditSchema,
} from "@/lib/zod/travelGuideSchema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const ImageUploader: React.FC<{
  value?: File;
  preview?: string;
  onChange: (file: File | undefined, preview: string | undefined) => void;
  maxImages?: number;
  error?: string;
  mode: "edit" | "create";
}> = ({ value, preview, onChange, maxImages = 1, mode, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      onChange(file, previewUrl);
    }
    e.target.value = "";
  };

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    onChange(undefined, undefined);
  };

  return (
    <div className="space-y-3">
      <div className="">
        {preview && (
          <div className="group pointer-events:none relative mb-5 aspect-square overflow-hidden rounded-lg border bg-gray-50">
            <img
              loading="lazy"
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <Button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3 text-white" />
            </Button>
          </div>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!value && (
          <div className="group pointer-events: none relative aspect-square overflow-hidden rounded-lg border bg-gray-50">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="hover:border-primary hover:bg-primary/5 flex aspect-square h-full w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-10 transition-all"
            >
              <Camera className="h-6 w-6 text-gray-400" />
              <span className="text-xs text-gray-500">
                {mode === "edit"
                  ? "Update thumbnail image"
                  : "Add thumbnail image"}
              </span>
            </Button>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

// TagInput Component for flexible tag management
const TagInput: React.FC<{
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}> = ({ value = [], onChange, placeholder = "Add tags..." }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = inputValue.trim();

      if (newTag && !value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      const newTag = inputValue.trim();
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="border-input bg-background ring-offset-background focus-within:ring-ring flex flex-wrap gap-2 rounded-md border px-3 py-2 focus-within:ring-2 focus-within:ring-offset-2">
      {value.map((tag, index) => (
        <Badge key={index} variant="secondary" className="gap-1 px-2 py-1">
          <Hash className="h-3 w-3" />
          {tag}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeTag(index)}
            className="text-muted-foreground h-4 w-4 rounded-full p-0 transition-colors hover:bg-red-100 hover:text-red-400"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={value.length === 0 ? placeholder : ""}
        className="placeholder:text-muted-foreground min-w-[120px] flex-1 bg-transparent outline-none"
      />
    </div>
  );
};

const PostModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated?: (post: TravelGuide) => void;
  mode: "create" | "edit";
  privacy?: "public" | "private";
  initialData?: TravelGuide | null;
  onPostUpdated?: (guide: TravelGuide) => void;
}> = ({
  open,
  onOpenChange,
  onPostCreated,
  privacy,
  mode,
  initialData,
  onPostUpdated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const {
    itineraries,
    itinerariesLoading,
    itinerariesError,
    getSpecificUserItineraries,
  } = useCommunityTravelGuideStore(
    useShallow((state) => ({
      itineraries: state.itineraries,
      itinerariesLoading: state.loading.itineraries,
      itinerariesError: state.error.itinerariesError,
      getSpecificUserItineraries: state.getSpecificUserItineraries,
    })),
  );
  // Extend the schema for form handling
  const schema =
    mode === "create" ? travelGuideCreateSchema : travelGuideEditSchema;
    
  type FormValues = z.infer<typeof schema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      country: "",
      tags: [],
      privacy: privacy,
      itineraryId: "",
      itineraryTitle: "",
      image: undefined,
      imagePreview: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const watchedItineraryId = watch("itineraryId");
  console.log("FORM ERRORS:", errors);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (!open) {
      reset();
    } else if (mode === "edit" && initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        country: initialData.country || "",
        tags: initialData.tags || [],
        privacy: initialData.privacy || "public",
        itineraryId: initialData?.itinerary?._id ?? "none",
        itineraryTitle: initialData.itinerary?.title || "",
        image: undefined,
        imagePreview: initialData.thumbnailImage || undefined,
      });
    } else if (mode === "create") {
      reset({
        title: "",
        description: "",
        country: "",
        tags: [],
        privacy: privacy,
        itineraryId: "",
        itineraryTitle: "",
        image: undefined,
        imagePreview: undefined,
      });
    }
  }, [open, mode, initialData, reset]);

  // Fetch user's itineraries when modal opens
  useEffect(() => {
    if (open && user?._id) {
      getSpecificUserItineraries(user?._id);
    }
  }, [open, user?._id, getSpecificUserItineraries]);

  useEffect(() => {
    if (itinerariesError) {
      showToast("error", "Failed to fetch user itineraries");
    }
  }, [itinerariesError, showToast]);

  const handleItinerarySelect = (value: string) => {
    console.log(value);
    if (!itineraries) return;

    if (value === "none") {
      setValue("itineraryId", "");
      setValue("itineraryTitle", "");
      setValue("country", "");
      return;
    }

    const selectedItinerary = itineraries.find((i) => i._id === value);
    if (selectedItinerary) {
      setValue("itineraryId", value);
      setValue("itineraryTitle", selectedItinerary.title);
      setValue("country", selectedItinerary.country || "");
    }
  };

  // Auto-update country when itinerary changes
  useEffect(() => {
    if (watchedItineraryId && itineraries) {
      const selectedItinerary = itineraries.find(
        (i) => i._id === watchedItineraryId,
      );
      if (selectedItinerary && selectedItinerary.country) {
        setValue("country", selectedItinerary.country);
      }
    }
  }, [watchedItineraryId, itineraries, setValue]);

  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted with data:", data);
    if (!user?._id) return;

    const rawData = {
      title: data.title,
      description: data.description,
      country: data.country || "Unknown",
      authorId: user._id,
      tags: data.tags,
      privacy: data.privacy,
      itineraryId: data.itineraryId ?? "",
      image: data.image,
    };

    if (!data.itineraryId) {
      showToast("info", "Please select an itinerary");
      return;
    }
    try {
      setIsSubmitting(true);
      setUploadProgress(0);

      if (mode === "create") {
        const payload = {
          ...rawData,
          authorId: user._id, // ✅ inject here
          itineraryId: data.itineraryId,
        };

        const created = await createTravelGuideApi(payload, (progress) =>
          setUploadProgress(progress),
        );

        onPostCreated?.(created);
        showToast("success", "Post published successfully");
        onOpenChange(false);
        reset();
      } else if (mode === "edit" && initialData?._id) {
        const payload = {
          ...rawData,
        };

        const updated = await updateTravelGuideApi(
          initialData._id,
          payload,
          (progress) => setUploadProgress(progress),
        );

        onPostUpdated?.(updated);
        showToast("success", "Post updated successfully");
        onOpenChange(false);
        reset();
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to publish post");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup image preview URL on unmount
  useEffect(() => {
    return () => {
      const currentPreview = form.getValues("imagePreview");
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }
    };
  }, [form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Edit3 className="h-5 w-5" />
            {mode === "edit" ? "Edit Post" : "Create Post"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update your travel story and keep it fresh for the community"
              : "Share your travel experiences, tips, or questions with the community"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="max-h-[calc(90vh-120px)] overflow-auto">
            <div className="space-y-6 p-4">
              {/* Title */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Title *</Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        placeholder="e.g., 10 Days in Paradise: My Bali Adventure"
                        className="text-lg"
                      />
                      {fieldState.error && (
                        <p className="text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Content *</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Textarea
                        {...field}
                        placeholder="Share your experience, tips, or ask a question..."
                        rows={6}
                        className="resize-none"
                      />
                      {fieldState.error && (
                        <p className="text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Thumbnail Image</Label>
                <Controller
                  name="image"
                  control={control}
                  render={({ field, fieldState }) => (
                    <ImageUploader
                      value={field.value}
                      preview={form.watch("imagePreview")}
                      onChange={(file, preview) => {
                        field.onChange(file);
                        setValue("imagePreview", preview ?? "");
                      }}
                      error={fieldState?.error?.message}
                      maxImages={1}
                      mode={mode}
                    />
                  )}
                />
              </div>

              {/* Itinerary Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-sm font-medium">
                  <Map className="h-4 w-4" /> Related Itinerary
                </Label>
                <Select
                  value={watchedItineraryId || "none"}
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
                {form.watch("itineraryTitle") && (
                  <p className="text-muted-foreground text-xs">
                    This post will be linked to your itinerary:{" "}
                    <strong>{form.watch("itineraryTitle")}</strong>
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Country</Label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <Input
                          {...field}
                          placeholder="e.g., Japan"
                          value={field.value || ""}
                        />
                        {fieldState.error && (
                          <p className="text-sm text-red-500 capitalize">
                            {fieldState.error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>

              {/* Tags - New Flexible Tag Input */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-sm font-medium">
                  <Hash className="h-4 w-4" /> Tags
                </Label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <TagInput
                      value={field.value || []}
                      onChange={(tag) => field.onChange([...tag])}
                      placeholder="Type a tag and press Enter or comma..."
                    />
                  )}
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
                    onClick={() => setValue("privacy", "public")}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border-2 p-3 text-left transition-all",
                      form.watch("privacy") === "public"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 rounded-full p-1",
                        form.watch("privacy") === "public"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}
                    >
                      <Globe className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Public</span>
                        {form.watch("privacy") === "public" && (
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
                    onClick={() => setValue("privacy", "private")}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border-2 p-3 text-left transition-all",
                      form.watch("privacy") === "private"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 rounded-full p-1",
                        form.watch("privacy") === "private"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}
                    >
                      <Lock className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Only followers</span>
                        {form.watch("privacy") === "private" && (
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    {mode === "edit" ? (
                      <>
                        <PenIcon className="mr-2 h-4 w-4" />
                        <span>Update Post</span>
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        <span>Publish Post</span>
                      </>
                    )}
                  </>
                )}
              </Button>
            </DialogFooter>
          </ScrollArea>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;
