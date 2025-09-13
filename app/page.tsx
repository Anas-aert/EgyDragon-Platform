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
  return await fetch("https://egydragon-anas.vercel.app/api/posts").then(
    (res) => res.json()
  );
}

async function getUser(userId: string) {
  return await prisma.user.findUnique({ where: { id: userId } });
}

export default async function Home() {
  const posts = await fetchPosts();

  const postsWithUsers = await Promise.all(
    posts.map(async (post) => {
      const user = await getUser(post.authorId);
      return {
        post,
        user: {
          id: user?.id ?? "",
          name: user?.name ?? "مستخدم مجهول",
          image: user?.image ?? undefined,
        },
      };
    })
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-4xl mx-auto flex flex-col-reverse space-y-8">
        {postsWithUsers.map(({ post, user }) => (
          <PostCard key={post.id} post={post} user={user} />
        ))}
      </div>
    </main>
  );
}
