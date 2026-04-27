import express from "express";
import { db } from "../lib/db.ts";
import { verifyToken, AuthRequest } from "../lib/auth.ts";

const router = express.Router();

router.get("/dashboard", verifyToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const MyEvents = await db.event.findMany({
      where: { creatorId: userId },
      include: {
        _count: { select: { rsvps: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const MyRsvps = await db.rSVP.findMany({
      where: { userId },
      include: {
        event: {
          include: { creator: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const analytics = {
        totalEventsCreated: MyEvents.length,
        totalRsvpsReceived: MyEvents.reduce((acc, curr) => acc + curr._count.rsvps, 0),
        totalEventsJoined: MyRsvps.length
    }

    res.json({ myEvents: MyEvents, myRsvps: MyRsvps, analytics });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

export default router;
