import userSchema from "@/app/api/users/schema";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// ✅ GET Posts
export async function GET(request: NextRequest, body) {
  // const useridapi = getId()
  const userValidation = userSchema.safeParse(body);

  const authorRes = await prisma.user.findUnique({
    where: {
      id: "",
    },
  });
  const authorId = await authorRes;
  const posts = await prisma.post.findMany({
    where: { authorId: authorId.id as string },
  });

  if (!posts || posts.length === 0) {
    return NextResponse.json(
      { "Empty Page😢": "No posts found" },
      { status: 404 }
    );
  }

  return NextResponse.json(posts, { status: 200 });
}
