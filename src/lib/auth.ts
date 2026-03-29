import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { DefaultSession } from "next-auth";
import type { NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan: string;
    };
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan?: string;
    } & DefaultSession["user"];
  }
}

const config: NextAuthConfig = {
  // Required on Vercel — without this, auth() returns null because
  // Vercel rewrites Host via x-forwarded-host which NextAuth rejects.
  trustHost: true,

  // Adapter persists User + Account rows for Google OAuth.
  // No conditional — it must be active in ALL environments including production.
  adapter: PrismaAdapter(prisma),

  session: {
    // JWT strategy is required when using Credentials alongside an adapter.
    // Database strategy silently breaks Credentials in NextAuth v5.
    // Sessions live in an encrypted cookie — no DB read per request.
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            password: true,
          },
        });

        if (!user || !user.password) return null;

        const bcrypt = require("bcryptjs");
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    // jwt runs on sign-in (user is populated) and on every session read.
    // Embed id + plan into the token on first sign-in only.
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id!;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id! },
          select: { plan: true },
        });
        token.plan = dbUser?.plan ?? "FREE";
      }

      // Re-sync plan from DB when client calls update() — e.g. after upgrade.
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { plan: true },
        });
        token.plan = dbUser?.plan ?? token.plan ?? "FREE";
      }

      return token;
    },

    // session runs on every auth() / useSession() call.
    // With JWT strategy, read from token — NOT from user (user is undefined here).
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.plan = token.plan ?? "FREE";
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
