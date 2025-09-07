import { AllComponents } from "./_components/Full-Detail";

export default async function Home() {
  const res = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store",
  });

  const posts = await res.json();
  let postsJSX;

  if (!Array.isArray(posts)) {
    return (
      <div className="text-center">
        <AllComponents />
        <div className="absolute top-6/12 left-6/12 -translate-x-6/12 -translate-z-6/12 text-2xl">No posts found</div>
      </div>
    );
  } else {
    const postsJSX = posts.map((post, key) => {
      return (
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
      );
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AllComponents />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">{postsJSX}</div>
      </div>
    </main>
  );
}
