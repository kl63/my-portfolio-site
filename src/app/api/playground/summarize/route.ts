import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const getSummaryPrompt = (text: string, length: string, style: string) => {
  const lengthInstructions = {
    'short': 'Provide a very concise summary in 1-2 sentences (20-40 words).',
    'medium': 'Provide a moderate summary in 3-5 sentences (50-100 words).',
    'long': 'Provide a comprehensive summary in 1-2 paragraphs (100-200 words).'
  };

  const styleInstructions = {
    'bullet': 'Format the summary as clear bullet points highlighting the key information.',
    'paragraph': 'Write the summary as a flowing, coherent paragraph.',
    'executive': 'Write in a professional, business-oriented executive summary style.',
    'casual': 'Use a conversational, easy-to-read tone that anyone can understand.'
  };

  return `${lengthInstructions[length as keyof typeof lengthInstructions] || lengthInstructions['medium']} 
${styleInstructions[style as keyof typeof styleInstructions] || styleInstructions['paragraph']}

Please summarize the following text:

${text}`;
};

export async function POST(request: NextRequest) {
  try {
    const { text, length = 'medium', style = 'paragraph' } = await request.json();

    if (!text || text.trim().length < 50) {
      return NextResponse.json({ error: 'Text must be at least 50 characters long' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        summary: generateFallbackSummary(text, length, style)
      });
    }

    const prompt = getSummaryPrompt(text, length, style);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional text summarization assistant. Create accurate, concise summaries that capture the main points and key information from the provided text. Maintain the original meaning while condensing the content according to the specified length and style requirements.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 400,
      temperature: 0.3,
    });

    const summary = completion.choices[0]?.message?.content || generateFallbackSummary(text, length, style);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    const { text, length = 'medium', style = 'paragraph' } = await request.json().catch(() => ({ 
      text: '', 
      length: 'medium', 
      style: 'paragraph' 
    }));

    return NextResponse.json({ 
      summary: generateFallbackSummary(text, length, style)
    });
  }
}

function generateFallbackSummary(text: string, length: string, style: string): string {
  // Simple extractive summarization fallback
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  let summaryLength = 2;
  if (length === 'short') summaryLength = 1;
  else if (length === 'long') summaryLength = Math.min(4, sentences.length);
  
  const selectedSentences = sentences.slice(0, summaryLength);
  
  let summary = selectedSentences.join('. ').trim();
  if (summary && !summary.endsWith('.')) summary += '.';
  
  if (style === 'bullet') {
    const points = selectedSentences.map(s => `• ${s.trim()}`);
    summary = points.join('\n');
  } else if (style === 'executive') {
    summary = `Executive Summary: ${summary}`;
  } else if (style === 'casual') {
    summary = `Here's the gist: ${summary}`;
  }
  
  return summary + '\n\n*Note: This is a basic summary generated in offline mode. Connect to the internet for AI-powered summarization.*';
}
