import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const followSchema = z.object({
  userId: z.string().uuid({ message: "Invalid User Id" }),
  postUserId: z.string().uuid({ message: "Invalid Post User Id" }),
});

// ✅ GET Followers count
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "User id is required" },
      { status: 400 }
    );
  }

  const followersCount = await prisma.follow.count({
    where: { followingId: id },
  });

  return NextResponse.json({ followers: followersCount }, { status: 200 });
}

// ✅ POST → Follow
export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = followSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.issues[0].message },
      { status: 400 }
    );
  }

  const { userId, postUserId } = body;

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId: postUserId,
      },
    },
  });

  if (existingFollow) {
    return NextResponse.json({ message: "Already following" }, { status: 400 });
  }

  const follow = await prisma.follow.create({
    data: {
      followerId: userId,
      followingId: postUserId,
    },
  });

  return NextResponse.json(follow, { status: 200 });
}

// ✅ DELETE → Unfollow
export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const validation = followSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.issues[0].message },
      { status: 400 }
    );
  }

  const { userId, postUserId } = body;

  await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId: postUserId,
      },
    },
  });

  return NextResponse.json(
    { message: "Unfollowed successfully" },
    { status: 200 }
  );
}
