import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { google } from 'googleapis';
import { getServiceAccountCredentials } from '@/lib/google-auth';

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const siteUrl = process.env.SEARCH_CONSOLE_SITE_URL || 'sc-domain:pizzadeig.is';
  const credentials = getServiceAccountCredentials();

  if (!credentials) {
    return NextResponse.json(
      { error: 'Service account vantar. Settu GOOGLE_SERVICE_ACCOUNT_KEY_PATH eða service-account.json í rót verkefnis.' },
      { status: 400 }
    );
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const searchconsole = google.searchconsole({ version: 'v1', auth });

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

    const pagesResponse = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: fmt(startDate),
        endDate: fmt(endDate),
        dimensions: ['page'],
        rowLimit: 10,
      },
    });

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
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Search Console API error:', message);
    return NextResponse.json({ error: `Search Console villa: ${message}` }, { status: 500 });
  }
}
