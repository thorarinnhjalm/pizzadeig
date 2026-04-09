import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, email } = body;

    // VERY basic admin check to ensure this doesn't get abused publicly.
    // In a full production setup with Firebase Auth, you would verify an IdToken.
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
    if (!email || !adminEmails.includes(email.toLowerCase())) {
      return NextResponse.json({ error: 'Unauthorized. Not an admin.' }, { status: 401 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided.' }, { status: 400 });
    }

    const token = process.env.KRONAN_ACCESS_TOKEN;
    if (!token) {
      console.error('KRONAN_ACCESS_TOKEN missing in environment variables');
      return NextResponse.json({ error: 'Krónan API ekki tengt. Vantar token.' }, { status: 500 });
    }

    const headers = {
      'Authorization': `AccessToken ${token}`,
      'Content-Type': 'application/json'
    };

    console.log(`Bæti ${items.length} hraefnum i Shopping Note...`);
    const results = [];

    // Bæta línum á Shopping Note - 1 call per line needed? 
    // Wait, let's check schema for `/api/v1/shopping-notes/add-line/`. 
    // It accepts `sku` and `qty`.
    for (const item of items) {
      if (!item.sku) continue;
      
      const krBody = {
        sku: item.sku,
        qty: item.qty || 1
      };

      const res = await fetch('https://api.kronan.is/api/v1/shopping-notes/add-line/', {
        method: 'POST',
        headers,
        body: JSON.stringify(krBody)
      });
      
      if (!res.ok) {
        console.error(`Failed to add SKU ${item.sku}: ${res.status}`);
        const errTxt = await res.text();
        console.error('Kronan Error:', errTxt);
        // Continue even if one fails
      } else {
        const data = await res.json();
        results.push(data);
      }
    }

    return NextResponse.json({ success: true, added: results.length });
  } catch (error) {
    console.error('Error adding to Kronan:', error);
    return NextResponse.json({ error: 'Failed to add items to Krónan' }, { status: 500 });
  }
}
