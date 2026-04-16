import { Post } from "../models/Post.js";
import { formatPost } from "../utils/formatters.js";

export async function getPosts(req, res) {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("user", "name profileImage");
    return res.json(posts.map((post) => formatPost(post, req.user._id.toString())));
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to load posts." });
  }
}

export async function createPost(req, res) {
  try {
    const { skillWanted, description } = req.body;

    if (!skillWanted || !description) {
      return res.status(400).json({ message: "skillWanted and description are required." });
    }

    const post = await Post.create({
      user: req.user._id,
      skillWanted,
      description,
    });

    const populatedPost = await Post.findById(post._id).populate("user", "name profileImage");
    return res.status(201).json(formatPost(populatedPost, req.user._id.toString()));
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to create post." });
  }
}

export async function togglePostLike(req, res) {
  try {
    const post = await Post.findById(req.params.id).populate("user", "name profileImage");
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const currentUserId = req.user._id.toString();
    const hasLiked = post.likedBy.some((id) => id.toString() === currentUserId);
    post.likedBy = hasLiked
      ? post.likedBy.filter((id) => id.toString() !== currentUserId)
      : [...post.likedBy, req.user._id];

    await post.save();
    await post.populate("user", "name profileImage");

    return res.json(formatPost(post, currentUserId));
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to update like." });
  }
}

export async function togglePostSave(req, res) {
  try {
    const post = await Post.findById(req.params.id).populate("user", "name profileImage");
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const currentUserId = req.user._id.toString();
    const hasSaved = post.savedBy.some((id) => id.toString() === currentUserId);
    post.savedBy = hasSaved
      ? post.savedBy.filter((id) => id.toString() !== currentUserId)
      : [...post.savedBy, req.user._id];

    await post.save();
    await post.populate("user", "name profileImage");

    return res.json(formatPost(post, currentUserId));
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to update save state." });
  }
}
