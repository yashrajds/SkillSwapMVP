import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skillWanted: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    likedBy: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    savedBy: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    responses: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
