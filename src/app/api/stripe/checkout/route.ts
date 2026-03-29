export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { auth } = require("@/lib/auth");
  const { createCheckoutSession } = require("@/lib/stripe");

  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const checkoutSession = await createCheckoutSession(
    session.user.id!,
    session.user.email!,
  );

  return NextResponse.json({ url: checkoutSession.url });
}
