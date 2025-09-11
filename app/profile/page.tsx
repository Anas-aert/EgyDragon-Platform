import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "../lib/nextAuth";
import { cookies } from "next/headers"; // ✅ إضافة مهمة
import { AddNewPost } from "../_components/AddPost";

async function GetPosts() {
  // احصل على الـ cookies من الـ request
  const cookieStore = cookies();

  const res = await fetch("https://egydragon-anas.vercel.app/api/userPosts", {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const posts = await res.json();

  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-gray-500">
          No posts found. Start by creating your first post!
        </div>
      </div>
    );
  } else {
    const postsJSX = posts.map((post, key) => {
      return (
        <div
          key={key}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
            {post.title}
          </h2>
          <div className="text-gray-600 leading-relaxed break-words">
            {post.content}
          </div>
        </div>
      );
    });
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Posts</h2>
        {postsJSX}
      </div>
    );
  }
}

const Profile = async () => {
  const data = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col gap-8">
          {/* قسم الملف الشخصي */}
          <div className="flex flex-col items-center justify-center p-6">
            {!data && (
              <p className="text-black text-lg bg-white p-4 rounded-xl shadow-md">
                Please login to access your profile.
              </p>
            )}
            {data && (
              <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                  Your Profile
                </h1>
                {data.user?.image && (
                  <div className="mb-6">
                    <Image
                      src={data.user.image}
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
                    {data.user?.name}
                  </p>
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Email:</span>{" "}
                    {data.user?.email}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Add new Post */}
          {data && (
            <div className="flex flex-row justify-center items-center">
              <AddNewPost />
            </div>
          )}

          {/* قسم المنشورات - بس لو في session */}
          {data && (
            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
              <GetPosts />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
