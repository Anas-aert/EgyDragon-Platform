"use client";

import Image from "next/image";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Calendar, User, Users } from "lucide-react";
import PostActions from "./PostActions";
import { useState, useEffect, useMemo, useCallback } from "react";
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
  const { data: session } = useSession();
  const loggedInUserId = session?.user?.id;

  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 📌 fetch helper
  const fetchWithAbort = useCallback(async (url: string, options?: RequestInit) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const res = await fetch(url, { ...options, signal });
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    return res.json();
  }, []);

  // 📌 followers + follow state
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [followers, followState] = await Promise.all([
          fetchWithAbort(`/api/followers?id=${post.authorId}`, { cache: "no-store" }),
          loggedInUserId
            ? fetchWithAbort(
                `/api/followers/check?userId=${loggedInUserId}&postUserId=${post.authorId}`,
                { cache: "no-store" }
              )
            : Promise.resolve(null),
        ]);
        if (!active) return;
        setFollowersCount(followers.followers);
        if (followState) setIsFollowing(followState.isFollowing);
      } catch (err) {
        console.error(err);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [post.authorId, loggedInUserId, fetchWithAbort]);

  // 📌 follow / unfollow
  const plusFollower = useCallback(async () => {
    if (!loggedInUserId) return;
    try {
      const res = await fetch(`/api/followers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: loggedInUserId, postUserId: post.authorId }),
        cache: "no-store",
      });
      if (res.ok) {
        setIsFollowing(true);
        setFollowersCount((c) => c + 1);
      }
    } catch (err) {
      console.error("Follow request failed:", err);
    }
  }, [loggedInUserId, post.authorId]);

  const minusFollower = useCallback(async () => {
    if (!loggedInUserId) return;
    try {
      const res = await fetch(`/api/followers`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: loggedInUserId, postUserId: post.authorId }),
        cache: "no-store",
      });
      if (res.ok) {
        setIsFollowing(false);
        setFollowersCount((c) => Math.max(0, c - 1));
        setOpen(false);
      }
    } catch (err) {
      console.error("Unfollow request failed:", err);
    }
  }, [loggedInUserId, post.authorId]);

  // 📌 formatted date
  const formattedDate = useMemo(() => {
    const date = new Date(post.createdAt);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [post.createdAt]);

  // 📌 presence logic
  const [state, setState] = useState<{ isOnline: boolean; lastSeen: string } | null>(null);
  useEffect(() => {
    let isMounted = true;

    const fetchState = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch(`/api/getStates?userId=${author.id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch state");
        const data = await res.json();
        if (isMounted) setState(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 30000);

    const channel = new BroadcastChannel("presence");
    channel.onmessage = (event) => {
      if (event.data.userId === author.id) {
        setState({ isOnline: event.data.isOnline, lastSeen: event.data.lastSeen });
      }
    };

    return () => {
      isMounted = false;
      clearInterval(interval);
      channel.close();
    };
  }, [author.id]);

  return (
    <article
      className={`group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] ${
        isHovered ? "ring-2 ring-purple-400/40" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        {/* author */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Image
              src={author?.image || "/default-avatar.png"}
              alt={author?.name || "User"}
              width={48}
              height={48}
              className="rounded-full border-2 border-purple-200 group-hover:border-purple-400 transition-colors"
            />
            {state?.isOnline && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
            )}
            {!state?.isOnline && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{author?.name || "user"}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar size={14} /> {formattedDate}
            </p>
            {state && !state.isOnline && (
              <p className="text-xs text-gray-400">Last seen: {state.lastSeen}</p>
            )}
          </div>
          {loggedInUserId !== author.id && (
            <div className="ml-auto">
              {isFollowing ? (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-purple-50 text-purple-600 hover:bg-purple-100">
                      Following
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Unfollow {author?.name}?</DialogTitle>
                      <DialogDescription>
                        Do you want to unfollow {author?.name}? You can always follow again later.
                      </DialogDescription>
                    </DialogHeader>
                    <Button variant="destructive" onClick={minusFollower}>
                      Unfollow
                    </Button>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button onClick={plusFollower} size="sm" className="bg-purple-500 text-white hover:bg-purple-600">
                  Follow
                </Button>
              )}
            </div>
          )}
        </div>

        {/* post */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-4">{post.content}</p>

        {/* actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1">
              <Users size={16} /> {followersCount}
            </span>
          </div>
          <PostActions postId={post.id} initialLikes={post.likes} initialComments={post.comments} />
        </div>
      </div>
    </article>
  );
}
