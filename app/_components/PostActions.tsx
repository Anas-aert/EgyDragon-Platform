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
  initialLikes: Array<{
    id: string;
    userId: string;
    user: { name: string; image?: string };
  }>;
  initialComments: Comment[];
}) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes.length);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [likesUsers, setLikesUsers] = useState(
    initialLikes.map((like) => like.user)
  );
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLiked(false);
      return;
    }
    setLiked(initialLikes.some((like) => like.userId === userId));
  }, [initialLikes, userId]);

  const handleLike = async () => {
    if (loading || !userId) return alert("You should be Signedin");
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
    if (!userId) return alert("You should be Signedin");
    if (!commentText.trim() || loading) return;
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

  return (
    <div className="border-t border-gray-100">
      {/* أزرار التفاعل */}
      <div className="px-8 py-4 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center cursor-pointer space-x-2 ${
              liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            <span className="text-sm font-medium">
              {likesCount > 0 && <span className="mr-1">({likesCount})</span>}
              {liked ? "liked" : "like"}
            </span>
          </button>
          <button
            onClick={() => {
              setShowComments(!showComments);
            }}
            className="flex cursor-pointer items-center space-x-2 text-gray-500 hover:text-blue-500"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">
              {comments.length > 0 && (
                <span className="mr-1">({comments.length})</span>
              )}
              comments
            </span>
          </button>
        </div>
      </div>

      {/* التعليقات */}
      {showComments && (
        <div className="px-8 py-4 bg-gray-50/30 border-t border-gray-100">
          {userId ? (
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 flex space-x-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="write comment ..."
                  disabled={loading}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                  rows={1}
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim() || loading}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">You should be Signedin</p>
          )}

          <div className="space-y-3">
            {comments.map((c) => (
              <div
                key={c.id}
                className="flex items-start space-x-3 bg-white rounded-lg p-3 shadow-sm"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                  {c.user?.image ? (
                    <Image
                      src={c.user.image}
                      alt={c.user?.name || "Undefined"}
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
                    <p className="text-sm font-medium">
                      {c.user?.name || "Undefined user"}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
