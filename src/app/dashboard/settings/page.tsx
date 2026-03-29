export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

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

  return <SettingsClient user={user!} userId={userId} />;
}
