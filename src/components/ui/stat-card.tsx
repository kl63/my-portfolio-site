"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  changePercent?: number
  description?: string
  className?: string
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  changePercent,
  description,
  className = ''
}) => {
  return (
    <Card className={`p-5 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {changePercent !== undefined && (
            <div className="flex items-center mt-2">
              <div className={`flex items-center text-sm ${changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {changePercent >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3" />
                )}
                <span className="font-medium">{Math.abs(changePercent)}%</span>
              </div>
              <span className="text-xs text-muted-foreground ml-1">vs last period</span>
            </div>
          )}
          
          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        <div className="text-blue-500">
          {icon}
        </div>
      </div>
    </Card>
  )
}

export default StatCard
