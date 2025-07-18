import { NextResponse } from 'next/server';
import { 
  getActiveUsers, 
  getActiveUsersInLastMinutes, 
  makeAnalyticsRequest 
} from '@/lib/google-analytics';

/**
 * This is a debug endpoint to help troubleshoot Google Analytics integration
 */
export async function GET() {
  try {
    // First try a direct raw request to GA with minimal parameters
    const rawResponse = await makeAnalyticsRequest({
      dateRanges: [
        {
          startDate: '7daysAgo',
          endDate: 'today'
        }
      ],
      metrics: [
        { name: 'activeUsers' }
      ]
    });

    // Get active users with our regular methods
    const activeUsersCount = await getActiveUsers();
    const last30MinUsers = await getActiveUsersInLastMinutes(30);
    
    // Try a more forced approach - just count all active users for today
    const forcedResponse = await makeAnalyticsRequest({
      dateRanges: [
        {
          startDate: 'today',
          endDate: 'today'
        }
      ],
      metrics: [
        { name: 'activeUsers' }
      ],
      // No dimensions at all, just get total users
    });

    // Prepare response data
    const debugData = {
      timestamp: new Date().toISOString(),
      standardActiveUsers: activeUsersCount,
      last30MinUsers,
      rawResponse: {
        hasData: !!rawResponse.rows?.length,
        rowCount: rawResponse.rows?.length || 0,
        totalUsers: rawResponse.rows?.reduce((sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0', 10), 0) || 0,
        firstRow: rawResponse.rows?.[0] || null
      },
      forcedResponse: {
        hasData: !!forcedResponse.rows?.length,
        rowCount: forcedResponse.rows?.length || 0,
        totalUsers: forcedResponse.rows?.reduce((sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0', 10), 0) || 0,
        firstRow: forcedResponse.rows?.[0] || null
      },
      // For testing, set a fixed value to verify the API and dashboard are working
      mockUsers: 6
    };

    return NextResponse.json(debugData);
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
