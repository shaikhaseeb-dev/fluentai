import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// ❌ NO Prisma adapter in production (avoids build crash)

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email) return null;

        const { prisma } = await import("@/lib/prisma");

        return prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
      },
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        const { prisma } = await import("@/lib/prisma");

        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { plan: true },
        });

        (session.user as any).plan = dbUser?.plan ?? "FREE";
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});
