import { db } from "./db";
import { regions, trips, achievements } from "@shared/schema";

const seedRegions = [
  {
    id: "karabakh",
    name: "Karabakh",
    symbol: "karabakh",
    symbolName: "Golden Horse",
    description: "The legendary Karabakh horse, known for its golden sheen, represents the region's proud equestrian heritage.",
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071",
  },
  {
    id: "nakhchivan",
    name: "Nakhchivan",
    symbol: "nakhchivan",
    symbolName: "Ancient Fortress",
    description: "Home to the Momine Khatun Mausoleum and ancient fortifications representing centuries of excellence.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2084",
  },
  {
    id: "shaki",
    name: "Shaki",
    symbol: "shaki",
    symbolName: "Silk Road Caravan",
    description: "A UNESCO World Heritage site on the historic Silk Road with magnificent Khan's Palace.",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070",
  },
  {
    id: "gabala",
    name: "Gabala",
    symbol: "gabala",
    symbolName: "Mountain Peak",
    description: "Azerbaijan's premier outdoor destination with stunning alpine scenery and adventure facilities.",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070",
  },
  {
    id: "ganja",
    name: "Ganja",
    symbol: "ganja",
    symbolName: "Carpet Pattern",
    description: "Famous for its vibrant carpet-weaving tradition, telling stories of artistic heritage.",
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070",
  },
  {
    id: "gobustan",
    name: "Gobustan",
    symbol: "gobustan",
    symbolName: "Petroglyphs",
    description: "Ancient rock carvings dating back 40,000 years, a UNESCO site of earliest artistic expressions.",
    imageUrl: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=2070",
  },
];

const seedTrips = [
  {
    title: "Shahdag Summit Expedition",
    description: "Conquer the majestic Shahdag peak, one of the highest mountains in Azerbaijan. Experience breathtaking views of the Greater Caucasus range.",
    regionId: "gabala",
    location: "Shahdag National Park, Gabala",
    difficulty: "advanced",
    activityType: "climbing",
    elevation: 4243,
    distance: "12.5",
    duration: "3 days",
    maxGroupSize: 8,
    price: "450",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070",
    featured: true,
    pointsReward: 500,
    bestSeasons: ["summer", "fall"],
  },
  {
    title: "Karabakh Heritage Trail",
    description: "Trek through the historic trails of Karabakh, visiting ancient monasteries and experiencing the legendary horse breeding traditions.",
    regionId: "karabakh",
    location: "Shusha Region, Karabakh",
    difficulty: "intermediate",
    activityType: "hiking",
    elevation: 1500,
    distance: "25",
    duration: "4 days",
    maxGroupSize: 12,
    price: "380",
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070",
    featured: true,
    pointsReward: 400,
    bestSeasons: ["spring", "summer", "fall"],
  },
  {
    title: "Gobustan Rock Art Discovery",
    description: "Explore the ancient petroglyphs and mud volcanoes of Gobustan, a UNESCO World Heritage site with 40,000 years of history.",
    regionId: "gobustan",
    location: "Gobustan National Park",
    difficulty: "beginner",
    activityType: "cultural",
    elevation: 400,
    distance: "8",
    duration: "1 day",
    maxGroupSize: 20,
    price: "95",
    imageUrl: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=2070",
    featured: true,
    pointsReward: 150,
    bestSeasons: ["spring", "summer", "fall", "winter"],
  },
  {
    title: "Shaki Silk Road Adventure",
    description: "Follow the ancient Silk Road through Shaki, visiting the stunning Khan's Palace and exploring mountain villages.",
    regionId: "shaki",
    location: "Shaki, Greater Caucasus",
    difficulty: "intermediate",
    activityType: "cultural",
    elevation: 2000,
    distance: "18",
    duration: "2 days",
    maxGroupSize: 15,
    price: "220",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070",
    featured: false,
    pointsReward: 250,
    bestSeasons: ["spring", "summer", "fall"],
  },
  {
    title: "Tufandag Ski & Summit",
    description: "Experience world-class skiing followed by a challenging summit attempt at Tufandag Mountain Resort.",
    regionId: "gabala",
    location: "Tufandag, Gabala",
    difficulty: "expert",
    activityType: "climbing",
    elevation: 3900,
    distance: "15",
    duration: "5 days",
    maxGroupSize: 6,
    price: "680",
    imageUrl: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2076",
    featured: false,
    pointsReward: 600,
    bestSeasons: ["winter"],
  },
  {
    title: "Nakhchivan Ancient Wonders",
    description: "Discover the sacred Ashabi-Kahf Cave and the magnificent Momine Khatun Mausoleum in this spiritual journey.",
    regionId: "nakhchivan",
    location: "Nakhchivan City",
    difficulty: "beginner",
    activityType: "cultural",
    elevation: 900,
    distance: "10",
    duration: "2 days",
    maxGroupSize: 18,
    price: "180",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2084",
    featured: false,
    pointsReward: 200,
    bestSeasons: ["spring", "fall"],
  },
  {
    title: "Ganja Mountain Photography Tour",
    description: "Capture the stunning landscapes around Azerbaijan's second-largest city. Perfect for photography enthusiasts.",
    regionId: "ganja",
    location: "Ganja Region",
    difficulty: "beginner",
    activityType: "photography",
    elevation: 1200,
    distance: "12",
    duration: "2 days",
    maxGroupSize: 10,
    price: "195",
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070",
    featured: false,
    pointsReward: 175,
    bestSeasons: ["spring", "summer", "fall"],
  },
  {
    title: "Caucasus Wildlife Safari",
    description: "Observe rare Caucasian wildlife including the endangered Caucasian leopard in their natural habitat.",
    regionId: "gabala",
    location: "Shahdag National Park",
    difficulty: "intermediate",
    activityType: "wildlife",
    elevation: 2500,
    distance: "20",
    duration: "3 days",
    maxGroupSize: 8,
    price: "350",
    imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2052",
    featured: false,
    pointsReward: 350,
    bestSeasons: ["spring", "summer"],
  },
  {
    title: "Alpine Camping Experience",
    description: "Camp under the stars in the heart of the Caucasus Mountains. Experience true wilderness camping.",
    regionId: "gabala",
    location: "Greater Caucasus Range",
    difficulty: "intermediate",
    activityType: "camping",
    elevation: 2800,
    distance: "15",
    duration: "2 nights",
    maxGroupSize: 10,
    price: "275",
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070",
    featured: false,
    pointsReward: 300,
    bestSeasons: ["summer", "fall"],
  },
  {
    title: "Khinalig Village Trek",
    description: "Trek to one of the highest and most ancient continuously inhabited settlements in Europe.",
    regionId: "gabala",
    location: "Khinalig, Quba",
    difficulty: "advanced",
    activityType: "hiking",
    elevation: 2350,
    distance: "22",
    duration: "3 days",
    maxGroupSize: 12,
    price: "320",
    imageUrl: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=2076",
    featured: true,
    pointsReward: 400,
    bestSeasons: ["summer", "fall"],
  },
];

const seedAchievements = [
  // Karabakh achievements
  {
    name: "Golden Horse Rider",
    description: "Complete your first trip in the Karabakh region",
    regionId: "karabakh",
    symbol: "karabakh",
    requiredLevel: 1,
    requiredTrips: 1,
    pointsRequired: 0,
    tier: "bronze",
  },
  {
    name: "Karabakh Explorer",
    description: "Complete 3 trips in the Karabakh region",
    regionId: "karabakh",
    symbol: "karabakh",
    requiredLevel: 3,
    requiredTrips: 3,
    pointsRequired: 500,
    tier: "silver",
  },
  {
    name: "Karabakh Master",
    description: "Complete 5 trips in Karabakh and earn 2000 points",
    regionId: "karabakh",
    symbol: "karabakh",
    requiredLevel: 5,
    requiredTrips: 5,
    pointsRequired: 2000,
    tier: "gold",
  },
  // Nakhchivan achievements
  {
    name: "Fortress Discoverer",
    description: "Complete your first trip in the Nakhchivan region",
    regionId: "nakhchivan",
    symbol: "nakhchivan",
    requiredLevel: 1,
    requiredTrips: 1,
    pointsRequired: 0,
    tier: "bronze",
  },
  {
    name: "Ancient Heritage Seeker",
    description: "Complete 3 trips in Nakhchivan",
    regionId: "nakhchivan",
    symbol: "nakhchivan",
    requiredLevel: 3,
    requiredTrips: 3,
    pointsRequired: 500,
    tier: "silver",
  },
  // Shaki achievements
  {
    name: "Silk Road Traveler",
    description: "Complete your first trip in the Shaki region",
    regionId: "shaki",
    symbol: "shaki",
    requiredLevel: 1,
    requiredTrips: 1,
    pointsRequired: 0,
    tier: "bronze",
  },
  {
    name: "Caravan Master",
    description: "Complete 3 trips along the Silk Road in Shaki",
    regionId: "shaki",
    symbol: "shaki",
    requiredLevel: 4,
    requiredTrips: 3,
    pointsRequired: 800,
    tier: "silver",
  },
  // Gabala achievements
  {
    name: "Peak Beginner",
    description: "Complete your first mountain trip in Gabala",
    regionId: "gabala",
    symbol: "gabala",
    requiredLevel: 1,
    requiredTrips: 1,
    pointsRequired: 0,
    tier: "bronze",
  },
  {
    name: "Summit Seeker",
    description: "Complete 5 climbing trips in Gabala",
    regionId: "gabala",
    symbol: "gabala",
    requiredLevel: 5,
    requiredTrips: 5,
    pointsRequired: 1500,
    tier: "silver",
  },
  {
    name: "Caucasus Champion",
    description: "Conquer all major peaks in Gabala region",
    regionId: "gabala",
    symbol: "gabala",
    requiredLevel: 8,
    requiredTrips: 10,
    pointsRequired: 5000,
    tier: "gold",
  },
  {
    name: "Mountain Legend",
    description: "Achieve master status in Gabala with 15 completed trips",
    regionId: "gabala",
    symbol: "gabala",
    requiredLevel: 10,
    requiredTrips: 15,
    pointsRequired: 10000,
    tier: "platinum",
  },
  // Ganja achievements
  {
    name: "Carpet Artist",
    description: "Complete your first cultural trip in Ganja",
    regionId: "ganja",
    symbol: "ganja",
    requiredLevel: 1,
    requiredTrips: 1,
    pointsRequired: 0,
    tier: "bronze",
  },
  {
    name: "Cultural Ambassador",
    description: "Complete 3 cultural experiences in Ganja",
    regionId: "ganja",
    symbol: "ganja",
    requiredLevel: 3,
    requiredTrips: 3,
    pointsRequired: 600,
    tier: "silver",
  },
  // Gobustan achievements
  {
    name: "Ancient Art Seeker",
    description: "Visit the Gobustan petroglyphs",
    regionId: "gobustan",
    symbol: "gobustan",
    requiredLevel: 1,
    requiredTrips: 1,
    pointsRequired: 0,
    tier: "bronze",
  },
  {
    name: "Petroglyph Expert",
    description: "Complete 3 explorations in Gobustan",
    regionId: "gobustan",
    symbol: "gobustan",
    requiredLevel: 3,
    requiredTrips: 3,
    pointsRequired: 500,
    tier: "silver",
  },
  {
    name: "History Guardian",
    description: "Master the ancient history of Gobustan",
    regionId: "gobustan",
    symbol: "gobustan",
    requiredLevel: 6,
    requiredTrips: 5,
    pointsRequired: 2000,
    tier: "gold",
  },
  // General achievements
  {
    name: "First Steps",
    description: "Complete your very first mountain adventure",
    regionId: null,
    symbol: "general",
    requiredLevel: 1,
    requiredTrips: 1,
    pointsRequired: 0,
    tier: "bronze",
  },
  {
    name: "Rising Adventurer",
    description: "Reach Level 5 and explore multiple regions",
    regionId: null,
    symbol: "general",
    requiredLevel: 5,
    requiredTrips: 5,
    pointsRequired: 1000,
    tier: "silver",
  },
  {
    name: "Azerbaijan Explorer",
    description: "Visit all 6 regions of Azerbaijan",
    regionId: null,
    symbol: "general",
    requiredLevel: 8,
    requiredTrips: 10,
    pointsRequired: 3000,
    tier: "gold",
  },
  {
    name: "Grand Master Explorer",
    description: "Achieve legendary status with maximum points",
    regionId: null,
    symbol: "general",
    requiredLevel: 10,
    requiredTrips: 20,
    pointsRequired: 10000,
    tier: "platinum",
  },
];

async function seed() {
  console.log("Starting database seed...");

  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await db.delete(achievements);
    await db.delete(trips);
    await db.delete(regions);

    // Seed regions
    console.log("Seeding regions...");
    for (const region of seedRegions) {
      await db.insert(regions).values(region);
    }
    console.log(`Seeded ${seedRegions.length} regions`);

    // Seed trips
    console.log("Seeding trips...");
    for (const trip of seedTrips) {
      await db.insert(trips).values(trip);
    }
    console.log(`Seeded ${seedTrips.length} trips`);

    // Seed achievements
    console.log("Seeding achievements...");
    for (const achievement of seedAchievements) {
      await db.insert(achievements).values(achievement);
    }
    console.log(`Seeded ${seedAchievements.length} achievements`);

    console.log("Database seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
