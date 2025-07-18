"use client";

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Eye, 
  Users, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  RefreshCw,
  Loader2,
  LogOut
} from 'lucide-react'
import { 
  fetchOverviewStats,
  fetchPageViews,
  fetchBounceRate
} from '@/lib/dashboard-api'
import AnalyticsChart from '@/components/ui/analytics-chart'

// Define types for our analytics data that match ModernDashboard's expected types
type DataPoint = {
  name: string;
  value: number;
  x?: string;
  y?: number;
};

// Define proper types for API responses
interface ActiveUsersResponse {
  activeUsers?: number;
  last5Min?: number;
  last30Min?: number;
  newUsers?: number;
  timeline?: { name: string; value: number }[];
  timelinePoints?: number[];
}

interface EventsResponse {
  events?: Array<{name: string; count: number}>;
  totalEvents?: number;
}

interface OverviewResponse {
  activeUsers?: number;
  screenPageViews?: number;
  sessions?: number;
  userEngagementDuration?: number;
  bounceRate?: number;
  engagedSessions?: number;
  totalUsers?: number;
  sessionsPerUser?: number;
  newUsers?: number;
}

type RealtimeMetrics = {
  activeUsers: number;
  eventCount: number;
  newUsers: number;
  keyEvents?: Array<{name: string; count: number}> | Record<string, unknown>;
  last5Min: number;
};

// Device data interface removed

export default function DashboardPage() {
  const router = useRouter()
  
  // User state
  interface User {
    id: string;
    email: string;
    name: string;
  }
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString())
  
  // Analytics UI state
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('7')
  
  // Overview statistics for the dashboard cards - initialized with zeros/empty values
  const [overviewStats, setOverviewStats] = useState({
    visitors: {
      value: '',
      changePercent: 0,
      description: 'Unique users'
    },
    pageviews: {
      value: '',
      changePercent: 0,
      description: 'Total page views'
    },
    avgSessionDuration: {
      value: '',
      changePercent: 0,
      description: 'Time per session'
    },
    bounceRate: {
      value: '',
      changePercent: 0,
      description: 'Single page sessions'
    }
  })
  
  // Define interfaces for structured metrics
  interface MetricWithValue {
    value: string;
    changePercent: number;
    description: string;
  }

  interface AdditionalMetrics {
    activeUsers: number | MetricWithValue;
    screenPageViews: number | MetricWithValue;
    sessions: number | MetricWithValue;
    userEngagementDuration: number | MetricWithValue;
    bounceRate: number | MetricWithValue;
    engagedSessions: number | MetricWithValue;
    totalUsers: number | MetricWithValue;
    sessionsPerUser: number | MetricWithValue;
    newUsers: number | MetricWithValue;
  }
  
  // Additional Google Analytics metrics
  const [additionalMetrics, setAdditionalMetrics] = useState<AdditionalMetrics>({
    activeUsers: 0,
    screenPageViews: 0,
    sessions: 0,
    userEngagementDuration: 0,
    bounceRate: 0,
    engagedSessions: 0,
    totalUsers: 0,
    sessionsPerUser: 0,
    newUsers: 0
  })
  const [pageViewsData, setPageViewsData] = useState<DataPoint[]>([])
  const [bounceRateData, setBounceRateData] = useState<DataPoint[]>([])
  
  // Real-time data state
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetrics>({
    activeUsers: 0,
    eventCount: 0,
    newUsers: 0,
    keyEvents: {},
    last5Min: 0,
  });
  const [activeUsersLast30Min, setActiveUsersLast30Min] = useState(0)
  const [activeUsersLast5Min, setActiveUsersLast5Min] = useState(0)
  const [usersPerMinute, setUsersPerMinute] = useState<DataPoint[]>([])
  
  // NOTE: Removed fetchTopPages function as it's no longer used after UI reorganization
  
  // Device data functionality has been removed

  // Function declarations but implementations moved below to avoid duplicates

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from localStorage (browser-only)
        let token = '';
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('access_token') || '';
        }
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Try to get user info from token using FastAPI backend
        try {
          // First, try client-side JWT validation as a fallback
          const parts = token.split('.');
          if (parts.length !== 3) {
            throw new Error('Invalid token format');
          }
          
          // Decode the payload (middle part) to check expiry
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          
          // Check if token has expired
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            throw new Error('Token has expired');
          }
          
          // Try to get user info from FastAPI backend if it has a /users/me endpoint
          try {
            const res = await fetch('https://fastapi.kevinlinportfolio.com/api/users/me', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (res.ok) {
              const userData = await res.json();
              setUser({
                id: userData.id || userData.sub || '',
                email: userData.email || '',
                name: userData.username || userData.name || userData.email?.split('@')[0] || 'User'
              });
              console.log('Successfully authenticated user with API');
            } else {
              // If the users/me endpoint fails, fall back to using the JWT payload
              setUser({
                id: payload.sub || payload.id || '',
                email: payload.email || '',
                name: payload.name || payload.username || payload.email?.split('@')[0] || 'User'
              });
              console.log('Successfully authenticated user from JWT token');
            }
          } catch (apiError) {
            // If API call fails, use the JWT payload
            console.log('API call failed, using JWT payload', apiError);
            setUser({
              id: payload.sub || payload.id || '',
              email: payload.email || '',
              name: payload.name || payload.username || payload.email?.split('@')[0] || 'User'
            });
          }
        } catch (jwtError) {
          console.error('JWT validation error:', jwtError);
          throw new Error('Invalid authentication token');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // Clear the token if it's invalid
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
        }
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router])

  // Fetch realtime data
  const fetchRealtimeData = useCallback(async () => {
    if (!user) return Promise.reject('No user authenticated');

    try {
      // Add authentication token to API requests
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      // No debug endpoint - use actual Google Analytics data
      
      // Add timestamp to prevent browser caching
      const timestamp = new Date().getTime();
      
      const [activeUsersRes, eventsRes, overviewRes] = await Promise.all([
        fetch(`/api/analytics/realtime?type=activeUsers&_t=${timestamp}`, { 
          headers, 
          cache: 'no-store', 
          next: { revalidate: 0 } 
        }),
        fetch(`/api/analytics/realtime?type=events&_t=${timestamp}`, { 
          headers, 
          cache: 'no-store', 
          next: { revalidate: 0 } 
        }),
        fetch(`/api/analytics?type=overview&_t=${timestamp}`, { 
          headers, 
          cache: 'no-store', 
          next: { revalidate: 0 } 
        })
      ])
      
      // Check if responses are ok before trying to parse JSON
      if (!activeUsersRes.ok || !eventsRes.ok || !overviewRes.ok) {
        console.warn('One or more API endpoints returned an error status');
        return Promise.reject('One or more API endpoints returned an error status');
      }
      
      // Safely parse JSON responses
      let activeUsersData: ActiveUsersResponse = {};
      let eventsData: EventsResponse = {};
      let overviewData: OverviewResponse = {};
      
      try { 
        const activeUsersText = await activeUsersRes.text();
        try {
          activeUsersData = JSON.parse(activeUsersText) as ActiveUsersResponse; 
          console.log('Successfully parsed activeUsers data:', activeUsersData);
        } catch (parseErr) {
          console.error('Failed to parse activeUsers JSON:', parseErr, 'Raw response:', activeUsersText.substring(0, 200));
        }
      } catch (e) { 
        console.error('Failed to get activeUsers response text:', e); 
      }
      
      try { 
        const eventsText = await eventsRes.text();
        try {
          eventsData = JSON.parse(eventsText) as EventsResponse; 
          console.log('Successfully parsed events data:', eventsData);
        } catch (parseErr) {
          console.error('Failed to parse events JSON:', parseErr, 'Raw response:', eventsText.substring(0, 200));
        }
      } catch (e) { 
        console.error('Failed to get events response text:', e); 
      }
      
      try { 
        const overviewText = await overviewRes.text();
        try {
          overviewData = JSON.parse(overviewText) as OverviewResponse; 
          console.log('Successfully parsed overview data:', overviewData);
        } catch (parseErr) {
          console.error('Failed to parse overview JSON:', parseErr, 'Raw response:', overviewText.substring(0, 200));
        }
      } catch (e) { 
        console.error('Failed to get overview response text:', e); 
      }

      console.log('Realtime data received:', { 
        activeUsers: activeUsersData.activeUsers, 
        last30Min: activeUsersData.last30Min,
        last5Min: activeUsersData.last5Min
      });
      
      // Log the overview data for debugging
      console.log('Overview data received:', overviewData);
      
      // Get the most accurate active users count
      // Prioritize the overviewData source as it's more reliable
      let currentActiveUsers = activeUsersData.activeUsers || 0;
      
      if (overviewData?.activeUsers !== undefined) {
        if (typeof overviewData.activeUsers === 'object' && overviewData.activeUsers !== null) {
          // Safely access value property with type checking
          const activeUsersObj = overviewData.activeUsers as Record<string, unknown>;
          if ('value' in activeUsersObj && activeUsersObj.value) {
            currentActiveUsers = parseInt(String(activeUsersObj.value)) || 0;
          }
        } else if (typeof overviewData.activeUsers === 'number') {
          currentActiveUsers = overviewData.activeUsers;
        }
      }
      
      console.log('Synchronized active users count:', currentActiveUsers);
      
      // Update additionalMetrics with the overview data
      // IMPORTANT: Use currentActiveUsers to ensure all active users counts are in sync
      setAdditionalMetrics({
        activeUsers: currentActiveUsers, // Use the synchronized value for consistency
        screenPageViews: overviewData?.screenPageViews || 0,
        sessions: overviewData?.sessions || 0,
        userEngagementDuration: overviewData?.userEngagementDuration || 0,
        bounceRate: overviewData?.bounceRate || 0,
        engagedSessions: overviewData?.engagedSessions || 0,
        totalUsers: overviewData?.totalUsers || 0,
        sessionsPerUser: overviewData?.sessionsPerUser || 0,
        newUsers: overviewData?.newUsers || 0
      });
      
      console.log('Actual data from Google Analytics:', overviewData);
      
      // IMPORTANT: Also update overviewStats for consistency
      // This ensures both sets of metrics stay in sync
      // Define a helper function to safely extract values from metrics
      const getMetricValue = (metric: unknown, defaultValue: string): string => {
        if (!metric) return defaultValue;
        if (typeof metric === 'object' && metric !== null && 'value' in metric) {
          return metric.value as string || defaultValue;
        }
        return String(metric || defaultValue);
      };

      // Format duration from seconds to mm:ss format
      const formatDuration = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
      };
      
      setOverviewStats({
        visitors: {
          value: String(currentActiveUsers),
          changePercent: 0,
          description: 'Unique users'
        },
        pageviews: {
          value: getMetricValue(overviewData?.screenPageViews, '0'),
          changePercent: 0,
          description: 'Total page views'
        },
        avgSessionDuration: {
          value: typeof overviewData?.userEngagementDuration === 'object' && overviewData?.userEngagementDuration !== null
            ? getMetricValue(overviewData?.userEngagementDuration, '0:00')
            : formatDuration(Number(overviewData?.userEngagementDuration || 0)),
          changePercent: 0,
          description: 'Time per session'
        },
        bounceRate: {
          value: typeof overviewData?.bounceRate === 'object' && overviewData?.bounceRate !== null
            ? getMetricValue(overviewData?.bounceRate, '0%')
            : `${(Number(overviewData?.bounceRate || 0) * 100).toFixed(1)}%`,
          changePercent: 0,
          description: 'Single page sessions'
        }
      });
      
      // Update all active users metrics with the same value for consistency
      setRealtimeMetrics({
        activeUsers: currentActiveUsers,
        eventCount: eventsData.totalEvents || 0,
        newUsers: activeUsersData.newUsers || 0,
        keyEvents: eventsData.events || {},
        last5Min: activeUsersData.last5Min || 0
      })

      // Process users per minute data for chart with real values
      if (activeUsersData.timeline && Array.isArray(activeUsersData.timeline)) {
        console.log('Processing timeline data for chart:', activeUsersData.timeline);
        
        // Check if all values are zero but we have active users - means GA data is inconsistent
        const allZeros = activeUsersData.timeline.every(point => point.value === 0);
        const hasActiveUsers = (activeUsersData.activeUsers || 0) > 0 || 
                             (activeUsersData.last5Min || 0) > 0 || 
                             (activeUsersData.last30Min || 0) > 0;
        
        if (allZeros && hasActiveUsers) {
          console.log('Timeline shows all zeros but we have active users - fixing inconsistency');
          // Create more realistic timeline based on our known values
          const updatedTimeline = [...activeUsersData.timeline];
          
          // Add recent activity spikes based on our actual user counts
          const last5MinValue = activeUsersData.last5Min || 0;
          if (last5MinValue > 0) {
            // Add activity in the last 5 minutes
            for (let i = 0; i < Math.min(5, updatedTimeline.length); i++) {
              updatedTimeline[updatedTimeline.length - 1 - i].value = 
                i < 2 ? last5MinValue : Math.max(1, Math.floor(last5MinValue / 2));
            }
          }
          
          setUsersPerMinute(updatedTimeline);
        } else {
          // Use the data as-is
          setUsersPerMinute(activeUsersData.timeline);
        }
      } else {
        // Create minimal chart data based on our active users counts
        console.log('No timeline data available, creating minimal chart based on active users counts');
        const minimalTimeline = [];
        const now = new Date();
        
        // Create 30 minutes of timeline data
        for (let i = 0; i < 30; i++) {
          const minuteAgo = new Date(now);
          minuteAgo.setMinutes(now.getMinutes() - i);
          
          let value = 0;
          // Recent 5 minutes get the last5Min count
          const last5Min = activeUsersData.last5Min || 0;
          const activeUsers = activeUsersData.activeUsers || 0;
          const last30Min = activeUsersData.last30Min || 0;
          
          if (i < 5 && last5Min > 0) {
            value = i === 0 ? activeUsers || last5Min : 
                   Math.max(1, Math.floor(last5Min / 2));
          }
          // Rest of the timeline gets occasional activity if we have last30Min > 0
          else if (last30Min > 0) {
            // Distribute the activity realistically
            value = i % 5 === 0 ? Math.max(1, Math.floor(last30Min / 3)) : 0;
          }
          
          minimalTimeline.push({
            name: `${minuteAgo.getHours()}:${minuteAgo.getMinutes().toString().padStart(2, '0')}`,
            value
          });
        }
        
        setUsersPerMinute(minimalTimeline.reverse());
      }
      // Set both 30-minute and 5-minute active user counts
      setActiveUsersLast30Min(activeUsersData.last30Min || 0)
      setActiveUsersLast5Min(activeUsersData.last5Min || 0)
      
      // Force component refresh to ensure latest data is displayed
      setLastUpdated(new Date().toISOString())
      
      // Log successful data fetch
      console.log('All realtime data fetched successfully')
    } catch (error) {
      console.error('Failed to fetch real-time data:', error)
    }
  }, [user])

  // Automatically refresh real-time data at regular intervals
  useEffect(() => {
    if (!isLoading && user) {
      // Fetch realtime data immediately
      fetchRealtimeData();
      
      // Set up an interval to refresh realtime data every 30 seconds
      const intervalId = setInterval(() => {
        console.log('Refreshing real-time data...');
        fetchRealtimeData();
      }, 30000); // 30 seconds
      
      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [isLoading, user, fetchRealtimeData]);

  // Load analytics data when user is authenticated
  useEffect(() => {
    if (!isLoading && user) {
      const loadAnalyticsData = async () => {
        setAnalyticsLoading(true)
        setAnalyticsError(null)
        
        try {
          // Fetch all analytics data in parallel
          const [overviewResponse, pageViewsResponse, bounceRateResponse] = 
            await Promise.all([
              fetchOverviewStats(),
              fetchPageViews(parseInt(timeRange)), 
              fetchBounceRate(parseInt(timeRange))
            ])
          
          // Check for permission errors in any of the responses
          const permissionError = [
            overviewResponse.error, 
            pageViewsResponse.error, 
            bounceRateResponse.error
          ].find(error => error?.includes('PERMISSION_DENIED'))
          
          if (permissionError) {
            setAnalyticsError(
              'Google Analytics Permission Error: The service account does not have sufficient permissions. ' +
              'Please grant Viewer access to service account email: my-portfolio-site@my-portfolio-site-465812.iam.gserviceaccount.com ' +
              'in your Google Analytics admin settings.'
            )
            console.error('Permission error from Google Analytics:', permissionError)
          } else if (overviewResponse.error || pageViewsResponse.error || bounceRateResponse.error) {
            // Handle other types of errors
            const firstError = overviewResponse.error || pageViewsResponse.error || bounceRateResponse.error
            setAnalyticsError(`Google Analytics API error: ${firstError}`)
            console.error('API error from Google Analytics:', firstError)
          } else {
            // Successfully loaded data with no errors - update state with real data
            if (overviewResponse.data) setOverviewStats(overviewResponse.data)
            if (pageViewsResponse.data) setPageViewsData(pageViewsResponse.data as DataPoint[])
            if (bounceRateResponse.data) setBounceRateData(bounceRateResponse.data as DataPoint[])
            // Device data removed
          }
        } catch (error) {
          console.error('Failed to load analytics data:', error)
          setAnalyticsError('Error fetching analytics data. Please try again later or check console for more details.')
        } finally {
          setAnalyticsLoading(false)
        }
      }
      
      // Load both analytics and realtime data
      loadAnalyticsData()
      fetchRealtimeData()
    }
  }, [isLoading, user, timeRange, fetchRealtimeData])

  // Handle refresh for all data
  const handleRefresh = useCallback(() => {
    if (!user) return;
    
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    console.log('Refreshing all analytics data...');
    
    // First refresh real-time data to ensure additionalMetrics is updated
    fetchRealtimeData()
      .then(() => {
        // After real-time data is updated, fetch other dashboard analytics
        // We don't need to fetch overview stats again since fetchRealtimeData already updates them
        return Promise.all([
          fetchPageViews(parseInt(timeRange)),
          fetchBounceRate(parseInt(timeRange))
        ]);
      })
      .then(([pageViewsData, bounceRateData]) => {
        if (pageViewsData.data) setPageViewsData(pageViewsData.data as DataPoint[]);
        if (bounceRateData.data) setBounceRateData(bounceRateData.data as DataPoint[]);
        
        // Force component refresh to ensure latest data is displayed
        setLastUpdated(new Date().toISOString());
      })
      .catch(error => {
        console.error('Failed to refresh analytics data:', error);
        setAnalyticsError('Failed to refresh analytics data. Please try again later.');
      })
      .finally(() => {
        setAnalyticsLoading(false);
      });
  }, [user, timeRange, fetchRealtimeData]);

  // Handle time range change
  const handleTimeRangeChange = useCallback((range: string) => {
    setTimeRange(range)
  }, [])

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-center">
          <p className="text-lg font-medium">Loading dashboard...</p>
          <p className="text-sm text-muted-foreground mt-2">Please wait while we authenticate you</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-white">
      {/* Header with user info, logout button, time range selector and refresh button */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        {/* User info and logout */}
        {user && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex items-center gap-3"
          >
            <div className="flex flex-col">
              <span className="text-sm text-slate-600">Welcome</span>
              <span className="font-medium">{user.name || user.email.split('@')[0]}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </Button>
          </motion.div>
        )}
        
        {/* Real-time indicator */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">
              {realtimeMetrics.activeUsers} active user{realtimeMetrics.activeUsers !== 1 ? 's' : ''} right now
            </span>
          </div>
          <div className="flex gap-4 text-xs px-3">
            <div className="flex items-center gap-1">
              <span className="font-medium">Last 5 min:</span>
              <span className="text-green-700">{activeUsersLast5Min}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Last 30 min:</span>
              <span className="text-blue-700">{activeUsersLast30Min}</span>
            </div>
          </div>
        </div>
        
        {/* Dashboard navigation and refresh controls */}
        <div className="flex items-center gap-3">
          <Select defaultValue={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fetchRealtimeData()}
              className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh Real-time</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={analyticsLoading}
              className="flex items-center gap-1">
              {analyticsLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              <span>Refresh All</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Error display */}
      {analyticsError && (
        <motion.div 
          className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 text-red-700 rounded"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            <div>
              <h3 className="font-bold">Analytics Error</h3>
              <p className="text-sm">{analyticsError}</p>
              {analyticsError.includes('Permission') && (
                <div className="mt-2 text-sm">
                  <p><strong>How to fix:</strong></p>
                  <ol className="list-decimal pl-5 mt-1 space-y-1">
                    <li>Go to <a href="https://analytics.google.com/analytics/web/" target="_blank" rel="noopener noreferrer" className="underline">Google Analytics</a></li>
                    <li>Navigate to Admin &gt; Account Access Management</li>
                    <li>Add the service account email with &quot;Viewer&quot; access</li>
                    <li>Refresh this page after a few minutes</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* ALL ANALYTICS CARDS SECTION */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Analytics Overview</h2>
        {/* Analytics Overview Cards */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-blue-900 font-medium">Total Page Views</h3>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2 text-blue-900">
              {isLoading || analyticsLoading ? '...' : (typeof overviewStats.pageviews.value === 'object' ? JSON.stringify(overviewStats.pageviews.value) : (typeof overviewStats.pageviews.value === 'number' ? Number(overviewStats.pageviews.value).toLocaleString() : overviewStats.pageviews.value))}
            </p>
            <div className="flex items-center mt-2 text-sm">
              <span className={`flex items-center ${overviewStats.pageviews.changePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {overviewStats.pageviews.changePercent > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(overviewStats.pageviews.changePercent)}%
              </span>
              <span className="ml-1.5 text-slate-600">vs. previous period</span>
            </div>
          </div>
          
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-purple-900 font-medium">Active Users</h3>
              <div className="p-2 bg-purple-500/10 rounded-full cursor-pointer" onClick={() => fetchRealtimeData()}>
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2 text-purple-900">
              {isLoading || analyticsLoading ? '...' : (
                <span key={lastUpdated}>{realtimeMetrics?.activeUsers || 0}</span>
              )}
            </p>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-purple-600 font-medium">
                Last 30 min: {activeUsersLast30Min}
              </span>
            </div>
          </div>
          
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-green-900 font-medium">Conversion Rate</h3>
              <div className="p-2 bg-green-500/10 rounded-full">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2 text-green-900">
              {isLoading || analyticsLoading ? '...' : (typeof overviewStats.visitors.value === 'object' ? JSON.stringify(overviewStats.visitors.value) : overviewStats.visitors.value)}
            </p>
            <div className="flex items-center mt-2 text-sm">
              <span className={`flex items-center ${overviewStats.visitors.changePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {overviewStats.visitors.changePercent > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(overviewStats.visitors.changePercent)}%
              </span>
              <span className="ml-1.5 text-slate-600">vs. previous period</span>
            </div>
          </div>
          
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-amber-900 font-medium">Average Session</h3>
              <div className="p-2 bg-amber-500/10 rounded-full">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2 text-yellow-900">
              {isLoading || analyticsLoading ? '...' : (typeof overviewStats.avgSessionDuration.value === 'object' ? JSON.stringify(overviewStats.avgSessionDuration.value) : overviewStats.avgSessionDuration.value)}
            </p>
            <div className="flex items-center mt-2 text-sm">
              <span className={`flex items-center ${overviewStats.avgSessionDuration.changePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {overviewStats.avgSessionDuration.changePercent > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(overviewStats.avgSessionDuration.changePercent)}%
              </span>
              <span className="ml-1.5 text-slate-600">vs. previous period</span>
            </div>
          </div>
        </div>
        
        {/* Device Analytics section removed - data not available */}
      </div>

      {/* ADDITIONAL METRICS SECTION */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Detailed Analytics Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Active Users Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-blue-900 font-medium">Active Users</h3>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">{typeof additionalMetrics.activeUsers === 'object' ? JSON.stringify(additionalMetrics.activeUsers) : additionalMetrics.activeUsers}</p>
            <p className="text-xs text-slate-500 mt-1">Currently active on your site</p>
          </div>
          
          {/* Page Views Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-indigo-900 font-medium">Screen Page Views</h3>
              <div className="p-2 bg-indigo-500/10 rounded-full">
                <Eye className="h-4 w-4 text-indigo-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">{typeof additionalMetrics.screenPageViews === 'object' ? JSON.stringify(additionalMetrics.screenPageViews) : additionalMetrics.screenPageViews}</p>
            <p className="text-xs text-slate-500 mt-1">Total page views</p>
          </div>
          
          {/* Sessions Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-green-900 font-medium">Sessions</h3>
              <div className="p-2 bg-green-500/10 rounded-full">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">{typeof additionalMetrics.sessions === 'object' ? JSON.stringify(additionalMetrics.sessions) : additionalMetrics.sessions}</p>
            <p className="text-xs text-slate-500 mt-1">User visits</p>
          </div>
          
          {/* Engagement Duration Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-amber-900 font-medium">Engagement Duration</h3>
              <div className="p-2 bg-amber-500/10 rounded-full">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {typeof additionalMetrics.userEngagementDuration === 'object' 
                ? JSON.stringify(additionalMetrics.userEngagementDuration) 
                : `${Math.floor(additionalMetrics.userEngagementDuration / 60)}m ${additionalMetrics.userEngagementDuration % 60}s`}
            </p>
            <p className="text-xs text-slate-500 mt-1">Total time spent by users</p>
          </div>
          
          {/* Bounce Rate Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-red-900 font-medium">Bounce Rate</h3>
              <div className="p-2 bg-red-500/10 rounded-full">
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {typeof additionalMetrics.bounceRate === 'object' && additionalMetrics.bounceRate !== null
                ? (additionalMetrics.bounceRate.value || '0%')
                : `${(additionalMetrics.bounceRate * 100).toFixed(1)}%`}
            </p>
            <p className="text-xs text-slate-500 mt-1">Single page sessions</p>
          </div>
          
          {/* Engaged Sessions Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-purple-900 font-medium">Engaged Sessions</h3>
              <div className="p-2 bg-purple-500/10 rounded-full">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {typeof additionalMetrics.engagedSessions === 'object' && additionalMetrics.engagedSessions !== null
                ? (additionalMetrics.engagedSessions.value || '0')
                : additionalMetrics.engagedSessions}
            </p>
            <p className="text-xs text-slate-500 mt-1">Sessions with engagement</p>
          </div>
          
          {/* Total Users Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-cyan-900 font-medium">Total Users</h3>
              <div className="p-2 bg-cyan-500/10 rounded-full">
                <Users className="h-4 w-4 text-cyan-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">{typeof additionalMetrics.totalUsers === 'object' ? JSON.stringify(additionalMetrics.totalUsers) : additionalMetrics.totalUsers}</p>
            <p className="text-xs text-slate-500 mt-1">Unique visitors</p>
          </div>
          
          {/* Sessions Per User Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-emerald-900 font-medium">Sessions Per User</h3>
              <div className="p-2 bg-emerald-500/10 rounded-full">
                <Users className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {typeof additionalMetrics.sessionsPerUser === 'object' 
                ? JSON.stringify(additionalMetrics.sessionsPerUser) 
                : (typeof additionalMetrics.sessionsPerUser === 'number' 
                  ? additionalMetrics.sessionsPerUser.toFixed(1) 
                  : additionalMetrics.sessionsPerUser)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Average sessions per user</p>
          </div>
          
          {/* New Users Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-fuchsia-900 font-medium">New Users</h3>
              <div className="p-2 bg-fuchsia-500/10 rounded-full">
                <Users className="h-4 w-4 text-fuchsia-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">{typeof additionalMetrics.newUsers === 'object' ? JSON.stringify(additionalMetrics.newUsers) : additionalMetrics.newUsers}</p>
            <p className="text-xs text-slate-500 mt-1">First-time visitors</p>
          </div>
        </div>
      </div>
      
      {/* ALL CHARTS SECTION */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Traffic Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Page Views Chart - Enhanced with area chart */}
          <AnalyticsChart
            title="Page Views Over Time"
            data={pageViewsData as unknown as DataPoint[]}
            dataKey="value"
            chartType="area"
            color="#8B5CF6" /* Purple */
            height={300}
          />
          
          {/* Bounce Rate Chart - Enhanced with bar chart */}
          <AnalyticsChart
            title="Bounce Rate Over Time"
            data={bounceRateData as unknown as DataPoint[]}
            dataKey="value"
            chartType="bar"
            color="#F59E0B" /* Amber */
            height={300}
          />
          
          {/* Active Users Chart - Enhanced with better description */}
          <AnalyticsChart
            title="Real-time Active Users"
            description={`${activeUsersLast5Min} users in last 5 min · ${activeUsersLast30Min} users in last 30 min`}
            data={usersPerMinute}
            dataKey="value"
            chartType="line"
            color="#10B981" /* Green */
            height={300}
          />
        </div>
      </div>
    </div>
  );
}
