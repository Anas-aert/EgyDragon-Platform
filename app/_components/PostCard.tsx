"use client";

import Image from "next/image";
import { Calendar, User } from "lucide-react";
import PostActions from "./PostActions";

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

export default function PostCard({
  post,
  user,
}: {
  post: PostFromAPI;
  user: { id: string; name?: string; image?: string };
}) {
  return (
    <article className="bg-white/70 backdrop-blur-sm rounded-2xl mb-5 shadow-lg border border-white/20 overflow-hidden">
      <div className="px-8 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {user?.name || "Undefined user"}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              <time>{new Date(post.createdAt).toLocaleDateString()}</time>
            </div>
          </div>
        </div>
      </div>
      <div className="px-8 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h2>
        <p className="text-gray-700 text-lg break-words">{post.content}</p>
      </div>
      <PostActions
        postId={post.id}
        initialLikes={post.likes}
        initialComments={post.comments}
      />
    </article>
  );
}
