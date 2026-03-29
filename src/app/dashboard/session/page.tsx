export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SessionInterface } from "@/components/session/SessionInterface";

export default async function SessionPage() {
  const session = await auth();
  // FIX: was session!.user!.id! — crashes if session is null
  if (!session?.user?.id) redirect("/auth/signin");

  return (
    <div className="h-full">
      <SessionInterface userId={session.user.id} />
    </div>
  );
}
