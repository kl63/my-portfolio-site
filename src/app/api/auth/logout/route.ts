import { NextResponse } from 'next/server';

export async function POST() {
  // We don't need to revoke the token on the server for a simple implementation
  // The client will remove the token from localStorage
  
  return NextResponse.json({ 
    success: true,
    message: 'Logged out successfully' 
  });
}
