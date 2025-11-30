import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { getRegionSymbol } from "@/lib/regionSymbols";
import { useTranslation } from "react-i18next";
import {
  Mountain,
  Heart,
  Shield,
  Users,
  Award,
  MapPin,
  Compass,
  Target,
  Leaf,
} from "lucide-react";

const valueKeys = [
  { key: "safety", icon: Shield },
  { key: "culture", icon: Heart },
  { key: "community", icon: Users },
  { key: "sustainability", icon: Leaf },
];

const regionKeys = [
  "karabakh",
  "nakhchivan",
  "shaki",
  "gabala",
  "ganja",
  "gobustan",
];

export default function About() {
  const { t } = useTranslation();

  const stats = [
    { value: t("about.stats.earlyAccess", "Early Access"), label: t("about.stats.liveNow", "Live Now") },
    { value: t("about.stats.beFirst", "Be the First"), label: t("about.stats.explorersJoining", "Explorers Joining") },
    { value: "6", label: t("about.stats.regionsAvailable", "Regions Available") },
    { value: "50+", label: t("about.stats.badgesReady", "Badges Ready") },
  ];

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-12 bg-background">
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2076')`,
          }}
        />
        <div className="absolute inset-0 hero-overlay" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Badge
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 mb-6"
            data-testid="badge-about-story"
          >
            <Mountain className="h-3.5 w-3.5 mr-1.5" />
            {t("about.story.badge", "Our Story")}
          </Badge>
          <h1
            className="text-4xl lg:text-6xl font-bold mb-6"
            data-testid="text-about-title"
          >
            {t("about.story.title", "Connecting Adventurers with")}
            <span className="block mt-2">{t("about.story.titleHighlight", "Azerbaijan's Mountains")}</span>
          </h1>
          <p
            className="text-lg lg:text-xl text-white/90 max-w-3xl mx-auto"
            data-testid="text-about-subtitle"
          >
            {t("about.story.subtitle", "We're on a mission to make Azerbaijan's breathtaking mountain landscapes accessible to explorers worldwide, while celebrating the rich cultural heritage of each unique region.")}
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="secondary" data-testid="badge-mission">
                <Target className="h-3.5 w-3.5 mr-1.5" />
                {t("about.mission.badge", "Our Mission")}
              </Badge>
              <h2
                className="text-3xl lg:text-4xl font-bold mb-6"
                data-testid="text-mission-title"
              >
                {t("about.mission.title", "Elevating Mountain Tourism in Azerbaijan")}
              </h2>
              <p
                className="text-muted-foreground text-lg mb-6 leading-relaxed"
                data-testid="text-mission-p1"
              >
                {t("about.mission.p1", "Peak Finder was founded with a simple yet powerful vision: to transform how people experience Azerbaijan's magnificent mountain landscapes. We believe that every summit conquered and every trail explored should be celebrated.")}
              </p>
              <p
                className="text-muted-foreground text-lg mb-6 leading-relaxed"
                data-testid="text-mission-p2"
              >
                {t("about.mission.p2", "Our innovative achievement system rewards your adventures with authentic regional symbols, connecting you with the cultural heritage of each area you explore. From the legendary Karabakh horses to the ancient petroglyphs of Gobustan, every badge tells a story.")}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-lg bg-muted/50"
                    data-testid={`about-stat-${index}`}
                  >
                    <div
                      className="text-2xl font-bold text-primary"
                      data-testid={`about-stat-value-${index}`}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-sm text-muted-foreground"
                      data-testid={`about-stat-label-${index}`}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=2070"
                  alt="Mountain landscape"
                  className="w-full h-full object-cover"
                  data-testid="img-about-mountain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge className="mb-4" variant="secondary" data-testid="badge-values">
              {t("about.values.badge", "Our Values")}
            </Badge>
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              data-testid="text-values-title"
            >
              {t("about.values.title", "What Drives Us Forward")}
            </h2>
            <p
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
              data-testid="text-values-description"
            >
              {t("about.values.description", "Our core values shape every trip we curate and every experience we create for our community.")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueKeys.map((value, index) => (
              <Card
                key={index}
                className="text-center border-card-border card-hover"
                data-testid={`card-value-${index}`}
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3
                    className="font-semibold text-lg mb-2"
                    data-testid={`value-title-${index}`}
                  >
                    {t(`about.values.${value.key}`, value.key)}
                  </h3>
                  <p
                    className="text-sm text-muted-foreground"
                    data-testid={`value-description-${index}`}
                  >
                    {t(`about.values.${value.key}Desc`, "")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge className="mb-4" variant="secondary" data-testid="badge-symbols">
              <Award className="h-3.5 w-3.5 mr-1.5" />
              {t("about.symbols.badge", "Regional Symbols")}
            </Badge>
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              data-testid="text-symbols-title"
            >
              {t("about.symbols.title", "The Heart of Our Achievement System")}
            </h2>
            <p
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
              data-testid="text-symbols-description"
            >
              {t("about.symbols.description", "Each region of Azerbaijan has its own unique cultural symbol that represents centuries of heritage, tradition, and natural beauty.")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regionKeys.map((regionKey, index) => {
              const symbol = getRegionSymbol(regionKey);
              const SymbolIcon = symbol.icon;
              return (
                <Card
                  key={index}
                  className="overflow-visible border-card-border"
                  data-testid={`card-about-region-${regionKey}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${symbol.bgGradient} flex items-center justify-center shadow-lg flex-shrink-0`}
                        data-testid={`icon-about-region-${regionKey}`}
                      >
                        <SymbolIcon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-lg mb-1"
                          data-testid={`text-about-region-name-${regionKey}`}
                        >
                          {t(`regions.${regionKey}`, regionKey)}
                        </h3>
                        <p
                          className="text-sm text-secondary font-medium mb-3"
                          data-testid={`text-about-region-symbol-${regionKey}`}
                        >
                          {symbol.symbolName}
                        </p>
                        <p
                          className="text-sm text-muted-foreground"
                          data-testid={`text-about-region-description-${regionKey}`}
                        >
                          {t(`about.regions.${regionKey}`, "")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Compass className="h-12 w-12 mx-auto mb-6 opacity-90" />
          <h2
            className="text-3xl lg:text-4xl font-bold mb-6"
            data-testid="text-about-cta-title"
          >
            {t("about.cta.title", "Ready to Start Your Journey?")}
          </h2>
          <p
            className="text-lg text-white/90 mb-10 max-w-2xl mx-auto"
            data-testid="text-about-cta-description"
          >
            {t("about.cta.description", "Join our community of adventurers and discover the magic of Azerbaijan's mountains. Your first achievement badge awaits.")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/trips">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto text-lg px-8 gap-2"
                data-testid="button-about-explore"
              >
                <MapPin className="h-5 w-5" />
                {t("about.cta.exploreTrips", "Explore Trips")}
              </Button>
            </Link>
            <Link href="/achievements">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 border-white/30 text-white hover:bg-white/10 bg-white/5"
                data-testid="button-about-achievements"
              >
                <Award className="h-5 w-5 mr-2" />
                {t("about.cta.viewAchievements", "View Achievements")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
