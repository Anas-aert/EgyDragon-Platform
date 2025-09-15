"use client";

import Image from "next/image";
import { Calendar, User } from "lucide-react";
import PostActions from "./PostActions";
import { useState, useEffect } from "react";
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
  user,
}: {
  post: PostFromAPI;
  user: { id: string; name?: string; image?: string };
}) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [open, setOpen] = useState(false);

  // ✅ Get followers count
  async function fetchFollowers() {
    try {
      const res = await fetch(`/api/followers?id=${post.authorId}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setFollowersCount(data.followers);
      }
    } catch (err) {
      console.error("Error fetching followers:", err);
    }
  }

  // ✅ Check following state on mount
  useEffect(() => {
    async function fetchFollowers() {
      try {
        const res = await fetch(`/api/followers?id=${post.authorId}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setFollowersCount(data.followers);
        }
      } catch (err) {
        console.error("Error fetching followers:", err);
      }
    }

    async function checkIfFollowing() {
      try {
        const res = await fetch(
          `/api/followers/check?userId=${user.id}&postUserId=${post.authorId}`,
          {
            cache: "no-store",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setIsFollowing(data.isFollowing);
        }
      } catch (err) {
        console.error("Error checking follow state:", err);
      }
    }

    checkIfFollowing();
    fetchFollowers();
  }, [user.id, post.authorId]); // 👈 بس id والauthorId

  async function plusFollower() {
    try {
      const res = await fetch("/api/followers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          postUserId: post.authorId,
          name: user.name || "Anonymous",
        }),
        cache: "no-store",
      });

      if (res.ok) {
        setIsFollowing(true);
        fetchFollowers(); // ⬅️ Update count
      }
    } catch (err) {
      console.error("Follow request failed:", err);
    }
  }

  async function minusFollower() {
    try {
      const res = await fetch("/api/followers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          postUserId: post.authorId,
        }),
        cache: "no-store",
      });

      if (res.ok) {
        setIsFollowing(false);
        setOpen(false);
        fetchFollowers(); // ⬅️ Update count
      }
    } catch (err) {
      console.error("Unfollow request failed:", err);
    }
  }

  return (
    <article className="bg-white/70 backdrop-blur-sm rounded-2xl mb-5 shadow-lg border border-white/20 overflow-hidden">
      <div className="px-8 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            {user?.image ? (
              <Image
                src={user?.image || "/default-avatar.png"}
                alt={user?.name || "User"}
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

        {/* ✅ Follow / Following + Followers Count */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            {followersCount} follower{followersCount !== 1 ? "s" : ""}
          </span>

          {isFollowing === null ? (
            <Button disabled>Loading...</Button>
          ) : !isFollowing ? (
            <Button
              onClick={plusFollower}
              className="bg-red-500 hover:bg-red-700 hover:scale-105 text-white rounded-xl"
            >
              Follow
            </Button>
          ) : (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gray-400 hover:bg-gray-500 text-white rounded-xl">
                  Following
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Unfollow {user?.name || "this user"}?
                  </DialogTitle>
                  <DialogDescription>
                    Do you want to unfollow this guy?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={minusFollower}
                    className="bg-red-500 hover:bg-red-700 text-white rounded-xl"
                  >
                    Unfollow
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
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
