// Location: src/app/api/auth/nonce/route.ts
import { generateNonce } from 'siwe';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  const nonce = generateNonce();
  // We can temporarily store this nonce in a session or cookie later
  // For now, just sending it to the client is fine.
  return NextResponse.json({ nonce });
}  