import { useState } from "react";
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
import { TripCard } from "@/components/TripCard";
import type { Trip, Region } from "@shared/schema";
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
} from "lucide-react";

const activityTypes = [
  { value: "all", label: "All Activities", icon: Compass },
  { value: "climbing", label: "Climbing", icon: Mountain },
  { value: "hiking", label: "Hiking", icon: Footprints },
  { value: "camping", label: "Camping", icon: Tent },
  { value: "photography", label: "Photography", icon: Camera },
  { value: "cultural", label: "Cultural Tours", icon: Compass },
  { value: "wildlife", label: "Wildlife", icon: Binoculars },
];

const difficultyLevels = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

export default function Trips() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const { data: trips, isLoading: tripsLoading } = useQuery<Trip[]>({
    queryKey: ["/api/trips"],
  });

  const { data: regions } = useQuery<Region[]>({
    queryKey: ["/api/regions"],
  });

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

    return matchesSearch && matchesActivity && matchesDifficulty && matchesRegion;
  });

  const getRegionName = (regionId: string | null) => {
    if (!regionId || !regions) return undefined;
    return regions.find((r) => r.id === regionId)?.name;
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
            {trips?.length || 0} Adventures Available
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Mountain Trips & Adventures
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Discover unforgettable journeys through Azerbaijan's breathtaking
            landscapes. From summit climbs to cultural explorations.
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
                  placeholder="Search trips by name, location..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-trips"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                  <SelectTrigger className="w-[160px]" data-testid="select-activity">
                    <SelectValue placeholder="Activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-[160px]" data-testid="select-difficulty">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-[160px]" data-testid="select-region">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions?.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">Quick filters:</span>
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
                  {type.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">
              {selectedActivity !== "all"
                ? activityTypes.find((t) => t.value === selectedActivity)?.label
                : "All Trips"}
            </h2>
            <p className="text-muted-foreground">
              {filteredTrips?.length || 0} trips found
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
            <h3 className="text-lg font-semibold mb-2">No trips found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedActivity("all");
                setSelectedDifficulty("all");
                setSelectedRegion("all");
              }}
              data-testid="button-clear-filters"
            >
              Clear All Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
