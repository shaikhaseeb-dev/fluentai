import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// ✅ Always load the adapter — lazy require avoids build-time Prisma execution.
// BUG FIX: previous code skipped adapter in production (NODE_ENV !== "production"
// is false in prod), meaning sessions were never persisted to the DB on Vercel.
const { PrismaAdapter } = require("@auth/prisma-adapter");
const { prisma } = require("./prisma");
const adapter = PrismaAdapter(prisma);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,

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

        const { prisma } = require("./prisma");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        return user;
      },
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        const { prisma } = require("./prisma");

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
