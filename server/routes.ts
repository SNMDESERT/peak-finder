import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertReviewSchema, insertUserTripSchema, insertTripInvitationSchema } from "@shared/schema";
import { z } from "zod";
import crypto from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Region routes
  app.get("/api/regions", async (req, res) => {
    try {
      const regions = await storage.getRegions();
      res.json(regions);
    } catch (error) {
      console.error("Error fetching regions:", error);
      res.status(500).json({ message: "Failed to fetch regions" });
    }
  });

  // Trip routes
  app.get("/api/trips", async (req, res) => {
    try {
      const featured = req.query.featured === "true";
      const trips = featured
        ? await storage.getFeaturedTrips()
        : await storage.getTrips();
      res.json(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      res.status(500).json({ message: "Failed to fetch trips" });
    }
  });

  app.get("/api/trips/:id", async (req, res) => {
    try {
      const trip = await storage.getTrip(req.params.id);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      res.json(trip);
    } catch (error) {
      console.error("Error fetching trip:", error);
      res.status(500).json({ message: "Failed to fetch trip" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // User achievements routes
  app.get("/api/user/achievements", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  // User trips routes
  app.get("/api/user/trips", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userTrips = await storage.getUserTrips(userId);
      res.json(userTrips);
    } catch (error) {
      console.error("Error fetching user trips:", error);
      res.status(500).json({ message: "Failed to fetch user trips" });
    }
  });

  app.post("/api/user/trips", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookingData = {
        ...req.body,
        userId,
        bookingDate: req.body.bookingDate ? new Date(req.body.bookingDate) : undefined,
      };
      const data = insertUserTripSchema.parse(bookingData);
      const userTrip = await storage.bookTrip(data);
      res.status(201).json(userTrip);
    } catch (error) {
      console.error("Error booking trip:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to book trip" });
    }
  });

  app.post("/api/user/trips/:id/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userTrip = await storage.completeTrip(req.params.id);
      if (!userTrip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      // Get the trip details to update user stats
      if (userTrip.tripId) {
        const trip = await storage.getTrip(userTrip.tripId);
        if (trip) {
          const userId = req.user.claims.sub;
          await storage.updateUserStats(
            userId,
            trip.pointsReward || 100,
            trip.elevation || 0
          );
        }
      }

      res.json(userTrip);
    } catch (error) {
      console.error("Error completing trip:", error);
      res.status(500).json({ message: "Failed to complete trip" });
    }
  });

  // Review routes
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertReviewSchema.parse({ ...req.body, userId });
      const review = await storage.createReview(data);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.post("/api/reviews/:id/helpful", async (req, res) => {
    try {
      await storage.incrementHelpful(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error incrementing helpful:", error);
      res.status(500).json({ message: "Failed to update review" });
    }
  });

  // Trip invitation routes
  app.post("/api/invitations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { tripId, inviteeEmail } = req.body;

      if (!tripId) {
        return res.status(400).json({ message: "Trip ID is required" });
      }

      const trip = await storage.getTrip(tripId);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      const inviteCode = crypto.randomBytes(8).toString("hex");
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      const invitationData = {
        tripId,
        inviterId: userId,
        inviteCode,
        inviteeEmail: inviteeEmail || null,
        expiresAt,
      };

      const data = insertTripInvitationSchema.parse(invitationData);
      const invitation = await storage.createTripInvitation(data);
      res.status(201).json(invitation);
    } catch (error) {
      console.error("Error creating invitation:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create invitation" });
    }
  });

  app.get("/api/invitations/:code", async (req, res) => {
    try {
      const invitation = await storage.getTripInvitation(req.params.code);
      if (!invitation) {
        return res.status(404).json({ message: "Invitation not found" });
      }
      
      // Check if expired
      if (invitation.expiresAt && new Date() > invitation.expiresAt) {
        return res.status(410).json({ message: "Invitation has expired" });
      }

      res.json(invitation);
    } catch (error) {
      console.error("Error fetching invitation:", error);
      res.status(500).json({ message: "Failed to fetch invitation" });
    }
  });

  app.post("/api/invitations/:code/accept", isAuthenticated, async (req: any, res) => {
    try {
      const invitation = await storage.getTripInvitation(req.params.code);
      if (!invitation) {
        return res.status(404).json({ message: "Invitation not found" });
      }

      if (invitation.status === "accepted") {
        return res.status(400).json({ message: "Invitation already accepted" });
      }

      if (invitation.expiresAt && new Date() > invitation.expiresAt) {
        return res.status(410).json({ message: "Invitation has expired" });
      }

      const updated = await storage.acceptInvitation(req.params.code);
      res.json(updated);
    } catch (error) {
      console.error("Error accepting invitation:", error);
      res.status(500).json({ message: "Failed to accept invitation" });
    }
  });

  app.get("/api/user/invitations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const invitations = await storage.getUserInvitations(userId);
      res.json(invitations);
    } catch (error) {
      console.error("Error fetching user invitations:", error);
      res.status(500).json({ message: "Failed to fetch invitations" });
    }
  });

  return httpServer;
}
