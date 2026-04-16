import mongoose from "mongoose";
import { Swap } from "../models/Swap.js";
import { User } from "../models/User.js";
import { Notification } from "../models/Notification.js";
import { formatSwap } from "../utils/formatters.js";

export async function createSwap(req, res) {
  try {
    const { receiverId, skillOffered, skillRequested, message = "" } = req.body;

    if (!receiverId || !skillOffered || !skillRequested) {
      return res.status(400).json({ message: "receiverId, skillOffered, and skillRequested are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid receiver id." });
    }

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot send a swap request to yourself." });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    const swap = await Swap.create({
      sender: req.user._id,
      receiver: receiverId,
      skillOffered,
      skillRequested,
      message,
    });

    await Notification.create({
      user: receiver._id,
      type: "request",
      title: "New Exchange Request",
      body: `${req.user.name} wants to exchange ${skillOffered} for ${skillRequested}.`,
      avatar: req.user.profileImage,
    });

    const populatedSwap = await Swap.findById(swap._id)
      .populate("sender", "name profileImage")
      .populate("receiver", "name profileImage");

    return res.status(201).json(formatSwap(populatedSwap));
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to create swap request." });
  }
}

export async function getSwaps(req, res) {
  try {
    const swaps = await Swap.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name profileImage")
      .populate("receiver", "name profileImage");

    return res.json(swaps.map(formatSwap));
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to load swap requests." });
  }
}

export async function updateSwapStatus(req, res) {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be accepted or rejected." });
    }

    const swap = await Swap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ message: "Swap request not found." });
    }

    if (swap.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the receiver can update this request." });
    }

    swap.status = status;
    await swap.save();

    await Notification.create({
      user: swap.sender,
      type: status === "accepted" ? "accepted" : "system",
      title: status === "accepted" ? "Request Accepted" : "Request Update",
      body:
        status === "accepted"
          ? `${req.user.name} accepted your exchange request.`
          : `${req.user.name} declined your exchange request.`,
      avatar: req.user.profileImage,
    });

    const populatedSwap = await Swap.findById(swap._id)
      .populate("sender", "name profileImage")
      .populate("receiver", "name profileImage");

    return res.json(formatSwap(populatedSwap));
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to update swap request." });
  }
}
