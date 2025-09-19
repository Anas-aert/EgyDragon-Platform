import Image from "next/image";
import React, { useState, useEffect } from "react";

// تحديد أنواع البيانات المستخدمة
// Note: In a real-world application, these types would be in a separate file,
// but for this single-file example, they are defined here.
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorId: string;
  author: Author;
  likes: Like[];
  comments: Comment[];
};

// Mock data to simulate the API response and user session
const mockPosts = [
  {
    id: "post1",
    title: "My First Post",
    content: "This is a post about something interesting!",
    createdAt: "2023-10-27T10:00:00Z",
    authorId: "user123",
    author: {
      id: "user123",
      name: "Ahmed",
      image: "https://placehold.co/128x128/FF6347/FFFFFF?text=A",
    },
    likes: [],
    comments: [],
  },
  {
    id: "post2",
    title: "Another Post",
    content: "Sharing some thoughts on this topic.",
    createdAt: "2023-10-26T14:30:00Z",
    authorId: "user456",
    author: {
      id: "user456",
      name: "Fatima",
      image: "https://placehold.co/128x128/32CD32/FFFFFF?text=F",
    },
    likes: [],
    comments: [],
  },
];

const mockSession = {
  user: {
    id: "user123",
    name: "Ahmed",
    email: "ahmed@example.com",
    image: "https://placehold.co/128x128/FF6347/FFFFFF?text=A",
  },
};

// A simplified version of AddNewPost component
const AddNewPost = () => {
  return (
    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-transform duration-200 transform hover:scale-105">
      Add a New Post
    </button>
  );
};

// A simplified version of PostCard component
const PostCard = ({ post, author }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <Image
          src={
            author?.image ||
            "https://placehold.co/128x128/808080/FFFFFF?text=User"
          }
          alt="Author Image"
          className="w-12 h-12 rounded-full mr-4 border-2 border-gray-200"
          width={500}
          height={500}
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {author?.name || "Anonymous"}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <h4 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h4>
      <p className="text-gray-700">{post.content}</p>
    </div>
  );
};

const App = () => {
  // We'll use a mock user ID for demonstration purposes.
  // This would normally be derived from the URL as in your original code.
  const userId = "user123";

  // State to manage the user session and posts
  const [session, setSession] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching data on component mount
  useEffect(() => {
    // We're simulating a network request and setting the session and posts.
    // In a real app, this would be your fetch call.
    setTimeout(() => {
      setSession(mockSession);
      setPosts(mockPosts.filter((post) => post.authorId === userId));
      setIsLoading(false);
    }, 1000);
  }, [userId]);

  // Check if the current user is the owner of this profile
  const isOwner = session?.user?.id === userId;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-xl text-gray-600">Loading profile...</p>
      </div>
    );
  }

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

export default App;
