import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// ✅ GET single Post
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) return NextResponse.json({ error: "Post ID not found" }, { status: 400 });

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        likes: { include: { user: { select: { name: true, image: true } } } },
        comments: { include: { user: { select: { name: true, image: true } } } },
      },
    });

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      comments: post.comments.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
