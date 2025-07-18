import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the URL to debug from query params
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
  }
  
  try {
    // Build the full URL if it's a relative path
    const fullUrl = url.startsWith('/') 
      ? `${request.headers.get('host') ? `http://${request.headers.get('host')}` : 'http://localhost:3002'}${url}`
      : url;
    
    console.log(`Debug: Attempting to fetch ${fullUrl}`);
    
    // Get auth token from request if present
    const token = request.headers.get('Authorization');
    
    // Fetch the URL
    const response = await fetch(fullUrl, {
      headers: token ? { 'Authorization': token } : {}
    });
    
    // Get response details
    const status = response.status;
    const headers = Object.fromEntries(response.headers.entries());
    const contentType = response.headers.get('content-type');
    
    let body;
    try {
      // Try to parse as JSON first
      if (contentType && contentType.includes('application/json')) {
        body = await response.json();
      } else {
        // Otherwise get as text
        body = await response.text();
        
        // Truncate if it's too large
        if (body.length > 1000) {
          body = body.substring(0, 1000) + '... (truncated)';
        }
      }
    } catch (error) {
      body = `Error parsing response: ${error instanceof Error ? error.message : String(error)}`;
    }
    
    return NextResponse.json({
      url: fullUrl,
      status,
      headers,
      contentType,
      body
    });
  } catch (error) {
    console.error('Debug route error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      url
    }, { status: 500 });
  }
}
