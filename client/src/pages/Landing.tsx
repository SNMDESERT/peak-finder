import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { getRegionSymbol, regionSymbols } from "@/lib/regionSymbols";
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

const featuredRegions = [
  {
    key: "karabakh",
    name: "Karabakh",
    description: "Home of the legendary Karabakh horses and Shusha's peaks",
  },
  {
    key: "nakhchivan",
    name: "Nakhchivan",
    description: "Sacred mountains and historic Momine Khatun mausoleum",
  },
  {
    key: "shaki",
    name: "Shaki",
    description: "UNESCO heritage and the majestic Caucasus foothills",
  },
  {
    key: "gabala",
    name: "Gabala",
    description: "Premier outdoor resort with stunning alpine scenery",
  },
  {
    key: "ganja",
    name: "Ganja",
    description: "Ancient city with vibrant culture and nearby trails",
  },
  {
    key: "gobustan",
    name: "Gobustan",
    description: "Ancient rock art and mystical mud volcanoes",
  },
];

const activities = [
  { icon: Mountain, label: "Climbing", count: "25+ routes" },
  { icon: Footprints, label: "Hiking", count: "40+ trails" },
  { icon: Tent, label: "Camping", count: "15+ sites" },
  { icon: Camera, label: "Photography", count: "30+ spots" },
  { icon: Compass, label: "Cultural Tours", count: "20+ tours" },
  { icon: Binoculars, label: "Wildlife", count: "10+ experiences" },
];

const stats = [
  { value: "Early Access", label: "Live Now" },
  { value: "6", label: "Regions Available" },
  { value: "50+", label: "Badges Ready" },
  { value: "Be the First", label: "Explorers Joining" },
];

export default function Landing() {
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
            Azerbaijan's First Mountain Tourism App
          </Badge>

          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
            data-testid="text-hero-title"
          >
            Conquer the Peaks of
            <span className="block mt-2 bg-gradient-to-r from-secondary via-yellow-400 to-primary bg-clip-text text-transparent">
              Azerbaijan
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed"
            data-testid="text-hero-description"
          >
            Embark on unforgettable mountain adventures across Azerbaijan's
            stunning landscapes. Earn unique regional achievement badges as you
            explore the majestic Caucasus peaks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/trips">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-8 gap-2"
                data-testid="button-hero-explore-trips"
              >
                <Compass className="h-5 w-5" />
                Explore Trips
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
                View Achievements
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
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
              Mountain Activities
            </Badge>
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              data-testid="text-activities-title"
            >
              Choose Your Adventure
            </h2>
            <p
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
              data-testid="text-activities-description"
            >
              From challenging summit climbs to serene cultural explorations,
              find the perfect mountain experience for your skill level.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {activities.map((activity, index) => (
              <Card
                key={index}
                className="group hover-elevate cursor-pointer border-card-border"
                data-testid={`card-activity-${activity.label.toLowerCase()}`}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <activity.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3
                    className="font-semibold text-sm mb-1"
                    data-testid={`text-activity-name-${index}`}
                  >
                    {activity.label}
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
              Achievement System
            </Badge>
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              data-testid="text-badges-title"
            >
              Collect Regional Badges
            </h2>
            <p
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
              data-testid="text-badges-description"
            >
              Each region of Azerbaijan has its own unique cultural symbol.
              Complete trips and challenges to earn exclusive achievement badges
              representing the heritage of each area.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRegions.map((region, index) => {
              const symbol = getRegionSymbol(region.key);
              const SymbolIcon = symbol.icon;
              return (
                <Card
                  key={index}
                  className="group overflow-visible card-hover border-card-border"
                  data-testid={`card-region-${region.key}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${symbol.bgGradient} flex items-center justify-center shadow-lg flex-shrink-0`}
                        data-testid={`icon-region-${region.key}`}
                      >
                        <SymbolIcon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-lg mb-1"
                          data-testid={`text-region-name-${region.key}`}
                        >
                          {region.name}
                        </h3>
                        <p
                          className="text-sm text-secondary font-medium mb-2"
                          data-testid={`text-region-symbol-${region.key}`}
                        >
                          {symbol.symbolName}
                        </p>
                        <p
                          className="text-sm text-muted-foreground line-clamp-2"
                          data-testid={`text-region-description-${region.key}`}
                        >
                          {region.description}
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
                View All Achievements
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
                Climbing Levels
              </Badge>
              <h2
                className="text-3xl lg:text-4xl font-bold mb-6"
                data-testid="text-levels-title"
              >
                Level Up Your Journey
              </h2>
              <p
                className="text-muted-foreground text-lg mb-8 leading-relaxed"
                data-testid="text-levels-description"
              >
                Every trip you complete, every summit you conquer, and every
                challenge you overcome earns you points. As you progress, unlock
                new levels and exclusive rewards tied to Azerbaijan's rich
                cultural heritage.
              </p>

              <div className="space-y-4">
                {[
                  { level: 1, name: "Novice Explorer", points: "0 - 500 pts" },
                  {
                    level: 5,
                    name: "Trail Master",
                    points: "2,000 - 5,000 pts",
                  },
                  { level: 10, name: "Summit Champion", points: "10,000+ pts" },
                ].map((tier, index) => (
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
                        {tier.name}
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
                  Start Your Journey
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
                      This month
                    </div>
                    <div className="font-bold text-lg">
                      +2,450 points earned
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
            Ready to Explore Azerbaijan's Mountains?
          </h2>
          <p
            className="text-lg text-white/90 mb-10 max-w-2xl mx-auto"
            data-testid="text-cta-description"
          >
            Join thousands of adventurers discovering the beauty of the
            Caucasus. Sign up today and start earning your first achievement
            badge.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto text-lg px-8 gap-2"
              onClick={() => (window.location.href = "/api/login")}
              data-testid="button-get-started"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 border-white/30 text-white hover:bg-white/10 bg-white/5"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
