import { NextRequest, NextResponse } from 'next/server';
import { 
  getActiveUsers, 
  getActiveUsersPerMinute, 
  getActiveUsersInLastMinutes,
  getEventCount, 
  getKeyEventsCount, 
  getNewUsers, 
  getUsersByCountry, 
  getUsersByCity 
} from '@/lib/google-analytics';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');

    switch (type) {
      case 'activeUsers': {
        console.log('Fetching real-time data at', new Date().toISOString());
        
        // We need to make these requests sequential to avoid issues with Google Analytics API rate limits
        
        // Get active user metrics - use the actual count from Google Analytics
        const activeUsers = await getActiveUsers();
        console.log('Current active users:', activeUsers);
        
        // Get actual active users in the last 5 minutes from Google Analytics - most important metric
        const last5Min = await getActiveUsersInLastMinutes(5);
        console.log('Users in last 5 min:', last5Min);
        
        // Get actual active users in the last 30 minutes from Google Analytics
        const last30Min = await getActiveUsersInLastMinutes(30);
        console.log('Users in last 30 min:', last30Min);
        
        // Get new users for today
        const newUsers = await getNewUsers(1);
        console.log('New users today:', newUsers);
        
        // Get the timeline for active users per minute for the chart
        const timeline = await getActiveUsersPerMinute();
        console.log('Timeline data points:', timeline?.length);
        
        // Detailed debugging info
        console.log('Returning real-time data:', { 
          activeUsers, 
          last5Min, 
          last30Min, 
          newUsers,
          timelinePoints: timeline?.length 
        });
        
        return NextResponse.json({
          activeUsers,
          newUsers,
          timeline,
          last30Min,
          last5Min
        });
      }
      
      case 'events': {
        const totalEvents = await getEventCount(1); // Last day
        const events = await getKeyEventsCount(1); // Last day
        
        return NextResponse.json({
          totalEvents,
          events
        });
      }
      
      case 'countries': {
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const data = await getUsersByCountry(limit);
        return NextResponse.json(data);
      }
      
      case 'cities': {
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const data = await getUsersByCity(limit);
        return NextResponse.json(data);
      }
      
      default:
        return NextResponse.json({ error: 'Invalid analytics type requested' }, { status: 400 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in analytics API:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
