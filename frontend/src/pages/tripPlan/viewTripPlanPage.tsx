import {
  Landmark,
  MapPin,
  Calendar,
  Sparkles,
  Globe,
  Text,
  X,
  Navigation,
  Loader2,
  Award,
  Camera,
  UtensilsCrossed,
  Coffee as CoffeeIcon,
  Clock,
  MapPinned,
  Route,
  CheckSquare,
  Square,
  MessageCircle,
  Send,
  User,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useToast from "@/hooks/useToast";
import { useParams, useNavigate, Link } from "react-router-dom";
import { LoadingState } from "@/layouts/components/loading/LoadingState";
import {
  createCommentTripPlanApi,
  getCommentTripPlanApi,
  getTripPlanApi,
  updateCommentTripPlanApi,
  deleteCommentTripPlanApi,
} from "@/api/trip.api";
import type { Section, DaySection } from "@/pages/tripPlan/TripPlanPage";
import useAuthStore from "@/stores/useAuthStore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { Comment } from "@/types/interface.type";
import { Button } from "@/components/ui/button";

dayjs.extend(relativeTime);

// ─── Leaflet setup ─────────────────────────────────────────────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const CATEGORY_COLORS: Record<string, string> = {
  restaurant: "#ef4444",
  cafe: "#f59e0b",
  viewpoint: "#10b981",
  attraction: "#8b5cf6",
  other: "#6b7280",
  route: "#3b82f6",
};

const createCustomIcon = (color: string) =>
  L.divIcon({
    html: `<div style="background:${color};width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.2)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg></div>`,
    className: "custom-marker",
    iconSize: [36, 36],
    popupAnchor: [0, -18],
  });

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

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "restaurant":
      return <UtensilsCrossed size={14} className="text-red-500" />;
    case "cafe":
      return <CoffeeIcon size={14} className="text-amber-500" />;
    case "viewpoint":
      return <Camera size={14} className="text-emerald-500" />;
    case "attraction":
      return <Landmark size={14} className="text-purple-500" />;
    default:
      return <MapPin size={14} className="text-gray-500" />;
  }
};

const ViewTripPlanPage = () => {
  const { tripPlanId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [guideTitle, setGuideTitle] = useState("");
  const [authorIntro, setAuthorIntro] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const currentUser = useAuthStore((state) => state.user);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop";

  useEffect(() => {
    if (!tripPlanId) return;
    const fetchPlan = async () => {
      try {
        setIsLoading(true);
        const res = await getTripPlanApi(tripPlanId);
        const plan = res.data.data;
        setGuideTitle(plan.title ?? "");
        setAuthorIntro(plan.authorIntro ?? "");
        setAuthorName(plan.authorName ?? "");
        setAuthorAvatar(plan.authorAvatar ?? "");
        if (plan.thumbnailImage) setCoverImage(plan.thumbnailImage);
        const loadedSections = plan.sections ?? [];
        setSections(loadedSections);
        const openMap: Record<string, boolean> = {};
        loadedSections.forEach((s: Section) => {
          openMap[s.id] = true;
        });
        setOpenSections(openMap);
      } catch {
        showToast("error", "Failed to load trip plan");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, [tripPlanId]);

  useEffect(() => {
    if (!tripPlanId) return;
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const data = await getCommentTripPlanApi(tripPlanId);
        setComments(data.content as Comment[]);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [tripPlanId]);

  const toggleSection = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const getAllMapMarkers = () => {
    const markers: Array<{
      lat: number;
      lng: number;
      title: string;
      type: string;
      locationImageUrl?: string;
      category?: string;
      note?: string;
      name?: string;
      description?: string;
      timeEstimate?: string;
      address?: string;
    }> = [];
    sections.forEach((section) => {
      if (section.type === "day" && section.isOpen) {
        section.route.forEach((stop) =>
          markers.push({
            lat: stop.lat,
            lng: stop.lng,
            title: stop.name,
            type: "route",
            note: stop.note,
          }),
        );
        section.places.forEach((place) =>
          markers.push({
            lat: place.lat,
            lng: place.lng,
            title: place.name,
            name: place.name,
            address: place.address,
            locationImageUrl: place.locationImageUrl,
            timeEstimate: place.timeEstimate,
            description: place.description,
            type: "place",
            category: place.category,
          }),
        );
      }
    });
    return markers;
  };

  const getRoutePolylines = () =>
    sections
      .filter((s) => s.type === "day")
      .map((s) => ({
        positions: (s as DaySection).route.map(
          (stop) => [stop.lat, stop.lng] as [number, number],
        ),
        color: "#6366f1",
      }));

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await createCommentTripPlanApi(tripPlanId!, {
        content: newComment,
      });
      if (!res) return;
      setComments((prev) => [res, ...prev]);
      setNewComment("");
      showToast("success", "Comment added");
    } catch (error) {
      showToast("error", "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // edit comment
  const handleStartEdit = (comment: Comment) => {
    if (!comment._id) return;

    setEditingCommentId(comment._id);
    setEditCommentContent(comment.content);
  };

  // cancel edit
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  // save edited comment
  const handleUpdateComment = async (commentId: string) => {
    if (!tripPlanId) return;
    if (!editCommentContent.trim()) {
      showToast("error", "Comment cannot be empty");
      return;
    }

    setIsUpdating(true);
    try {
      const updated = await updateCommentTripPlanApi(
        tripPlanId,
        commentId,
        editCommentContent,
      );

      console.log(updated);
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? {
                ...c,
                content: updated.content,
                updatedAt: updated.updatedAt,
              }
            : c,
        ),
      );
      showToast("success", "Comment updated");
      handleCancelEdit();
    } catch (error) {
      showToast("error", "Failed to update comment");
    } finally {
      setIsUpdating(false);
    }
  };

  // delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!tripPlanId) return;

    try {
      await deleteCommentTripPlanApi(tripPlanId, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      showToast("success", "Comment deleted");
    } catch (error) {
      showToast("error", "Failed to delete comment");
    }
  };

  const formatCommentDate = (dateStr: string) => {
    return dayjs(dateStr).fromNow();
  };

  if (isLoading) return <LoadingState />;

  const allMarkers = getAllMapMarkers();

  return (
    <div className="relative flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* left panel*/}
      <aside
        className="relative z-20 mx-4 my-17 flex h-screen w-[52%] flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl"
        style={{ scrollbarWidth: "thin" }}
      >
        {/* Hero content */}
        <div className="relative h-64 flex-shrink-0 overflow-hidden rounded-t-3xl">
          <img
            src={
              coverImage ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=600&fit=crop"
            }
            className="h-full w-full object-cover"
            alt="Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 rounded-full bg-black/50 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/70"
          >
            ← Back
          </button>
          <div className="absolute right-0 bottom-0 left-0 p-8">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/30 backdrop-blur">
                <Sparkles size={12} className="text-indigo-200" />
              </div>
              <span className="text-xs font-semibold tracking-widest text-indigo-200 uppercase">
                Travel Guide
              </span>
            </div>
            <h1
              className="text-3xl leading-tight font-bold text-white"
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
            >
              {guideTitle}
            </h1>
          </div>
        </div>

        {/* author detail */}
        <div className="flex items-center gap-4 border-b border-gray-100 px-8 py-5">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-60 blur-sm" />
            <div
              onClick={() => navigate(`/profile/${authorName}`)}
              className="relative h-12 w-12 cursor-pointer overflow-hidden rounded-full ring-2 ring-white"
            >
              <img
                src={
                  authorAvatar ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"
                }
                className="h-full w-full object-cover"
                alt="Author"
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {authorName || "Travel Creator"}
            </p>
            <p className="text-xs text-gray-400">Travel Guide Creator</p>
          </div>
        </div>

        {authorIntro && (
          <div className="px-8 pt-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5 shadow-sm">
              <Award
                size={18}
                className="absolute top-4 right-4 text-indigo-300"
              />
              <p className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-widest text-indigo-500 uppercase">
                <Globe size={12} /> About the author
              </p>
              <p className="text-sm text-gray-600 italic">{authorIntro}</p>
            </div>
          </div>
        )}

        {/* Sections  */}
        <div className="flex flex-col gap-5 px-8 py-6 pb-10">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.id)}
                className={`flex w-full items-center justify-between px-5 py-4 text-left transition-all ${section.type === "day" ? "bg-gradient-to-r from-indigo-50/80 to-white" : "bg-gradient-to-r from-amber-50/80 to-white"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl ${section.type === "day" ? "bg-indigo-100 text-indigo-600" : "bg-amber-100 text-amber-600"}`}
                  >
                    {section.type === "day" ? (
                      <Calendar size={16} />
                    ) : (
                      <Sparkles size={16} />
                    )}
                  </div>
                  <span className="text-base font-semibold text-gray-800">
                    {section.title}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {openSections[section.id] ? "▲" : "▼"}
                </span>
              </button>

              {/* Section body */}
              {openSections[section.id] && (
                <div className="space-y-4 px-5 py-5">
                  {section.type === "tips" ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-600">
                      {section.content || (
                        <span className="text-gray-400 italic">
                          No tips added.
                        </span>
                      )}
                    </p>
                  ) : (
                    <>
                      {/* Route stops */}
                      {section.route.length > 0 && (
                        <div className="space-y-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <Route size={14} className="text-blue-600" />
                            <p className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
                              Route
                            </p>
                          </div>
                          {section.route.map((stop, index) => (
                            <div
                              key={stop.id ?? `${section.id}-route-${index}`}
                              className="flex items-start gap-3"
                            >
                              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-[11px] font-bold text-blue-700">
                                {stop.order}
                              </div>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-gray-800">
                                  {stop.name}
                                </span>
                                {stop.note && (
                                  <p className="mt-0.5 text-xs text-gray-500">
                                    {stop.note}
                                  </p>
                                )}
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
                            <p className="text-[10px] font-bold tracking-widest text-purple-600 uppercase">
                              Added Places
                            </p>
                          </div>

                          {section.places.map((place) => (
                            <div
                              key={place.id}
                              className="group/place relative flex items-start gap-5 rounded-2xl bg-white/60 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-lg"
                            >
                              {/* image container*/}
                              <div className="relative h-35 w-35 flex-shrink-0 overflow-hidden rounded-2xl shadow-md transition-all duration-500 group-hover/place:scale-[1.02] group-hover/place:shadow-xl">
                                {/* Gradient border halo */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-transparent to-black/10 opacity-0 transition-opacity duration-500 group-hover/place:opacity-100" />

                                <img
                                  src={
                                    place.locationImageUrl ||
                                    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=500&fit=crop"
                                  }
                                  alt={place.name}
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover/place:scale-110"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=500&fit=crop";
                                  }}
                                />

                                {/*Floating mask + magnifying glass icon*/}
                                <div
                                  onClick={() => {
                                    setSelectedImage(
                                      place.locationImageUrl ?? FALLBACK_IMAGE,
                                    );
                                  }}
                                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-0 transition-all duration-400 group-hover/place:opacity-100"
                                >
                                  <div className="rounded-full bg-white/30 p-1.5 backdrop-blur-sm">
                                    <Eye
                                      size={16}
                                      className="text-white drop-shadow-md"
                                    />
                                  </div>
                                </div>

                                {/* Category badges - floating at the top of the image*/}
                                <div className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm">
                                  <div className="flex items-center gap-1">
                                    {getCategoryIcon(place.category)}
                                    <span className="text-[9px] font-medium text-white capitalize">
                                      {place.category}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/*content area*/}
                              <div className="min-w-0 flex-1 space-y-1.5">
                                <div className="flex flex-wrap items-center gap-1">
                                  <h4 className="truncate text-base font-bold text-gray-800 transition-colors group-hover/place:text-indigo-700">
                                    {place.name}
                                  </h4>
                                  {place.timeEstimate && (
                                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600 shadow-sm">
                                      <Clock size={10} />
                                      {place.timeEstimate}
                                    </span>
                                  )}
                                </div>

                                {place.description && (
                                  <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">
                                    {place.description}
                                  </p>
                                )}

                                {/* Address tips */}
                                {place.address && (
                                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                    <MapPin size={10} />
                                    <span className="truncate">
                                      {place.address.split(",")[0]}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Notes */}
                      {section.notes && (
                        <div className="rounded-xl bg-gray-50 p-4">
                          <p className="mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                            Notes
                          </p>
                          <p className="text-sm whitespace-pre-wrap text-gray-600">
                            {section.notes}
                          </p>
                        </div>
                      )}

                      {/* List items */}
                      {section.listItems.length > 0 && (
                        <div className="space-y-2">
                          {section.listItems.map((item, index) => (
                            <div
                              key={item.id ?? `${section.id}-item-${index}`}
                              className="flex items-center gap-3 rounded-lg p-2"
                            >
                              {item.type === "checklist" ? (
                                item.checked ? (
                                  <CheckSquare
                                    size={16}
                                    className="flex-shrink-0 text-indigo-500"
                                  />
                                ) : (
                                  <Square
                                    size={16}
                                    className="flex-shrink-0 text-gray-300"
                                  />
                                )
                              ) : (
                                <Text
                                  size={14}
                                  className="flex-shrink-0 text-gray-400"
                                />
                              )}
                              <span
                                className={`text-sm ${item.checked ? "text-gray-400 line-through" : "text-gray-700"}`}
                              >
                                {item.text || (
                                  <span className="text-gray-300 italic">
                                    Empty item
                                  </span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Image preview pop-up window */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80"
            onClick={() => setSelectedImage(null)}
          >
            {/* image container */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              {/* close button */}
              <Button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              >
                <X size={18} />
              </Button>

              {/* image */}
              <img
                src={selectedImage}
                className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
                alt="Preview"
              />
            </div>
          </div>
        )}

        {/* comment section */}
        <div className="mx-6 mt-6 border-t border-gray-100 pt-6 pb-10">
          <div className="mb-4 flex items-center gap-2">
            <MessageCircle size={18} className="text-sky-500" />
            <h3 className="text-base font-semibold text-gray-800">
              Comments ({comments.length})
            </h3>
          </div>

          {currentUser ? (
            <div className="mb-6 rounded-xl bg-gray-50 p-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this travel guide..."
                rows={3}
                className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-indigo-300 focus:ring-1 focus:ring-indigo-300 focus:outline-none"
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleSubmitComment}
                  disabled={isSubmitting || !newComment.trim()}
                  className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  Post Comment
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 rounded-xl bg-amber-50 p-4 text-center text-sm text-amber-700">
              <Link to="/auth?mode=login" className="font-semibold underline">
                Log in
              </Link>{" "}
              to join the conversation.
            </div>
          )}

          {loadingComments ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-gray-400" />
            </div>
          ) : comments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center">
              <MessageCircle size={32} className="mx-auto text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">
                No comments yet. Be the first to share!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => {
                const isOwner = currentUser?._id === comment.user?._id;
                const isEditing = editingCommentId === comment._id;
                return (
                  <div
                    key={comment._id}
                    className="flex gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
                  >
                    <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
                      {comment.user?.profilePicture ? (
                        <img
                          src={comment.user.profilePicture}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User
                          size={16}
                          className="m-auto mt-2 text-indigo-500"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800">
                          {comment.user?.username}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatCommentDate(comment.createdAt)}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="mt-2 space-y-2">
                          <textarea
                            value={editCommentContent}
                            onChange={(e) =>
                              setEditCommentContent(e.target.value)
                            }
                            rows={3}
                            className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-indigo-300 focus:outline-none"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={handleCancelEdit}
                              className="rounded-md px-3 py-1 text-xs text-gray-500 hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() =>
                                comment._id && handleUpdateComment(comment._id)
                              }
                              disabled={
                                isUpdating || !editCommentContent.trim()
                              }
                              className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                              {isUpdating ? "Saving..." : "Save"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-gray-600">
                          {comment.content}
                        </p>
                      )}

                      {/* Action buttons: Only displayed when the comment author is not in editing mode. */}
                      {!isEditing && isOwner && (
                        <div className="mt-2 flex gap-3">
                          <button
                            onClick={() => handleStartEdit(comment)}
                            className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-indigo-600"
                          >
                            <Edit size={12} />
                            Edit
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-red-600">
                                <Trash2 size={12} />
                                Delete
                              </button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete this comment?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently remove your comment.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>

                                <AlertDialogAction
                                  onClick={() =>
                                    comment._id &&
                                    handleDeleteComment(comment._id)
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {/* right panel */}
      <div className="relative my-17 mr-4 h-screen flex-1">
        <div className="absolute inset-0 overflow-hidden rounded-3xl shadow-2xl">
          <MapContainer
            center={
              allMarkers.length > 0
                ? [allMarkers[0].lat, allMarkers[0].lng]
                : [51.505, -0.09]
            }
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {allMarkers.map((marker, idx) => {
              const color =
                marker.type === "route"
                  ? CATEGORY_COLORS.route
                  : (CATEGORY_COLORS[marker.category || "other"] ??
                    CATEGORY_COLORS.other);
              return (
                <Marker
                  key={`${marker.title}-${idx}`}
                  position={[marker.lat, marker.lng]}
                  icon={createCustomIcon(color)}
                >
                  <Popup>
                    <div className="w-[280px] max-w-[280px] overflow-hidden rounded-2xl bg-white shadow-2xl">
                      {marker.type !== "route" && (
                        <>
                          {marker.locationImageUrl ? (
                            <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                              <img
                                src={marker.locationImageUrl}
                                alt={marker.title}
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                              <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white shadow-md backdrop-blur-md">
                                {marker.category?.toUpperCase() || "PLACE"}
                              </div>
                              {marker.timeEstimate && (
                                <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[10px] font-medium text-white shadow-md backdrop-blur-md">
                                  <Clock
                                    size={10}
                                    className="text-indigo-200"
                                  />
                                  {marker.timeEstimate}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="relative flex h-36 w-full flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <div
                                className="absolute inset-0 opacity-30"
                                style={{
                                  backgroundImage: `radial-gradient(circle at 2px 2px, #9ca3af 1px, transparent 0)`,
                                  backgroundSize: "24px 24px",
                                }}
                              />
                              <MapPin size={32} className="text-gray-400/70" />
                              <span className="mt-2 text-[10px] font-medium text-gray-400">
                                No image available
                              </span>
                            </div>
                          )}
                        </>
                      )}
                      <div
                        className={`space-y-2.5 p-4 ${marker.type === "route" ? "pt-4" : ""}`}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                          <h3 className="flex-1 text-base leading-tight font-bold text-gray-800">
                            {marker.title}
                          </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span className="text-[11px] font-medium">
                            {marker.type === "route"
                              ? "🚏 Route stop"
                              : `🏷️ ${marker.category || "Place"}`}
                          </span>
                          {marker.timeEstimate && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="inline-flex items-center gap-1">
                                <Clock size={11} className="text-gray-400" />
                                <span>{marker.timeEstimate}</span>
                              </span>
                            </>
                          )}
                        </div>
                        {marker.address && (
                          <div className="flex items-start gap-1.5 border-l-2 border-indigo-200 pl-2 text-[11px] text-gray-500">
                            <MapPin
                              size={11}
                              className="mt-0.5 flex-shrink-0 text-indigo-400"
                            />
                            <span className="line-clamp-2">
                              {marker.address}
                            </span>
                          </div>
                        )}
                        {(marker.description || marker.note) && (
                          <div className="mt-1 rounded-lg border border-indigo-100/50 bg-gradient-to-r from-gray-50 to-indigo-50/30 p-2.5 text-xs text-gray-600">
                            <div className="mb-1 flex items-center gap-1">
                              <Sparkles size={10} className="text-indigo-400" />
                              <span className="text-[9px] font-semibold tracking-wide text-indigo-500">
                                DETAILS
                              </span>
                            </div>
                            <p className="line-clamp-3 leading-relaxed">
                              {marker.description || marker.note}
                            </p>
                          </div>
                        )}
                        {!marker.description &&
                          !marker.note &&
                          !marker.address && (
                            <p className="flex items-center gap-1 text-[10px] text-gray-400 italic">
                              <Eye size={10} /> Explore this spot
                            </p>
                          )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
            <MapController markers={allMarkers} />
          </MapContainer>
        </div>

        <div className="pointer-events-none absolute right-5 bottom-5 left-5 z-10">
          <div className="flex items-center justify-between rounded-2xl bg-black/70 px-5 py-3 text-xs text-white shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-2">
                <MapPin size={12} className="text-indigo-400" />
                <span className="font-medium">
                  {allMarkers.length} locations
                </span>
              </span>
              <div className="h-4 w-px bg-white/20" />
              <span className="flex items-center gap-2">
                <Calendar size={12} className="text-indigo-400" />
                <span className="font-medium">
                  {sections.filter((s) => s.type === "day").length} days
                </span>
              </span>
              <div className="h-4 w-px bg-white/20" />
              <span className="flex items-center gap-2">
                <Navigation size={12} className="text-indigo-400" />
                <span className="font-medium">
                  {getRoutePolylines().reduce(
                    (acc, p) => acc + Math.max(0, p.positions.length - 1),
                    0,
                  )}{" "}
                  routes
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {[
                { color: "#6366f1", label: "Route" },
                { color: "#8b5cf6", label: "Attraction" },
                { color: "#ef4444", label: "Restaurant" },
                { color: "#f59e0b", label: "Cafe" },
                { color: "#10b981", label: "Viewpoint" },
              ].map(({ color, label }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full shadow-sm"
                    style={{ backgroundColor: color }}
                  />
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

export default ViewTripPlanPage;
