import { Swap } from "../models/Swap.js";
import { User } from "../models/User.js";
import { formatUser } from "../utils/formatters.js";

async function getMatchCount(userId) {
  return Swap.countDocuments({
    status: "accepted",
    $or: [{ sender: userId }, { receiver: userId }],
  });
}

export async function getProfile(req, res) {
  try {
    const freshUser = await User.findById(req.user._id).select("-password");
    const matchCount = await getMatchCount(req.user._id);
    return res.json(formatUser(freshUser, matchCount));
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to load profile." });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password").sort({ createdAt: -1 });

    const usersWithCounts = await Promise.all(
      users.map(async (userDoc) => {
        const matchCount = await getMatchCount(userDoc._id);
        return formatUser(userDoc, matchCount);
      })
    );

    return res.json(usersWithCounts);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to load users." });
  }
}

export async function updateProfile(req, res) {
  try {
    const allowedFields = ["name", "bio", "location", "profileImage", "skillsOffered", "skillsWanted"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    const updatedUser = await req.user.save();
    const matchCount = await getMatchCount(req.user._id);

    return res.json(formatUser(updatedUser, matchCount));
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to update profile." });
  }
}
