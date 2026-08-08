import { NextResponse } from 'next/server';

/**
 * Verifies a Firebase ID token sent as `Authorization: Bearer <token>` and checks
 * the caller against the admin allowlist.
 *
 * There is no Admin SDK in this project, so the token is validated by handing it to
 * Google's Identity Toolkit — an invalid or expired token is rejected there rather
 * than trusted from the client.
 *
 * Returns null when the caller is an admin, or the response to send back when not.
 */
export async function requireAdmin(request: Request): Promise<NextResponse | null> {
  const header = request.headers.get('authorization') || '';
  const idToken = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';
  if (!idToken) {
    return NextResponse.json({ error: 'Innskráningar krafist' }, { status: 401 });
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Firebase API lykil vantar á þjóni' }, { status: 500 });
  }

  let email = '';
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!res.ok) {
      return NextResponse.json({ error: 'Ógilt eða útrunnið auðkenni' }, { status: 401 });
    }
    const data = await res.json();
    const account = data?.users?.[0];
    // Sign-up is open, so an unverified address proves nothing: without this check
    // anyone could register an allowlisted email with a password and pass as admin.
    if (!account?.emailVerified) {
      return NextResponse.json({ error: 'Netfang ekki staðfest' }, { status: 403 });
    }
    email = (account.email || '').toLowerCase();
  } catch {
    return NextResponse.json({ error: 'Gat ekki staðfest auðkenni' }, { status: 401 });
  }

  const allowlist = (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!email || !allowlist.includes(email)) {
    return NextResponse.json({ error: 'Aðgangur ekki heimill' }, { status: 403 });
  }

  return null;
}
