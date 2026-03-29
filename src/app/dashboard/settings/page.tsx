export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
  const session = await auth();
  // FIX: was session!.user!.id! — crashes if session is null
  if (!session?.user?.id) redirect("/auth/signin");
  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      plan: true,
      correctionMode: true,
      dailyGoalMinutes: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  if (!user) redirect("/auth/signin");

  return <SettingsClient user={user} userId={userId} />;
}
