import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/nextAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const postId = url.pathname.split("/")[4];
    console.log(postId);
    if (!postId)
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );

    const likes = await prisma.like.findMany({
      where: { postId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, likes, count: likes.length });
  } catch (error) {
    console.error("Get Likes API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );

    const url = new URL(request.url);
    const postId = url.pathname.split("/")[4];
    console.log(postId)
    if (!postId)
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      );

    const userId = session.user.id;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post)
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 400 }
      );


    const existingLike = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    let liked: boolean;
    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      liked = false;
    } else {
      await prisma.like.create({ data: { postId, userId } });
      liked = true;
    }

    const likesCount = await prisma.like.count({ where: { postId } });

    return NextResponse.json({ success: true, liked, likesCount });
  } catch (error) {
    console.error("Like API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
