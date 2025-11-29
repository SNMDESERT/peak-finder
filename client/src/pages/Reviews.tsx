import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReviewCard } from "@/components/ReviewCard";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Review, User, Trip } from "@shared/schema";
import { Star, MessageSquare, PenLine, Filter } from "lucide-react";

const reviewFormSchema = z.object({
  tripId: z.string().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Review must be at least 10 characters"),
  activityType: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

export default function Reviews() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [filterRating, setFilterRating] = useState("all");

  const { data: reviews, isLoading: reviewsLoading } = useQuery<
    (Review & { user?: Partial<User>; trip?: Partial<Trip> })[]
  >({
    queryKey: ["/api/reviews"],
  });

  const { data: trips } = useQuery<Trip[]>({
    queryKey: ["/api/trips"],
  });

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      title: "",
      content: "",
      activityType: "",
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      await apiRequest("POST", "/api/reviews", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: t("reviews.toast.submitted", "Review submitted!"),
        description: t("reviews.toast.thankYou", "Thank you for sharing your experience."),
      });
      setIsDialogOpen(false);
      form.reset();
      setSelectedRating(0);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: t("reviews.error.unauthorized", "Unauthorized"),
          description: t("reviews.error.signInRequired", "Please sign in to submit a review."),
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: t("reviews.error.title", "Error"),
        description: t("reviews.error.failed", "Failed to submit review. Please try again."),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    createReviewMutation.mutate({ ...data, rating: selectedRating });
  };

  const filteredReviews = reviews?.filter((review) => {
    if (filterRating === "all") return true;
    return review.rating === parseInt(filterRating);
  });

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = reviews?.reduce(
    (acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-12 bg-background">
      <section className="py-12 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
              {t("reviews.badge", "Traveler Feedback")}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {t("reviews.pageTitle", "Reviews & Experiences")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("reviews.pageDescription", "Read authentic reviews from fellow adventurers and share your own mountain experiences across Azerbaijan.")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-card-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-primary">
                    {averageRating.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(averageRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("reviews.basedOn", "Based on {{count}} reviews", { count: reviews?.length || 0 })}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = ratingDistribution?.[rating] || 0;
                    const percentage = reviews?.length
                      ? (count / reviews.length) * 100
                      : 0;
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-sm w-6">{rating}</span>
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-10">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-card-border flex flex-col justify-center">
              <CardContent className="p-6 text-center">
                <PenLine className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t("reviews.shareExperience", "Share Your Experience")}</h3>
                <p className="text-muted-foreground mb-6">
                  {t("reviews.shareDescription", "Completed a trip? Help other adventurers by sharing your story.")}
                </p>

                {isAuthenticated ? (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2" data-testid="button-write-review">
                        <PenLine className="h-4 w-4" />
                        {t("reviews.writeReview", "Write a Review")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>{t("reviews.form.dialogTitle", "Write Your Review")}</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t("reviews.form.yourRating", "Your Rating")}</label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setSelectedRating(star)}
                                  className="p-1 hover:scale-110 transition-transform"
                                  data-testid={`rating-star-${star}`}
                                >
                                  <Star
                                    className={`h-8 w-8 ${
                                      star <= selectedRating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted hover:text-yellow-300"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                            {selectedRating === 0 && (
                              <p className="text-xs text-destructive">
                                {t("reviews.form.selectRating", "Please select a rating")}
                              </p>
                            )}
                          </div>

                          <FormField
                            control={form.control}
                            name="tripId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("reviews.form.tripOptional", "Trip (Optional)")}</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-trip">
                                      <SelectValue placeholder={t("reviews.form.selectTrip", "Select a trip")} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {trips?.map((trip) => (
                                      <SelectItem key={trip.id} value={trip.id}>
                                        {trip.title}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("reviews.form.reviewTitle", "Review Title")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("reviews.form.titlePlaceholder", "Summarize your experience")}
                                    {...field}
                                    data-testid="input-review-title"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("reviews.form.yourReview", "Your Review")}</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder={t("reviews.form.contentPlaceholder", "Share your detailed experience...")}
                                    className="min-h-[120px]"
                                    {...field}
                                    data-testid="input-review-content"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="activityType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("reviews.form.activityTypeOptional", "Activity Type (Optional)")}</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-activity-type">
                                      <SelectValue placeholder={t("reviews.form.selectActivity", "Select activity")} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="climbing">{t("reviews.activities.climbing", "Climbing")}</SelectItem>
                                    <SelectItem value="hiking">{t("reviews.activities.hiking", "Hiking")}</SelectItem>
                                    <SelectItem value="camping">{t("reviews.activities.camping", "Camping")}</SelectItem>
                                    <SelectItem value="photography">{t("reviews.activities.photography", "Photography")}</SelectItem>
                                    <SelectItem value="cultural">{t("reviews.activities.cultural", "Cultural Tour")}</SelectItem>
                                    <SelectItem value="wildlife">{t("reviews.activities.wildlife", "Wildlife")}</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full"
                            disabled={createReviewMutation.isPending || selectedRating === 0}
                            data-testid="button-submit-review"
                          >
                            {createReviewMutation.isPending 
                              ? t("reviews.form.submitting", "Submitting...") 
                              : t("reviews.form.submitReview", "Submit Review")}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button
                    onClick={() => (window.location.href = "/api/login")}
                    data-testid="button-signin-review"
                  >
                    {t("reviews.signInToReview", "Sign In to Review")}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold">{t("reviews.allReviews", "All Reviews")}</h2>
            <p className="text-muted-foreground">
              {t("reviews.reviewCount", "{{count}} reviews", { count: filteredReviews?.length || 0 })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-[140px]" data-testid="filter-rating">
                <SelectValue placeholder={t("common.filter", "Filter")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("reviews.filter.allRatings", "All Ratings")}</SelectItem>
                <SelectItem value="5">{t("reviews.filter.stars5", "5 Stars")}</SelectItem>
                <SelectItem value="4">{t("reviews.filter.stars4", "4 Stars")}</SelectItem>
                <SelectItem value="3">{t("reviews.filter.stars3", "3 Stars")}</SelectItem>
                <SelectItem value="2">{t("reviews.filter.stars2", "2 Stars")}</SelectItem>
                <SelectItem value="1">{t("reviews.filter.star1", "1 Star")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {reviewsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <Skeleton className="w-11 h-11 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </Card>
            ))}
          </div>
        ) : filteredReviews && filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                user={review.user}
                trip={review.trip}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("reviews.noReviews", "No reviews yet")}</h3>
            <p className="text-muted-foreground">
              {t("reviews.beFirst", "Be the first to share your mountain adventure experience!")}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
