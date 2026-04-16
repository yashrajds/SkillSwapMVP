import { useEffect, useState } from "react";
import { Bookmark, MessageSquare, Plus, Search, Send, ThumbsUp, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getApiError } from "../services/api";
import { postService } from "../services/postService";
import type { Post } from "../services/types";

export function Posts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [skillWanted, setSkillWanted] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await postService.getPosts();
        setPosts(data);
      } catch (loadError) {
        setError(getApiError(loadError, "Unable to load posts."));
      }
    };

    void loadPosts();
  }, []);

  const filtered = posts.filter(
    (post) =>
      !search ||
      post.skillWanted.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase()) ||
      post.userName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!skillWanted.trim() || !description.trim()) return;

    try {
      const newPost = await postService.createPost({
        skillWanted: skillWanted.trim(),
        description: description.trim(),
      });
      setPosts([newPost, ...posts]);
      setSkillWanted("");
      setDescription("");
      setShowForm(false);
    } catch (submitError) {
      setError(getApiError(submitError, "Unable to create post."));
    }
  };

  const updatePost = (nextPost: Post) => {
    setPosts((prev) => prev.map((post) => (post.id === nextPost.id ? nextPost : post)));
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-slate-900 mb-1" style={{ fontSize: "24px", fontWeight: 700 }}>
            Skill Posts
          </h1>
          <p className="text-slate-500" style={{ fontSize: "14px" }}>
            Post what you want to learn and find people to exchange with.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 transition-all shadow-sm"
          style={{ fontSize: "13px", fontWeight: 500 }}
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 mb-6" style={{ fontSize: "13px" }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-50 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-900" style={{ fontSize: "15px", fontWeight: 600 }}>
              Post a Skill Request
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          <div className="flex items-start gap-3 mb-4">
            <img
              src={user?.profilePic}
              alt={user?.name}
              className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 space-y-3">
              <input
                type="text"
                value={skillWanted}
                onChange={(e) => setSkillWanted(e.target.value)}
                placeholder="Skill you want to learn (e.g. React, Python...)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                style={{ fontSize: "13px" }}
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you're looking for and what you can offer in return..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                style={{ fontSize: "13px" }}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => void handleSubmit()}
              disabled={!skillWanted.trim() || !description.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              <Send className="w-3.5 h-3.5" />
              Post
            </button>
          </div>
        </div>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          style={{ fontSize: "13px" }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600" style={{ fontSize: "15px", fontWeight: 600 }}>No posts found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:border-indigo-100 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={post.userPic}
                  alt={post.userName}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <p className="text-slate-900" style={{ fontSize: "14px", fontWeight: 600 }}>
                    {post.userName}
                  </p>
                  <p className="text-slate-400" style={{ fontSize: "11px" }}>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-xl" style={{ fontSize: "12px", fontWeight: 500 }}>
                    Wants: {post.skillWanted}
                  </span>
                </div>
              </div>

              <p className="text-slate-600 mb-4" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                {post.description}
              </p>

              <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                <button
                  onClick={async () => updatePost(await postService.toggleLike(post.id))}
                  className={`flex items-center gap-1.5 transition-colors ${
                    post.isLiked ? "text-indigo-600" : "text-slate-400 hover:text-indigo-600"
                  }`}
                  style={{ fontSize: "12px" }}
                >
                  <ThumbsUp className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                  Helpful ({post.likes})
                </button>
                <button
                  className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                  style={{ fontSize: "12px" }}
                >
                  <MessageSquare className="w-4 h-4" />
                  {post.responses} Responses
                </button>
                <button
                  onClick={async () => updatePost(await postService.toggleSave(post.id))}
                  className={`flex items-center gap-1.5 ml-auto transition-colors ${
                    post.isSaved ? "text-amber-500" : "text-slate-400 hover:text-amber-500"
                  }`}
                  style={{ fontSize: "12px" }}
                >
                  <Bookmark className={`w-4 h-4 ${post.isSaved ? "fill-current" : ""}`} />
                  {post.isSaved ? "Saved" : "Save"}
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all"
                  style={{ fontSize: "12px", fontWeight: 500 }}
                >
                  Respond
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
