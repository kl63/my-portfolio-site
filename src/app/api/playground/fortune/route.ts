import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const getFortunePrompt = (question: string, type: string, style: string) => {
  const typeInstructions = {
    'general': 'Provide general life guidance and wisdom.',
    'love': 'Focus on love, relationships, and matters of the heart.',
    'career': 'Give career advice and professional guidance.',
    'health': 'Offer wellness and health-related insights.',
    'travel': 'Predict adventures and travel opportunities.',
    'creative': 'Inspire creativity and artistic endeavors.'
  };

  const styleInstructions = {
    'mystical': 'Use mystical, ancient wisdom language with metaphors about stars, cosmic energy, and spiritual guidance.',
    'humorous': 'Be witty, light-hearted, and include gentle humor while still being helpful.',
    'inspirational': 'Be uplifting, motivating, and focus on positive possibilities and personal growth.',
    'philosophical': 'Provide deep, thoughtful insights with philosophical wisdom and reflection.'
  };

  return `You are a wise AI fortune teller. ${typeInstructions[type as keyof typeof typeInstructions] || typeInstructions['general']} 

Style: ${styleInstructions[style as keyof typeof styleInstructions] || styleInstructions['mystical']}

The user asks: "${question}"

Provide a fortune that is:
- 2-4 sentences long
- Appropriate for all audiences
- Encouraging and positive (even if mentioning challenges)
- Specific enough to feel personal but general enough to be meaningful
- Written in the specified style

Remember: This is for entertainment purposes. Be helpful and inspiring while maintaining the mystical fortune-teller persona.`;
};

export async function POST(request: NextRequest) {
  try {
    const { question, type = 'general', style = 'mystical' } = await request.json();

    if (!question || question.trim().length < 3) {
      return NextResponse.json({ error: 'Question must be at least 3 characters long' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        fortune: generateFallbackFortune(question, type, style)
      });
    }

    const prompt = getFortunePrompt(question, type, style);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a wise and benevolent AI fortune teller. Provide thoughtful, positive, and entertaining fortunes that inspire and guide people. Always maintain an appropriate and family-friendly tone.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    const fortune = completion.choices[0]?.message?.content || generateFallbackFortune(question, type, style);

    return NextResponse.json({ fortune });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    const { question, type = 'general', style = 'mystical' } = await request.json().catch(() => ({ 
      question: 'What does my future hold?', 
      type: 'general', 
      style: 'mystical' 
    }));

    return NextResponse.json({ 
      fortune: generateFallbackFortune(question, type, style)
    });
  }
}

function generateFallbackFortune(question: string, type: string, style: string): string {
  const mysticalFortunes = [
    "The stars whisper of positive changes approaching your path. Trust in your inner wisdom and embrace the opportunities that present themselves.",
    "The cosmic energies reveal that your question carries its own answer within. Look inward and you shall find the guidance you seek.",
    "Ancient wisdom suggests that this is a time of growth and transformation. The universe conspires to help those who help themselves.",
    "The celestial bodies align to bring clarity to your situation. What seems unclear now will become illuminated in due time."
  ];

  const humorousFortunes = [
    "The digital crystal ball says: 'Error 404: Future not found.' Just kidding! Good things are definitely coming your way, probably involving coffee.",
    "My AI circuits are buzzing with excitement about your future! It's looking brighter than a smartphone screen at 3 AM.",
    "The fortune cookies have been gossiping, and they say you're about to have some delightfully unexpected moments ahead.",
    "According to my calculations (and a magic 8-ball I consulted), the outlook is quite positive with a 73.2% chance of awesomeness."
  ];

  const inspirationalFortunes = [
    "Your journey is unfolding exactly as it should. Every challenge you face is preparing you for the success that awaits.",
    "The strength you've shown in asking this question reveals your readiness for the positive changes ahead. Believe in yourself.",
    "You have all the tools within you to create the future you desire. Trust your instincts and take that next step forward.",
    "This moment of uncertainty is actually a doorway to new possibilities. Step through it with confidence and hope."
  ];

  const philosophicalFortunes = [
    "As the ancient philosophers taught, the question itself often contains the seed of its answer. Reflect deeply on what you already know.",
    "In the grand tapestry of existence, your thread is weaving a pattern of growth and discovery. Each moment adds to your unique design.",
    "The nature of time reveals that what we seek is often seeking us in return. Be patient and remain open to unexpected paths.",
    "True wisdom lies not in knowing the future, but in understanding that each present moment shapes what is to come."
  ];

  let fortunes = mysticalFortunes;
  if (style === 'humorous') fortunes = humorousFortunes;
  else if (style === 'inspirational') fortunes = inspirationalFortunes;
  else if (style === 'philosophical') fortunes = philosophicalFortunes;

  const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  
  return randomFortune + "\n\n*Note: This fortune was generated in offline mode. Connect to the internet for personalized AI-powered readings.*";
}
