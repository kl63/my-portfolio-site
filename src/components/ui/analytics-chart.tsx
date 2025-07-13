"use client"

import React from 'react'
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'

interface DataPoint {
  name: string
  value: number
  [key: string]: any
}

interface ChartProps {
  title: string
  description?: string
  data: DataPoint[]
  dataKey: string
  chartType?: 'line' | 'bar'
  height?: number
  color?: string
}

const AnalyticsChart = ({
  title,
  description,
  data,
  dataKey,
  chartType = 'line',
  height = 300,
  color = '#3B82F6'
}: ChartProps) => {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" fontSize={12} tickMargin={10} />
              <YAxis fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: '1px solid #f0f0f0',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" fontSize={12} tickMargin={10} />
              <YAxis fontSize={12} />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: '1px solid #f0f0f0',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default AnalyticsChart
