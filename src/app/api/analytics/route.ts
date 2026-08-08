import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { getServiceAccountCredentials } from '@/lib/google-auth';

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const propertyId = process.env.GA4_PROPERTY_ID;
  const credentials = getServiceAccountCredentials();

  if (!propertyId) {
    return NextResponse.json({ error: 'GA4_PROPERTY_ID vantar í env' }, { status: 400 });
  }

  if (!credentials) {
    return NextResponse.json(
      { error: 'Service account vantar. Settu GOOGLE_SERVICE_ACCOUNT_KEY_PATH eða service-account.json í rót verkefnis.' },
      { status: 400 }
    );
  }

  try {
    const client = new BetaAnalyticsDataClient({ credentials });

    // Fetch last 30 days and 7 days of key metrics
    const [report] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        { startDate: '30daysAgo', endDate: 'today' },
        { startDate: '7daysAgo', endDate: 'today' },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
    });

    // Fetch top pages
    const [pagesReport] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
      ],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    });

    // Fetch real-time active users
    const [realtime] = await client.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: 'activeUsers' }],
    });

    const row30d = report.rows?.[0];
    const row7d = report.rows?.[1];

    const metrics30d = {
      activeUsers: Number(row30d?.metricValues?.[0]?.value ?? 0),
      sessions: Number(row30d?.metricValues?.[1]?.value ?? 0),
      pageViews: Number(row30d?.metricValues?.[2]?.value ?? 0),
      avgSessionDuration: Number(row30d?.metricValues?.[3]?.value ?? 0),
      bounceRate: Number(row30d?.metricValues?.[4]?.value ?? 0),
    };

    const metrics7d = {
      activeUsers: Number(row7d?.metricValues?.[0]?.value ?? 0),
      sessions: Number(row7d?.metricValues?.[1]?.value ?? 0),
      pageViews: Number(row7d?.metricValues?.[2]?.value ?? 0),
    };

    const topPages = (pagesReport.rows ?? []).map(row => ({
      path: row.dimensionValues?.[0]?.value ?? '',
      views: Number(row.metricValues?.[0]?.value ?? 0),
      users: Number(row.metricValues?.[1]?.value ?? 0),
    }));

    const realtimeUsers = Number(realtime.rows?.[0]?.metricValues?.[0]?.value ?? 0);

    return NextResponse.json({ metrics30d, metrics7d, topPages, realtimeUsers });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('GA4 API error:', message);
    return NextResponse.json({ error: `GA4 villa: ${message}` }, { status: 500 });
  }
}
