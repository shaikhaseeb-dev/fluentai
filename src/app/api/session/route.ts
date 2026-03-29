export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prisma } = require("@/lib/prisma");
    const { auth } = require("@/lib/auth");

    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { userId } = await req.json();

    // Check free plan limits: max 5 min/day
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.plan === "FREE") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaySessions = await prisma.practiceSession.findMany({
        where: { userId, startedAt: { gte: today }, endedAt: { not: null } },
        select: { duration: true },
      });
      const totalToday = todaySessions.reduce(
        (acc: number, s: any) => acc + (s.duration ?? 0),
        0,
      );
      if (totalToday >= 300) {
        return NextResponse.json(
          {
            error:
              "Daily limit reached. Upgrade to Pro for unlimited sessions.",
          },
          { status: 403 },
        );
      }
    }

    const practiceSession = await prisma.practiceSession.create({
      data: { userId },
    });

    return NextResponse.json({ sessionId: practiceSession.id });
  } catch (error) {
    console.error("Session start error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
