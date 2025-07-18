'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Users, Activity, Star, UserPlus, Clock, Globe } from 'lucide-react'
import AnalyticsChart from '@/components/ui/analytics-chart'

interface RealTimeMetrics {
  activeUsers: number
  eventCount: number
  keyEvents: number
  newUsers: number
}

interface ActiveUsersPerMinute {
  minute: number
  users: number
}

interface CountryData {
  country: string
  users: number
}

interface CityData {
  city: string
  users: number
}

export default function RealtimeAnalytics() {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    activeUsers: 0,
    eventCount: 0,
    keyEvents: 0,
    newUsers: 0
  })
  const [activeUsersLast30Min, setActiveUsersLast30Min] = useState<number>(0)
  const [usersPerMinute, setUsersPerMinute] = useState<ActiveUsersPerMinute[]>([])
  const [countriesData, setCountriesData] = useState<CountryData[]>([])
  const [citiesData, setCitiesData] = useState<CityData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  // Set default refresh interval to 60 seconds
  const refreshInterval = 60 // seconds

  // Format the users per minute data for the chart
  const formattedUsersPerMinute = usersPerMinute.map(item => ({
    name: item.minute.toString(),
    value: item.users
  }))

  useEffect(() => {
    const fetchRealtimeData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch all data in parallel
        const [metricsResponse, activeUsersLast30MinResponse, usersPerMinuteResponse, countriesResponse, citiesResponse] = 
          await Promise.all([
            fetch('/api/analytics?type=realtime-metrics').then(res => res.json()),
            fetch('/api/analytics?type=active-users-last-30-min').then(res => res.json()),
            fetch('/api/analytics?type=active-users-per-minute').then(res => res.json()),
            fetch('/api/analytics?type=users-by-country&limit=10').then(res => res.json()),
            fetch('/api/analytics?type=users-by-city&limit=10').then(res => res.json())
          ])

        setMetrics(metricsResponse)
        setActiveUsersLast30Min(activeUsersLast30MinResponse.activeUsers)
        setUsersPerMinute(usersPerMinuteResponse)
        setCountriesData(countriesResponse)
        setCitiesData(citiesResponse)
      } catch (error) {
        console.error('Failed to fetch realtime analytics data:', error)
        setError('Failed to fetch realtime analytics data')
      } finally {
        setIsLoading(false)
      }
    }

    // Fetch data immediately
    fetchRealtimeData()

    // Set up interval for refreshing data
    const intervalId = setInterval(fetchRealtimeData, refreshInterval * 1000)

    // Clean up
    return () => clearInterval(intervalId)
  }, [refreshInterval])

  const MetricCard = ({ 
    value, 
    label, 
    icon 
  }: { 
    value: number | string, 
    label: string, 
    icon: React.ReactNode 
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-md border p-4 flex flex-col">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</h3>
        <div className="text-gray-400 dark:text-gray-500">
          {icon}
        </div>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {error && (
        <div className="mb-4 p-3 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md">
          <div className="flex items-center">
            <Activity className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
          value={metrics.activeUsers} 
          label="Active users" 
          icon={<Users className="h-4 w-4" />} 
        />
        <MetricCard 
          value={metrics.eventCount} 
          label="Event count" 
          icon={<Activity className="h-4 w-4" />} 
        />
        <MetricCard 
          value={metrics.keyEvents} 
          label="Key events" 
          icon={<Star className="h-4 w-4" />} 
        />
        <MetricCard 
          value={metrics.newUsers} 
          label="New users" 
          icon={<UserPlus className="h-4 w-4" />} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Active Users in Last 30 Minutes
              </h2>
              <div className="text-3xl font-bold">
                {activeUsersLast30Min}
              </div>
            </div>

            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Active Users Per Minute
            </h3>
            <div className="h-48 mt-auto">
              <AnalyticsChart 
                title="Users Per Minute"
                data={formattedUsersPerMinute} 
                dataKey="value" 
                chartType="line"
                color="#3b82f6" 
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center mb-4">
            <Globe className="h-4 w-4 mr-2" />
            <h2 className="text-lg font-medium">Country</h2>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </>
            ) : countriesData.length === 0 ? (
              <p className="text-sm text-gray-500">No country data available</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b">
                    <th className="pb-2">COUNTRY</th>
                    <th className="pb-2 text-right">ACTIVE USERS</th>
                  </tr>
                </thead>
                <tbody>
                  {countriesData.map((item, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3">{item.country}</td>
                      <td className="py-3 text-right">{item.users}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
      
      {/* Cities section */}
      <div className="mt-6">
        <Card className="p-4">
          <div className="flex items-center mb-4">
            <Globe className="h-4 w-4 mr-2" />
            <h2 className="text-lg font-medium">Cities</h2>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </>
            ) : citiesData.length === 0 ? (
              <p className="text-sm text-gray-500">No city data available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b">
                      <th className="pb-2">CITY</th>
                      <th className="pb-2 text-right">ACTIVE USERS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {citiesData.map((item, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-3">{item.city}</td>
                        <td className="py-3 text-right">{item.users}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
