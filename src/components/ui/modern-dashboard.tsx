"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import AnalyticsChart from '@/components/ui/analytics-chart'
import { 
  Users, 
  Eye, 
  Clock, 
  Globe, 
  TrendingUp, 
  TrendingDown,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  MapPin,
  Activity,
  MousePointerClick,
  AlertCircle
} from 'lucide-react'

// Type definitions
interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  description?: string
  isLoading?: boolean
}

interface ChartDataPoint {
  name: string
  value: number
  [key: string]: string | number // Add index signature to allow accessing properties by string
}

interface CountryData {
  country: string
  users: number
}

interface CityData {
  city: string
  users: number
}

interface PageData {
  name: string
  views: number
  avgTime: string
  bounceRate: number
}

interface DeviceData {
  device: string
  users: number
}

// Metric card component
const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, description, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse my-2"></div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center text-sm mt-1">
            {change > 0 ? (
              <TrendingUp className="h-3.5 w-3.5 mr-1 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 mr-1 text-rose-500" />
            )}
            <span className={change > 0 ? "text-emerald-500" : "text-rose-500"}>
              {Math.abs(change).toFixed(1)}%
            </span>
            <span className="text-muted-foreground ml-1">from last period</span>
          </div>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}

interface ModernDashboardProps {
  // Overview data
  overviewStats: {
    visitors: { value: string; changePercent: number; description: string };
    pageviews: { value: string; changePercent: number; description: string };
    avgSessionDuration: { value: string; changePercent: number; description: string };
    bounceRate: { value: string; changePercent: number; description: string };
  };
  
  // Chart data
  pageViewsData: ChartDataPoint[];
  bounceRateData: ChartDataPoint[];
  
  // Table data
  topPagesData: PageData[];
  visitorsByDeviceData: DeviceData[];
  
  // Geographic data
  countriesData: CountryData[];
  citiesData: CityData[];
  
  // Real-time data
  realtimeMetrics: {
    activeUsers: number;
    eventCount: number;
    keyEvents: Record<string, number>;
    newUsers: number;
  };
  activeUsersLast30Min: number;
  usersPerMinute: ChartDataPoint[];
  
  // State indicators
  isLoading: boolean;
  error: string | null;
  
  // Actions
  onRefresh: () => void;
  onTimeRangeChange: (range: string) => void;
}

export const ModernDashboard: React.FC<ModernDashboardProps> = ({
  overviewStats,
  pageViewsData,
  bounceRateData,
  topPagesData,
  visitorsByDeviceData,
  countriesData,
  citiesData,
  realtimeMetrics,
  activeUsersLast30Min,
  usersPerMinute,
  isLoading,
  error,
  onRefresh,
  onTimeRangeChange,
}) => {
  const [timeRange, setTimeRange] = useState<string>('7');
  const [activeTab, setActiveTab] = useState<string>('overview');

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    onTimeRangeChange(value);
  };

  // Format usersPerMinute for chart
  const formattedUsersPerMinute = usersPerMinute.map(item => ({
    name: item.name,
    value: item.value,
  }));

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 p-6 my-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <div>
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400">Analytics Error</h3>
            <p className="text-red-600 dark:text-red-400 opacity-90 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last 24 Hours</SelectItem>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 sm:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="real-time">Real-Time</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Unique Visitors"
              value={overviewStats.visitors.value}
              change={overviewStats.visitors.changePercent}
              icon={<Users className="h-4 w-4" />}
              description={overviewStats.visitors.description}
              isLoading={isLoading}
            />
            <MetricCard
              title="Total Pageviews"
              value={overviewStats.pageviews.value}
              change={overviewStats.pageviews.changePercent}
              icon={<Eye className="h-4 w-4" />}
              description={overviewStats.pageviews.description}
              isLoading={isLoading}
            />
            <MetricCard
              title="Avg. Session Duration"
              value={overviewStats.avgSessionDuration.value}
              change={overviewStats.avgSessionDuration.changePercent}
              icon={<Clock className="h-4 w-4" />}
              description={overviewStats.avgSessionDuration.description}
              isLoading={isLoading}
            />
            <MetricCard
              title="Bounce Rate"
              value={overviewStats.bounceRate.value}
              change={-overviewStats.bounceRate.changePercent} // Inverted because lower is better
              icon={<MousePointerClick className="h-4 w-4" />}
              description={overviewStats.bounceRate.description}
              isLoading={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Page Views Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <AnalyticsChart 
                    title="Page Views"
                    data={pageViewsData} 
                    dataKey="value"
                    chartType="bar" 
                    color="#3b82f6" 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Bounce Rate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <AnalyticsChart 
                    title="Bounce Rate"
                    data={bounceRateData} 
                    dataKey="value"
                    chartType="line" 
                    color="#ec4899" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Only render device breakdown if data is provided */}
            {visitorsByDeviceData.length > 0 && (
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Monitor className="h-4 w-4 mr-2" />
                    Device Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {visitorsByDeviceData.map((item, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center">
                              {item.device === 'Desktop' && <Monitor className="h-3.5 w-3.5 mr-2" />}
                              {item.device === 'Mobile' && <Smartphone className="h-3.5 w-3.5 mr-2" />}
                              {item.device === 'Tablet' && <Tablet className="h-3.5 w-3.5 mr-2" />}
                              {item.device}
                            </div>
                            <span>{item.users}%</span>
                          </div>
                          <Progress value={item.users} className="h-2" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Top Countries
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {countriesData.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span>{item.country}</span>
                        <Badge variant="secondary">{item.users} users</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Real-Time Tab Content */}
        <TabsContent value="real-time" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Users Now"
              value={realtimeMetrics.activeUsers}
              icon={<Users className="h-4 w-4" />}
              isLoading={isLoading}
              description="Users currently on your site"
            />
            <MetricCard
              title="Events (Last Hour)"
              value={realtimeMetrics.eventCount}
              icon={<Activity className="h-4 w-4" />}
              isLoading={isLoading}
              description="Total events in the last 60 minutes"
            />
            <MetricCard
              title="New Users Today"
              value={realtimeMetrics.newUsers}
              icon={<Users className="h-4 w-4" />}
              isLoading={isLoading}
              description="First-time visitors today"
            />
            <MetricCard
              title="Users (Last 30 Min)"
              value={activeUsersLast30Min}
              icon={<Clock className="h-4 w-4" />}
              isLoading={isLoading}
              description="Active users in the last 30 minutes"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Users Per Minute</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <AnalyticsChart 
                    title="Users Per Minute"
                    data={formattedUsersPerMinute}
                    dataKey="value"
                    chartType="line"
                    color="#3b82f6"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Events (Last Hour)</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(realtimeMetrics.keyEvents).map(([key, value], idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm">{key}</span>
                        <Badge variant="outline">{value}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Active Users by City
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : citiesData.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No city data available</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-muted-foreground border-b">
                          <th className="pb-2 font-medium">CITY</th>
                          <th className="pb-2 text-right font-medium">USERS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {citiesData.map((item, index) => (
                          <tr key={index} className="border-b last:border-0">
                            <td className="py-3 text-sm">{item.city}</td>
                            <td className="py-3 text-right text-sm">{item.users}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Engagement Tab Content */}
        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-full sm:w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="flex flex-wrap gap-4">
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-5">
                  {topPagesData.map((page, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="font-medium">{page.name}</div>
                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="text-muted-foreground">
                          {page.views.toLocaleString()} views
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <div className="font-medium">{page.avgTime}</div>
                            <div className="text-muted-foreground">Avg. Time</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{page.bounceRate}%</div>
                            <div className="text-muted-foreground">Bounce Rate</div>
                          </div>
                          <Badge variant={page.bounceRate < 30 ? "default" : page.bounceRate < 50 ? "secondary" : "destructive"}>
                            {page.bounceRate < 30 ? "Excellent" : page.bounceRate < 50 ? "Good" : "Needs Work"}
                          </Badge>
                        </div>
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ModernDashboard
