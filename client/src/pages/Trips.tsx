import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { TripCard } from "@/components/TripCard";
import type { Trip, Region } from "@shared/schema";
import { useTranslation } from "react-i18next";
import {
  Search,
  Filter,
  Mountain,
  Footprints,
  Tent,
  Camera,
  Compass,
  Binoculars,
  MapPin,
  Sun,
  Snowflake,
  Leaf,
  Flower2,
  Clock,
  X,
} from "lucide-react";

const parseDurationToHours = (duration: string | null): number | null => {
  if (!duration) return null;
  const lower = duration.toLowerCase();
  
  if (lower.includes("day")) {
    const match = lower.match(/(\d+)/);
    if (match) {
      return parseInt(match[1]) * 24;
    }
    return 24;
  }
  
  if (lower.includes("hour") || lower.includes("hr")) {
    const match = lower.match(/(\d+)/);
    if (match) return parseInt(match[1]);
  }
  
  return 8;
};

const getCurrentSeason = (): string => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
};

export default function Trips() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const activityTypes = [
    { value: "all", labelKey: "filters.allActivities", icon: Compass },
    { value: "climbing", labelKey: "activities.climbing", icon: Mountain },
    { value: "hiking", labelKey: "activities.hiking", icon: Footprints },
    { value: "camping", labelKey: "activities.camping", icon: Tent },
    { value: "photography", labelKey: "activities.photography", icon: Camera },
    { value: "cultural", labelKey: "activities.cultural", icon: Compass },
    { value: "wildlife", labelKey: "activities.wildlife", icon: Binoculars },
  ];

  const difficultyLevels = [
    { value: "all", labelKey: "filters.allLevels" },
    { value: "beginner", labelKey: "difficulty.beginner" },
    { value: "intermediate", labelKey: "difficulty.intermediate" },
    { value: "advanced", labelKey: "difficulty.advanced" },
    { value: "expert", labelKey: "difficulty.expert" },
  ];

  const seasons = [
    { value: "all", labelKey: "filters.allSeasons", icon: Compass },
    { value: "spring", labelKey: "seasons.spring", icon: Flower2 },
    { value: "summer", labelKey: "seasons.summer", icon: Sun },
    { value: "fall", labelKey: "seasons.fall", icon: Leaf },
    { value: "winter", labelKey: "seasons.winter", icon: Snowflake },
  ];

  const durationRanges = [
    { value: "all", labelKey: "filters.anyDuration" },
    { value: "short", labelKey: "duration.halfDay" },
    { value: "medium", labelKey: "duration.fullDay" },
    { value: "long", labelKey: "duration.multiDay" },
    { value: "extended", labelKey: "duration.extended" },
  ];

  const { data: trips, isLoading: tripsLoading } = useQuery<Trip[]>({
    queryKey: ["/api/trips"],
  });

  const { data: regions } = useQuery<Region[]>({
    queryKey: ["/api/regions"],
  });

  const maxPrice = trips?.reduce((max, trip) => {
    const price = trip.price ? Number(trip.price) : 0;
    return price > max ? price : max;
  }, 0) || 1000;

  useEffect(() => {
    if (trips && trips.length > 0) {
      const calculatedMax = trips.reduce((max, trip) => {
        const price = trip.price ? Number(trip.price) : 0;
        return price > max ? price : max;
      }, 0);
      if (calculatedMax > 0 && priceRange[1] === 1000) {
        setPriceRange([0, calculatedMax]);
      }
    }
  }, [trips]);

  const hasActiveFilters = 
    searchQuery !== "" ||
    selectedActivity !== "all" ||
    selectedDifficulty !== "all" ||
    selectedRegion !== "all" ||
    selectedSeason !== "all" ||
    selectedDuration !== "all" ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice;

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedActivity("all");
    setSelectedDifficulty("all");
    setSelectedRegion("all");
    setSelectedSeason("all");
    setSelectedDuration("all");
    setPriceRange([0, maxPrice]);
  };

  const filteredTrips = trips?.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesActivity =
      selectedActivity === "all" || trip.activityType === selectedActivity;

    const matchesDifficulty =
      selectedDifficulty === "all" || trip.difficulty === selectedDifficulty;

    const matchesRegion =
      selectedRegion === "all" || trip.regionId === selectedRegion;

    const matchesSeason = (() => {
      if (selectedSeason === "all") return true;
      if (!trip.bestSeasons || trip.bestSeasons.length === 0) return true;
      return trip.bestSeasons.includes(selectedSeason);
    })();

    const matchesDuration = (() => {
      if (selectedDuration === "all") return true;
      const hours = parseDurationToHours(trip.duration);
      
      if (hours === null) return true;
      
      switch (selectedDuration) {
        case "short": return hours < 4;
        case "medium": return hours >= 4 && hours <= 8;
        case "long": return hours > 8 && hours <= 72;
        case "extended": return hours > 72;
        default: return true;
      }
    })();

    const tripPrice = trip.price ? Number(trip.price) : 0;
    const matchesPrice = tripPrice >= priceRange[0] && tripPrice <= priceRange[1];

    return matchesSearch && matchesActivity && matchesDifficulty && matchesRegion && matchesSeason && matchesDuration && matchesPrice;
  });

  const getRegionName = (regionId: string | null) => {
    if (!regionId || !regions) return undefined;
    return regions.find((r) => r.id === regionId)?.name;
  };

  const getActivityLabel = (value: string) => {
    const activity = activityTypes.find(a => a.value === value);
    if (!activity) return value;
    if (value === "all") return t(`trips.${activity.labelKey}`);
    return t(`landing.${activity.labelKey}`);
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-12 bg-background">
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070')`,
          }}
        />
        <div className="absolute inset-0 hero-overlay" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 mb-6">
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            {t("trips.adventuresAvailable", "{{count}} Adventures Available", { count: trips?.length || 0 })}
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t("trips.pageTitle", "Mountain Trips & Adventures")}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {t("trips.pageDescription", "Discover unforgettable journeys through Azerbaijan's breathtaking landscapes. From summit climbs to cultural explorations.")}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <Card className="border-card-border shadow-lg">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("trips.searchPlaceholder")}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-trips"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                  <SelectTrigger className="w-[160px]" data-testid="select-activity">
                    <SelectValue placeholder={t("trips.filters.activity")} />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.value === "all" 
                            ? t(`trips.${type.labelKey}`)
                            : t(`landing.${type.labelKey}`)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-[160px]" data-testid="select-difficulty">
                    <SelectValue placeholder={t("trips.filters.difficulty")} />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.value === "all"
                          ? t(`trips.${level.labelKey}`)
                          : t(`trips.${level.labelKey}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-[160px]" data-testid="select-region">
                    <SelectValue placeholder={t("trips.filters.region")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("trips.filters.allRegions")}</SelectItem>
                    {regions?.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {t(`regions.${region.id}`, region.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant={showAdvancedFilters ? "secondary" : "outline"}
                  size="icon"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  data-testid="button-toggle-advanced-filters"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">{t("trips.quickFilters", "Quick filters")}:</span>
              {activityTypes.slice(1).map((type) => (
                <Button
                  key={type.value}
                  variant={selectedActivity === type.value ? "secondary" : "outline"}
                  size="sm"
                  className="gap-1.5"
                  onClick={() =>
                    setSelectedActivity(
                      selectedActivity === type.value ? "all" : type.value
                    )
                  }
                  data-testid={`filter-${type.value}`}
                >
                  <type.icon className="h-3.5 w-3.5" />
                  {t(`landing.${type.labelKey}`)}
                </Button>
              ))}
              
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-destructive hover:text-destructive"
                  onClick={clearAllFilters}
                  data-testid="button-clear-all-filters"
                >
                  <X className="h-3.5 w-3.5" />
                  {t("common.clearAll")}
                </Button>
              )}
            </div>

            {showAdvancedFilters && (
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                <div className="text-sm font-medium text-muted-foreground">{t("trips.advancedFilters")}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Sun className="h-4 w-4 text-primary" />
                      {t("trips.filters.season")}
                    </label>
                    <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                      <SelectTrigger data-testid="select-season">
                        <SelectValue placeholder={t("trips.filters.season")} />
                      </SelectTrigger>
                      <SelectContent>
                        {seasons.map((season) => (
                          <SelectItem key={season.value} value={season.value}>
                            <div className="flex items-center gap-2">
                              <season.icon className="h-4 w-4" />
                              {season.value === "all"
                                ? t(`trips.${season.labelKey}`)
                                : t(`trips.${season.labelKey}`)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      {t("trips.filters.duration")}
                    </label>
                    <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                      <SelectTrigger data-testid="select-duration">
                        <SelectValue placeholder={t("trips.filters.duration")} />
                      </SelectTrigger>
                      <SelectContent>
                        {durationRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.value === "all"
                              ? t(`trips.${range.labelKey}`)
                              : t(`trips.${range.labelKey}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium flex items-center justify-between">
                      <span>{t("trips.filters.priceRange")}</span>
                      <span className="text-muted-foreground">
                        ${priceRange[0]} - ${priceRange[1]}
                      </span>
                    </label>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={0}
                        max={maxPrice}
                        step={10}
                        className="w-full"
                        data-testid="slider-price-range"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">
              {selectedActivity !== "all"
                ? getActivityLabel(selectedActivity)
                : t("trips.allTrips")}
            </h2>
            <p className="text-muted-foreground">
              {t("trips.tripsFound", { count: filteredTrips?.length || 0 })}
            </p>
          </div>
        </div>

        {tripsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-[4/3]" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTrips && filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                regionName={getRegionName(trip.regionId)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("trips.noTrips")}</h3>
            <p className="text-muted-foreground mb-4">
              {t("trips.noTripsDescription")}
            </p>
            <Button
              variant="outline"
              onClick={clearAllFilters}
              data-testid="button-clear-filters"
            >
              {t("common.clearAll")}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
