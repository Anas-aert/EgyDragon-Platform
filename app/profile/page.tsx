import { getServerSession } from "next-auth";
import Image from "next/image";

const Profile = async () => {
  // لازم تمرر authOptions
  const data = await getServerSession();

  // const res = await fetch("http://localhost:3000/api/posts", {
  //   cache: "no-store",
  // });
  // const posts = await res.json();
  const postsJSX = "";

  // const postsJSX = posts.map((post, key) => (
  //   <div
  //     key={key}
  //     className="mt-4 rounded-xl bg-white shadow-md hover:shadow-lg text-center transition-shadow duration-300 w-full max-w-4xl mx-auto p-6"
  //   >
  //     <h2 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
  //       {post.title}
  //     </h2>
  //     <div className="text-lg text-gray-700 leading-relaxed break-words">
  //       {post.content}
  //     </div>
  //   </div>
  // ));

  return (
    <div className="h-full">
      <div className="flex flex-col items-center justify-center p-8">
        {!data && (
          <p className="text-black">Please login to access your profile.</p>
        )}
        {data && (
          <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md text-center">
            <h1 className="mb-4 text-xl font-semibold text-black">
              Name: {data.user?.name}
            </h1>
            {data.user?.image && (
              <Image
                src={data.user.image}
                alt="User Image"
                width={300}
                height={300}
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
            )}
            <h4 className="mb-4 text-black">Email: {data.user?.email}</h4>
          </div>
        )}
      </div>
      {/* <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-6">{postsJSX}</div>
        </div>
      </main> */}
    </div>
  );
};

export default Profile;
