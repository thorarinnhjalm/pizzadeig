import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  const siteUrl = process.env.SEARCH_CONSOLE_SITE_URL || 'sc-domain:pizzadeig.is';
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!credentials) {
    return NextResponse.json(
      { error: 'GOOGLE_SERVICE_ACCOUNT_KEY missing' },
      { status: 400 }
    );
  }

  try {
    const parsed = JSON.parse(credentials);
    const auth = new google.auth.GoogleAuth({
      credentials: parsed,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const searchconsole = google.searchconsole({ version: 'v1', auth });

    // Last 28 days performance
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 28);

    const fmt = (d: Date) => d.toISOString().split('T')[0];

    const response = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: fmt(startDate),
        endDate: fmt(endDate),
        dimensions: ['query'],
        rowLimit: 10,
      },
    });

    // Also get page-level data
    const pagesResponse = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: fmt(startDate),
        endDate: fmt(endDate),
        dimensions: ['page'],
        rowLimit: 10,
      },
    });

    // Totals
    const totals = (response.data.rows ?? []).reduce(
      (acc: { clicks: number; impressions: number; ctr: number; position: number }, row) => ({
        clicks: acc.clicks + (row.clicks ?? 0),
        impressions: acc.impressions + (row.impressions ?? 0),
        ctr: 0,
        position: 0,
      }),
      { clicks: 0, impressions: 0, ctr: 0, position: 0 }
    );
    if (totals.impressions > 0) {
      totals.ctr = totals.clicks / totals.impressions;
    }

    const topQueries = (response.data.rows ?? []).map(row => ({
      query: row.keys?.[0] ?? '',
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: Math.round(row.position ?? 0),
    }));

    const topPages = (pagesResponse.data.rows ?? []).map(row => ({
      page: row.keys?.[0] ?? '',
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: Math.round(row.position ?? 0),
    }));

    return NextResponse.json({
      totals,
      topQueries,
      topPages,
      period: { start: fmt(startDate), end: fmt(endDate) },
    });
  } catch (err) {
    console.error('Search Console API error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch Search Console data' },
      { status: 500 }
    );
  }
}
