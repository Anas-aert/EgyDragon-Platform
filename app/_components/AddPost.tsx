"use client";

import { useSession } from "next-auth/react";
import { PostDialog } from "./dialog";
import { useState } from "react";
import useSWR, { mutate } from "swr";

// fetcher function لـ SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const AddNewPost = () => {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  // 🟢 جلب البيانات عشان نقدر نعمل update لها محليًا
  const { data: posts } = useSWR("/api/posts", fetcher);

  const addPost = async (title: string, content: string) => {
    if (!session?.user?.id) {
      setErrorMessage("You must be logged in to add a post.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const newPost = {
      id: Date.now().toString(), // مؤقت لعرض البوست فورًا
      title,
      content,
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
      likes: [],
    };

    try {
      // 🟢 Optimistic update: نضيف البوست فورًا في الـ UI
      mutate("/api/posts", [...(posts || []), newPost], false);

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          authorId: session.user.id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add post");
      }

      // 🟢 نعيد جلب البيانات من السيرفر لتأكيدها
      mutate("/api/posts");
    } catch (error) {
      console.error("Error adding post:", error);
      setErrorMessage("Something went wrong. Please try again.");

      // 🟠 نلغي التحديث المؤقت لو حصل خطأ
      mutate("/api/posts");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <div className="text-gray-500 text-sm">Checking session...</div>;
  }

  if (status !== "authenticated") {
    return (
      <div className="text-gray-600 italic text-sm">
        Please log in to add a post.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <PostDialog onSubmit={addPost}>
        <button
          disabled={isSubmitting}
          className={`bg-gradient-to-r from-red-600 via-purple-600 to-blue-700 
            text-white rounded-xl px-6 py-3 text-lg font-semibold
            transition-transform duration-300 ease-out
            hover:scale-105 hover:opacity-90
            flex items-center gap-2
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isSubmitting && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {isSubmitting ? "Adding..." : "Add Post"}
        </button>
      </PostDialog>

      {errorMessage && (
        <p className="mt-2 text-red-600 text-sm">{errorMessage}</p>
      )}
    </div>
  );
};
