import { NextResponse } from 'next/server';

// Simplistic cache to avoid hitting Kronan API infinitely for the same products.
// In production, redis or Next.js revalidate is better, but this handles basic repeated requests in memory.
const memoryCache: Record<string, { data: any; expiry: number }> = {};
const CACHE_TTL = 1000 * 60 * 60; // 1 klst

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sku = searchParams.get('sku');

    if (!sku) {
      return NextResponse.json({ error: 'Missing sku parameter' }, { status: 400 });
    }

    const now = Date.now();
    if (memoryCache[sku] && memoryCache[sku].expiry > now) {
      return NextResponse.json(memoryCache[sku].data);
    }

    const token = process.env.KRONAN_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Krónan API ekki tengt. Vantar token.' }, { status: 500 });
    }

    const headers = {
      'Authorization': `AccessToken ${token}`,
      'Content-Type': 'application/json'
    };

    // We use the search endpoint because there is no direct public /products/sku endpoint documented
    const res = await fetch(`https://api.kronan.is/api/v1/products/search/?query=${sku}`, {
      headers
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Kronan' }, { status: res.status });
    }

    const data = await res.json();
    let productMatch = null;

    if (data.hits && data.hits.length > 0) {
       // Leita í hits að nákvæmu sku til öryggis
       productMatch = data.hits.find((p: any) => p.sku === sku) || data.hits[0];
    } else if (data.items && data.items.length > 0) {
       productMatch = data.items.find((p: any) => p.sku === sku || p.id === sku) || data.items[0];
    } else if (data.results && data.results.length > 0) {
       productMatch = data.results.find((p: any) => p.sku === sku) || data.results[0];
    }

    if (!productMatch) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const responseData = {
      sku: productMatch.sku || productMatch.id,
      name: productMatch.name || productMatch.title,
      price: productMatch.price,
      thumbnail: productMatch.thumbnail || productMatch.image,
      priceInfo: productMatch.priceInfo
    };

    memoryCache[sku] = {
      data: responseData,
      expiry: now + CACHE_TTL
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching from Kronan via proxy:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
