"use client";

import { useSession } from "next-auth/react";

export const AddNewPost = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, status } = useSession();

  const addPost = async () => {
    if (!data?.user?.id) {
      console.error("User not authenticated");
      return;
    }

    const title = "Anas";
    const content = "Tiiiiktooook";

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
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  return (
    <span
      onClick={addPost}
      className="bg-gradient-to-r duration-700 transition-all from-red-600 via-purple-600 to-blue-700 hover:scale-110 hover:opacity-85 text-white hover:bg-red-900 rounded-xl cursor-pointer select-none p-5 text-xl"
    >
      Add Post
    </span>
  );
};
