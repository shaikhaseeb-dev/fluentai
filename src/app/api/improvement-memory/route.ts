export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 🔥 Lazy imports (CRITICAL)
    const { prisma } = require("@/lib/prisma");
    const { auth } = require("@/lib/auth");

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, word, context } = await req.json();

    await prisma.improvementMemory.upsert({
      where: { userId_word: { userId, word } },
      create: { userId, word, context },
      update: {
        usageCount: { increment: 1 },
        lastUsedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Improvement memory error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // 🔥 Lazy imports (CRITICAL)
    const { prisma } = require("@/lib/prisma");
    const { auth } = require("@/lib/auth");

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const words = await prisma.improvementMemory.findMany({
      where: { userId: session.user.id! },
      orderBy: { usageCount: "desc" },
      take: 50,
    });

    return NextResponse.json({ words });
  } catch (error) {
    console.error("Improvement memory error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
