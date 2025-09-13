"use client";

import { prisma } from "@/prisma/client";
import { Post } from "@prisma/client";
import {
  FileText,
  AlertCircle,
  Calendar,
  Heart,
  MessageCircle,
  Eye,
  User,
  Send,
} from "lucide-react";
import Image from "next/image";
import { Suspense, useState, useEffect } from "react";

// 👇 تعريف نوع خاص للبوست اللي جاي من API
type PostFromAPI = Omit<Post, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  likes: Array<{ id: string; userId: string; user: { name: string; image?: string } }>;
  comments: Array<{ id: string; content: string; userId: string; user: { name: string; image?: string }; createdAt: string }>;
};

type Comment = {
  id: string;
  content: string;
  userId: string;
  user: {
    name: string;
    image?: string;
  };
  createdAt: string;
};

async function getUser(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

// 🔹 Loading skeleton component
const PostSkeleton = () => (
  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden animate-pulse">
    <div className="px-8 pt-6 pb-4 border-b border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="px-8 py-6">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

// 🔹 Error boundary component
const ErrorDisplay = ({
  type,
  title,
  message,
}: {
  type: "loading" | "data" | "empty";
  title: string;
  message: string;
}) => {
  const gradients = {
    loading: "from-red-50 to-red-100",
    data: "from-yellow-50 to-orange-100",
    empty: "from-blue-50 to-indigo-100",
  };

  const colors = {
    loading: "text-red-500",
    data: "text-orange-500",
    empty: "text-blue-600",
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${gradients[type]} flex items-center justify-center`}
    >
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4">
        <AlertCircle className={`w-16 h-16 ${colors[type]} mx-auto mb-4`} />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

// 🔹 Post Actions (Like & Comment) - Updated with full backend integration
function PostActions({ 
  postId, 
  userId, 
  initialLikes = [], 
  initialComments = [] 
}: { 
  postId: string; 
  userId: string;
  initialLikes: Array<{ id: string; userId: string; user: { name: string; image?: string } }>;
  initialComments: Array<{ id: string; content: string; userId: string; user: { name: string; image?: string }; createdAt: string }>;
}) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes.length);
  const [likesUsers, setLikesUsers] = useState(initialLikes.map(like => like.user));
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user already liked the post
  useEffect(() => {
    setLiked(initialLikes.some(like => like.userId === userId));
  }, [initialLikes, userId]);

  // Handle Like Toggle
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
        // Update likes count and users list
        if (data.liked) {
          setLikesCount(prev => prev + 1);
          // You might want to fetch updated likes list here
        } else {
          setLikesCount(prev => prev - 1);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Comment Submit
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
        // Add the new comment to the list
        const newComment: Comment = {
          id: data.comment.id,
          content: data.comment.content,
          userId: data.comment.userId,
          user: data.comment.user || { name: "Anonymous" },
          createdAt: data.comment.createdAt || new Date().toISOString(),
        };
        
        setComments(prev => [...prev, newComment]);
        setCommentText("");
        setShowComments(true);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load Comments
  const loadComments = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comment`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setComments(data);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  // Handle Enter key for comment submission
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  return (
    <div className="border-t border-gray-100">
      {/* Action Buttons */}
      <div className="px-8 py-4 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={loading || !userId}
              className={`flex items-center space-x-2 transition-all duration-200 ${
                liked 
                  ? "text-red-500" 
                  : "text-gray-500 hover:text-red-500"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">
                {likesCount > 0 && <span className="mr-1">({likesCount})</span>}
                {liked ? "Liked" : "Like"}
              </span>
            </button>

            {/* Comment Button */}
            <button
              onClick={() => {
                setShowComments(!showComments);
                if (!showComments && comments.length === 0) {
                  loadComments();
                }
              }}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                {comments.length > 0 && <span className="mr-1">({comments.length})</span>}
                Comment
              </span>
            </button>
          </div>

          {/* Likes Users Preview */}
          {likesUsers.length > 0 && (
            <div className="flex items-center space-x-1">
              <div className="flex -space-x-1">
                {likesUsers.slice(0, 3).map((user, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center border-2 border-white"
                    title={user.name}
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <span className="text-xs text-white font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {likesUsers.length > 3 && (
                <span className="text-xs text-gray-500 ml-2">
                  +{likesUsers.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-8 py-4 bg-gray-50/30 border-t border-gray-100">
          {/* Comment Input */}
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
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={1}
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim() || loading || !userId}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3 bg-white rounded-lg p-3 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  {comment.user?.image ? (
                    <Image
                      src={comment.user.image}
                      alt={comment.user.name || "User"}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-800">
                      {comment.user?.name || "Anonymous"}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
            
            {comments.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 🔹 Optimized Post component
const PostCard = async ({
  post,
  index,
}: {
  post: PostFromAPI;
  index: number;
}) => {
  const user = await getUser(post.authorId);

  return (
    <article
      className="group bg-white/70 backdrop-blur-sm rounded-2xl mb-5 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 overflow-hidden animate-fade-in-up will-change-transform"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Post Header */}
      <div className="px-8 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? "User"}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {user?.name ?? "Unknown User"}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                <time>
                  {new Date(post.createdAt).toLocaleDateString()}
                </time>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              Article
            </span>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-300">
          {post.title}
        </h2>
      </div>

      {/* Post Content */}
      <div className="px-8 py-6">
        <div className="text-gray-700 text-lg leading-relaxed break-words line-clamp-text">
          {post.content}
        </div>
      </div>

      {/* Post Footer with Actions */}
      <PostActions 
        postId={post.id} 
        userId={user?.id ?? ""} 
        initialLikes={post.likes || []}
        initialComments={post.comments || []}
      />
    </article>
  );
};

// 🔹 Fetch posts with proper typing
async function fetchPosts(): Promise<PostFromAPI[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch("https://egydragon-anas.vercel.app/api/posts", {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const posts: PostFromAPI[] = await res.json();

    if (!Array.isArray(posts)) {
      throw new Error("Invalid response format: expected array");
    }

    return posts;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

export default async function Home() {
  let posts: PostFromAPI[] = [];
  let error: string | null = null;

  try {
    posts = await fetchPosts();
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error occurred";
  }

  // Handle errors
  if (error) {
    if (error.includes("HTTP error") || error.includes("aborted")) {
      return (
        <ErrorDisplay
          type="loading"
          title="Loading Error"
          message="Failed to load posts"
        />
      );
    }
    return (
      <ErrorDisplay
        type="data"
        title="Data Error"
        message="Invalid response format 🚨"
      />
    );
  }

  // Handle empty state
  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-12 bg-white rounded-3xl shadow-2xl max-w-lg mx-4 transform hover:scale-105 transition-transform duration-300">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mx-auto flex items-center justify-center animate-pulse">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            No Posts Found
          </h2>
          <p className="text-gray-600 text-lg">
            Start by creating your first post!
          </p>
          <div
            className="mt-8 flex justify-center space-x-2"
            role="status"
            aria-label="Loading"
          >
            {[0, 0.2, 0.4].map((delay, i) => (
              <div
                key={i}
                className={`w-3 h-3 bg-${
                  ["blue", "purple", "pink"][i]
                }-400 rounded-full animate-bounce`}
                style={{ animationDelay: `${delay}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Blog Posts
                </h1>
                <p className="text-sm text-gray-500" role="status">
                  {posts.length} posts available
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Eye className="w-4 h-4" />
              <span>Latest Posts</span>
            </div>
          </div>
        </div>
      </header>

      {/* Posts Container */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div
          className="space-y-8 flex flex-col-reverse"
          role="feed"
          aria-label="Blog posts"
        >
          <Suspense fallback={<PostSkeleton />}>
            {posts.map((post, index) => (
              <PostCard key={post.id || index} post={post} index={index} />
            ))}
          </Suspense>
        </div>
      </div>
    </main>
  );
}