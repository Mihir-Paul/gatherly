import express from "express";
import { z } from "zod";
import { db } from "../lib/db.ts";
import { verifyToken, AuthRequest } from "../lib/auth.ts";
import { sendRSVPConfirmation } from "../lib/email.ts";

const router = express.Router();

const EventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().refine((val) => !isNaN(new Date(val).getTime()), "Invalid date format").transform((val) => new Date(val)),
  location: z.string().min(3, "Location must be at least 3 characters"),
  imageUrl: z.string().or(z.literal("")).refine((val) => val === "" || val.startsWith("http"), "Must be empty or a valid URL").optional().nullable(),
});

// GET all events (public)
router.get("/", async (req, res) => {
  try {
    const events = await db.event.findMany({
      include: {
        _count: { select: { rsvps: true } },
        creator: { select: { name: true } },
      },
      orderBy: { date: "asc" },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// GET single event
router.get("/:id", async (req, res) => {
  try {
    const event = await db.event.findUnique({
      where: { id: req.params.id },
      include: {
        creator: { select: { name: true, email: true } },
        rsvps: {
          include: { user: { select: { name: true, email: true } } },
        },
        _count: { select: { rsvps: true } },
      },
    });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// POST create event (protected)
router.post("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    const data = EventSchema.parse(req.body);
    const event = await db.event.create({
      data: {
        ...data,
        creatorId: req.user!.id,
      },
    });
    res.status(201).json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(", ");
      return res.status(400).json({ error: `Validation failed: ${errorMessages}` });
    }
    res.status(500).json({ error: "Failed to create event" });
  }
});

// POST RSVP to event (protected)
router.post("/:id/rsvp", verifyToken, async (req: AuthRequest, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user!.id;

    const event = await db.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Prevent duplicate RSVP
    const existingRsvp = await db.rSVP.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });
    if (existingRsvp) return res.status(400).json({ error: "Already RSVP'd" });

    const rsvp = await db.rSVP.create({
      data: { eventId, userId },
      include: { user: true },
    });

    // Send email confirmation
    const ticketUrl = `${req.get('origin') || process.env.APP_URL}/events/${eventId}/ticket`;
    await sendRSVPConfirmation({
      to: rsvp.user.email,
      userName: rsvp.user.name,
      eventTitle: event.title,
      eventDate: event.date.toLocaleString(),
      eventLocation: event.location,
      ticketUrl
    });

    res.status(201).json(rsvp);
  } catch (error) {
    res.status(500).json({ error: "Failed to RSVP" });
  }
});

// DELETE event (protected)
router.delete("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const event = await db.event.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ error: "Event not found" });
    if (event.creatorId !== req.user!.id) return res.status(403).json({ error: "Unauthorized" });

    await db.event.delete({ where: { id: req.params.id } });
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

export default router;
