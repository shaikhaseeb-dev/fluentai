import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";

// ✅ SINGLE, CLEAN TYPE AUGMENTATION
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan: string;
    } & DefaultSession["user"];
  }
}

// ✅ MAIN CONFIG
const config: NextAuthConfig = {
  trustHost: true,

  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
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
    async jwt({ token, user, trigger }) {
      // First login
      if (user) {
        token.id = user.id as string;

        const dbUser = await prisma.user.findUnique({
          where: { id: user.id as string },
          select: { plan: true },
        });

        token.plan = dbUser?.plan ?? "FREE";
      }

      // Update trigger (plan refresh)
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { plan: true },
        });

        token.plan = dbUser?.plan ?? token.plan ?? "FREE";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = (token.plan as string) ?? "FREE";
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
