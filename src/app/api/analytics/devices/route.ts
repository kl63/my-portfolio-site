import { NextResponse } from 'next/server';
import { getDeviceCategories } from '@/lib/google-analytics';

export async function GET() {
  try {
    console.log('Fetching device data...');
    const data = await getDeviceCategories();

    // Ensure we have data and provide fallback data if needed
    if (!data || data.length === 0) {
      console.log('No device data found, using fallback data');
      return NextResponse.json([
        { name: 'Desktop', value: 1, device: 'desktop' },
        { name: 'Mobile', value: 0, device: 'mobile' },
        { name: 'Tablet', value: 0, device: 'tablet' }
      ]);
    }

    // Format for chart component and ensure we have valid data
    const formattedData = data.map(item => ({
      // Standardize device naming to match what the dashboard component expects
      name: item.device.charAt(0).toUpperCase() + item.device.slice(1),
      value: item.users,
      // Add device type field that may be expected by the component
      device: item.device.toLowerCase()
    }));

    console.log('Device data formatted:', formattedData);
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error in device analytics endpoint:', error);
    // Return fallback data in case of error
    return NextResponse.json([
      { name: 'Desktop', value: 1, device: 'desktop' },
      { name: 'Mobile', value: 0, device: 'mobile' },
      { name: 'Tablet', value: 0, device: 'tablet' }
    ]);
  }
}
