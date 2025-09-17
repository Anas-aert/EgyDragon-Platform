"use client";

import { useSession } from "next-auth/react";
import { PostDialog } from "./dialog";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export const AddNewPost = () => {
  const { data, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const addPost = useCallback(
    async (title: string, content: string) => {
      if (!data?.user?.id) {
        setErrorMessage("You must be logged in to add a post.");
        return;
      }

      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            authorId: data.user.id,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to add post");
        }

        // ✅ Refresh the data instead of full reload
        router.refresh();
      } catch (error) {
        console.error("Error adding post:", error);
        setErrorMessage("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [data?.user?.id, router]
  );

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
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isSubmitting ? "Adding Post..." : "Add Post"}
        </button>
      </PostDialog>

      {errorMessage && (
        <p className="mt-2 text-red-600 text-sm">{errorMessage}</p>
      )}
    </div>
  );
};
