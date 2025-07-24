import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const getStoryPrompt = (topic: string, storyType: string, tone: string) => {
  const typeInstructions = {
    'short-story': 'Write a complete short story of 200-500 words with a clear beginning, middle, and end.',
    'poem': 'Write a creative poem with vivid imagery and emotional depth. Use appropriate rhythm and structure.',
    'flash-fiction': 'Write an ultra-short story under 100 words that tells a complete narrative with impact.',
    'fairy-tale': 'Write a classic fairy tale style story with magical elements and a moral lesson.',
    'sci-fi': 'Write a science fiction story with futuristic elements, technology, or space themes.',
    'mystery': 'Write a suspenseful mystery story with intrigue, clues, and an unexpected resolution.'
  };

  const toneInstructions = {
    'whimsical': 'Use a playful, lighthearted, and imaginative tone with quirky details.',
    'dramatic': 'Use intense emotions, conflict, and powerful imagery to create drama.',
    'humorous': 'Include wit, funny situations, and comedic elements throughout.',
    'romantic': 'Focus on love, relationships, and emotional connections between characters.',
    'dark': 'Use a serious, mysterious, or slightly ominous tone with deeper themes.',
    'inspirational': 'Create an uplifting story that motivates and encourages the reader.'
  };

  return `${typeInstructions[storyType as keyof typeof typeInstructions] || typeInstructions['short-story']} 

The story should be about: ${topic}

Tone and style: ${toneInstructions[tone as keyof typeof toneInstructions] || toneInstructions['whimsical']}

Make the story engaging, creative, and well-structured. Include vivid descriptions and compelling characters if applicable.`;
};

export async function POST(request: NextRequest) {
  try {
    const { topic, storyType = 'short-story', tone = 'whimsical' } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        story: generateFallbackStory(topic, storyType, tone)
      });
    }

    // Initialize OpenAI client at runtime
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = getStoryPrompt(topic, storyType, tone);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a creative writing assistant. Generate engaging, original stories and poems based on user prompts. Be creative, imaginative, and ensure your writing is appropriate for all audiences.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.8,
    });

    const story = completion.choices[0]?.message?.content || generateFallbackStory(topic, storyType, tone);

    return NextResponse.json({ story });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    const { topic, storyType = 'short-story', tone = 'whimsical' } = await request.json().catch(() => ({ 
      topic: 'a magical adventure', 
      storyType: 'short-story', 
      tone: 'whimsical' 
    }));

    return NextResponse.json({ 
      story: generateFallbackStory(topic, storyType, tone)
    });
  }
}

function generateFallbackStory(topic: string, storyType: string, tone: string): string {
  const fallbackStories = {
    'short-story': `# A Tale of ${topic}

Once upon a time, in a world not so different from our own, there lived a character whose life was about to change forever because of ${topic}.

The adventure began on an ordinary Tuesday morning, when something extraordinary happened. The protagonist discovered that ${topic} held secrets beyond imagination.

Through trials and tribulations, our hero learned valuable lessons about courage, friendship, and the power of believing in oneself. The story of ${topic} became a legend that would be told for generations to come.

And so, the tale reminds us that even the most ordinary things can lead to the most extraordinary adventures.

*Note: This is a sample story generated in offline mode. Connect to the internet for AI-powered creative writing.*`,

    'poem': `# ${topic}

In the realm of dreams and wonder,
Where ${topic} holds its sway,
Magic dances all around us,
In the most enchanting way.

Words cannot capture fully,
All the beauty that we see,
When ${topic} shows its splendor,
Setting every heart free.

*Note: This is a sample poem generated in offline mode.*`,

    'flash-fiction': `The moment I encountered ${topic}, everything changed. In that instant, the world shifted, revealing truths I never knew existed. Some discoveries, no matter how small, have the power to transform everything.

*Note: This is a sample flash fiction generated in offline mode.*`
  };

  return fallbackStories[storyType as keyof typeof fallbackStories] || fallbackStories['short-story'];
}
