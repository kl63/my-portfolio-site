import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getExplanationPrompt = (code: string, language: string, level: string) => {
  const levelInstructions = {
    'beginner': 'Explain this code in very simple terms that a complete beginner can understand. Avoid technical jargon and use analogies when helpful.',
    'intermediate': 'Provide a clear explanation with moderate technical detail. Assume some programming knowledge but explain key concepts.',
    'advanced': 'Give a detailed technical explanation including algorithms, complexity, design patterns, and best practices where relevant.'
  };

  return `${levelInstructions[level as keyof typeof levelInstructions] || levelInstructions['intermediate']}

Programming Language: ${language}

Please explain what this code does, how it works, and break down the key components:

\`\`\`${language}
${code}
\`\`\`

Structure your explanation with:
1. **Overview**: What does this code do?
2. **Step-by-step breakdown**: Explain each part
3. **Key concepts**: Important programming concepts used
4. **Potential improvements**: If applicable, suggest improvements`;
};

export async function POST(request: NextRequest) {
  try {
    const { code, language = 'javascript', level = 'intermediate' } = await request.json();

    if (!code || code.trim().length < 10) {
      return NextResponse.json({ error: 'Code must be at least 10 characters long' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        explanation: generateFallbackExplanation(code, language, level)
      });
    }

    const prompt = getExplanationPrompt(code, language, level);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert programming tutor. Explain code clearly and educationally, adapting your explanation to the specified skill level. Use proper formatting with markdown when helpful.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.3,
    });

    const explanation = completion.choices[0]?.message?.content || generateFallbackExplanation(code, language, level);

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    const { code, language = 'javascript', level = 'intermediate' } = await request.json().catch(() => ({ 
      code: '', 
      language: 'javascript', 
      level: 'intermediate' 
    }));

    return NextResponse.json({ 
      explanation: generateFallbackExplanation(code, language, level)
    });
  }
}

function generateFallbackExplanation(code: string, language: string, level: string): string {
  const lines = code.split('\n').filter(line => line.trim());
  const hasFunction = /function|def|class|public|private/.test(code);
  const hasLoop = /for|while|forEach/.test(code);
  const hasCondition = /if|else|switch|case/.test(code);
  
  let explanation = `## Code Overview\n\nThis is a ${language} code snippet`;
  
  if (hasFunction) {
    explanation += " that defines a function or class";
  }
  if (hasLoop) {
    explanation += " with loop structures";
  }
  if (hasCondition) {
    explanation += " containing conditional logic";
  }
  
  explanation += ".\n\n## Basic Analysis\n\n";
  explanation += `• **Language**: ${language}\n`;
  explanation += `• **Lines of code**: ${lines.length}\n`;
  explanation += `• **Contains functions**: ${hasFunction ? 'Yes' : 'No'}\n`;
  explanation += `• **Contains loops**: ${hasLoop ? 'Yes' : 'No'}\n`;
  explanation += `• **Contains conditions**: ${hasCondition ? 'Yes' : 'No'}\n\n`;
  
  if (level === 'beginner') {
    explanation += "## Simple Explanation\n\n";
    explanation += "This code tells the computer to follow a series of instructions. ";
    if (hasFunction) explanation += "It creates reusable pieces of code called functions. ";
    if (hasLoop) explanation += "It repeats certain actions multiple times. ";
    if (hasCondition) explanation += "It makes decisions based on different conditions. ";
  } else {
    explanation += "## Technical Details\n\n";
    explanation += "The code structure suggests it implements specific programming logic. ";
    explanation += "For a detailed line-by-line analysis, please connect to the internet for AI-powered explanations.";
  }
  
  explanation += "\n\n*Note: This is a basic analysis generated in offline mode. Connect to the internet for comprehensive AI-powered code explanations.*";
  
  return explanation;
}
