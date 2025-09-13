import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import postSchema from "./schema";

// ✅ GET Posts
export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      likes: true,
      comments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!posts || posts.length === 0) {
    return NextResponse.json({ message: "No posts found 😢" }, { status: 404 });
  }

  return NextResponse.json(posts, { status: 200 });
}

// ✅ POST Post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const postValidation = postSchema.safeParse(body);
    if (!postValidation.success) {
      return NextResponse.json(
        { error: postValidation.error.issues[0].message },
        { status: 400 }
      );
    }

    const newPost = await prisma.post.create({
      data: postValidation.data,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}

// ✅ DELETE Post
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.post.findUnique({
      where: { id: body.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const deletedPost = await prisma.post.delete({
      where: { id: body.id },
    });

    return NextResponse.json({ deleted: deletedPost }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete post", error },
      { status: 500 }
    );
  }
}
