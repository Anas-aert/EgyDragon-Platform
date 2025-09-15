import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// ✅ Check if user is following post's author
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const postUserId = searchParams.get("postUserId");

  if (!userId || !postUserId) {
    return NextResponse.json(
      { message: "userId and postUserId are required" },
      { status: 400 }
    );
  }

  // 🔎 لازم يبقى عندك جدول Follows يربط الـ users مع بعض
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId: postUserId,
      },
    },
  });

  return NextResponse.json({ isFollowing: !!follow }, { status: 200 });
}
