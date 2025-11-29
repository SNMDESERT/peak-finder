import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import type { TripPhoto, User } from "@shared/schema";
import {
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  ImageIcon,
  ZoomIn,
} from "lucide-react";

interface PhotoGalleryProps {
  tripId: string;
}

type PhotoWithUser = TripPhoto & { user?: Partial<User> };

export function PhotoGallery({ tripId }: PhotoGalleryProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");

  const { data: photos = [], isLoading } = useQuery<PhotoWithUser[]>({
    queryKey: ["/api/trips", tripId, "photos"],
  });

  const addPhotoMutation = useMutation({
    mutationFn: async (data: { imageUrl: string; caption?: string }) => {
      return apiRequest("POST", `/api/trips/${tripId}/photos`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips", tripId, "photos"] });
      setIsAddPhotoOpen(false);
      setPhotoUrl("");
      setPhotoCaption("");
      toast({
        title: t("gallery.photoAdded", "Photo added"),
        description: t("gallery.photoAddedDescription", "Your photo has been added to the gallery."),
      });
    },
    onError: () => {
      toast({
        title: t("gallery.error", "Error"),
        description: t("gallery.addPhotoError", "Failed to add photo. Please try again."),
        variant: "destructive",
      });
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: string) => {
      return apiRequest("DELETE", `/api/photos/${photoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips", tripId, "photos"] });
      setSelectedPhotoIndex(null);
      toast({
        title: t("gallery.photoDeleted", "Photo deleted"),
        description: t("gallery.photoDeletedDescription", "Your photo has been removed from the gallery."),
      });
    },
    onError: () => {
      toast({
        title: t("gallery.error", "Error"),
        description: t("gallery.deletePhotoError", "Failed to delete photo. Please try again."),
        variant: "destructive",
      });
    },
  });

  const handleAddPhoto = () => {
    if (!photoUrl.trim()) {
      toast({
        title: t("gallery.error", "Error"),
        description: t("gallery.enterPhotoUrl", "Please enter a photo URL."),
        variant: "destructive",
      });
      return;
    }
    addPhotoMutation.mutate({ imageUrl: photoUrl, caption: photoCaption || undefined });
  };

  const navigatePhoto = (direction: "prev" | "next") => {
    if (selectedPhotoIndex === null) return;
    if (direction === "prev") {
      setSelectedPhotoIndex(selectedPhotoIndex > 0 ? selectedPhotoIndex - 1 : photos.length - 1);
    } else {
      setSelectedPhotoIndex(selectedPhotoIndex < photos.length - 1 ? selectedPhotoIndex + 1 : 0);
    }
  };

  const selectedPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  const getPhotoCountText = (count: number) => {
    if (count === 1) {
      return `(1 ${t("gallery.photo", "photo")})`;
    }
    return `(${count} ${t("gallery.photos", "photos")})`;
  };

  if (isLoading) {
    return (
      <Card data-testid="card-gallery-loading">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            {t("gallery.title", "Photo Gallery")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card data-testid="card-photo-gallery">
        <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            {t("gallery.title", "Photo Gallery")}
            {photos.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                {getPhotoCountText(photos.length)}
              </span>
            )}
          </CardTitle>
          {user && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddPhotoOpen(true)}
              data-testid="button-add-photo"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("gallery.addPhoto", "Add Photo")}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center" data-testid="gallery-empty">
              <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">{t("gallery.noPhotosYet", "No photos yet")}</p>
              <p className="text-sm text-muted-foreground/75">
                {t("gallery.beFirstToShare", "Be the first to share a photo from this trip!")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2" data-testid="gallery-grid">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className="relative aspect-square overflow-hidden rounded-md group hover-elevate"
                  data-testid={`gallery-photo-${photo.id}`}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || t("gallery.tripPhoto", "Trip photo")}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ZoomIn className="h-6 w-6 text-white" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={selectedPhotoIndex !== null} onOpenChange={(open) => !open && setSelectedPhotoIndex(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden" data-testid="dialog-lightbox">
          <DialogHeader className="sr-only">
            <DialogTitle>{t("gallery.photoViewer", "Photo Viewer")}</DialogTitle>
            <DialogDescription>{t("gallery.photoViewerDescription", "View and navigate through trip photos")}</DialogDescription>
          </DialogHeader>
          {selectedPhoto && (
            <div className="relative">
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="absolute top-2 right-2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                data-testid="button-close-lightbox"
              >
                <X className="h-5 w-5" />
              </button>

              {photos.length > 1 && (
                <>
                  <button
                    onClick={() => navigatePhoto("prev")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    data-testid="button-prev-photo"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => navigatePhoto("next")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    data-testid="button-next-photo"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.caption || t("gallery.tripPhoto", "Trip photo")}
                className="w-full max-h-[70vh] object-contain bg-black"
                data-testid="img-lightbox-photo"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800";
                }}
              />

              <div className="p-4 bg-background">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedPhoto.user && (
                      <>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={selectedPhoto.user.profileImageUrl || undefined} />
                          <AvatarFallback>
                            {(selectedPhoto.user.firstName?.[0] || "U").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium" data-testid="text-photo-author">
                            {selectedPhoto.user.firstName} {selectedPhoto.user.lastName}
                          </p>
                          {selectedPhoto.caption && (
                            <p className="text-sm text-muted-foreground" data-testid="text-photo-caption">
                              {selectedPhoto.caption}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground" data-testid="text-photo-counter">
                      {(selectedPhotoIndex || 0) + 1} / {photos.length}
                    </span>
                    {user && selectedPhoto.userId === user.id && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deletePhotoMutation.mutate(selectedPhoto.id)}
                        disabled={deletePhotoMutation.isPending}
                        data-testid="button-delete-photo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddPhotoOpen} onOpenChange={setIsAddPhotoOpen}>
        <DialogContent data-testid="dialog-add-photo">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              {t("gallery.addPhoto", "Add Photo")}
            </DialogTitle>
            <DialogDescription>
              {t("gallery.addPhotoDescription", "Share a photo from your trip experience")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photo-url">{t("gallery.photoUrl", "Photo URL")}</Label>
              <Input
                id="photo-url"
                placeholder="https://example.com/photo.jpg"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                data-testid="input-photo-url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo-caption">{t("gallery.captionOptional", "Caption (optional)")}</Label>
              <Textarea
                id="photo-caption"
                placeholder={t("gallery.captionPlaceholder", "Describe your photo...")}
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                rows={2}
                data-testid="input-photo-caption"
              />
            </div>

            {photoUrl && (
              <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                <img
                  src={photoUrl}
                  alt={t("gallery.preview", "Preview")}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  data-testid="img-photo-preview"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddPhotoOpen(false)}
                data-testid="button-cancel-photo"
              >
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                onClick={handleAddPhoto}
                disabled={!photoUrl.trim() || addPhotoMutation.isPending}
                data-testid="button-submit-photo"
              >
                {addPhotoMutation.isPending ? t("gallery.adding", "Adding...") : t("gallery.addPhoto", "Add Photo")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
