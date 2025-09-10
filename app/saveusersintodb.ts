import { getServerSession } from "next-auth";
import { authOptions } from "./lib/nextAuth";

export async function SaveUsersss() {
  const session = await getServerSession(authOptions);
  if (session) {
    const res = await fetch("https://egydragon-anas.vercel.app/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }),
    });

    await res.json();
  }
}
