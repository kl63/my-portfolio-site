import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { action, text, message, targetLanguage, proficiency, topic } = await request.json();

    // Fallback responses if no API key
    if (!process.env.OPENAI_API_KEY) {
      const fallbackResult = generateFallbackResponse(action, text, message, targetLanguage, proficiency, topic);
      return NextResponse.json({ result: fallbackResult });
    }

    let prompt = '';
    let systemMessage = '';

    switch (action) {
      case 'translate':
        systemMessage = `You are a professional translator. Translate text accurately from English to ${getLanguageName(targetLanguage)}, considering the user's ${proficiency} level.`;
        prompt = `Translate this English text to ${getLanguageName(targetLanguage)}: "${text}"`;
        break;

      case 'grammar':
        systemMessage = `You are a ${getLanguageName(targetLanguage)} grammar expert and language tutor. Check grammar and provide corrections and explanations suitable for a ${proficiency} level learner.`;
        prompt = `Check the grammar of this ${getLanguageName(targetLanguage)} text and provide corrections with explanations: "${text}"`;
        break;

      case 'conversation_start':
        systemMessage = `You are a friendly ${getLanguageName(targetLanguage)} language tutor. Start conversations appropriate for ${proficiency} level learners. Be encouraging and patient.`;
        prompt = `Start a conversation in ${getLanguageName(targetLanguage)} about "${topic}". Keep it simple and appropriate for a ${proficiency} level learner.`;
        break;

      case 'conversation_reply':
        systemMessage = `You are a friendly ${getLanguageName(targetLanguage)} language tutor. Respond naturally to the conversation while being helpful and encouraging to a ${proficiency} level learner.`;
        prompt = `The user said: "${message}". Respond naturally in ${getLanguageName(targetLanguage)} and provide gentle corrections if needed. Keep the conversation flowing.`;
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || 'Unable to process request.';

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error in language tutor:', error);
    
    // Return fallback response on error
    const { action, text, message, targetLanguage, proficiency, topic } = await request.json();
    const fallbackResult = generateFallbackResponse(action, text, message, targetLanguage, proficiency, topic);
    return NextResponse.json({ result: fallbackResult });
  }
}

function getLanguageName(code: string): string {
  const languageNames: { [key: string]: string } = {
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'ru': 'Russian',
    'ar': 'Arabic'
  };
  return languageNames[code] || 'Spanish';
}

function generateFallbackResponse(action: string, text?: string, message?: string, targetLanguage?: string, proficiency?: string, topic?: string): string {
  const langName = getLanguageName(targetLanguage || 'es');
  
  switch (action) {
    case 'translate':
      return `[Sample Translation to ${langName}]\n\nOriginal: "${text}"\nTranslation: This is a sample translation. For accurate translations, please ensure your OpenAI API key is configured.\n\nNote: Real translations would consider grammar, context, and cultural nuances appropriate for your ${proficiency} level.`;

    case 'grammar':
      return `[Sample Grammar Check for ${langName}]\n\nOriginal text: "${text}"\n\nGrammar Analysis:\n✓ This is a sample grammar check\n✓ For accurate grammar checking, please ensure your OpenAI API key is configured\n✓ Real analysis would include specific corrections and explanations\n\nSuggestions:\n- Grammar rules appropriate for ${proficiency} level\n- Common mistakes to avoid\n- Tips for improvement`;

    case 'conversation_start':
      return `¡Hola! Let's practice ${langName} together! I see you want to talk about "${topic}". This is a great topic for ${proficiency} level practice.\n\nFor a real conversation experience with an AI tutor, please ensure your OpenAI API key is configured. I would help you practice naturally while providing gentle corrections and encouragement!`;

    case 'conversation_reply':
      return `That's great practice! I can see you're working hard on your ${langName}.\n\nFor real-time conversation practice with corrections and natural responses, please ensure your OpenAI API key is configured. I would provide helpful feedback while keeping the conversation flowing naturally!`;

    default:
      return `Language tutor functionality requires an OpenAI API key for full features. Please configure your API key to access translation, grammar checking, and conversation practice.`;
  }
}
