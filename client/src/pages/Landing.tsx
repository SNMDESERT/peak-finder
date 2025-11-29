import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { getRegionSymbol, regionSymbols } from "@/lib/regionSymbols";
import { useTranslation } from "react-i18next";
import {
  Mountain,
  Award,
  Users,
  MapPin,
  ArrowRight,
  Star,
  Compass,
  Camera,
  Tent,
  Footprints,
  Binoculars,
  ChevronRight,
  Zap,
  Castle,
  Ship,
  Palette,
  Gem,
} from "lucide-react";

const featuredRegionKeys = [
  "karabakh",
  "nakhchivan",
  "shaki",
  "gabala",
  "ganja",
  "gobustan",
];

const activityIcons = {
  climbing: Mountain,
  hiking: Footprints,
  camping: Tent,
  photography: Camera,
  cultural: Compass,
  wildlife: Binoculars,
};

export default function Landing() {
  const { t } = useTranslation();

  const activities = [
    { key: "climbing", icon: Mountain, count: "25+ routes" },
    { key: "hiking", icon: Footprints, count: "40+ trails" },
    { key: "camping", icon: Tent, count: "15+ sites" },
    { key: "photography", icon: Camera, count: "30+ spots" },
    { key: "cultural", icon: Compass, count: "20+ tours" },
    { key: "wildlife", icon: Binoculars, count: "10+ experiences" },
  ];

  const stats = [
    { value: "Early Access", labelKey: "stats.liveNow" },
    { value: "6", labelKey: "stats.regionsAvailable" },
    { value: "50+", labelKey: "stats.badgesReady" },
    { value: t("landing.stats.beFirst", "Be the First"), labelKey: "stats.explorersJoining" },
  ];

  const levels = [
    { level: 1, nameKey: "levels.novice", points: "0 - 500 pts" },
    { level: 5, nameKey: "levels.trailMaster", points: "2,000 - 5,000 pts" },
    { level: 10, nameKey: "levels.champion", points: "10,000+ pts" },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070')`,
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <Badge
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 mb-6 px-4 py-1.5"
            data-testid="badge-hero-rating"
          >
            <Mountain className="h-3.5 w-3.5 mr-1.5" />
            {t("landing.badge")}
          </Badge>

          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
            data-testid="text-hero-title"
          >
            {t("landing.title")}
            <span className="block mt-2 bg-gradient-to-r from-secondary via-yellow-400 to-primary bg-clip-text text-transparent">
              {t("landing.titleHighlight")}
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed"
            data-testid="text-hero-description"
          >
            {t("landing.description")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/trips">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-8 gap-2"
                data-testid="button-hero-explore-trips"
              >
                <Compass className="h-5 w-5" />
                {t("landing.exploreTrips")}
              </Button>
            </Link>
            <Link href="/achievements">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 gap-2 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                data-testid="button-hero-view-achievements"
              >
                <Award className="h-5 w-5" />
                {t("landing.viewAchievements")}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: "Early Access", label: t("landing.stats.liveNow", "Live Now") },
              { value: "6", label: t("landing.stats.regionsAvailable", "Regions Available") },
              { value: "50+", label: t("landing.stats.badgesReady", "Badges Ready") },
              { value: t("landing.stats.beFirst", "Be the First"), label: t("landing.stats.explorersJoining", "Explorers Joining") },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                data-testid={`stat-card-${index}`}
              >
                <div
                  className="text-2xl sm:text-3xl font-bold text-white"
                  data-testid={`stat-value-${index}`}
                >
                  {stat.value}
                </div>
                <div
                  className="text-sm text-white/80"
                  data-testid={`stat-label-${index}`}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="h-8 w-8 text-white/60 rotate-90" />
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge
              className="mb-4"
              variant="secondary"
              data-testid="badge-activities"
            >
              {t("landing.activities.badge", "Mountain Activities")}
            </Badge>
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              data-testid="text-activities-title"
            >
              {t("landing.activities.title")}
            </h2>
            <p
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
              data-testid="text-activities-description"
            >
              {t("landing.activities.description")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {activities.map((activity, index) => (
              <Card
                key={index}
                className="group hover-elevate cursor-pointer border-card-border"
                data-testid={`card-activity-${activity.key}`}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <activity.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3
                    className="font-semibold text-sm mb-1"
                    data-testid={`text-activity-name-${index}`}
                  >
                    {t(`landing.activities.${activity.key}`)}
                  </h3>
                  <p
                    className="text-xs text-muted-foreground"
                    data-testid={`text-activity-count-${index}`}
                  >
                    {activity.count}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge
              className="mb-4"
              variant="secondary"
              data-testid="badge-achievements-section"
            >
              {t("landing.achievements.badge", "Achievement System")}
            </Badge>
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              data-testid="text-badges-title"
            >
              {t("landing.achievements.title")}
            </h2>
            <p
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
              data-testid="text-badges-description"
            >
              {t("landing.achievements.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRegionKeys.map((regionKey, index) => {
              const symbol = getRegionSymbol(regionKey);
              const SymbolIcon = symbol.icon;
              return (
                <Card
                  key={index}
                  className="group overflow-visible card-hover border-card-border"
                  data-testid={`card-region-${regionKey}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${symbol.bgGradient} flex items-center justify-center shadow-lg flex-shrink-0`}
                        data-testid={`icon-region-${regionKey}`}
                      >
                        <SymbolIcon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-lg mb-1"
                          data-testid={`text-region-name-${regionKey}`}
                        >
                          {t(`regions.${regionKey}`)}
                        </h3>
                        <p
                          className="text-sm text-secondary font-medium mb-2"
                          data-testid={`text-region-symbol-${regionKey}`}
                        >
                          {symbol.symbolName}
                        </p>
                        <p
                          className="text-sm text-muted-foreground line-clamp-2"
                          data-testid={`text-region-description-${regionKey}`}
                        >
                          {t(`landing.regionDescriptions.${regionKey}`)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/achievements">
              <Button
                variant="outline"
                className="gap-2"
                data-testid="button-all-achievements"
              >
                {t("landing.achievements.viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge
                className="mb-4"
                variant="secondary"
                data-testid="badge-levels"
              >
                {t("landing.levels.badge")}
              </Badge>
              <h2
                className="text-3xl lg:text-4xl font-bold mb-6"
                data-testid="text-levels-title"
              >
                {t("landing.levels.title")}
              </h2>
              <p
                className="text-muted-foreground text-lg mb-8 leading-relaxed"
                data-testid="text-levels-description"
              >
                {t("landing.levels.description")}
              </p>

              <div className="space-y-4">
                {levels.map((tier, index) => (
                  <div
                    key={tier.level}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                    data-testid={`tier-card-${tier.level}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">
                        Lvl {tier.level}
                      </span>
                    </div>
                    <div>
                      <div
                        className="font-semibold"
                        data-testid={`tier-name-${tier.level}`}
                      >
                        {t(`landing.${tier.nameKey}`)}
                      </div>
                      <div
                        className="text-sm text-muted-foreground"
                        data-testid={`tier-points-${tier.level}`}
                      >
                        {tier.points}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  onClick={() => (window.location.href = "/api/login")}
                  className="gap-2"
                  data-testid="button-start-journey"
                >
                  <Users className="h-4 w-4" />
                  {t("landing.levels.startJourney")}
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070"
                  alt="Mountain climber on summit"
                  className="w-full h-full object-cover"
                  data-testid="img-climber"
                />
              </div>
              <div
                className="absolute -bottom-6 -left-6 bg-card border border-border rounded-xl p-4 shadow-xl"
                data-testid="card-points-earned"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t("landing.thisMonth", "This month")}
                    </div>
                    <div className="font-bold text-lg">
                      {t("landing.pointsEarned", "+2,450 points earned")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl lg:text-4xl font-bold mb-6"
            data-testid="text-cta-title"
          >
            {t("landing.cta.title")}
          </h2>
          <p
            className="text-lg text-white/90 mb-10 max-w-2xl mx-auto"
            data-testid="text-cta-description"
          >
            {t("landing.cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto text-lg px-8 gap-2"
              onClick={() => (window.location.href = "/api/login")}
              data-testid="button-get-started"
            >
              {t("common.getStarted")}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 border-white/30 text-white hover:bg-white/10 bg-white/5"
                data-testid="button-learn-more"
              >
                {t("common.learnMore")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
