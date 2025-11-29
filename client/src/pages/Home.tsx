import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TripCard } from "@/components/TripCard";
import { AchievementBadge } from "@/components/AchievementBadge";
import { useTranslation } from "react-i18next";
import type { Trip, Achievement, UserAchievement } from "@shared/schema";
import {
  Mountain,
  TrendingUp,
  MapPin,
  Award,
  Calendar,
  ArrowRight,
  Star,
  Compass,
} from "lucide-react";

export default function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: trips, isLoading: tripsLoading } = useQuery<Trip[]>({
    queryKey: ["/api/trips", "featured"],
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const { data: userAchievements } = useQuery<UserAchievement[]>({
    queryKey: ["/api/user/achievements"],
  });

  const climbingLevel = user?.climbingLevel || 1;
  const totalPoints = user?.totalPoints || 0;
  const nextLevelPoints = climbingLevel * 500;
  const levelProgress = Math.min((totalPoints % 500) / 5, 100);

  const featuredTrips = trips?.filter((t) => t.featured).slice(0, 3) || [];
  const earnedAchievementIds = new Set(userAchievements?.map((ua) => ua.achievementId) || []);

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-12">
          <Card className="overflow-hidden border-card-border bg-gradient-to-br from-primary/5 via-card to-secondary/5">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl lg:text-3xl shadow-lg">
                      {climbingLevel}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-secondary rounded-full flex items-center justify-center shadow">
                      <Star className="h-4 w-4 text-secondary-foreground fill-current" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">
                      {t("home.welcomeBack", "Welcome back")}, {user?.firstName || t("home.explorer", "Explorer")}!
                    </h1>
                    <p className="text-muted-foreground">
                      {t("home.levelExplorer", "Level {{level}} Mountain Explorer", { level: climbingLevel })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-primary">{totalPoints}</div>
                    <div className="text-xs text-muted-foreground">{t("home.totalPoints", "Total Points")}</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-primary">
                      {user?.tripsCompleted || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("home.tripsDone", "Trips Done")}</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-primary">
                      {earnedAchievementIds.size}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("home.badgesEarned", "Badges Earned")}</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-primary">
                      {((user?.totalElevation || 0) / 1000).toFixed(1)}km
                    </div>
                    <div className="text-xs text-muted-foreground">{t("home.elevation", "Elevation")}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {t("home.progressToLevel", "Progress to Level {{level}}", { level: climbingLevel + 1 })}
                  </span>
                  <span className="text-sm font-medium">
                    {totalPoints % 500} / 500 pts
                  </span>
                </div>
                <Progress value={levelProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Compass className="h-6 w-6 text-primary" />
                {t("home.featuredTrips", "Featured Trips")}
              </h2>
              <p className="text-muted-foreground">
                {t("home.handpickedAdventures", "Handpicked adventures waiting for you")}
              </p>
            </div>
            <Link href="/trips">
              <Button variant="outline" className="gap-2" data-testid="link-all-trips">
                {t("common.viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {tripsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[4/3]" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Mountain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("home.noFeaturedTrips", "No featured trips yet")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("home.checkBackSoon", "Check back soon for exciting mountain adventures!")}
              </p>
              <Link href="/trips">
                <Button data-testid="button-browse-trips">{t("home.browseAllTrips", "Browse All Trips")}</Button>
              </Link>
            </Card>
          )}
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Award className="h-6 w-6 text-secondary" />
                {t("home.achievementBadges", "Achievement Badges")}
              </h2>
              <p className="text-muted-foreground">
                {t("home.collectSymbols", "Collect regional symbols as you explore")}
              </p>
            </div>
            <Link href="/achievements">
              <Button variant="outline" className="gap-2" data-testid="link-all-achievements">
                {t("common.viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {achievementsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-4">
                  <div className="flex flex-col items-center space-y-3">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </Card>
              ))}
            </div>
          ) : achievements && achievements.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {achievements.slice(0, 6).map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  earned={earnedAchievementIds.has(achievement.id)}
                  progress={earnedAchievementIds.has(achievement.id) ? 100 : Math.random() * 80}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("home.noAchievements", "No achievements available")}</h3>
              <p className="text-muted-foreground">
                {t("home.startExploring", "Start exploring to unlock your first badge!")}
              </p>
            </Card>
          )}
        </section>

        <section>
          <Card className="overflow-hidden border-card-border">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <Badge className="w-fit mb-4" variant="secondary">
                  {t("home.quickActions", "Quick Actions")}
                </Badge>
                <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                  {t("home.readyForAdventure", "Ready for Your Next Adventure?")}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t("home.exploreNewTrails", "Explore new mountain trails, join group expeditions, or plan your solo journey through Azerbaijan's stunning landscapes.")}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/trips">
                    <Button className="gap-2" data-testid="button-find-trip">
                      <MapPin className="h-4 w-4" />
                      {t("home.findTrip", "Find a Trip")}
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" className="gap-2" data-testid="button-my-dashboard">
                      <Calendar className="h-4 w-4" />
                      {t("home.myDashboard", "My Dashboard")}
                    </Button>
                  </Link>
                </div>
              </div>
              <div
                className="hidden lg:block h-64 lg:h-auto bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070')`,
                }}
              />
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
