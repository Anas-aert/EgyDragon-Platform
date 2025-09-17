"use client";

import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Calendar, User, Users, Heart, MessageCircle } from "lucide-react";
import PostActions from "./PostActions";
import { useState, useEffect, useCallback } from "react";
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

  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const fetchFollowers = useCallback(async () => {
    try {
      const res = await fetch(
        `https://egydragon-anas.vercel.app/api/followers?id=${post.authorId}`,
        {
          cache: "no-store",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setFollowersCount(data.followers);
      }
    } catch (err) {
      console.error("Error fetching followers:", err);
    }
  }, [post.authorId]);

  const checkIfFollowing = useCallback(async () => {
    if (!loggedInUserId) return;
    try {
      const res = await fetch(
        `/api/followers/check?userId=${loggedInUserId}&postUserId=${post.authorId}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.isFollowing);
      }
    } catch (err) {
      console.error("Error checking follow state:", err);
    }
  }, [post.authorId, loggedInUserId]);

  useEffect(() => {
    fetchFollowers();
    checkIfFollowing();
  }, [fetchFollowers, checkIfFollowing]);

  // Follow
  const plusFollower = async () => {
    if (!loggedInUserId) return;
    try {
      const res = await fetch(
        "https://egydragon-anas.vercel.app/api/followers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: loggedInUserId,
            postUserId: post.authorId,
          }),
          cache: "no-store",
        }
      );

      if (res.ok) {
        setIsFollowing(true);
        fetchFollowers();
      } else {
        const data = await res.json();
        console.error("Follow failed:", data.error || data.message);
      }
    } catch (err) {
      console.error("Follow request failed:", err);
    }
  };

  // Unfollow
  const minusFollower = async () => {
    if (!loggedInUserId) return;
    try {
      const res = await fetch(
        "https://egydragon-anas.vercel.app/api/followers",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: loggedInUserId,
            postUserId: post.authorId,
          }),
          cache: "no-store",
        }
      );

      if (res.ok) {
        setIsFollowing(false);
        setOpen(false);
        fetchFollowers();
      } else {
        const data = await res.json();
        console.error("Unfollow failed:", data.error || data.message);
      }
    } catch (err) {
      console.error("Unfollow request failed:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <article
      className={`group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] ${
        isHovered ? "ring-2 ring-purple-400/50" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gradient-to-r from-purple-100 to-pink-100">
          <div className="flex items-center justify-between">
            {/* Author Info */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                  {author?.image ? (
                    <Image
                      src={author?.image}
                      alt={author?.name || "User"}
                      width={56}
                      height={56}
                      className="rounded-2xl object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7 text-white" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-sm"></div>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-purple-600 transition-colors">
                  {author?.name || "Unknown User"}
                </h3>
                <div className="flex items-center text-sm text-gray-500 space-x-2">
                  <Calendar className="w-4 h-4" />
                  <time className="font-medium">
                    {formatDate(post.createdAt)}
                  </time>
                </div>
              </div>
            </div>

            {/* Follow Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-full">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">
                  {followersCount}{" "}
                  {followersCount !== 1 ? "followers" : "follower"}
                </span>
              </div>

              {status !== "authenticated" || !loggedInUserId ? (
                <Button
                  disabled
                  className="bg-gray-300 text-gray-500 rounded-full px-6 py-2 font-semibold"
                >
                  Login to Follow
                </Button>
              ) : isFollowing === null ? (
                <Button
                  disabled
                  className="bg-gray-300 text-gray-500 rounded-full px-6 py-2 font-semibold"
                >
                  Loading...
                </Button>
              ) : !isFollowing ? (
                <Button
                  onClick={plusFollower}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-8 py-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Follow
                </Button>
              ) : (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gray-400 hover:bg-gray-500 text-white rounded-full px-8 py-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <Heart className="w-4 h-4 mr-2 fill-current" />
                      Following
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-gray-800">
                        Unfollow {author?.name || "this user"}?
                      </DialogTitle>
                      <DialogDescription className="text-gray-600 text-base">
                        You will no longer see their posts in your feed.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-3 mt-6">
                      <Button
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="rounded-xl px-6 py-2 hover:bg-gray-100 font-semibold"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={minusFollower}
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl px-6 py-2 font-semibold shadow-lg"
                      >
                        Unfollow
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="px-8 py-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight group-hover:text-purple-700 transition-colors">
            {post.title}
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed break-words">
            {post.content}
          </p>
        </div>

        {/* Post Stats Preview
        <div className="px-8 pb-6">
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>{post.likes.length} {post.likes.length !== 1 ? "likes" : "like"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments.length} {post.comments.length !== 1 ? "comments" : "comment"}</span>
            </div>
          </div>
        </div> */}

        {/* Post Actions */}
        <div className="border-t border-gray-100">
          <PostActions
            postId={post.id}
            initialLikes={post.likes}
            initialComments={post.comments}
          />
        </div>
      </div>
    </article>
  );
}
