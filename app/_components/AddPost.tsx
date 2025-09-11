"use client";
import { useSession } from "next-auth/react";
import { PostDialog } from "./dialog";
import { useState } from "react";

export const AddNewPost = () => {
  const { data, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addPost = async (title: string, content: string) => {
    if (!data?.user?.id) {
      console.error("User not authenticated");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("https://egydragon-anas.vercel.app/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          content: content,
          autherId: data.user.id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add post");
      }

      const result = await res.json();
      console.log("Post added successfully:", result);

      // يمكنك إضافة notification أو refresh للصفحة هنا
      window.location.reload(); // أو استخدم router.refresh()
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <PostDialog onSubmit={addPost}>
      <span
        className={`
          bg-gradient-to-r duration-700 transition-all from-red-600 via-purple-600 to-blue-700 
          hover:scale-110 hover:opacity-85 text-white hover:bg-red-900 rounded-xl 
          cursor-pointer select-none p-5 text-xl
          ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {isSubmitting ? "Adding Post..." : "Add Post"}
      </span>
    </PostDialog>
  );
};
