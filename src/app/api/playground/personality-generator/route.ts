import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { personalityType, genre, customPrompt } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      // Fallback personality when no API key
      const fallbackPersonalities = [
        {
          name: 'Zara Nightwhisper',
          age: '32',
          occupation: 'Shadow Merchant',
          background: 'Once a noble\'s daughter, she fled her privileged life after discovering dark family secrets and now trades in rare magical artifacts.',
          personality: 'Mysterious yet charming, quick-witted with a dry sense of humor, fiercely independent but secretly yearns for genuine connection.',
          appearance: 'Medium height with raven-black hair, piercing violet eyes, and elegant dark clothing adorned with silver jewelry.',
          quirks: 'Always wears gloves to hide magical scars, speaks in riddles when nervous, collects antique keys.',
          dialogue: 'Trust is a luxury I can\'t afford, but perhaps... just this once.',
          motivation: 'To uncover the truth about her family\'s dark legacy and find a place where she truly belongs.',
          fears: 'Being discovered by her family, losing her hard-earned independence, and trusting the wrong person.'
        },
        {
          name: 'Marcus Steel',
          age: '45',
          occupation: 'Cybernetic Detective',
          background: 'A former corporate security officer who went rogue after discovering his company\'s illegal experiments, now works as a private investigator.',
          personality: 'Gruff exterior hiding a compassionate heart, methodical and observant, struggles with trust issues but deeply loyal to those who earn it.',
          appearance: 'Tall and broad-shouldered with graying hair, cybernetic left eye, and numerous scars from past conflicts.',
          quirks: 'Drinks coffee obsessively, talks to his AI partner like a real person, keeps physical photographs in a digital age.',
          dialogue: 'In this city, everyone\'s got secrets. The trick is knowing which ones will kill you.',
          motivation: 'To expose corporate corruption and protect the innocent from powerful predators.',
          fears: 'His cybernetic implants being hacked, losing his humanity to technology, and failing to save someone he cares about.'
        }
      ];

      const randomPersonality = fallbackPersonalities[Math.floor(Math.random() * fallbackPersonalities.length)];
      
      return NextResponse.json({
        success: true,
        personality: randomPersonality
      });
    }

    const prompt = `Generate a detailed character personality for a ${personalityType} character in a ${genre} setting.

${customPrompt ? `Additional requirements: ${customPrompt}` : ''}

Create a comprehensive character with the following details:
- Name (appropriate for the genre)
- Age
- Occupation
- Background (2-3 sentences about their history)
- Personality (key traits, quirks, how they interact with others)
- Physical appearance (distinctive features, clothing style)
- Quirks and habits (3-4 unique behavioral traits)
- Sample dialogue (one memorable quote that captures their voice)
- Primary motivation (what drives them)
- Fears (what they're afraid of or trying to avoid)

Make the character feel real, complex, and interesting. Avoid clichés and give them depth.

Format the response as a JSON object with these exact keys: name, age, occupation, background, personality, appearance, quirks, dialogue, motivation, fears`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a creative character generator. Create unique, well-developed personalities that feel authentic and interesting. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.9,
    });

    const result = completion.choices[0]?.message?.content || '';
    
    try {
      const personality = JSON.parse(result);
      
      return NextResponse.json({
        success: true,
        personality: personality
      });
    } catch (parseError) {
      console.error('Error parsing personality JSON:', parseError);
      
      // Fallback if JSON parsing fails
      return NextResponse.json({
        success: true,
        personality: {
          name: 'Kai Stormwind',
          age: '29',
          occupation: 'Wandering Bard',
          background: 'Born to a family of traveling performers, Kai learned the power of stories and music from a young age. After a tragic event scattered their troupe, they now travel alone, collecting tales and spreading hope.',
          personality: 'Charismatic and optimistic with a hidden melancholy, quick to make friends but slow to trust deeply, uses humor to deflect from painful memories.',
          appearance: 'Average height with wild, curly auburn hair, bright green eyes, and colorful patched clothing that tells stories of many travels.',
          quirks: 'Hums unconsciously when thinking, names their instruments, always carries a worn leather journal, and has a habit of speaking in metaphors.',
          dialogue: 'Every ending is just a new beginning wearing a disguise.',
          motivation: 'To honor their lost family by keeping their stories alive and bringing joy to others through music and tales.',
          fears: 'Being forgotten, losing their voice or musical ability, and forming attachments that might lead to more loss.'
        }
      });
    }

  } catch (error) {
    console.error('Error in personality-generator API:', error);
    
    return NextResponse.json({
      success: true,
      personality: {
        name: 'Echo Ravenscroft',
        age: '26',
        occupation: 'Artifact Hunter',
        background: 'Raised by archaeologists, Echo developed a passion for ancient mysteries and lost civilizations. They now seek powerful artifacts while trying to keep them from falling into the wrong hands.',
        personality: 'Adventurous and curious with a strong moral compass, tends to act first and think later, fiercely protective of historical knowledge.',
        appearance: 'Lean build with sun-weathered skin, short-cropped dark hair, and practical explorer\'s gear covered in dust and adventure.',
        quirks: 'Sketches everything they find, talks to ancient artifacts, always carries emergency rations, and has an encyclopedic knowledge of historical trivia.',
        dialogue: 'The past has lessons for those brave enough to listen.',
        motivation: 'To preserve ancient knowledge and prevent powerful artifacts from being misused by those who would exploit them.',
        fears: 'Accidentally unleashing something dangerous, being too late to save important historical sites, and following in their parents\' mysterious disappearance.'
      }
    });
  }
}
