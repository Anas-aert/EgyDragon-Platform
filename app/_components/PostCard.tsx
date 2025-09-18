"use client";

import Image from "next/image";
import { Calendar, User, Users, Heart } from "lucide-react";
import PostActions from "./PostActions";
import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useSWR from "swr";

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
  author,
}: {
  post: PostFromAPI;
  author: { id: string; name?: string; image?: string };
}) {
  const { data: session, status } = useSession();
  const loggedInUserId = session?.user?.id;
  const [open, setOpen] = useState(false);

  // fetcher للـ SWR
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  // 🔹 SWR بيجيب followersCount + isFollowing مع بعض
  const { data: followData, mutate } = useSWR(
    loggedInUserId
      ? `/api/followers/summary?viewerId=${loggedInUserId}&authorId=${post.authorId}`
      : null,
    fetcher,
    { refreshInterval: 30000 }
  );

  const followersCount = followData?.followers ?? 0;
  const isFollowing = followData?.isFollowing ?? false;

  // presence state
  const { data: presence } = useSWR(
    `/api/getStates?userId=${author.id}`,
    fetcher,
    { refreshInterval: 30000 }
  );

  // follow action (optimistic update)
  const plusFollower = async () => {
    if (!loggedInUserId) return;
    mutate({ ...followData, isFollowing: true, followers: followersCount + 1 }, false);
    try {
      await fetch(`/api/followers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loggedInUserId,
          postUserId: post.authorId,
        }),
      });
      mutate(); // revalidate من السيرفر
    } catch (err) {
      console.error("Follow request failed:", err);
      mutate(); // roll back لو فشلت
    }
  };

  // unfollow action (optimistic update)
  const minusFollower = async () => {
    if (!loggedInUserId) return;
    mutate({ ...followData, isFollowing: false, followers: followersCount - 1 }, false);
    try {
      await fetch(`/api/followers`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loggedInUserId,
          postUserId: post.authorId,
        }),
      });
      mutate();
      setOpen(false);
    } catch (err) {
      console.error("Unfollow request failed:", err);
      mutate();
    }
  };

  const formattedDate = useMemo(() => {
    const date = new Date(post.createdAt);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [post.createdAt]);

  return (
    <article
      className={`group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]`}
    >
      {/* Author & Header */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              {author?.image ? (
                <Image
                  src={author.image}
                  alt={author?.name || "User"}
                  width={56}
                  height={56}
                  className="rounded-2xl object-cover"
                />
              ) : (
                <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              )}
            </div>
            {presence ? (
              presence.isOnline ? (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              ) : (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
              )
            ) : (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gray-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            )}
          </div>

          <div>
            <h3 className="font-bold text-gray-800 text-base sm:text-lg group-hover:text-purple-600 transition-colors">
              {author?.name || "Unknown User"}
            </h3>
            <div className="flex items-center text-xs sm:text-sm text-gray-500 gap-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <time className="font-medium">{formattedDate}</time>
            </div>
          </div>
        </div>

        {/* Follow Section */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">
              {followersCount} {followersCount !== 1 ? "followers" : "follower"}
            </span>
          </div>

          {status !== "authenticated" || !loggedInUserId ? (
            <Button
              disabled
              className="bg-gray-200 text-gray-500 rounded-full px-4 sm:px-6 py-2"
            >
              Login to Follow
            </Button>
          ) : followData === undefined ? (
            <Button
              disabled
              className="bg-gray-200 text-gray-500 rounded-full px-4 sm:px-6 py-2"
            >
              Loading...
            </Button>
          ) : !isFollowing ? (
            <Button
              onClick={plusFollower}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-5 sm:px-8 py-2 font-semibold shadow hover:scale-105 transition-transform"
            >
              <Heart className="w-4 h-4 mr-2" />
              Follow
            </Button>
          ) : (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gray-400 hover:bg-gray-500 text-white rounded-full px-5 sm:px-8 py-2 font-semibold shadow hover:scale-105 transition-transform">
                  <Heart className="w-4 h-4 mr-2 fill-current" />
                  Following
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl font-bold text-gray-800">
                    Unfollow {author?.name || "this user"}?
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 text-sm sm:text-base">
                    You will no longer see their posts in your feed.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-5 py-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={minusFollower}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl px-5 py-2 font-semibold shadow"
                  >
                    Unfollow
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 sm:px-8 py-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-purple-700 transition-colors">
          {post.title}
        </h2>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed break-words line-clamp-6">
          {post.content}
        </p>
      </div>

      {/* Post Actions */}
      <div className="border-t border-gray-100">
        <PostActions
          postId={post.id}
          initialLikes={post.likes}
          initialComments={post.comments}
        />
      </div>
    </article>
  );
}
