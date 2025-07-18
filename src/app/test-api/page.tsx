'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function TestAPIPage() {
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const endpoints = [
    { name: 'Overview', url: '/api/analytics?type=overview' },
    { name: 'Page Views', url: '/api/analytics?type=pageViews&days=7' },
    { name: 'Top Pages', url: '/api/analytics?type=topPages&limit=5' },
    { name: 'Devices', url: '/api/analytics?type=devices' },
    { name: 'Bounce Rate', url: '/api/analytics?type=bounceRate&days=7' },
    { name: 'Realtime - Active Users', url: '/api/analytics/realtime?type=activeUsers' },
    { name: 'Realtime - Events', url: '/api/analytics/realtime?type=events' },
    { name: 'Realtime - Countries', url: '/api/analytics/realtime?type=countries' },
    { name: 'Realtime - Cities', url: '/api/analytics/realtime?type=cities' },
  ];

  const testEndpoint = async (name: string, url: string) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    
    try {
      // Use our debug endpoint to get detailed information
      const debugUrl = `/api/debug?url=${encodeURIComponent(url)}`;
      const response = await fetch(debugUrl, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      
      const data = await response.json();
      setResults(prev => ({ ...prev, [name]: data }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [name]: { error: error instanceof Error ? error.message : 'Unknown error' } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const testAll = async () => {
    for (const endpoint of endpoints) {
      await testEndpoint(endpoint.name, endpoint.url);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">API Endpoint Test</h1>
      
      <div className="mb-6">
        <Button onClick={testAll} variant="default">Test All Endpoints</Button>
      </div>
      
      <div className="space-y-4">
        {endpoints.map((endpoint) => (
          <Card key={endpoint.name} className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{endpoint.name}</h2>
              <Button 
                onClick={() => testEndpoint(endpoint.name, endpoint.url)}
                disabled={loading[endpoint.name]}
                variant="outline"
                size="sm"
              >
                {loading[endpoint.name] ? 'Testing...' : 'Test'}
              </Button>
            </div>
            
            <div className="text-sm">
              <p className="mb-1"><code>{endpoint.url}</code></p>
              {results[endpoint.name] ? (
                <div className="bg-gray-100 p-2 rounded mt-2 max-h-60 overflow-auto">
                  <pre className="whitespace-pre-wrap break-all">
                    {JSON.stringify(results[endpoint.name], null, 2)}
                  </pre>
                </div>
              ) : loading[endpoint.name] ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                <p className="text-gray-500">Not tested yet</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
