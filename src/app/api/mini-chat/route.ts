import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      // Fallback responses when no API key
      const fallbackResponses = [
        "Thanks for your interest in Kevin's work! He's a passionate full-stack developer with expertise in React, Next.js, and AI integration. What would you like to know more about?",
        "Kevin has worked on various projects including AI-powered applications, web development, and creative coding solutions. Feel free to explore his portfolio!",
        "I'd love to help you learn more about Kevin's skills and projects. He specializes in modern web technologies and has a strong background in AI development.",
        "Kevin's portfolio showcases his expertise in building responsive, user-friendly applications. Is there a particular project or skill you're curious about?",
        "Great question! Kevin is always working on innovative projects that combine cutting-edge technology with great user experience. What interests you most?"
      ];

      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      return NextResponse.json({
        success: true,
        response: randomResponse
      });
    }

    const systemPrompt = `You are Kevin Lin's AI assistant on his portfolio website. You're helpful, friendly, and knowledgeable about Kevin's work and background. 

Kevin is a skilled full-stack developer with expertise in:
- Frontend: React, Next.js, TypeScript, Tailwind CSS
- Backend: Node.js, Python, APIs
- AI/ML: OpenAI integration, AI-powered applications
- Other: Modern web development, responsive design, user experience

His portfolio includes:
- AI Playground Hub with multiple AI-powered mini-applications
- Various web development projects
- Creative coding solutions
- Professional experience in software development

Keep responses concise (2-3 sentences max), helpful, and focused on Kevin's professional capabilities. If asked about specific projects, highlight his technical skills and problem-solving abilities. Always maintain a professional yet approachable tone.

If users ask about contacting Kevin, direct them to the contact page or suggest they can reach out through the portfolio.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 
      "I'm here to help you learn more about Kevin's work! Feel free to ask about his projects, skills, or experience.";

    return NextResponse.json({
      success: true,
      response: response
    });

  } catch (error) {
    console.error('Error in mini-chat API:', error);
    
    return NextResponse.json({
      success: true,
      response: "Thanks for your interest! Kevin is a talented developer with expertise in React, Next.js, and AI integration. Feel free to explore his portfolio to learn more about his projects and skills."
    });
  }
}
