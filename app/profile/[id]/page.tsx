import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/nextAuth";
import { cookies } from "next/headers";
import PostCard from "@/app/_components/PostCard";
import { AddNewPost } from "@/app/_components/AddPost";

type Like = { id: string; userId: string; user: { name?: string; image?: string } };
type Comment = { id: string; content: string; userId: string; user: { name?: string; image?: string }; createdAt: string };
type Author = { id: string; name?: string; image?: string };
export type Post = { id: string; title: string; content: string; createdAt: string; authorId: string; author: Author; likes: Like[]; comments: Comment[] };

// ⚡️ استخدم PageProps مباشرة
type ProfilePageProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

const Profile = async ({ params }: ProfilePageProps) => {
  const userId = params.id;

  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.id === userId;

  // جلب الكوكيز
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join("; ");

  // جلب البوستات
  const res = await fetch(`https://egydragon-anas.vercel.app/api/userPosts/${userId}`, {
    cache: "no-store",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });
  const posts: Post[] = res.ok ? await res.json() : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col gap-8">
        {session ? (
          <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center border border-gray-100 mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{isOwner ? "Your Profile" : "Profile"}</h1>
            {session.user?.image && <img src={session.user.image} alt="User" className="w-32 h-32 rounded-full mx-auto mb-4" />}
            <p className="text-lg text-gray-700"><b>Name:</b> {session.user?.name}</p>
            <p className="text-lg text-gray-700"><b>Email:</b> {session.user?.email}</p>
          </div>
        ) : (
          <p className="text-center text-lg text-black bg-white p-4 rounded-xl shadow-md">Please login to access this profile.</p>
        )}

        {session && isOwner && <AddNewPost />}

        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
          {posts.length === 0 ? (
            <p className="text-center text-xl text-gray-500 py-12">{isOwner ? "No posts yet. Start by creating your first post!" : "No posts found."}</p>
          ) : (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Posts</h2>
              {posts.map(post => <PostCard key={post.id} post={post} author={post.author} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
