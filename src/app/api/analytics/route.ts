import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export async function GET() {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!propertyId || !credentials) {
    return NextResponse.json(
      { error: 'GA4_PROPERTY_ID or GOOGLE_SERVICE_ACCOUNT_KEY missing' },
      { status: 400 }
    );
  }

  try {
    const parsed = JSON.parse(credentials);
    const client = new BetaAnalyticsDataClient({ credentials: parsed });

    // Fetch last 30 days of key metrics
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

    // Parse 30-day totals
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

    return NextResponse.json({
      metrics30d,
      metrics7d,
      topPages,
      realtimeUsers,
    });
  } catch (err) {
    console.error('GA4 API error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch GA4 data' },
      { status: 500 }
    );
  }
}
