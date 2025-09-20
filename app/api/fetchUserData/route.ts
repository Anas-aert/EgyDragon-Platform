import { NextRequest, NextResponse } from "next/server";
import { URL } from "url";
import schema from "./schema";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams?.get("id");
  const obj = {
    id: id,
  };

  const validation = schema.safeParse(obj);

  if (!validation.success) {
    return NextResponse.json({ message: "Data not Valid" }, { status: 400 });
  }

  const userData = await prisma.user.findUnique({
    where: { id: validation.data.id },
    select:{ image:true, name:true, email:true }
  });

  return NextResponse.json(userData, {status:200})

}
