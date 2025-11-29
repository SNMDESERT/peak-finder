import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Trip } from "@shared/schema";
import {
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Mountain,
  Camera,
  Tent,
  Footprints,
  Compass,
  Binoculars,
} from "lucide-react";

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/90 text-white",
  intermediate: "bg-yellow-500/90 text-white",
  advanced: "bg-orange-500/90 text-white",
  expert: "bg-red-500/90 text-white",
};

const activityIcons: Record<string, React.ReactNode> = {
  climbing: <Mountain className="h-3.5 w-3.5" />,
  hiking: <Footprints className="h-3.5 w-3.5" />,
  camping: <Tent className="h-3.5 w-3.5" />,
  photography: <Camera className="h-3.5 w-3.5" />,
  cultural: <Compass className="h-3.5 w-3.5" />,
  wildlife: <Binoculars className="h-3.5 w-3.5" />,
};

interface TripCardProps {
  trip: Trip;
  regionName?: string;
}

export function TripCard({ trip, regionName }: TripCardProps) {
  return (
    <Card
      className="group overflow-visible card-hover border-card-border"
      data-testid={`card-trip-${trip.id}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-md">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: trip.imageUrl
              ? `url(${trip.imageUrl})`
              : `linear-gradient(135deg, hsl(var(--primary)/0.8), hsl(var(--secondary)/0.8))`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge
            className={`${difficultyColors[trip.difficulty]} border-0 text-xs font-medium`}
          >
            {trip.difficulty.charAt(0).toUpperCase() + trip.difficulty.slice(1)}
          </Badge>
          {trip.featured && (
            <Badge className="bg-secondary text-secondary-foreground border-0 text-xs font-medium">
              Featured
            </Badge>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2 text-white/90 text-xs">
            {activityIcons[trip.activityType] || <Mountain className="h-3.5 w-3.5" />}
            <span className="capitalize">{trip.activityType}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {trip.title}
          </h3>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="line-clamp-1">
              {trip.location}
              {regionName && `, ${regionName}`}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {trip.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
          {trip.elevation && (
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span>{trip.elevation.toLocaleString()}m</span>
            </div>
          )}
          {trip.duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{trip.duration}</span>
            </div>
          )}
          {trip.maxGroupSize && (
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>Max {trip.maxGroupSize}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            {trip.price && (
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-primary">
                  ${Number(trip.price).toFixed(0)}
                </span>
                <span className="text-xs text-muted-foreground">per person</span>
              </div>
            )}
          </div>
          <Link href={`/trips/${trip.id}`}>
            <Button size="sm" data-testid={`button-view-trip-${trip.id}`}>
              View Details
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-1 text-xs text-secondary">
          <TrendingUp className="h-3 w-3" />
          <span>+{trip.pointsReward || 100} points</span>
        </div>
      </CardContent>
    </Card>
  );
}
