export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const { prisma } = require("@/lib/prisma");
  const { auth } = require("@/lib/auth");

  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { correctionMode, dailyGoalMinutes } = await req.json();

  await prisma.user.update({
    where: { id: session.user.id! },
    data: { correctionMode, dailyGoalMinutes },
  });

  return NextResponse.json({ success: true });
}
