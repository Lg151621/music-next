// auth.ts - central NextAuth v5 config
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, account, profile }) {
      // Store GitHub email on first sign-in
      if (account && profile && typeof profile?.email === "string") {
        token.email = profile.email;
      }

      // Admin role logic
      const admins = (process.env.ADMIN_EMAILS ?? "").split(",");
      const email = token.email ?? "";
      token.role = admins.includes(email) ? "admin" : "user";

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as "admin" | "user") ?? undefined;
      }
      return session;
    },
  },
};

// Initialize NextAuth v5: gives us handlers, auth(), signIn(), signOut()
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
