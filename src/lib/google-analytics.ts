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
      throw new Error(`Analytics API error: ${JSON.stringify(data)}`);
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
 */
export async function getAnalyticsMetrics(
  startDate: string = '30daysAgo', 
  endDate: string = 'today'
): Promise<AnalyticsData> {
  try {
    const response = await makeAnalyticsRequest({
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'userEngagementDuration' },
        { name: 'bounceRate' },
        { name: 'engagedSessions' },
      ],
    });

    const formattedMetrics = response.rows?.[0]?.metricValues?.map((metricValue: AnalyticsMetricValue, index: number) => {
      const metricName = response.metricHeaders?.[index]?.name || 'unknown';
      return {
        name: metricName,
        value: metricValue?.value || '0',
      };
    }) || [];

    return {
      startDate,
      endDate,
      metrics: formattedMetrics,
    };
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
