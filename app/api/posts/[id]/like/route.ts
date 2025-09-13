import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// ✅ Add/Remove Like
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/")[4]; // posts/[id]/like → index 4

    if (!id) return NextResponse.json({ error: "Post ID not found" }, { status: 400 });

    const { userId } = await request.json();
    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    // تحقق إذا المستخدم عمل لايك مسبقاً
    const existingLike = await prisma.like.findUnique({ where: { userId_postId: { userId, postId: id } } });

    let liked;
    if (existingLike) {
      // إزالة اللايك
      await prisma.like.delete({ where: { userId_postId: { userId, postId: id } } });
      liked = false;
    } else {
      // إضافة لايك
      await prisma.like.create({ data: { userId, postId: id } });
      liked = true;
    }

    // جلب عدد اللايكات المحدث
    const likesCount = await prisma.like.count({ where: { postId: id } });

    return NextResponse.json({ success: true, liked, likesCount });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}

// ✅ Get Likes
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/")[4];

    if (!id) return NextResponse.json({ error: "Post ID not found" }, { status: 400 });

    const likes = await prisma.like.findMany({
      where: { postId: id },
      include: { user: { select: { name: true, image: true } } },
    });

    return NextResponse.json(likes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 });
  }
}
