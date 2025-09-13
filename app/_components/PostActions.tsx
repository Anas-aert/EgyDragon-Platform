"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, User, Send } from "lucide-react";
import Image from "next/image";

type Comment = {
  id: string;
  content: string;
  userId: string;
  user: { name: string; image?: string };
  createdAt: string;
};

export default function PostActions({
  postId,
  userId,
  initialLikes = [],
  initialComments = [],
}: {
  postId: string;
  userId: string;
  initialLikes: Array<{ id: string; userId: string; user: { name: string; image?: string } }>;
  initialComments: Comment[];
}) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes.length);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [likesUsers, setLikesUsers] = useState(initialLikes.map((like) => like.user));
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(initialLikes.some((like) => like.userId === userId));
  }, [initialLikes, userId]);

  const handleLike = async () => {
    if (loading || !userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        setLiked(data.liked);
        setLikesCount(data.liked ? likesCount + 1 : likesCount - 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || loading || !userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, content: commentText.trim() }),
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setComments([...comments, data.comment]);
        setCommentText("");
        setShowComments(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comment`);
      const data = await res.json();
      if (Array.isArray(data)) setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="border-t border-gray-100">
      {/* Action Buttons */}
      <div className="px-8 py-4 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            disabled={loading || !userId}
            className={`flex items-center space-x-2 ${
              liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            <span className="text-sm font-medium">
              {likesCount > 0 && <span className="mr-1">({likesCount})</span>}
              {liked ? "Liked" : "Like"}
            </span>
          </button>
          <button
            onClick={() => {
              setShowComments(!showComments);
              if (!showComments && comments.length === 0) loadComments();
            }}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">
              {comments.length > 0 && <span className="mr-1">({comments.length})</span>}
              Comment
            </span>
          </button>
        </div>
        {likesUsers.length > 0 && (
          <div className="flex items-center space-x-1">
            {likesUsers.slice(0, 3).map((user, idx) => (
              <div key={idx} className="w-6 h-6 rounded-full overflow-hidden border-2 border-white">
                {user.image ? (
                  <Image src={user.image} alt={user.name} width={24} height={24} />
                ) : (
                  <span className="text-xs">{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
            ))}
            {likesUsers.length > 3 && <span className="text-xs text-gray-500 ml-2">+{likesUsers.length - 3} more</span>}
          </div>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-8 py-4 bg-gray-50/30 border-t border-gray-100">
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 flex space-x-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Write a comment..."
                disabled={loading || !userId}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                rows={1}
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim() || loading || !userId}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start space-x-3 bg-white rounded-lg p-3 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  {c.user.image ? (
                    <Image src={c.user.image} alt={c.user.name} width={32} height={32} />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium">{c.user.name}</p>
                    <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-700">{c.content}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && <p className="text-center text-gray-500 text-sm py-4">No comments yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
