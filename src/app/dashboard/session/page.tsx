import { auth } from '@/lib/auth';
import { SessionInterface } from '@/components/session/SessionInterface';

export default async function SessionPage() {
  const session = await auth();

  return (
    <div className="h-full">
      <SessionInterface userId={session!.user!.id!} />
    </div>
  );
}
