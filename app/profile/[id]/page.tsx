import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "@/app/lib/nextAuth";
import { cookies } from "next/headers";
import { AddNewPost } from "@/app/_components/AddPost";
import PostCard from "@/app/_components/PostCard";



// تحديد أنواع البيانات المستخدمة
type Like = {
  id: string;
  userId: string;
  user: { name?: string; image?: string };
};

type Comment = {
  id: string;
  content: string;
  userId: string;
  user: { name?: string; image?: string };
  createdAt: string;
};

type Author = {
  id: string;
  name?: string;
  image?: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorId: string;
  author: Author;
  likes: Like[];
  comments: Comment[];
};

// تحديد أنواع الـ props التي يستقبلها المكون
type ProfileProps = {
  params: {
    id: string;
  };
};

// 🟢 المكون أصبح الآن Async Component لجلب البيانات من الخادم
const Profile = async ({ params }: ProfileProps) => {
  const id = params.id
  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.id === id;
  const userId = id;

  // 🟢 استخراج الكوكيز مباشرة داخل المكون
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  // 🟢 جلب البوستات مباشرة داخل المكون
  const res = await fetch(
    `https://egydragon-anas.vercel.app/api/userPosts/${userId}`,
    {
      cache: "no-store",
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    }
  );

  const posts: Post[] = res.ok ? await res.json() : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col gap-8">
          {/* 🟢 قسم البروفايل */}
          <div className="flex flex-col items-center justify-center p-6">
            {!session && (
              <p className="text-black text-lg bg-white p-4 rounded-xl shadow-md">
                Please login to access this profile.
              </p>
            )}

            {session && (
              <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                  {isOwner ? "Your Profile" : "Profile"}
                </h1>

                {session.user?.image && (
                  <div className="mb-6">
                    <Image
                      src={session.user.image}
                      alt="User Image"
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-100 shadow-md"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Name:</span>{" "}
                    {session.user?.name}
                  </p>
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Email:</span>{" "}
                    {session.user?.email}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 🟢 زر Add Post يظهر فقط لصاحب البروفايل */}
          {session && isOwner && (
            <div className="flex flex-row justify-center items-center">
              <AddNewPost />
            </div>
          )}

          {/* 🟢 قسم البوستات */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-xl text-gray-500">
                  No posts found.{" "}
                  {isOwner && "Start by creating your first post!"}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Posts</h2>
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} author={post.author} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
