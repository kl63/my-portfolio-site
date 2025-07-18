'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

// Inline Skeleton component since import is having issues
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className || ''}`}
      {...props}
    />
  );
}

interface DeviceData {
  name: string;
  value: number;
  device: string;
}

interface DeviceBreakdownProps {
  data: DeviceData[];
  isLoading: boolean;
}

export function DeviceBreakdown({ data = [], isLoading }: DeviceBreakdownProps) {
  // Ensure data is valid
  const safeData = Array.isArray(data) ? data : [];
  
  // Calculate total users for percentage calculation
  const total = safeData.reduce((acc, item) => acc + (item?.value || 0), 0);

  // Get device icons and make sure we have default devices even if some are missing
  const getDeviceIcon = (device: string = '') => {
    // Safely handle potentially undefined device strings
    if (!device) return <Monitor className="h-5 w-5 text-gray-500" />;
    
    const deviceType = device.toLowerCase();
    if (deviceType.includes('desktop')) return <Monitor className="h-5 w-5 text-blue-500" />;
    if (deviceType.includes('mobile')) return <Smartphone className="h-5 w-5 text-green-500" />;
    if (deviceType.includes('tablet')) return <Tablet className="h-5 w-5 text-purple-500" />;
    return <Monitor className="h-5 w-5 text-gray-500" />;
  };

  // Ensure we have all three device types
  const deviceMap: Record<string, DeviceData> = {};
  
  // Add existing data to map
  data?.forEach(item => {
    const deviceType = item.device.toLowerCase();
    deviceMap[deviceType] = item;
  });
  
  // Add default entries for missing devices
  if (!deviceMap['desktop']) deviceMap['desktop'] = { name: 'Desktop', value: 0, device: 'desktop' };
  if (!deviceMap['mobile']) deviceMap['mobile'] = { name: 'Mobile', value: 0, device: 'mobile' };
  if (!deviceMap['tablet']) deviceMap['tablet'] = { name: 'Tablet', value: 0, device: 'tablet' };

  // Convert back to array for rendering
  const normalizedData = Object.values(deviceMap);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Monitor className="h-4 w-4" />
          Device Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : safeData.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p>No device data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {normalizedData.map((device) => {
              const percentage = total > 0 ? Math.round((device.value / total) * 100) : 0;
              
              return (
                <div key={device.device} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(device.device)}
                    <span className="text-sm font-medium">{device.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          device.device.includes('desktop') ? 'bg-blue-500' : 
                          device.device.includes('mobile') ? 'bg-green-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
