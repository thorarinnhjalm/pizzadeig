import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ad_id, type, placement } = body;

    if (!ad_id || !type || !placement) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Generate an anonymized session identifier rather than collecting raw PII
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Hash formulation utilizing Web Crypto API
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${ip}-${userAgent}`));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const sessionId = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);

    await addDoc(collection(db, 'ad_events'), {
      ad_id,
      type, // 'impression' | 'click'
      placement,
      session_id: sessionId,
      timestamp: serverTimestamp()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ad event error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
