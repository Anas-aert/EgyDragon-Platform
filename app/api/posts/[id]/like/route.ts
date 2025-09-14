import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// POST /api/posts/:id/like
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await req.json();
    const postId = params.id;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // هل المستخدم عامل لايك قبل كده؟
    const existing = await prisma.like.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    let liked: boolean;
    if (existing) {
      // إلغاء اللايك
      await prisma.like.delete({
        where: { id: existing.id },
      });
      liked = false;
    } else {
      // إضافة لايك
      await prisma.like.create({
        data: { postId, userId },
      });
      liked = true;
    }

    return NextResponse.json({ success: true, liked });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get("postId");

    if (!postId)
      return NextResponse.json({ error: "Post ID not found" }, { status: 400 });

    const likes = await prisma.like.findMany({
      where: { postId },
      include: { user: { select: { name: true, image: true } } },
    });

    return NextResponse.json(likes);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}
