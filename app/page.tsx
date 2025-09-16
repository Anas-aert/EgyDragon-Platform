// app/page.tsx
import { prisma } from "@/prisma/client";
import PostCard from "./_components/PostCard";

type PostFromAPI = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorId: string;
  likes: Array<{
    id: string;
    userId: string;
    user: { name: string; image?: string };
  }>;
  comments: Array<{
    id: string;
    content: string;
    userId: string;
    user: { name: string; image?: string };
    createdAt: string;
  }>;
};

async function fetchPosts(): Promise<PostFromAPI[]> {
  try {
    const res = await fetch("https://egydragon-anas.vercel.app/api/posts", {
      cache: "no-store", // always fetch latest data
    });
    const data = await res.json();
    // ensure it's always an array
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    return [];
  }
}

async function getUser(userId: string) {
  if (!userId) return null;
  return await prisma.user.findUnique({ where: { id: userId } });
}

export default async function Home() {
  const posts = await fetchPosts();

  // If no posts, this will be [] preventing any errors
  const postsWithUsers = await Promise.all(
    posts.map(async (post) => {
      const user = await getUser(post.authorId);
      return {
        post,
        user: {
          id: user?.id ?? "",
          name: user?.name ?? "Unknown User",
          image: user?.image ?? undefined,
        },
      };
    })
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-200/10 to-blue-200/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-12 pb-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-fade-in animate-gradient-shift">
            Social Feed
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in delay-300">
            Discover amazing stories, connect with people, and share your thoughts with the world
          </p>
          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent animate-fade-in delay-500"></div>
        </div>
      </div>

      {/* Posts Container */}
      <div className="relative z-10 px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          {postsWithUsers.length === 0 ? (
            <div className="text-center py-20 animate-fade-in delay-700">
              <div className="mb-8 animate-float">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-6 shadow-lg animate-glow">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No posts yet!</h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
                Be the first to share something amazing with the community. Your story could inspire others!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {postsWithUsers.map(({ post, user }, index) => (
                <div 
                  key={post.id} 
                  className={`animate-fade-in-up delay-${Math.min(index * 100 + 200, 900)} hover-lift`}
                >
                  <PostCard post={post} author={user} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}