import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import postSchema from "./schema";

// ✅ GET Posts
export async function GET() {
  const posts = await prisma.post.findMany();

  if (!posts || posts.length === 0) {
    return NextResponse.json(
      { "Empty Page😢": "No posts found" },
      { status: 404 }
    );
  }

  return NextResponse.json(posts, { status: 200 });
}

// ✅ POST Post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const postValidation = postSchema.safeParse(body);

    if (!postValidation.success) {
      return NextResponse.json(
        { "Invalid Data": postValidation.error.issues[0].message },
        { status: 400 }
      );
    }

    // Create post in DB
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
