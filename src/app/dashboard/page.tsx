"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LogOut, Users, Eye, Clock, MousePointer, Activity, AlertCircle } from 'lucide-react'
import AnalyticsChart from '@/components/ui/analytics-chart'
import StatCard from '@/components/ui/stat-card'
import { 
  fetchOverviewStats,
  fetchPageViews,
  fetchTopPages,
  fetchDeviceData,
  fetchBounceRate,
  fallbackData
} from '@/lib/dashboard-api'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ username: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)
  
  // Analytics state
  const [overviewStats, setOverviewStats] = useState(fallbackData.overviewStats)
  const [pageViewsData, setPageViewsData] = useState(fallbackData.pageViewsData)
  const [bounceRateData, setBounceRateData] = useState(fallbackData.bounceRateData)
  const [topPagesData, setTopPagesData] = useState(fallbackData.topPagesData)
  const [visitorsByDeviceData, setVisitorsByDeviceData] = useState(fallbackData.visitorsByDeviceData)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      router.push('/login')
      return
    }

    // Fetch user profile from API
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('https://fastapi.kevinlinportfolio.com/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user profile:', error)
        // If token is invalid or expired, redirect to login
        localStorage.removeItem('access_token')
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [router])
  
  // Fetch analytics data
  useEffect(() => {
    const loadAnalyticsData = async () => {
      setAnalyticsLoading(true)
      setAnalyticsError(null)
      
      try {
        // Fetch all analytics data in parallel
        const [overviewResponse, pageViewsResponse, bounceRateResponse, topPagesResponse, deviceResponse] = 
          await Promise.all([
            fetchOverviewStats(),
            fetchPageViews(30), // Last 30 days
            fetchBounceRate(30),
            fetchTopPages(5),
            fetchDeviceData()
          ])
        
        // Handle errors and update state with real data or fallback to mock data
        if (overviewResponse.data) {
          setOverviewStats(overviewResponse.data)
        }
        
        if (pageViewsResponse.data) {
          setPageViewsData(pageViewsResponse.data)
        }
        
        if (bounceRateResponse.data) {
          setBounceRateData(bounceRateResponse.data)
        }
        
        if (topPagesResponse.data) {
          setTopPagesData(topPagesResponse.data)
        }
        
        if (deviceResponse.data) {
          setVisitorsByDeviceData(deviceResponse.data)
        }
      } catch (error) {
        console.error('Failed to load analytics data:', error)
        setAnalyticsError('Failed to load analytics data. Using fallback data.')
        // Fallback to mock data is already set in initial state
      } finally {
        setAnalyticsLoading(false)
      }
    }
    
    // Only load analytics if user is authenticated
    if (!isLoading && user) {
      loadAnalyticsData()
    }
  }, [isLoading, user])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <section className="py-8 md:py-12">
      <div className="container px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">Welcome back, {user?.username || 'User'}!</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {analyticsError && (
            <Card className="p-4 mb-6 bg-amber-50 border-amber-200">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertCircle className="h-5 w-5" />
                <p>{analyticsError}</p>
              </div>
            </Card>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard 
              title="Visitors"
              value={overviewStats.visitors.value}
              icon={<Users className="h-5 w-5" />}
              changePercent={overviewStats.visitors.changePercent}
              description={overviewStats.visitors.description}
            />
            <StatCard 
              title="Page Views"
              value={overviewStats.pageviews.value}
              icon={<Eye className="h-5 w-5" />}
              changePercent={overviewStats.pageviews.changePercent}
              description={overviewStats.pageviews.description}
            />
            <StatCard 
              title="Avg. Session Duration"
              value={overviewStats.avgSessionDuration.value}
              icon={<Clock className="h-5 w-5" />}
              changePercent={overviewStats.avgSessionDuration.changePercent}
              description={overviewStats.avgSessionDuration.description}
            />
            <StatCard 
              title="Bounce Rate"
              value={overviewStats.bounceRate.value}
              icon={<MousePointer className="h-5 w-5" />}
              changePercent={overviewStats.bounceRate.changePercent}
              description={overviewStats.bounceRate.description}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="relative">
              {analyticsLoading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
              <AnalyticsChart
                title="Page Views"
                description="Total page views over the last 30 days"
                data={pageViewsData}
                dataKey="value"
                chartType="line"
                color="#3B82F6"
              />
            </div>
            <div className="relative">
              {analyticsLoading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
              <AnalyticsChart
                title="Bounce Rate"
                description="Percentage of visitors who navigate away after viewing only one page"
                data={bounceRateData}
                dataKey="value"
                chartType="line"
                color="#F97316"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Top Pages</h3>
                <Button variant="ghost" size="sm" className="text-xs h-8">View All</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2 font-medium">Page</th>
                      <th className="text-right pb-2 font-medium">Visitors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPagesData.map((page, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-3">{page.name}</td>
                        <td className="py-3 text-right font-medium">{page.visitors.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-lg font-medium mb-4">Visitors by Device</h3>
              <div className="h-[220px]">
                <AnalyticsChart 
                  title=""
                  data={visitorsByDeviceData}
                  dataKey="value"
                  chartType="bar"
                  color="#8B5CF6"
                  height={220}
                />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-2">Profile Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Username</span>
                  <span className="font-medium">{user?.username}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium">July 2025</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-muted-foreground">Account Status</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-medium mb-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </h3>
              <ul className="space-y-3">
                <li className="border-b pb-2">
                  <p className="text-sm">You updated your profile picture</p>
                  <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                </li>
                <li className="border-b pb-2">
                  <p className="text-sm">You changed your password</p>
                  <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                </li>
                <li>
                  <p className="text-sm">You created your account</p>
                  <p className="text-xs text-muted-foreground mt-1">July 13, 2025</p>
                </li>
              </ul>
              <Button variant="ghost" size="sm" className="w-full mt-4 text-xs">View All Activity</Button>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
