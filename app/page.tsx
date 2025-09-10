import { Post } from "@prisma/client";

export default async function Home() {
  const res = await fetch("https://egydragon-anas.vercel.app/api/posts", {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("API error:", res.status);
    return (
      <div className="text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">
          Failed to load posts 😢 (status {res.status})
        </div>
      </div>
    );
  }

  let posts: Post[] = [];
  try {
    posts = await res.json();
  } catch (err) {
    console.error("JSON parse error:", err);
    return (
      <div className="text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">
          Invalid response format 🚨
        </div>
      </div>
    );
  }

  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <div className="text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">
          No posts found
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6 flex flex-col-reverse">
          {posts.map((post, key) => (
            <div
              key={key}
              className="mt-4 rounded-xl bg-white shadow-md hover:shadow-lg text-center transition-shadow duration-300 w-full max-w-4xl mx-auto p-6"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
                {post.title}
              </h2>
              <div className="text-lg text-gray-700 leading-relaxed break-words">
                {post.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
