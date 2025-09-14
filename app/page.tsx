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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-4xl mx-auto flex flex-col-reverse space-y-8">
        {postsWithUsers.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            No posts yet. Be the first to post!
          </p>
        ) : (
          postsWithUsers.map(({ post, user }) => (
            <PostCard key={post.id} post={post} user={user} />
          ))
        )}
      </div>
    </main>
  );
}
