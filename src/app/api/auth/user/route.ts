import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authToken = request.headers.get('authorization')?.split(' ')[1];
  
  if (!authToken) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    // Forward the token to your FastAPI backend for verification
    const response = await fetch('https://fastapi.kevinlinportfolio.com/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to verify token');
    }

    const userData = await response.json();
    
    return NextResponse.json({ 
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.username || userData.email.split('@')[0],
      } 
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
