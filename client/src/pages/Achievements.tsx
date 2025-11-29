import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AchievementBadge } from "@/components/AchievementBadge";
import { getRegionSymbol } from "@/lib/regionSymbols";
import type { Achievement, UserAchievement, Region } from "@shared/schema";
import { Award, Trophy, Lock, Star, Crown, Medal } from "lucide-react";

const tierInfo = {
  bronze: { icon: Medal, color: "text-amber-600", label: "Bronze" },
  silver: { icon: Award, color: "text-slate-400", label: "Silver" },
  gold: { icon: Trophy, color: "text-yellow-500", label: "Gold" },
  platinum: { icon: Crown, color: "text-cyan-400", label: "Platinum" },
};

export default function Achievements() {
  const { user, isAuthenticated } = useAuth();

  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const { data: userAchievements } = useQuery<UserAchievement[]>({
    queryKey: ["/api/user/achievements"],
    enabled: isAuthenticated,
  });

  const { data: regions } = useQuery<Region[]>({
    queryKey: ["/api/regions"],
  });

  const earnedMap = new Map(
    userAchievements?.map((ua) => [ua.achievementId, ua.earnedAt]) || []
  );

  const groupedByRegion = achievements?.reduce(
    (acc, achievement) => {
      const regionId = achievement.regionId || "general";
      if (!acc[regionId]) acc[regionId] = [];
      acc[regionId].push(achievement);
      return acc;
    },
    {} as Record<string, Achievement[]>
  );

  const groupedByTier = achievements?.reduce(
    (acc, achievement) => {
      const tier = achievement.tier || "bronze";
      if (!acc[tier]) acc[tier] = [];
      acc[tier].push(achievement);
      return acc;
    },
    {} as Record<string, Achievement[]>
  );

  const totalAchievements = achievements?.length || 0;
  const earnedCount = userAchievements?.length || 0;
  const progressPercentage = totalAchievements > 0 ? (earnedCount / totalAchievements) * 100 : 0;

  const getRegionName = (regionId: string) => {
    if (regionId === "general") return "General";
    return regions?.find((r) => r.id === regionId)?.name || "Unknown";
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-12 bg-background">
      <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-br from-secondary/10 via-background to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary" data-testid="badge-achievements-title">
              <Award className="h-3.5 w-3.5 mr-1.5" />
              Achievement Gallery
            </Badge>
            <h1
              className="text-4xl lg:text-5xl font-bold mb-4"
              data-testid="text-achievements-title"
            >
              Regional Achievement Badges
            </h1>
            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              data-testid="text-achievements-description"
            >
              Collect unique badges representing Azerbaijan's rich cultural heritage.
              Each region has its own symbol - earn them all to become a true explorer.
            </p>
          </div>

          {isAuthenticated && (
            <Card className="max-w-2xl mx-auto border-card-border" data-testid="card-progress">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3
                        className="font-semibold"
                        data-testid="text-progress-title"
                      >
                        Your Progress
                      </h3>
                      <p
                        className="text-sm text-muted-foreground"
                        data-testid="text-progress-count"
                      >
                        {earnedCount} of {totalAchievements} badges earned
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-2xl font-bold text-primary"
                      data-testid="text-progress-percentage"
                    >
                      {Math.round(progressPercentage)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Complete</div>
                  </div>
                </div>
                <Progress
                  value={progressPercentage}
                  className="h-3"
                  data-testid="progress-bar"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="regions" className="space-y-8">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
            <TabsTrigger value="regions" data-testid="tab-by-region">
              By Region
            </TabsTrigger>
            <TabsTrigger value="tiers" data-testid="tab-by-tier">
              By Tier
            </TabsTrigger>
          </TabsList>

          <TabsContent value="regions" className="space-y-10">
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
            ) : groupedByRegion ? (
              Object.entries(groupedByRegion).map(([regionId, regionAchievements]) => {
                const symbol = getRegionSymbol(regionId);
                const SymbolIcon = symbol.icon;
                return (
                  <div key={regionId} data-testid={`region-section-${regionId}`}>
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${symbol.bgGradient} flex items-center justify-center`}
                      >
                        <SymbolIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2
                          className="text-xl font-bold"
                          data-testid={`text-region-title-${regionId}`}
                        >
                          {getRegionName(regionId)}
                        </h2>
                        <p
                          className="text-sm text-muted-foreground"
                          data-testid={`text-region-count-${regionId}`}
                        >
                          {regionAchievements.filter((a) => earnedMap.has(a.id)).length} /{" "}
                          {regionAchievements.length} earned
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {regionAchievements.map((achievement) => (
                        <AchievementBadge
                          key={achievement.id}
                          achievement={achievement}
                          earned={earnedMap.has(achievement.id)}
                          earnedAt={earnedMap.get(achievement.id)}
                          progress={
                            earnedMap.has(achievement.id)
                              ? 100
                              : isAuthenticated
                              ? Math.random() * 80
                              : 0
                          }
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <Card className="p-12 text-center" data-testid="card-no-achievements">
                <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No achievements available</h3>
                <p className="text-muted-foreground">
                  Check back soon for new badges to earn!
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tiers" className="space-y-10">
            {achievementsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="p-4">
                    <div className="flex flex-col items-center space-y-3">
                      <Skeleton className="w-16 h-16 rounded-xl" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : groupedByTier ? (
              ["platinum", "gold", "silver", "bronze"].map((tier) => {
                const tierAchievements = groupedByTier[tier] || [];
                if (tierAchievements.length === 0) return null;

                const info = tierInfo[tier as keyof typeof tierInfo];
                const TierIcon = info.icon;

                return (
                  <div key={tier} data-testid={`tier-section-${tier}`}>
                    <div className="flex items-center gap-3 mb-6">
                      <TierIcon className={`h-7 w-7 ${info.color}`} />
                      <div>
                        <h2
                          className="text-xl font-bold capitalize"
                          data-testid={`text-tier-title-${tier}`}
                        >
                          {info.label} Tier
                        </h2>
                        <p
                          className="text-sm text-muted-foreground"
                          data-testid={`text-tier-count-${tier}`}
                        >
                          {tierAchievements.filter((a) => earnedMap.has(a.id)).length} /{" "}
                          {tierAchievements.length} earned
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {tierAchievements.map((achievement) => (
                        <AchievementBadge
                          key={achievement.id}
                          achievement={achievement}
                          earned={earnedMap.has(achievement.id)}
                          earnedAt={earnedMap.get(achievement.id)}
                          progress={
                            earnedMap.has(achievement.id)
                              ? 100
                              : isAuthenticated
                              ? Math.random() * 80
                              : 0
                          }
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : null}
          </TabsContent>
        </Tabs>

        {!isAuthenticated && (
          <Card
            className="mt-12 p-8 text-center bg-gradient-to-br from-primary/5 to-secondary/5"
            data-testid="card-signin-prompt"
          >
            <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3
              className="text-xl font-bold mb-2"
              data-testid="text-signin-title"
            >
              Sign In to Track Your Progress
            </h3>
            <p
              className="text-muted-foreground mb-6 max-w-md mx-auto"
              data-testid="text-signin-description"
            >
              Create an account to start earning badges and tracking your mountain
              adventures across Azerbaijan.
            </p>
            <button
              onClick={() => (window.location.href = "/api/login")}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              data-testid="button-signin-achievements"
            >
              <Star className="h-4 w-4" />
              Start Your Journey
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}
