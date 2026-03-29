import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const checkoutSession = await createCheckoutSession(
    session.user.id!,
    session.user.email!
  );

  return NextResponse.json({ url: checkoutSession.url });
}
