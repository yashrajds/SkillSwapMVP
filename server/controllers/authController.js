import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Notification } from "../models/Notification.js";
import { formatUser } from "../utils/formatters.js";

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function registerUser(req, res) {
  try {
    const { name, email, password, bio = "", skillsOffered = [], skillsWanted = [] } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      bio,
      skillsOffered,
      skillsWanted,
    });

    await Notification.create({
      user: user._id,
      type: "system",
      title: "Welcome to SkillSwap!",
      body: "Your account is ready. Start by browsing members and sending your first exchange request.",
    });

    return res.status(201).json({
      token: generateToken(user._id.toString()),
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to register user." });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    return res.json({
      token: generateToken(user._id.toString()),
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to log in." });
  }
}
