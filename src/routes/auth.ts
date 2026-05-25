import express from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "../lib/db.ts";
import { signToken } from "../lib/auth.ts";

const router = express.Router();

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = SignupSchema.parse(req.body);

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = signToken({ id: user.id, email: user.email });
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
