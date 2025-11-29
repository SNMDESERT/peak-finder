import { sql, relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  climbingLevel: integer("climbing_level").default(1),
  totalElevation: integer("total_elevation").default(0),
  tripsCompleted: integer("trips_completed").default(0),
  totalPoints: integer("total_points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Azerbaijan regions with their cultural symbols
export const regions = pgTable("regions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  symbol: varchar("symbol").notNull(),
  symbolName: varchar("symbol_name").notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"),
});

// Mountain trips
export const trips = pgTable("trips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  regionId: varchar("region_id").references(() => regions.id),
  location: varchar("location").notNull(),
  difficulty: varchar("difficulty").notNull(), // beginner, intermediate, advanced, expert
  activityType: varchar("activity_type").notNull(), // climbing, hiking, camping, photography, cultural, wildlife
  elevation: integer("elevation"),
  distance: decimal("distance"),
  duration: varchar("duration"),
  maxGroupSize: integer("max_group_size"),
  price: decimal("price"),
  imageUrl: varchar("image_url"),
  featured: boolean("featured").default(false),
  pointsReward: integer("points_reward").default(100),
  createdAt: timestamp("created_at").defaultNow(),
});

// Achievement badges based on regional symbols
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  regionId: varchar("region_id").references(() => regions.id),
  symbol: varchar("symbol").notNull(),
  requiredLevel: integer("required_level").default(1),
  requiredTrips: integer("required_trips").default(1),
  pointsRequired: integer("points_required").default(0),
  imageUrl: varchar("image_url"),
  tier: varchar("tier").default("bronze"), // bronze, silver, gold, platinum
});

// User achievements (earned badges)
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  achievementId: varchar("achievement_id").references(() => achievements.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// User trip bookings/completions
export const userTrips = pgTable("user_trips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  tripId: varchar("trip_id").references(() => trips.id).notNull(),
  status: varchar("status").default("booked"), // booked, completed, cancelled
  bookingDate: timestamp("booking_date"),
  groupSize: integer("group_size").default(1),
  participantNames: text("participant_names"),
  specialRequests: text("special_requests"),
  contactPhone: varchar("contact_phone"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews/Feedback
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  tripId: varchar("trip_id").references(() => trips.id),
  rating: integer("rating").notNull(),
  title: varchar("title"),
  content: text("content"),
  activityType: varchar("activity_type"),
  helpful: integer("helpful").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Trip invitations for social sharing
export const tripInvitations = pgTable("trip_invitations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tripId: varchar("trip_id").references(() => trips.id).notNull(),
  inviterId: varchar("inviter_id").references(() => users.id).notNull(),
  inviteCode: varchar("invite_code").unique().notNull(),
  inviteeEmail: varchar("invitee_email"),
  status: varchar("status").default("pending"), // pending, accepted, expired
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Trip photos uploaded by users
export const tripPhotos = pgTable("trip_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tripId: varchar("trip_id").references(() => trips.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  reviewId: varchar("review_id").references(() => reviews.id),
  imageUrl: varchar("image_url").notNull(),
  caption: text("caption"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userAchievements: many(userAchievements),
  userTrips: many(userTrips),
  reviews: many(reviews),
}));

export const regionsRelations = relations(regions, ({ many }) => ({
  trips: many(trips),
  achievements: many(achievements),
}));

export const tripsRelations = relations(trips, ({ one, many }) => ({
  region: one(regions, {
    fields: [trips.regionId],
    references: [regions.id],
  }),
  userTrips: many(userTrips),
  reviews: many(reviews),
}));

export const achievementsRelations = relations(achievements, ({ one, many }) => ({
  region: one(regions, {
    fields: [achievements.regionId],
    references: [regions.id],
  }),
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const userTripsRelations = relations(userTrips, ({ one }) => ({
  user: one(users, {
    fields: [userTrips.userId],
    references: [users.id],
  }),
  trip: one(trips, {
    fields: [userTrips.tripId],
    references: [trips.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  trip: one(trips, {
    fields: [reviews.tripId],
    references: [trips.id],
  }),
}));

export const tripInvitationsRelations = relations(tripInvitations, ({ one }) => ({
  trip: one(trips, {
    fields: [tripInvitations.tripId],
    references: [trips.id],
  }),
  inviter: one(users, {
    fields: [tripInvitations.inviterId],
    references: [users.id],
  }),
}));

export const tripPhotosRelations = relations(tripPhotos, ({ one }) => ({
  trip: one(trips, {
    fields: [tripPhotos.tripId],
    references: [trips.id],
  }),
  user: one(users, {
    fields: [tripPhotos.userId],
    references: [users.id],
  }),
  review: one(reviews, {
    fields: [tripPhotos.reviewId],
    references: [reviews.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRegionSchema = createInsertSchema(regions).omit({ id: true });
export const insertTripSchema = createInsertSchema(trips).omit({ id: true, createdAt: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true });
export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({ id: true, earnedAt: true });
export const insertUserTripSchema = createInsertSchema(userTrips).omit({ id: true, createdAt: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true, helpful: true });
export const insertTripInvitationSchema = createInsertSchema(tripInvitations).omit({ id: true, createdAt: true });
export const insertTripPhotoSchema = createInsertSchema(tripPhotos).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Region = typeof regions.$inferSelect;
export type InsertRegion = z.infer<typeof insertRegionSchema>;

export type Trip = typeof trips.$inferSelect;
export type InsertTrip = z.infer<typeof insertTripSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

export type UserTrip = typeof userTrips.$inferSelect;
export type InsertUserTrip = z.infer<typeof insertUserTripSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type TripInvitation = typeof tripInvitations.$inferSelect;
export type InsertTripInvitation = z.infer<typeof insertTripInvitationSchema>;

export type TripPhoto = typeof tripPhotos.$inferSelect;
export type InsertTripPhoto = z.infer<typeof insertTripPhotoSchema>;
