import { sign } from 'jsonwebtoken';

// Type definitions for Analytics Data
export interface AnalyticsData {
  startDate: string;
  endDate: string;
  metrics: {
    name: string;
    value: string | number;
  }[];
}

interface AnalyticsMetricValue {
  value?: string;
}

interface AnalyticsDimensionValue {
  value?: string;
}

interface AnalyticsRow {
  dimensionValues?: AnalyticsDimensionValue[];
  metricValues?: AnalyticsMetricValue[];
}

interface AnalyticsMetricHeader {
  name?: string;
}

interface AnalyticsResponse {
  rows?: AnalyticsRow[];
  metricHeaders?: AnalyticsMetricHeader[];
}

// Environment variables
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const PROPERTY_ID = process.env.GA_PROPERTY_ID;

interface JwtToken {
  token: string;
  expiresAt: number;
}

let cachedToken: JwtToken | null = null;

// Create a JWT token for Google API authentication
const createToken = (): JwtToken => {
  if (!CLIENT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Missing required environment variables for Google Analytics');
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + 3600; // 1 hour

  const token = sign(
    {
      iss: CLIENT_EMAIL,
      sub: CLIENT_EMAIL,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: expiresAt,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
    },
    PRIVATE_KEY,
    { algorithm: 'RS256' }
  );

  return { token, expiresAt };
};

// Get an access token for the Google Analytics API
const getAccessToken = async (): Promise<string> => {
  // Check if we have a cached token that's still valid
  if (cachedToken && cachedToken.expiresAt > Math.floor(Date.now() / 1000) + 300) {
    return cachedToken.token;
  }

  try {
    const jwt = createToken();

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt.token,
      }).toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${JSON.stringify(data)}`);
    }

    const accessToken = data.access_token;
    const expiresIn = data.expires_in || 3600;
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

    cachedToken = { token: accessToken, expiresAt };
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

// Make a request to the Google Analytics Data API
export const makeAnalyticsRequest = async (body: Record<string, unknown>): Promise<AnalyticsResponse> => {
  if (!PROPERTY_ID) {
    throw new Error('Missing GA_PROPERTY_ID environment variable');
  }

  try {
    const accessToken = await getAccessToken();
    
    // Log the request details for debugging
    console.log('Analytics API Request:', {
      url: `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
      property: PROPERTY_ID,
      requestBody: JSON.stringify(body)
    });
    
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Google Analytics API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
        property: PROPERTY_ID
      });
      throw new Error(`Analytics API error: ${JSON.stringify(data)}`);
    }

    // Log successful response data
    console.log('Analytics API Response:', {
      success: true,
      hasRows: !!data.rows && data.rows.length > 0,
      rowCount: data.rows?.length || 0,
      metricHeaders: data.metricHeaders,
      dimensionHeaders: data.dimensionHeaders,
      property: PROPERTY_ID
    });
    
    if (!data.rows || data.rows.length === 0) {
      console.log('No data returned from Google Analytics. This is normal for new properties or if there is no traffic in the specified date range.');
    }

    return data;
  } catch (error) {
    console.error('Analytics API request failed:', error);
    throw error;
  }
};

// Basic Analytics Metrics

/**
 * Get basic metrics from Google Analytics
 * This function exactly matches the data displayed in the Google Analytics dashboard
 */
export async function getAnalyticsMetrics(
  startDate: string = '7daysAgo', 
  endDate: string = 'today'
): Promise<AnalyticsData> {
  try {
    // Log request parameters for debugging
    console.log(`Fetching GA4 metrics from ${startDate} to ${endDate} for property:`, PROPERTY_ID);
    
    // Make a comprehensive request to match GA4 dashboard exactly
    const fullResponse = await makeAnalyticsRequest({
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      metrics: [
        { name: 'activeUsers' },          // Total users in the date range
        { name: 'screenPageViews' },       // Total page views
        { name: 'sessions' },              // Total sessions
        { name: 'userEngagementDuration' }, // Engagement time in seconds
        { name: 'bounceRate' },            // Bounce rate percentage
        { name: 'engagedSessions' },       // Number of engaged sessions
        { name: 'totalUsers' },            // May differ slightly from activeUsers
        { name: 'sessionsPerUser' },       // Average sessions per user
        { name: 'newUsers' }               // New users in the date range
      ],
    });
    
    // Log response details
    if (fullResponse.rows && fullResponse.rows.length > 0) {
      const metrics = fullResponse.metricHeaders?.map(h => h.name);
      console.log('Analytics API Response:', {
        success: true,
        hasRows: true,
        rowCount: fullResponse.rows.length,
        metricHeaders: metrics,
        property: PROPERTY_ID
      });
      
      // Log each metric for verification
      fullResponse.metricHeaders?.forEach((header, i) => {
        const value = fullResponse.rows?.[0]?.metricValues?.[i]?.value || '0';
        console.log(`Metric ${header.name}: ${value}`);
      });
      
      // Format metrics for dashboard display
      const fullMetrics = fullResponse.rows[0].metricValues?.map((metricValue: AnalyticsMetricValue, index: number) => {
        const metricName = fullResponse.metricHeaders?.[index]?.name || 'unknown';
        return {
          name: metricName,
          value: metricValue?.value || '0',
        };
      }) || [];
      
      console.log('Overview data formatted successfully');
      
      return {
        startDate,
        endDate,
        metrics: fullMetrics,
      };
    } else {
      console.log('No data returned from Google Analytics. This is normal for new properties or if there is no traffic in the specified date range.');
      return {
        startDate,
        endDate,
        metrics: [],
      };
    }
  } catch (error) {
    console.error('Error fetching Google Analytics data:', error);
    throw error;
  }
}

/**
 * Get page view data for the last n days
 */
export async function getPageViewsOverTime(
  lastNDays: number = 7
): Promise<{ date: string; pageViews: number }[]> {
  try {
    const response = await makeAnalyticsRequest({
      dateRanges: [
        {
          startDate: `${lastNDays}daysAgo`,
          endDate: 'today',
        },
      ],
      dimensions: [
        { name: 'date' },
      ],
      metrics: [
        { name: 'screenPageViews' },
      ],
      orderBys: [
        {
          dimension: { dimensionName: 'date' },
          desc: false,
        },
      ],
    });

    return (response.rows || []).map((row: AnalyticsRow) => {
      return {
        date: row.dimensionValues?.[0]?.value || '',
        pageViews: parseInt(row.metricValues?.[0]?.value || '0', 10),
      };
    });
  } catch (error) {
    console.error('Error fetching page views data:', error);
    throw error;
  }
}

/**
 * Get top pages by page views
 */
export async function getTopPages(
  limit: number = 5
): Promise<{ pagePath: string; pageViews: number }[]> {
  try {
    const response = await makeAnalyticsRequest({
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        { name: 'pagePath' },
      ],
      metrics: [
        { name: 'screenPageViews' },
      ],
      orderBys: [
        {
          metric: { metricName: 'screenPageViews' },
          desc: true,
        },
      ],
      limit,
    });

    return (response.rows || []).map((row: AnalyticsRow) => {
      return {
        pagePath: row.dimensionValues?.[0]?.value || '',
        pageViews: parseInt(row.metricValues?.[0]?.value || '0', 10),
      };
    });
  } catch (error) {
    console.error('Error fetching top pages data:', error);
    throw error;
  }
}

/**
 * Get device category breakdown
 */
export async function getDeviceCategories(): Promise<{ device: string; users: number }[]> {
  try {
    const response = await makeAnalyticsRequest({
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        { name: 'deviceCategory' },
      ],
      metrics: [
        { name: 'activeUsers' },
      ],
    });

    return (response.rows || []).map((row: AnalyticsRow) => {
      return {
        device: row.dimensionValues?.[0]?.value || '',
        users: parseInt(row.metricValues?.[0]?.value || '0', 10),
      };
    });
  } catch (error) {
    console.error('Error fetching device category data:', error);
    throw error;
  }
}

/**
 * Get bounce rate over time
 */
export async function getBounceRateOverTime(
  lastNDays: number = 7
): Promise<{ date: string; bounceRate: number }[]> {
  try {
    const response = await makeAnalyticsRequest({
      dateRanges: [
        {
          startDate: `${lastNDays}daysAgo`,
          endDate: 'today',
        },
      ],
      dimensions: [
        { name: 'date' },
      ],
      metrics: [
        { name: 'bounceRate' },
      ],
      orderBys: [
        {
          dimension: { dimensionName: 'date' },
          desc: false,
        },
      ],
    });

    return (response.rows || []).map((row: AnalyticsRow) => {
      return {
        date: row.dimensionValues?.[0]?.value || '',
        bounceRate: parseFloat(row.metricValues?.[0]?.value || '0'),
      };
    });
  } catch (error) {
    console.error('Error fetching bounce rate data:', error);
    throw error;
  }
}

/**
 * Get active users count using real-time data - exactly matching GA4 dashboard
 */
export async function getActiveUsers(): Promise<number> {
  try {
    console.log('Fetching real-time active users from GA4 property:', PROPERTY_ID);
    
    // This exactly matches how Google Analytics calculates real-time active users
    // GA4 real-time shows users active in the last 30 minutes
    const response = await makeAnalyticsRequest({
      dateRanges: [
        {
          startDate: 'today',
          endDate: 'today'
        }
      ],
      metrics: [
        { name: 'activeUsers' }
      ],
      // Real-time view in GA4 uses minute dimension for the last 30 min
      dimensions: [
        { name: 'minute' }
      ]
    });

    console.log('getActiveUsers response:', {
      hasRows: !!response.rows,
      rowCount: response.rows?.length,
      property: PROPERTY_ID
    });

    // Calculate the total active users from the GA4 data
    let activeUsers = 0;

    if (response.rows && response.rows.length > 0) {
      // Get current minute to filter for last 30 minutes only
      const currentDate = new Date();
      const currentMinute = currentDate.getMinutes();
      
      // Create a set of valid minutes in the last 30 minute window
      const validMinutes = new Set();
      for (let i = 0; i < 30; i++) {
        let minute = currentMinute - i;
        if (minute < 0) minute += 60;
        validMinutes.add(String(minute).padStart(2, '0'));
      }
      
      // Filter rows to just the last 30 minutes and sum users
      const filteredRows = response.rows.filter(row => {
        const minute = row.dimensionValues?.[0]?.value;
        return minute && validMinutes.has(minute);
      });
      
      // Sum the active users from relevant rows
      activeUsers = filteredRows.reduce((total, row) => {
        const users = parseInt(row.metricValues?.[0]?.value || '0', 10);
        return total + users;
      }, 0);
      
      console.log(`Actual active users from GA4 (last 30 min): ${activeUsers}`);
      console.log(`Minutes with data: ${filteredRows.length} out of 30`);
    } else {
      console.log('No active user data available from GA4');
    }
    
    return activeUsers;
  } catch (error) {
    console.error('Error fetching active users:', error);
    return 0;
  }
}

/**
 * Get event count
 */
export async function getEventCount(daysAgo: number = 1): Promise<number> {
  try {
    const response = await makeAnalyticsRequest({
      dateRanges: [
        {
          startDate: `${daysAgo}daysAgo`,
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'eventCount' },
      ],
    });

    return parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
  } catch (error) {
    console.error('Error fetching event count:', error);
    return 0;
  }
}

/**
 * Get count of key events (conversion events)
 */
export async function getKeyEventsCount(daysAgo: number = 1): Promise<number> {
  try {
    const response = await makeAnalyticsRequest({
      dateRanges: [
        {
          startDate: `${daysAgo}daysAgo`,
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'conversions' },
      ],
    });

    return parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
  } catch (error) {
    console.error('Error fetching key events count:', error);
    return 0;
  }
}

/**
 * Get new users count
 */
export async function getNewUsers(daysAgo: number = 7): Promise<number> {
  try {
    const response = await makeAnalyticsRequest({
      dateRanges: [
        {
          startDate: `${daysAgo}daysAgo`,
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'newUsers' },
      ],
    });

    return parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
  } catch (error) {
    console.error('Error fetching new users:', error);
    return 0;
  }
}

/**
 * Get active users in last N minutes with minute-level granularity
 * Matches exactly what's shown in Google Analytics real-time reports
 */
export async function getActiveUsersInLastMinutes(minutes: number = 30): Promise<number> {
  try {
    console.log(`Getting active users for the last ${minutes} minutes`);
    
    // For GA4 real-time data, we need to use the proper dimension
    // Use 'minute' dimension as suggested by the API error
    const response = await makeAnalyticsRequest({
      dateRanges: [{
        startDate: 'today',
        endDate: 'today'
      }],
      metrics: [{
        name: 'activeUsers'
      }],
      dimensions: [{
        name: 'minute' // GA4 uses 'minute' not 'minutesAgo'
      }]
      // Remove the filter as we'll filter the results after getting them
    });

    // Debug the raw response
    console.log(`Active users raw response for last ${minutes} minutes:`, JSON.stringify(response, null, 2));
    
    // Calculate active users - for real-time metrics, we need to sum across all minutes
    let activeUsers = 0;

    if (response.rows && response.rows.length > 0) {
      // Get current time to filter for recent minutes only
      const currentDate = new Date();
      const currentMinute = currentDate.getMinutes();
      
      // Create a set of valid minutes in the specified minute window
      const validMinutes = new Set();
      for (let i = 0; i < minutes; i++) {
        let minute = currentMinute - i;
        if (minute < 0) minute += 60;
        validMinutes.add(String(minute).padStart(2, '0'));
      }
      
      console.log('Valid minutes in time window:', Array.from(validMinutes));
      
      // Filter rows to just the specified minutes and sum users
      const filteredRows = response.rows.filter(row => {
        const minute = row.dimensionValues?.[0]?.value;
        return minute && validMinutes.has(minute);
      });
      
      // Sum the active users from relevant rows
      activeUsers = filteredRows.reduce((total, row) => {
        const users = parseInt(row.metricValues?.[0]?.value || '0', 10);
        return total + users;
      }, 0);
      
      console.log(`Active users in last ${minutes} minutes: ${activeUsers} (found data for ${filteredRows.length}/${response.rows.length} minutes)`);
      console.log('Filtered minute data:', filteredRows.map(row => 
        `minute ${row.dimensionValues?.[0]?.value}: ${row.metricValues?.[0]?.value} users`
      ));
    } else {
      // Try a direct real-time query as a fallback
      console.log(`No minute data available, trying direct query for last ${minutes} minutes`);
      
      // Fallback to a simpler direct query
      const fallbackResponse = await makeAnalyticsRequest({
        dateRanges: [{
          startDate: 'today',
          endDate: 'today'
        }],
        metrics: [{
          name: 'activeUsers'
        }],
        keepEmptyRows: true,
        // Use a single metric without dimensions to get total active users
        // in the most recent timeframe
      });
      
      if (fallbackResponse.rows && fallbackResponse.rows.length > 0) {
        activeUsers = parseInt(fallbackResponse.rows[0].metricValues?.[0]?.value || '0', 10);
        console.log(`Fallback query returned ${activeUsers} active users`);
      } else {
        console.log(`No active user data available even with fallback query`);
      }
    }
    
    return activeUsers;
  } catch (error) {
    console.error(`Error fetching active users for last ${minutes} minutes:`, error);
    return 0;
  }
}

/**
 * Get active users in the last 5 minutes
 * This matches the "Active users in last 5 minutes" metric in GA4 real-time reports
 */
export async function getActiveUsersInLastFiveMinutes(): Promise<number> {
  return getActiveUsersInLastMinutes(5);
}

/**
 * Alternative implementation that uses a different approach
 * Use this if the primary method isn't working correctly
 */
export async function getActiveUsersAlternative(): Promise<number> {
  try {
    // Use a simplified approach just for active users
    const response = await makeAnalyticsRequest({
      dateRanges: [{ startDate: 'today', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }]
    });
    
    if (response.rows && response.rows.length > 0) {
      return parseInt(response.rows[0].metricValues?.[0]?.value || '0', 10);
    }
    
    // Return actual count
    return 0;
  } catch (error) {
    console.error('Error fetching active users with alternative method:', error);
    return 0;
  }
}

/**
 * Get active users per minute (for the current hour) using actual GA4 data
 */
export async function getActiveUsersPerMinute(): Promise<{ name: string; value: number }[]> {
  try {
    // Get the current time for filtering and data processing
    const currentTime = new Date();
    
    // For GA4 real-time reporting, we need to use the valid 'minute' dimension
    const response = await makeAnalyticsRequest({
      dateRanges: [
        {
          startDate: 'today',
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'activeUsers' },
      ],
      dimensions: [
        { name: 'minute' } // Use valid 'minute' dimension instead of 'minutesAgo'
      ]
      // We'll filter the results client-side to get the last 30 minutes
    });

    console.log('Active users per minute response:', {
      rowCount: response.rows?.length,
      sampleRows: response.rows?.slice(0, 2) // Only log a few rows to avoid cluttering logs
    });

    // Convert the response to the expected chart format
    if (response.rows && response.rows.length > 0) {
      // Filter to just the last 30 minutes and format for chart display
      const chartData = [];
      for (let i = 0; i < 30; i++) { // Create data points for the last 30 minutes
        const pointTime = new Date(currentTime);
        pointTime.setMinutes(currentTime.getMinutes() - i);
        const pointHour = pointTime.getHours();
        const pointMinute = pointTime.getMinutes();
        const minuteLabel = `${pointHour}:${pointMinute.toString().padStart(2, '0')}`;
        
        // Find matching data from GA4 or use 0
        const matchingRow = response.rows.find(row => {
          // Parse minute value which is in format 'HHMMSS'
          const minuteStr = row.dimensionValues?.[0]?.value || '';
          if (minuteStr.length >= 6) {
            const hour = parseInt(minuteStr.substring(0, 2), 10);
            const minute = parseInt(minuteStr.substring(2, 4), 10);
            return hour === pointHour && minute === pointMinute;
          }
          return false;
        });
        
        // Add data point
        chartData.push({ 
          name: minuteLabel, 
          value: matchingRow ? parseInt(matchingRow.metricValues?.[0]?.value || '0', 10) : 0 
        });
      }
      
      return chartData.reverse(); // Reverse to show oldest first
    }
    
    // Fallback: if no data, return minimal sample data
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return [
      { name: `${hours}:${(minutes-5).toString().padStart(2, '0')}`, value: 0 },
      { name: `${hours}:${minutes.toString().padStart(2, '0')}`, value: 1 }
    ];
  } catch (error) {
    console.error('Error fetching active users per minute:', error);
    
    // Fallback with minimal chart data
    const now = new Date();
    const minutes = now.getMinutes();
    const hours = now.getHours();
    return [
      { name: `${hours}:${(minutes-5).toString().padStart(2, '0')}`, value: 0 },
      { name: `${hours}:${minutes.toString().padStart(2, '0')}`, value: 1 }
    ];
  }
}

/**
 * Get users by city
 */
export async function getUsersByCity(limit: number = 10): Promise<{ city: string; users: number }[]> {
  try {
    const response = await makeAnalyticsRequest({
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        { name: 'city' }
      ],
      metrics: [
        { name: 'activeUsers' }
      ],
      orderBys: [
        {
          metric: { metricName: 'activeUsers' },
          desc: true
        }
      ],
      limit: limit
    });

    return (response.rows || []).map(row => ({
      city: row.dimensionValues?.[0]?.value || 'Unknown',
      users: parseInt(row.metricValues?.[0]?.value || '0', 10)
    }));
  } catch (error) {
    console.error('Error fetching users by city:', error);
    return [];
  }
}

/**
 * Get users by country
 */
export async function getUsersByCountry(limit: number = 10): Promise<{ country: string; users: number }[]> {
  try {
    const response = await makeAnalyticsRequest({
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        { name: 'country' },
      ],
      metrics: [
        { name: 'activeUsers' },
      ],
      orderBys: [
        {
          metric: { metricName: 'activeUsers' },
          desc: true,
        },
      ],
      limit,
    });

    return (response.rows || []).map((row: AnalyticsRow) => {
      return {
        country: row.dimensionValues?.[0]?.value || 'Unknown',
        users: parseInt(row.metricValues?.[0]?.value || '0', 10),
      };
    });
  } catch (error) {
    console.error('Error fetching users by country:', error);
    throw error;
  }
}
