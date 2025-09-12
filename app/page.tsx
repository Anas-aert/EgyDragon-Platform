import { Post } from "@prisma/client";
import {
  FileText,
  AlertCircle,
  RefreshCw,
  Calendar,
  User,
  Heart,
  MessageCircle,
  Share2,
  Eye,
} from "lucide-react";
import { Suspense } from "react";

// Loading skeleton component for better UX
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

// Error boundary component
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

// Optimized Post component with memoization
const PostCard = ({ post, index }: { post: Post; index: number }) => (
  <article
    className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 overflow-hidden will-change-transform"
    style={{
      animationDelay: `${index * 0.1}s`,
      animation: "fadeInUp 0.6s ease-out forwards",
    }}
  >
    {/* Post Header */}
    <div className="px-8 pt-6 pb-4 border-b border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Author</p>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              <time dateTime={new Date().toISOString()}>Just now</time>
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
      <div className="text-gray-700 text-lg leading-relaxed break-words line-clamp-4">
        {post.content}
      </div>
    </div>

    {/* Post Footer */}
    <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            type="button"
            className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors duration-200 group/btn"
            aria-label="Like post"
          >
            <Heart className="w-5 h-5 group-hover/btn:fill-current" />
            <span className="text-sm font-medium">Like</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
            aria-label="Comment on post"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Comment</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors duration-200"
            aria-label="Share post"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
        <div className="text-xs text-gray-400">Post #{index + 1}</div>
      </div>
    </div>
  </article>
);

// Fetch posts with improved error handling
async function fetchPosts(): Promise<Post[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

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

    const posts = await res.json();

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
  let posts: Post[] = [];
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
        <div className="space-y-8" role="feed" aria-label="Blog posts">
          <Suspense fallback={<PostSkeleton />}>
            {posts.map((post, index) => (
              <PostCard key={post.id || index} post={post} index={index} />
            ))}
          </Suspense>
        </div>
      </div>

      {/* Optimized CSS with modern properties */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Enable GPU acceleration */
        .will-change-transform {
          will-change: transform;
        }

        /* Optimize animations */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
