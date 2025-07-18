// API functions for fetching dashboard data

// Define interfaces for analytics data types

interface ChartDataPoint {
  name: string;
  value: number;
}

interface PageData {
  name: string;
  visitors: number;
}

interface StatsItem {
  value: string;
  changePercent: number;
  description: string;
}

interface OverviewStats {
  visitors: StatsItem;
  pageviews: StatsItem;
  avgSessionDuration: StatsItem;
  bounceRate: StatsItem;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Helper function to fetch from API with auth token
async function fetchWithAuth<T>(endpoint: string, mockData: T): Promise<ApiResponse<T>> {
  // Flag to control mock data behavior - can be toggled for debugging
  const useMockData = false; // No mock data - showing real API errors
  
  if (useMockData) {
    console.log(`Using mock data for ${endpoint}`);
    return { data: mockData };
  }

  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (!token) {
      console.error('No authentication token found');
      return { error: 'No authentication token found' };
    }
    
    console.log(`Fetching from ${endpoint}...`);
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      let errorMessage;
      try {
        // Check if the response is HTML (which would cause JSON parsing errors)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          errorMessage = `Received HTML instead of JSON: HTTP Error ${response.status}`;
          console.warn('API returned HTML instead of JSON:', { status: response.status });
          return { error: errorMessage };
        }
        
        const errorData = await response.json();
        errorMessage = errorData.error || `HTTP Error ${response.status}: ${response.statusText}`;
        console.warn('API response not OK:', { status: response.status, errorData });
      } catch (parseError) {
        errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        console.warn('API response not OK and could not parse JSON:', response.status, parseError);
      }
      return { error: errorMessage };
    }
    
    try {
      const text = await response.text();
      
      // Check if the response might be HTML
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        console.error('Received HTML instead of JSON');
        return { error: 'Received HTML instead of JSON response' };
      }
      
      // Try to parse as JSON
      const data = JSON.parse(text);
      console.log(`Successfully fetched data from ${endpoint}`);
      return { data };
    } catch (parseError) {
      console.error('Failed to parse API response:', parseError);
      return { error: 'Invalid JSON response from API' };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`API fetch error for ${endpoint}:`, error);
    return { error: errorMessage };
  }
}

// Fetch overview statistics
export async function fetchOverviewStats() {
  return fetchWithAuth<OverviewStats>('/api/analytics?type=overview', fallbackData.overviewStats);
}

// Fetch page views over time
export async function fetchPageViews(days = 7) {
  return fetchWithAuth<ChartDataPoint[]>(`/api/analytics?type=pageViews&days=${days}`, fallbackData.pageViewsData);
}

// Fetch top pages
export async function fetchTopPages(limit = 5) {
  return fetchWithAuth<PageData[]>(`/api/analytics?type=topPages&limit=${limit}`, fallbackData.topPagesData);
}

// Fetch device breakdown
export async function fetchDeviceData() {
  return fetchWithAuth<ChartDataPoint[]>('/api/analytics/devices', fallbackData.visitorsByDeviceData);
}

// Fetch bounce rate over time
export async function fetchBounceRate(days = 7) {
  return fetchWithAuth<ChartDataPoint[]>(`/api/analytics?type=bounceRate&days=${days}`, fallbackData.bounceRateData);
}

// When API is unavailable or in development, use fallback data
export const fallbackData = {
  pageViewsData: [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 }
  ],
  visitorsByDeviceData: [
    { name: 'Desktop', value: 54 },
    { name: 'Mobile', value: 38 },
    { name: 'Tablet', value: 8 }
  ],
  bounceRateData: [
    { name: 'Jan', value: 65 },
    { name: 'Feb', value: 59 },
    { name: 'Mar', value: 62 },
    { name: 'Apr', value: 58 },
    { name: 'May', value: 55 },
    { name: 'Jun', value: 52 },
    { name: 'Jul', value: 48 }
  ],
  topPagesData: [
    { name: 'Home', visitors: 3245 },
    { name: 'Portfolio', visitors: 2186 },
    { name: 'Projects', visitors: 1723 },
    { name: 'Skills', visitors: 1452 },
    { name: 'Contact', visitors: 964 }
  ],
  overviewStats: {
    visitors: {
      value: '32.4K',
      changePercent: 12.2,
      description: 'Total visitors this month'
    },
    pageviews: {
      value: '94.8K',
      changePercent: 8.7,
      description: 'Total pageviews this month'
    },
    avgSessionDuration: {
      value: '2:32',
      changePercent: 3.4,
      description: 'Average time on site'
    },
    bounceRate: {
      value: '48.2%',
      changePercent: -6.8,
      description: 'Visitors who leave after viewing only one page'
    }
  }
};
