import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingModal } from "@/components/BookingModal";
import { useAuth } from "@/hooks/useAuth";
import type { Trip, Region } from "@shared/schema";
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
  ArrowLeft,
  Calendar,
  Award,
  DollarSign,
  CheckCircle,
  Info,
} from "lucide-react";

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/90 text-white",
  intermediate: "bg-yellow-500/90 text-white",
  advanced: "bg-orange-500/90 text-white",
  expert: "bg-red-500/90 text-white",
};

const activityIcons: Record<string, React.ReactNode> = {
  climbing: <Mountain className="h-5 w-5" />,
  hiking: <Footprints className="h-5 w-5" />,
  camping: <Tent className="h-5 w-5" />,
  photography: <Camera className="h-5 w-5" />,
  cultural: <Compass className="h-5 w-5" />,
  wildlife: <Binoculars className="h-5 w-5" />,
};

export default function TripDetail() {
  const [, params] = useRoute("/trips/:id");
  const { isAuthenticated } = useAuth();
  const [bookingOpen, setBookingOpen] = useState(false);

  const { data: trip, isLoading: tripLoading } = useQuery<Trip>({
    queryKey: ["/api/trips", params?.id],
    enabled: !!params?.id,
  });

  const { data: regions } = useQuery<Region[]>({
    queryKey: ["/api/regions"],
  });

  const region = regions?.find((r) => r.id === trip?.regionId);

  if (tripLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="relative h-[50vh]">
          <Skeleton className="absolute inset-0" />
        </div>
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Mountain className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-bold">Trip Not Found</h1>
          <p className="text-muted-foreground">
            The trip you're looking for doesn't exist.
          </p>
          <Link href="/trips">
            <Button data-testid="button-back-to-trips">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trips
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div
        className="relative h-[50vh] bg-cover bg-center"
        style={{
          backgroundImage: trip.imageUrl
            ? `url(${trip.imageUrl})`
            : `linear-gradient(135deg, hsl(var(--primary)/0.8), hsl(var(--secondary)/0.8))`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute top-4 left-4">
          <Link href="/trips">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trips
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                className={`${difficultyColors[trip.difficulty]} border-0`}
              >
                {trip.difficulty.charAt(0).toUpperCase() +
                  trip.difficulty.slice(1)}
              </Badge>
              <Badge
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white"
              >
                {activityIcons[trip.activityType]}
                <span className="ml-1.5 capitalize">{trip.activityType}</span>
              </Badge>
              {trip.featured && (
                <Badge className="bg-secondary text-secondary-foreground border-0">
                  Featured
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {trip.title}
            </h1>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">
                {trip.location}
                {region && `, ${region.name}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">About This Trip</h2>
              <p className="text-muted-foreground leading-relaxed">
                {trip.description}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trip.elevation && (
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Elevation</p>
                      <p className="font-semibold">
                        {trip.elevation.toLocaleString()}m
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {trip.duration && (
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">{trip.duration}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {trip.maxGroupSize && (
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Max Group</p>
                      <p className="font-semibold">
                        {trip.maxGroupSize} people
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {trip.distance && (
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Distance</p>
                      <p className="font-semibold">{trip.distance}km</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid sm:grid-cols-2 gap-3">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Professional mountain guide
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Safety equipment
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Transportation from meeting point
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Lunch and refreshments
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Photos and videos
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Certificate of completion
                  </li>
                </ul>
              </CardContent>
            </Card>

            {region && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    About {region.name} Region
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{region.description}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                {trip.price && (
                  <div className="text-center pb-4 border-b">
                    <div className="flex items-center justify-center gap-1">
                      <DollarSign className="h-6 w-6 text-primary" />
                      <span className="text-3xl font-bold">
                        {Number(trip.price).toFixed(0)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">per person</p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Difficulty</span>
                    <Badge
                      className={`${difficultyColors[trip.difficulty]} border-0`}
                    >
                      {trip.difficulty.charAt(0).toUpperCase() +
                        trip.difficulty.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Activity</span>
                    <span className="font-medium capitalize">
                      {trip.activityType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Points Reward</span>
                    <span className="font-medium text-secondary">
                      +{trip.pointsReward || 100} pts
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  {isAuthenticated ? (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setBookingOpen(true)}
                      data-testid="button-book-trip"
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Book This Trip
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      size="lg"
                      asChild
                      data-testid="button-login-to-book"
                    >
                      <a href="/api/login">
                        <Calendar className="h-5 w-5 mr-2" />
                        Sign In to Book
                      </a>
                    </Button>
                  )}

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Award className="h-4 w-4" />
                    <span>Earn achievement badges for completing trips</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {trip && (
        <BookingModal
          trip={trip}
          open={bookingOpen}
          onOpenChange={setBookingOpen}
        />
      )}
    </div>
  );
}
