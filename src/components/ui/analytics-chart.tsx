"use client"

import React, { useState, useEffect } from 'react'
import { 
  BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts'
import { Card } from '@/components/ui/card'
import { useTheme } from 'next-themes'

interface DataPoint {
  name: string
  value: number
  [key: string]: string | number | boolean | null
}

interface ChartProps {
  title: string
  description?: string
  data: DataPoint[]
  dataKey: string
  chartType?: 'line' | 'bar' | 'area'
  height?: number
  color?: string
  secondaryColor?: string
  showGrid?: boolean
}

// Color theme presets
const colorPresets = {
  blue: { main: '#3B82F6', secondary: '#93C5FD', gradient: ['#3B82F6', '#93C5FD', '#DBEAFE'] },
  purple: { main: '#8B5CF6', secondary: '#C4B5FD', gradient: ['#8B5CF6', '#C4B5FD', '#EDE9FE'] },
  green: { main: '#10B981', secondary: '#6EE7B7', gradient: ['#10B981', '#6EE7B7', '#D1FAE5'] },
  amber: { main: '#F59E0B', secondary: '#FCD34D', gradient: ['#F59E0B', '#FCD34D', '#FEF3C7'] },
  rose: { main: '#F43F5E', secondary: '#FDA4AF', gradient: ['#F43F5E', '#FDA4AF', '#FEE2E2'] },
}

const AnalyticsChart = ({
  title,
  description,
  data,
  dataKey,
  chartType = 'line',
  height = 300,
  color = colorPresets.blue.main,
  secondaryColor,
  showGrid = true
}: ChartProps) => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Determine colors based on theme
  const isDark = theme === 'dark'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  const tooltipBg = isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)'
  const tooltipBorder = isDark ? '#334155' : '#f0f0f0'
  
  // Handle gradients for charts
  const mainColor = color || colorPresets.blue.main
  const secondColor = secondaryColor || (() => {
    // Find matching preset or generate lighter color
    const matchingPreset = Object.values(colorPresets).find(p => p.main === mainColor)
    return matchingPreset?.secondary || mainColor + '80' // 50% opacity version
  })()
  
  // Handle next-themes hydration
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <Card className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
        <div className="bg-muted h-[300px] animate-pulse rounded-md" />
      </Card>
    )
  }
  
  return (
    <Card className="p-5 overflow-hidden">
      <div className="mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart 
              data={data} 
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />}
              <XAxis 
                dataKey="name" 
                fontSize={12} 
                tickMargin={10} 
                axisLine={{ stroke: gridColor }}
                tick={{ fill: isDark ? '#CBD5E1' : '#64748B' }}
              />
              <YAxis 
                fontSize={12} 
                axisLine={{ stroke: gridColor }}
                tick={{ fill: isDark ? '#CBD5E1' : '#64748B' }}
                width={40}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: tooltipBg, 
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  color: isDark ? '#F8FAFC' : '#334155'
                }} 
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '10px',
                  fontSize: '12px'
                }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={mainColor} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={mainColor} stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={mainColor}
                strokeWidth={2.5}
                dot={{ r: 4, fill: mainColor, stroke: mainColor, strokeWidth: 1 }}
                activeDot={{ r: 6, fill: mainColor, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          ) : chartType === 'area' ? (
            <AreaChart 
              data={data}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />}
              <XAxis 
                dataKey="name" 
                fontSize={12} 
                tickMargin={10} 
                axisLine={{ stroke: gridColor }}
                tick={{ fill: isDark ? '#CBD5E1' : '#64748B' }}
              />
              <YAxis 
                fontSize={12} 
                axisLine={{ stroke: gridColor }}
                tick={{ fill: isDark ? '#CBD5E1' : '#64748B' }}
                width={40}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: tooltipBg, 
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  color: isDark ? '#F8FAFC' : '#334155'
                }} 
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={mainColor} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={mainColor} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={mainColor} 
                strokeWidth={2}
                fill="url(#colorGradient)" 
                activeDot={{ r: 6, strokeWidth: 0 }} 
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '10px',
                  fontSize: '12px'
                }}
              />
            </AreaChart>
          ) : (
            <BarChart 
              data={data} 
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              barCategoryGap="20%"
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />}
              <XAxis 
                dataKey="name" 
                fontSize={12} 
                tickMargin={10} 
                axisLine={{ stroke: gridColor }}
                tick={{ fill: isDark ? '#CBD5E1' : '#64748B' }}
              />
              <YAxis 
                fontSize={12} 
                axisLine={{ stroke: gridColor }}
                tick={{ fill: isDark ? '#CBD5E1' : '#64748B' }}
                width={40}
              />
              <Tooltip
                cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }}
                contentStyle={{ 
                  backgroundColor: tooltipBg, 
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  color: isDark ? '#F8FAFC' : '#334155'
                }}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={mainColor} stopOpacity={1}/>
                  <stop offset="100%" stopColor={secondColor} stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <Legend 
                wrapperStyle={{
                  paddingTop: '10px',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey={dataKey} 
                fill="url(#barGradient)" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1500}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default AnalyticsChart
