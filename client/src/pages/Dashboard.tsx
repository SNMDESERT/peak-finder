import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { AchievementBadge } from "@/components/AchievementBadge";
import type { Trip, Achievement, UserAchievement, UserTrip } from "@shared/schema";
import {
  Mountain,
  TrendingUp,
  MapPin,
  Award,
  Calendar,
  ArrowRight,
  Star,
  CheckCircle,
  Clock,
  Trophy,
  Target,
  Zap,
  Castle,
} from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please sign in to view your dashboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: userTrips, isLoading: tripsLoading } = useQuery<
    (UserTrip & { trip?: Trip })[]
  >({
    queryKey: ["/api/user/trips"],
    enabled: isAuthenticated,
  });

  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
    enabled: isAuthenticated,
  });

  const { data: userAchievements } = useQuery<UserAchievement[]>({
    queryKey: ["/api/user/achievements"],
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen pt-20 lg:pt-24 pb-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-48 w-full mb-8" />
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const climbingLevel = user.climbingLevel || 1;
  const totalPoints = user.totalPoints || 0;
  const nextLevelPoints = climbingLevel * 500;
  const levelProgress = Math.min((totalPoints % 500) / 5, 100);

  const completedTrips = userTrips?.filter((ut) => ut.status === "completed") || [];
  const upcomingTrips = userTrips?.filter((ut) => ut.status === "booked") || [];
  const earnedAchievementIds = new Set(userAchievements?.map((ua) => ua.achievementId) || []);

  const recentAchievements = achievements
    ?.filter((a) => earnedAchievementIds.has(a.id))
    .slice(0, 4) || [];

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-8 overflow-hidden border-card-border bg-gradient-to-br from-primary/5 via-card to-secondary/5">
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 lg:h-24 lg:w-24 border-4 border-primary/20 shadow-lg">
                  <AvatarImage
                    src={user.profileImageUrl || undefined}
                    alt={user.firstName || "User"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold">
                    {user.firstName?.[0] || user.email?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold">
                    {user.firstName} {user.lastName}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="gap-1">
                      <Trophy className="h-3 w-3" />
                      Level {climbingLevel}
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                      Mountain Explorer
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 lg:ml-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Progress to Level {climbingLevel + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {totalPoints % 500} / 500 points
                  </span>
                </div>
                <Progress value={levelProgress} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  Complete trips and challenges to earn more points
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-card-border">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalPoints}</div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-card-border">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {user.tripsCompleted || completedTrips.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Trips Done</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-card-border">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{earnedAchievementIds.size}</div>
                  <div className="text-sm text-muted-foreground">Badges Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-card-border">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {((user.totalElevation || 0) / 1000).toFixed(1)}km
                  </div>
                  <div className="text-sm text-muted-foreground">Elevation</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="border-card-border">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Upcoming Trips
                </CardTitle>
                <Link href="/trips">
                  <Button variant="ghost" size="sm" className="gap-1" data-testid="button-view-all-trips">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {tripsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-16" />
                    ))}
                  </div>
                ) : upcomingTrips.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingTrips.slice(0, 3).map((ut) => (
                      <div
                        key={ut.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Mountain className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {ut.trip?.title || "Trip"}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {ut.trip?.location || "Location"}
                          </div>
                        </div>
                        <Badge variant="outline">Booked</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">No upcoming trips</p>
                    <Link href="/trips">
                      <Button size="sm" data-testid="button-book-trip">
                        Book a Trip
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-card-border">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Recent Completions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tripsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-16" />
                    ))}
                  </div>
                ) : completedTrips.length > 0 ? (
                  <div className="space-y-3">
                    {completedTrips.slice(0, 3).map((ut) => (
                      <div
                        key={ut.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {ut.trip?.title || "Trip"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {ut.completedAt
                              ? new Date(ut.completedAt).toLocaleDateString()
                              : "Completed"}
                          </div>
                        </div>
                        <Badge className="bg-green-500/10 text-green-600 border-0">
                          +{ut.trip?.pointsReward || 100} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No completed trips yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-card-border">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-secondary" />
                  Recent Achievements
                </CardTitle>
                <Link href="/achievements">
                  <Button variant="ghost" size="sm" className="gap-1" data-testid="button-view-all-achievements">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentAchievements.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {recentAchievements.map((achievement) => (
                      <AchievementBadge
                        key={achievement.id}
                        achievement={achievement}
                        earned={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">No badges earned yet</p>
                    <Link href="/trips">
                      <Button size="sm" data-testid="button-start-earning">
                        Start Earning
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-card-border bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Next Goals
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3" data-testid="goal-karabakh">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Karabakh Explorer</div>
                      <Progress value={45} className="h-1.5 mt-1" />
                    </div>
                    <span className="text-xs text-muted-foreground">45%</span>
                  </div>
                  <div className="flex items-center gap-3" data-testid="goal-summit">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Mountain className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Summit Master</div>
                      <Progress value={20} className="h-1.5 mt-1" />
                    </div>
                    <span className="text-xs text-muted-foreground">20%</span>
                  </div>
                  <div className="flex items-center gap-3" data-testid="goal-nakhchivan">
                    <div className="w-10 h-10 rounded-full bg-stone-500/10 flex items-center justify-center">
                      <Castle className="h-5 w-5 text-stone-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Nakhchivan Heritage</div>
                      <Progress value={10} className="h-1.5 mt-1" />
                    </div>
                    <span className="text-xs text-muted-foreground">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
