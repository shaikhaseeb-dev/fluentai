export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
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
