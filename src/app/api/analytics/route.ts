import { NextRequest, NextResponse } from 'next/server';
import { 
  getAnalyticsMetrics, 
  getPageViewsOverTime, 
  getTopPages, 
  getDeviceCategories, 
  getBounceRateOverTime,
  getActiveUsers,
  getEventCount,
  getKeyEventsCount,
  getNewUsers,
  getActiveUsersInLastMinutes,
  getActiveUsersPerMinute,
  getUsersByCity,
  getUsersByCountry
} from '@/lib/google-analytics';

// Mock data function for when credentials are not available
function getMockAnalyticsData(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  const mockData = {
    'realtime-metrics': {
      activeUsers: 0,
      eventCount: 0,
      keyEvents: 0,
      newUsers: 0
    },
    'overview': {
      sessions: 0,
      users: 0,
      pageViews: 0,
      bounceRate: 0,
      avgSessionDuration: 0
    },
    'realtime': {
      activeUsers: 0,
      activeUsersPerMinute: Array.from({ length: 30 }, (_, i) => ({
        name: `${29 - i}m ago`,
        value: 0
      })),
      usersByCity: [],
      usersByCountry: []
    },
    'timeline': Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        pageViews: 0,
        bounceRate: 0
      };
    }),
    'pages': [],
    'devices': []
  };

  return NextResponse.json({
    success: true,
    data: mockData[type as keyof typeof mockData] || {},
    message: 'Analytics credentials not configured - showing mock data'
  });
}

// Middleware to verify token
// Commented out for now but kept for future use
/* 
const verifyToken = async (request: NextRequest) => {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  
  if (!token) {
    return false;
  }

  // In a real implementation, you would validate the token with your auth server
  // For now, we'll just check if it exists in localStorage
  return true;
};
*/

export async function GET(request: NextRequest) {
  try {
    // Check if Google Analytics credentials are available
    const hasCredentials = process.env.GOOGLE_CLIENT_EMAIL && 
                          process.env.GOOGLE_PRIVATE_KEY && 
                          process.env.GA_PROPERTY_ID;

    if (!hasCredentials) {
      console.warn('Google Analytics credentials not configured, returning mock data');
      return getMockAnalyticsData(request);
    }

    // Verify token - uncomment this in production
    // const isAuthenticated = await verifyToken(request);
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');

    switch (type) {
      case 'realtime-metrics': {
        // Get current metrics for the top summary cards
        const [activeUsers, eventCount, keyEvents, newUsers] = await Promise.all([
          getActiveUsers(),
          getEventCount(1), // Last day
          getKeyEventsCount(1), // Last day
          getNewUsers(7) // Last 7 days
        ]);
        
        return NextResponse.json({
          activeUsers,
          eventCount,
          keyEvents,
          newUsers
        });
      }
      
      case 'active-users-last-30-min': {
        const activeUsers = await getActiveUsersInLastMinutes(30);
        return NextResponse.json({ activeUsers });
      }
      
      case 'active-users-per-minute': {
        const data = await getActiveUsersPerMinute();
        return NextResponse.json(data);
      }
      
      case 'users-by-city': {
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const data = await getUsersByCity(limit);
        return NextResponse.json(data);
      }
      
      case 'users-by-country': {
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const data = await getUsersByCountry(limit);
        return NextResponse.json(data);
      }
      
      case 'overview': {
        try {
          console.log('Fetching analytics metrics for overview...');
          const data = await getAnalyticsMetrics();
          
          // Format metrics for dashboard
          const metricsMap: Record<string, string | number> = {};
          data.metrics.forEach(metric => {
            metricsMap[metric.name] = metric.value;
            console.log(`Metric ${metric.name}: ${metric.value}`);
          });

          // Calculate average session duration in minutes:seconds
          const durationInSeconds = parseInt(String(metricsMap.userEngagementDuration || '0'), 10);
          const minutes = Math.floor(durationInSeconds / 60);
          const seconds = durationInSeconds % 60;
          const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          
          // Format overview stats similar to what the frontend expects
          const formattedData = {
            visitors: {
              value: `${parseInt(String(metricsMap.activeUsers || '0'), 10).toLocaleString()}`,
              changePercent: 0, // This would require comparison with previous period
              description: 'Total visitors this month'
            },
            pageviews: {
              value: `${parseInt(String(metricsMap.screenPageViews || '0'), 10).toLocaleString()}`,
              changePercent: 0, // This would require comparison with previous period
              description: 'Total pageviews this month'
            },
            avgSessionDuration: {
              value: formattedDuration,
              changePercent: 0, // This would require comparison with previous period
              description: 'Average time on site'
            },
            bounceRate: {
              value: `${parseFloat(String(metricsMap.bounceRate || '0')).toFixed(1)}%`,
              changePercent: 0, // This would require comparison with previous period
              description: 'Visitors who leave after viewing only one page'
            },
            // Add engagement metrics explicitly if they exist
            engagedSessions: {
              value: `${parseInt(String(metricsMap.engagedSessions || '0'), 10).toLocaleString()}`,
              changePercent: 0,
              description: 'Sessions with engagement'
            }
          };

          console.log('Overview data formatted successfully');
          return NextResponse.json(formattedData);
        } catch (error) {
          console.error('Error fetching overview metrics:', error);
          // Return minimal data structure to prevent UI errors
          return NextResponse.json({
            visitors: { value: '0', changePercent: 0, description: 'Total visitors this month' },
            pageviews: { value: '0', changePercent: 0, description: 'Total pageviews this month' },
            avgSessionDuration: { value: '0:00', changePercent: 0, description: 'Average time on site' },
            bounceRate: { value: '0.0%', changePercent: 0, description: 'Visitors who leave after viewing only one page' },
            engagedSessions: { value: '0', changePercent: 0, description: 'Sessions with engagement' }
          });
        }
      }

      case 'pageViews': {
        const days = parseInt(searchParams.get('days') || '7', 10);
        const data = await getPageViewsOverTime(days);

        // Format for chart component
        const formattedData = data.map(item => ({
          name: formatDate(item.date),
          value: item.pageViews
        }));

        return NextResponse.json(formattedData);
      }

      case 'topPages': {
        const limit = parseInt(searchParams.get('limit') || '5', 10);
        const data = await getTopPages(limit);

        // Format for the table component
        const formattedData = data.map(item => ({
          name: formatPagePath(item.pagePath),
          visitors: item.pageViews
        }));

        return NextResponse.json(formattedData);
      }

      case 'devices': {
        try {
          const data = await getDeviceCategories();

          // Format for chart component and ensure we have valid data
          const formattedData = data.map(item => ({
            // Standardize device naming to match what the dashboard component expects
            name: capitalizeFirstLetter(item.device || 'Unknown'),
            value: item.users || 0,
            // Add device type field that may be expected by the component
            device: capitalizeFirstLetter(item.device || 'Unknown')
          }));

          console.log('Device data:', formattedData);
          return NextResponse.json(formattedData);
        } catch (error) {
          console.error('Error fetching device categories:', error);
          return NextResponse.json([], { status: 200 }); // Return empty array instead of error
        }
      }

      case 'bounceRate': {
        const days = parseInt(searchParams.get('days') || '7', 10);
        const data = await getBounceRateOverTime(days);

        // Format for chart component
        const formattedData = data.map(item => ({
          name: formatDate(item.date),
          value: parseFloat(item.bounceRate.toFixed(1))
        }));

        return NextResponse.json(formattedData);
      }

      default:
        return NextResponse.json({ error: 'Invalid data type requested' }, { status: 400 });
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    
    // Instead of returning 500 error, return mock data to prevent dashboard crashes
    console.warn('Falling back to mock data due to analytics error');
    return getMockAnalyticsData(request);
  }
}

// Helper functions
function formatDate(dateString: string): string {
  // Convert YYYYMMDD to MMM DD format
  if (dateString.length === 8) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return dateString;
}

function formatPagePath(pagePath: string): string {
  // Remove trailing slash and query params
  let path = pagePath.split('?')[0];
  if (path.endsWith('/') && path.length > 1) {
    path = path.slice(0, -1);
  }
  
  // Extract the last part of the path
  const parts = path.split('/');
  const lastPart = parts[parts.length - 1];
  
  // If path is just the root, return "Home"
  if (path === '/' || path === '') {
    return 'Home';
  }
  
  // Capitalize and replace dashes with spaces
  return lastPart === '' 
    ? capitalizeFirstLetter(parts[parts.length - 2]) 
    : capitalizeFirstLetter(lastPart.replace(/-/g, ' '));
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
