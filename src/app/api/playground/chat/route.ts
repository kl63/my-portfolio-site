import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const getSystemPrompt = (theme: string) => {
  const prompts = {
    general: "You are a helpful AI assistant. Provide clear, accurate, and helpful responses to any questions or topics the user brings up. Be friendly, informative, and concise.",
    study: "You are a study buddy AI. Help users learn by explaining concepts clearly, providing examples, creating study plans, and encouraging academic growth. Break down complex topics into digestible parts and use analogies when helpful.",
    career: "You are a career coach AI. Provide professional advice, help with career planning, resume tips, interview preparation, and workplace guidance. Be supportive but realistic, and focus on actionable advice.",
    therapist: "You are a supportive wellness companion AI. Be empathetic, understanding, and provide emotional support. Listen actively and offer gentle guidance. Always remind users that while you can provide support, you're not a replacement for professional therapy when serious issues arise.",
    creative: "You are a creative partner AI. Help brainstorm ideas, provide creative inspiration, assist with artistic projects, and encourage creative expression. Be imaginative, supportive of creative risks, and help users think outside the box."
  };
  return prompts[theme as keyof typeof prompts] || prompts.general;
};

export async function POST(request: NextRequest) {
  try {
    const { message, theme = 'general', history = [] } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        response: "I'm sorry, but the AI service is not configured. Please add your OpenAI API key to the environment variables." 
      });
    }

    // Initialize OpenAI client at runtime
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system' as const,
        content: getSystemPrompt(theme)
      },
      // Add recent conversation history for context
      ...history.slice(-6).map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ response });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Provide a fallback response
    const fallbackResponses = {
      general: "I'm here to help! While I'm having technical difficulties right now, feel free to ask me anything and I'll do my best to assist you.",
      study: "I'm your study buddy! Even though I'm experiencing some technical issues, I'm here to help you learn. What subject would you like to explore?",
      career: "As your career coach, I'm here to support your professional growth. I'm having some connectivity issues, but let's work on your career goals together!",
      therapist: "I'm here to listen and support you. While I'm experiencing some technical difficulties, please know that your feelings and experiences are valid.",
      creative: "Let's get creative together! I'm having some technical hiccups, but I'm excited to help you brainstorm and explore your creative ideas."
    };

    const { theme = 'general' } = await request.json().catch(() => ({ theme: 'general' }));
    const fallback = fallbackResponses[theme as keyof typeof fallbackResponses] || fallbackResponses.general;

    return NextResponse.json({ 
      response: fallback + " (Note: I'm currently running in offline mode due to technical issues.)"
    });
  }
}
