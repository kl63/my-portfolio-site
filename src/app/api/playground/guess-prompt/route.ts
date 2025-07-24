import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { action, imageDescription, userGuess } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      // Fallback response when no API key
      return NextResponse.json({
        success: true,
        result: {
          prompt: "A majestic dragon flying over a medieval castle at sunset",
          similarity: Math.random() * 100,
          feedback: "Great guess! Try to be more specific about the setting and mood."
        }
      });
    }

    let prompt = '';
    
    if (action === 'generate_prompt') {
      prompt = `Generate a creative and detailed AI image prompt that would create an interesting image for a guessing game. The prompt should be:
      - Specific enough to create a unique image
      - Not too obvious or too obscure
      - Include visual elements, mood, and style
      - Be suitable for an image generation AI
      
      Return only the prompt text, nothing else.`;
    } else if (action === 'evaluate_guess') {
      prompt = `Compare these two prompts and provide feedback:
      
      Original prompt: "${imageDescription}"
      User's guess: "${userGuess}"
      
      Provide:
      1. A similarity score (0-100)
      2. Brief feedback on what they got right and what they missed
      
      Format as JSON: {"similarity": number, "feedback": "text"}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for an AI prompt guessing game. Be encouraging and educational."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    const result = completion.choices[0]?.message?.content || '';

    if (action === 'evaluate_guess') {
      try {
        const evaluation = JSON.parse(result);
        return NextResponse.json({
          success: true,
          result: evaluation
        });
      } catch {
        return NextResponse.json({
          success: true,
          result: {
            similarity: 75,
            feedback: "Good attempt! Try to include more specific details about the visual elements."
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      result: {
        prompt: result.trim()
      }
    });

  } catch (error) {
    console.error('Error in guess-prompt API:', error);
    
    return NextResponse.json({
      success: true,
      result: {
        prompt: "A cyberpunk cityscape with neon lights reflecting in rain-soaked streets",
        similarity: 80,
        feedback: "Nice work! Consider adding more details about lighting and atmosphere."
      }
    });
  }
}
