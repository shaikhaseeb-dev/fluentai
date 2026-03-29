import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// ❌ REMOVE direct prisma import here

// ✅ Lazy adapter (CRITICAL FIX)
let adapter: any = undefined;

if (process.env.NODE_ENV !== "production") {
  const { PrismaAdapter } = require("@auth/prisma-adapter");
  const { prisma } = require("./prisma");
  adapter = PrismaAdapter(prisma);
}

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

        // 🔥 Lazy prisma import here too
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
