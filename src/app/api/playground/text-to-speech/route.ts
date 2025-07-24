import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text, voice, speed } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // Fallback audio generation if no API key
    if (!process.env.OPENAI_API_KEY) {
      const fallbackAudio = generateFallbackAudio(text);
      return new NextResponse(fallbackAudio, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': 'attachment; filename="speech.mp3"'
        }
      });
    }

    // Use OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
      input: text,
      speed: speed || 1.0,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="speech.mp3"'
      }
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    
    // Return fallback audio on error
    const { text } = await request.json();
    const fallbackAudio = generateFallbackAudio(text || 'Error generating speech');
    return new NextResponse(fallbackAudio, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="speech.mp3"'
      }
    });
  }
}

function generateFallbackAudio(text: string): Buffer {
  // Create a simple audio file placeholder
  // In a real implementation without OpenAI, you might use other TTS services
  // For now, we'll create a minimal audio file that represents the text
  
  const fallbackMessage = `Text to Speech functionality requires an OpenAI API key. Your text was: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`;
  
  // Create a minimal MP3-like buffer (this is just a placeholder)
  // In reality, you'd use a different TTS service or library
  const buffer = Buffer.from(fallbackMessage, 'utf-8');
  
  return buffer;
}
