import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/nextAuth"; // ده اللي انت كاتبه قبل كده

export const { auth, signIn, signOut } = NextAuth(authOptions);
