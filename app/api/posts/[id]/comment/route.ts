import { authOptions } from "@/app/lib/nextAuth";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "You should be Signedin" },
        { status: 401 }
      );
    }

    const { content } = await req.json();
    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, message: "Content is required" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: params.id,
        userId: session.user.id, // هنا ربط الكومنت بالمستخدم من السيشن
      },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
    });

    return NextResponse.json({ success: true, comment });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get("postId");
    if (!postId) return NextResponse.json({ error: "Post ID required" }, { status: 400 });

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(
      comments.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }))
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}
