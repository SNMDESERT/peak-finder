import {
  users,
  regions,
  trips,
  achievements,
  userAchievements,
  userTrips,
  reviews,
  tripInvitations,
  tripPhotos,
  type User,
  type UpsertUser,
  type Region,
  type InsertRegion,
  type Trip,
  type InsertTrip,
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement,
  type UserTrip,
  type InsertUserTrip,
  type Review,
  type InsertReview,
  type TripInvitation,
  type InsertTripInvitation,
  type TripPhoto,
  type InsertTripPhoto,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStats(userId: string, points: number, elevation: number): Promise<void>;

  // Region operations
  getRegions(): Promise<Region[]>;
  getRegion(id: string): Promise<Region | undefined>;
  createRegion(region: InsertRegion): Promise<Region>;

  // Trip operations
  getTrips(): Promise<Trip[]>;
  getFeaturedTrips(): Promise<Trip[]>;
  getTrip(id: string): Promise<Trip | undefined>;
  createTrip(trip: InsertTrip): Promise<Trip>;

  // Achievement operations
  getAchievements(): Promise<Achievement[]>;
  getAchievement(id: string): Promise<Achievement | undefined>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // User achievements
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  awardAchievement(data: InsertUserAchievement): Promise<UserAchievement>;

  // User trips
  getUserTrips(userId: string): Promise<(UserTrip & { trip?: Trip })[]>;
  bookTrip(data: InsertUserTrip): Promise<UserTrip>;
  completeTrip(id: string): Promise<UserTrip | undefined>;

  // Reviews
  getReviews(): Promise<(Review & { user?: Partial<User>; trip?: Partial<Trip> })[]>;
  createReview(review: InsertReview): Promise<Review>;
  incrementHelpful(id: string): Promise<void>;

  // Trip invitations
  createTripInvitation(invitation: InsertTripInvitation): Promise<TripInvitation>;
  getTripInvitation(inviteCode: string): Promise<(TripInvitation & { trip?: Trip; inviter?: Partial<User> }) | undefined>;
  acceptInvitation(inviteCode: string): Promise<TripInvitation | undefined>;
  getUserInvitations(userId: string): Promise<TripInvitation[]>;

  // Trip photos
  getTripPhotos(tripId: string): Promise<(TripPhoto & { user?: Partial<User> })[]>;
  createTripPhoto(photo: InsertTripPhoto): Promise<TripPhoto>;
  deleteTripPhoto(id: string, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStats(userId: string, points: number, elevation: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;

    const newPoints = (user.totalPoints || 0) + points;
    const newElevation = (user.totalElevation || 0) + elevation;
    const newTripsCompleted = (user.tripsCompleted || 0) + 1;
    const newLevel = Math.floor(newPoints / 500) + 1;

    await db
      .update(users)
      .set({
        totalPoints: newPoints,
        totalElevation: newElevation,
        tripsCompleted: newTripsCompleted,
        climbingLevel: newLevel,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  // Region operations
  async getRegions(): Promise<Region[]> {
    return db.select().from(regions);
  }

  async getRegion(id: string): Promise<Region | undefined> {
    const [region] = await db.select().from(regions).where(eq(regions.id, id));
    return region;
  }

  async createRegion(region: InsertRegion): Promise<Region> {
    const [created] = await db.insert(regions).values(region).returning();
    return created;
  }

  // Trip operations
  async getTrips(): Promise<Trip[]> {
    return db.select().from(trips).orderBy(desc(trips.createdAt));
  }

  async getFeaturedTrips(): Promise<Trip[]> {
    return db.select().from(trips).where(eq(trips.featured, true));
  }

  async getTrip(id: string): Promise<Trip | undefined> {
    const [trip] = await db.select().from(trips).where(eq(trips.id, id));
    return trip;
  }

  async createTrip(trip: InsertTrip): Promise<Trip> {
    const [created] = await db.insert(trips).values(trip).returning();
    return created;
  }

  // Achievement operations
  async getAchievements(): Promise<Achievement[]> {
    return db.select().from(achievements);
  }

  async getAchievement(id: string): Promise<Achievement | undefined> {
    const [achievement] = await db
      .select()
      .from(achievements)
      .where(eq(achievements.id, id));
    return achievement;
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [created] = await db.insert(achievements).values(achievement).returning();
    return created;
  }

  // User achievements
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
  }

  async awardAchievement(data: InsertUserAchievement): Promise<UserAchievement> {
    const [created] = await db.insert(userAchievements).values(data).returning();
    return created;
  }

  // User trips
  async getUserTrips(userId: string): Promise<(UserTrip & { trip?: Trip })[]> {
    const result = await db
      .select()
      .from(userTrips)
      .leftJoin(trips, eq(userTrips.tripId, trips.id))
      .where(eq(userTrips.userId, userId))
      .orderBy(desc(userTrips.createdAt));

    return result.map((row) => ({
      ...row.user_trips,
      trip: row.trips || undefined,
    }));
  }

  async bookTrip(data: InsertUserTrip): Promise<UserTrip> {
    const [created] = await db.insert(userTrips).values(data).returning();
    return created;
  }

  async completeTrip(id: string): Promise<UserTrip | undefined> {
    const [updated] = await db
      .update(userTrips)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(userTrips.id, id))
      .returning();
    return updated;
  }

  // Reviews
  async getReviews(): Promise<(Review & { user?: Partial<User>; trip?: Partial<Trip> })[]> {
    const result = await db
      .select()
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .leftJoin(trips, eq(reviews.tripId, trips.id))
      .orderBy(desc(reviews.createdAt));

    return result.map((row) => ({
      ...row.reviews,
      user: row.users
        ? {
            id: row.users.id,
            firstName: row.users.firstName,
            lastName: row.users.lastName,
            profileImageUrl: row.users.profileImageUrl,
            climbingLevel: row.users.climbingLevel,
          }
        : undefined,
      trip: row.trips
        ? {
            id: row.trips.id,
            title: row.trips.title,
            location: row.trips.location,
          }
        : undefined,
    }));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [created] = await db.insert(reviews).values(review).returning();
    return created;
  }

  async incrementHelpful(id: string): Promise<void> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    if (review) {
      await db
        .update(reviews)
        .set({ helpful: (review.helpful || 0) + 1 })
        .where(eq(reviews.id, id));
    }
  }

  // Trip invitations
  async createTripInvitation(invitation: InsertTripInvitation): Promise<TripInvitation> {
    const [created] = await db.insert(tripInvitations).values(invitation).returning();
    return created;
  }

  async getTripInvitation(inviteCode: string): Promise<(TripInvitation & { trip?: Trip; inviter?: Partial<User> }) | undefined> {
    const result = await db
      .select()
      .from(tripInvitations)
      .leftJoin(trips, eq(tripInvitations.tripId, trips.id))
      .leftJoin(users, eq(tripInvitations.inviterId, users.id))
      .where(eq(tripInvitations.inviteCode, inviteCode));

    if (result.length === 0) return undefined;

    const row = result[0];
    return {
      ...row.trip_invitations,
      trip: row.trips || undefined,
      inviter: row.users
        ? {
            id: row.users.id,
            firstName: row.users.firstName,
            lastName: row.users.lastName,
            profileImageUrl: row.users.profileImageUrl,
          }
        : undefined,
    };
  }

  async acceptInvitation(inviteCode: string): Promise<TripInvitation | undefined> {
    const [updated] = await db
      .update(tripInvitations)
      .set({ status: "accepted" })
      .where(eq(tripInvitations.inviteCode, inviteCode))
      .returning();
    return updated;
  }

  async getUserInvitations(userId: string): Promise<TripInvitation[]> {
    return db
      .select()
      .from(tripInvitations)
      .where(eq(tripInvitations.inviterId, userId))
      .orderBy(desc(tripInvitations.createdAt));
  }

  // Trip photos
  async getTripPhotos(tripId: string): Promise<(TripPhoto & { user?: Partial<User> })[]> {
    const result = await db
      .select()
      .from(tripPhotos)
      .leftJoin(users, eq(tripPhotos.userId, users.id))
      .where(eq(tripPhotos.tripId, tripId))
      .orderBy(desc(tripPhotos.createdAt));

    return result.map((row) => ({
      ...row.trip_photos,
      user: row.users
        ? {
            id: row.users.id,
            firstName: row.users.firstName,
            lastName: row.users.lastName,
            profileImageUrl: row.users.profileImageUrl,
          }
        : undefined,
    }));
  }

  async createTripPhoto(photo: InsertTripPhoto): Promise<TripPhoto> {
    const [created] = await db.insert(tripPhotos).values(photo).returning();
    return created;
  }

  async deleteTripPhoto(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(tripPhotos)
      .where(and(eq(tripPhotos.id, id), eq(tripPhotos.userId, userId)))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
