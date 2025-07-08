import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_URL = "https://hook.us2.make.com/a6upeu74fnfviv4nblakt7gygtyw4oa4";

export async function POST(request: NextRequest) {
  try {
    // Get form data from request body
    const formData = await request.json();
    
    // Forward the request to Make.com webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      console.error('Zapier webhook error:', await response.text());
      return NextResponse.json(
        { error: 'Failed to submit form' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
