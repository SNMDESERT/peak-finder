import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MapPin, Clock, Users, Mountain, UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import type { Trip, User, TripInvitation } from "@shared/schema";

type InvitationWithDetails = TripInvitation & {
  trip?: Trip;
  inviter?: Partial<User>;
};

export default function InvitePage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/invite/:code");
  const inviteCode = params?.code;
  const { toast } = useToast();

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });

  const {
    data: invitation,
    isLoading: invitationLoading,
    error: invitationError,
  } = useQuery<InvitationWithDetails>({
    queryKey: ["/api/invitations", inviteCode],
    enabled: !!inviteCode,
  });

  const acceptMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/invitations/${inviteCode}/accept`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Invitation accepted",
        description: "You can now view and book this trip",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invitations", inviteCode] });
      if (invitation?.trip) {
        setLocation(`/trips/${invitation.trip.id}`);
      }
    },
    onError: () => {
      toast({
        title: "Failed to accept invitation",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  if (invitationLoading || userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (invitationError || !invitation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2" data-testid="text-invitation-error">
              Invitation Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              This invitation link may be invalid or has expired.
            </p>
            <Button onClick={() => setLocation("/trips")} data-testid="button-browse-trips">
              Browse All Trips
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const trip = invitation.trip;
  const inviter = invitation.inviter;
  const isExpired = invitation.expiresAt && new Date() > new Date(invitation.expiresAt);
  const isAccepted = invitation.status === "accepted";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Trip Invitation</span>
          </div>
          <CardTitle data-testid="text-invitation-title">
            {trip?.title || "Mountain Adventure"}
          </CardTitle>
          <CardDescription>
            {inviter?.firstName
              ? `${inviter.firstName} ${inviter.lastName || ""} invited you to join this trip`
              : "You've been invited to join this adventure"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {trip?.imageUrl && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={trip.imageUrl}
                alt={trip.title}
                className="w-full h-48 object-cover"
                data-testid="img-trip-preview"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {trip?.difficulty && (
              <Badge variant="outline" data-testid="badge-difficulty">
                <Mountain className="h-3 w-3 mr-1" />
                {trip.difficulty}
              </Badge>
            )}
            {trip?.activityType && (
              <Badge variant="secondary" data-testid="badge-activity">
                {trip.activityType}
              </Badge>
            )}
          </div>

          <div className="space-y-2 text-sm">
            {trip?.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span data-testid="text-location">{trip.location}</span>
              </div>
            )}
            {trip?.duration && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span data-testid="text-duration">{trip.duration}</span>
              </div>
            )}
            {trip?.maxGroupSize && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span data-testid="text-group-size">
                  Max group size: {trip.maxGroupSize}
                </span>
              </div>
            )}
          </div>

          {trip?.description && (
            <p className="text-sm text-muted-foreground line-clamp-3" data-testid="text-description">
              {trip.description}
            </p>
          )}

          <div className="pt-4 space-y-3">
            {isExpired ? (
              <div className="text-center py-4">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <p className="text-destructive font-medium" data-testid="text-expired">
                  This invitation has expired
                </p>
                <Button
                  variant="outline"
                  className="mt-3"
                  onClick={() => setLocation(`/trips/${trip?.id}`)}
                  data-testid="button-view-trip-expired"
                >
                  View Trip Details
                </Button>
              </div>
            ) : isAccepted ? (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-green-600 font-medium" data-testid="text-accepted">
                  Invitation accepted
                </p>
                <Button
                  className="mt-3"
                  onClick={() => setLocation(`/trips/${trip?.id}`)}
                  data-testid="button-view-trip-accepted"
                >
                  View Trip Details
                </Button>
              </div>
            ) : !user ? (
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => setLocation("/api/login")}
                  data-testid="button-login-to-accept"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign In to Accept Invitation
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Sign in with your account to join this trip
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => acceptMutation.mutate()}
                  disabled={acceptMutation.isPending}
                  data-testid="button-accept-invitation"
                >
                  {acceptMutation.isPending ? (
                    "Accepting..."
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Accept Invitation & View Trip
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setLocation("/trips")}
                  data-testid="button-decline-invitation"
                >
                  Browse Other Trips
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
