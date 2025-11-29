import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Review, User, Trip } from "@shared/schema";
import { Star, ThumbsUp, Calendar, MapPin } from "lucide-react";

interface ReviewCardProps {
  review: Review;
  user?: Partial<User>;
  trip?: Partial<Trip>;
}

export function ReviewCard({ review, user, trip }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
        }`}
      />
    ));
  };

  return (
    <Card
      className="overflow-visible card-hover"
      data-testid={`card-review-${review.id}`}
    >
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border-2 border-primary/20">
              <AvatarImage
                src={user?.profileImageUrl || undefined}
                alt={user?.firstName || "Reviewer"}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {user?.firstName?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {user?.firstName} {user?.lastName}
                </span>
                {user?.climbingLevel && (
                  <Badge variant="secondary" className="text-xs h-5">
                    Level {user.climbingLevel}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(review.createdAt!).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5">{renderStars(review.rating)}</div>
        </div>

        {trip && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">{trip.title}</span>
            {review.activityType && (
              <Badge variant="outline" className="text-xs capitalize ml-auto">
                {review.activityType}
              </Badge>
            )}
          </div>
        )}

        {review.title && (
          <h4 className="font-semibold text-base">{review.title}</h4>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed">
          {review.content}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary gap-1.5"
            data-testid={`button-helpful-${review.id}`}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>Helpful ({review.helpful || 0})</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
