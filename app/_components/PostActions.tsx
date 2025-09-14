"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, User, Send, Loader2 } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

type Comment = {
  id: string;
  content: string;
  userId: string;
  user?: { name?: string; image?: string };
  createdAt: string;
};

export default function PostActions({
  postId,
  initialLikes = [],
  initialComments = [],
}: {
  postId: string;
  initialLikes: Array<{
    id: string;
    userId: string;
    user?: { name?: string; image?: string };
  }>;
  initialComments: Comment[];
}) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes.length);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  const { data, status } = useSession();

  // Get user info from session
  const userId = data?.user?.id as string | undefined;
  const userName = data?.user?.name;
  const userImage = data?.user?.image;

  useEffect(() => {
    if (!userId || status !== "authenticated") {
      setLiked(false);
      return;
    }
    setLiked(initialLikes.some((like) => like.userId === userId));
  }, [initialLikes, userId, status]);

  const handleLike = async () => {
    if (loading || status !== "authenticated" || !userId) {
      alert("You should be signed in");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to like post");
      }

      if (data.success) {
        setLiked(data.liked);
        setLikesCount(data.liked ? likesCount + 1 : likesCount - 1);
      }
    } catch (err) {
      console.error("Like error:", err);
      alert("Failed to like post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    if (status !== "authenticated" || !userId) {
      alert("You should be signed in");
      return;
    }

    if (!commentText.trim() || commentLoading) return;

    setCommentLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText.trim() }),
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add comment");
      }

      if (data.success && data.comment) {
        setComments([...comments, data.comment]);
        setCommentText("");
        setShowComments(true);
      }
    } catch (err) {
      console.error("Comment error:", err);
      alert("Failed to add comment. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  return (
    <div className="border-t border-gray-100">
      {/* Action buttons */}
      <div className="px-8 py-4 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center cursor-pointer space-x-2 transition-all duration-200 ${
              liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Heart
                className={`w-5 h-5 transition-all duration-200 ${
                  liked ? "fill-current scale-110" : ""
                }`}
              />
            )}
            <span className="text-sm font-medium">
              {likesCount > 0 && <span className="mr-1">({likesCount})</span>}
              {liked ? "Liked" : "Like"}
            </span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex cursor-pointer items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">
              {comments.length > 0 && (
                <span className="mr-1">({comments.length})</span>
              )}
              Comments
            </span>
          </button>
        </div>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="px-8 py-4 bg-gray-50/30 border-t border-gray-100">
          {status === "authenticated" && userId ? (
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={userName || "User"}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="flex-1 flex space-x-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Write a comment..."
                  disabled={commentLoading}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                  rows={1}
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim() || commentLoading}
                  className="px-4 py-2 cursor-pointer bg-blue-600 text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1"
                >
                  {commentLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-2">
                You should be signed in to comment
              </p>
              <button
                onClick={() => (window.location.href = "/auth/MainAuth")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign In
              </button>
            </div>
          )}

          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className="flex items-start space-x-3 bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0">
                    {c.user?.image ? (
                      <Image
                        src={c.user?.image || "/default-avatar.png"}
                        alt={c.user?.name || "User"}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {c.user?.name || "Unknown user"}
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(c.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
