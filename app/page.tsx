"use client";

import { Heart, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function PostActions({
  postId,
  userId,
  initialLikes,
  initialComments,
}: {
  postId: string;
  userId: string;
  initialLikes: any[];
  initialComments: any[];
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes.length);
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (initialLikes.some((like) => like.userId === userId)) {
      setLiked(true);
    }
  }, [initialLikes, userId]);

  const handleLike = async () => {
    const res = await fetch(`/api/posts/${postId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (data.success) {
      setLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    const res = await fetch(`/api/posts/${postId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, content: commentText }),
    });
    const data = await res.json();
    if (data.success) {
      setComments([...comments, data.comment]);
      setCommentText("");
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      {/* Like + Comment input */}
      <div className="flex items-center space-x-6">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 transition-colors ${
            liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
          <span className="text-sm font-medium">{likeCount} Likes</span>
        </button>

        <div className="flex items-center space-x-2 flex-1">
          <MessageCircle className="w-5 h-5 text-gray-500" />
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="border rounded px-2 py-1 text-sm w-full"
          />
          <button onClick={handleComment} className="text-blue-600 text-sm font-medium">
            Send
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-3 space-y-2">
        {comments.map((c: any) => (
          <p key={c.id} className="text-sm text-gray-700 border-l-2 border-gray-300 pl-2">
            {c.content}
          </p>
        ))}
      </div>
    </div>
  );
}
