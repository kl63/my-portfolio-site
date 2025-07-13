import { NextRequest, NextResponse } from 'next/server';
import { 
  getAnalyticsMetrics, 
  getPageViewsOverTime, 
  getTopPages, 
  getDeviceCategories, 
  getBounceRateOverTime 
} from '@/lib/google-analytics';

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
    // Verify token - uncomment this in production
    // const isAuthenticated = await verifyToken(request);
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');

    switch (type) {
      case 'overview': {
        const data = await getAnalyticsMetrics();
        
        // Format metrics for dashboard
        const metricsMap: Record<string, string | number> = {};
        data.metrics.forEach(metric => {
          metricsMap[metric.name] = metric.value;
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
          }
        };

        return NextResponse.json(formattedData);
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
        const data = await getDeviceCategories();

        // Format for chart component
        const formattedData = data.map(item => ({
          name: capitalizeFirstLetter(item.device),
          value: item.users
        }));

        return NextResponse.json(formattedData);
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
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
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
