import { prisma } from "@/prisma/client";
import { type AuthOptions } from "next-auth";
import Github from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";


export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Github({
      clientId:process.env.GITHUB_ID as string,
      clientSecret:process.env.GITHUB_SECRET as string
    })
    // ...add more providers here
  ],
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages:{
    signIn:"/auth/MainAuth",
  },
  callbacks: {
    async signIn({ user }) {
      // كل مرة يسجل يدخل: نحاول نخزنه في DB
      try {
        await prisma.user.upsert({
          where: { email: user.email! },
          update: {
            name: user.name,
            image: user.image,
          },
          create: {
            name: user.name!,
            email: user.email!,
            image: user.image,
          },
        });
      } catch (e) {
        console.error("❌ Error saving user: ", e);
      }

      return true; // السماح بتسجيل الدخول
    },
  },
  
};
