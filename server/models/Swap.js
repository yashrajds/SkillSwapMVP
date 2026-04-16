import mongoose from "mongoose";

const swapSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skillOffered: { type: String, required: true, trim: true },
    skillRequested: { type: String, required: true, trim: true },
    message: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Swap = mongoose.model("Swap", swapSchema);
