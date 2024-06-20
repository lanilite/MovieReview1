import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { auth, signIn, signOut, handlers } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [Google],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async session({ session }) {
      const [user] = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1);

      session.user.role = user.role;

      return session;
    },
  },
});
