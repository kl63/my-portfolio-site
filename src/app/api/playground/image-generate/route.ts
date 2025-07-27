import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { prompt, style, aspectRatio } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Initialize OpenAI client at runtime
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Map aspect ratio to DALL-E size
    let imageSize = "1024x1024"; // default square
    if (aspectRatio === "landscape") {
      imageSize = "1792x1024";
    } else if (aspectRatio === "portrait") {
      imageSize = "1024x1792";
    }

    // Map style parameter
    const imageStyle = style === "natural" ? "natural" : "vivid";

    // Generate image using DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: imageSize as "1024x1024" | "1792x1024" | "1024x1792",
      quality: "standard",
      style: imageStyle as "natural" | "vivid"
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      imageUrl,
      prompt 
    });

  } catch (error) {
    console.error('Error generating image:', error);
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('content_policy_violation')) {
        return NextResponse.json(
          { error: 'The prompt violates OpenAI content policy. Please try a different prompt.' },
          { status: 400 }
        );
      }
      
      if (error.message.includes('rate_limit_exceeded')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    );
  }
}
