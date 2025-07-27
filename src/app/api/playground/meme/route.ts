import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { template, topText, bottomText, generateCaption, generateImage } = await request.json();
    
    console.log('Meme API called with:', { template, topText, bottomText, generateCaption, generateImage });
    console.log('generateImage type:', typeof generateImage, 'value:', generateImage);
    console.log('topText:', topText, 'bottomText:', bottomText);

    // If generating image, use DALL-E to create meme
    if (generateImage === true && topText && bottomText) {
      console.log('✅ Entering image generation branch...');
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
          { error: 'OpenAI API key is not configured' },
          { status: 500 }
        );
      }

      // Initialize OpenAI client at runtime
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Create a prompt for DALL-E to generate a meme image
      const memePrompt = `Create a meme image with the text "${topText}" at the top and "${bottomText}" at the bottom. The image should be in classic meme format with bold white text with black outline, suitable for the ${template} meme template style. Make it look like a professional internet meme.`;

      try {
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: memePrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "vivid"
        });

        const imageUrl = response.data?.[0]?.url;

        if (!imageUrl) {
          return NextResponse.json(
            { error: 'Failed to generate meme image' },
            { status: 500 }
          );
        }

        return NextResponse.json({ 
          imageUrl,
          topText,
          bottomText,
          template
        });
      } catch (error) {
        console.error('Error generating meme image:', error);
        return NextResponse.json(
          { error: 'Failed to generate meme image. Please try again.' },
          { status: 500 }
        );
      }
    }

    // Fallback meme captions if no API key
    if (!process.env.OPENAI_API_KEY) {
      const fallbackCaption = generateFallbackCaption(template, generateCaption);
      return NextResponse.json({ caption: fallbackCaption });
    }

    let prompt = '';
    
    if (generateCaption) {
      // Generate AI caption for the template
      prompt = `Generate a funny meme caption for the "${template}" meme template. Return the top text and bottom text separated by a "|" character. Make it humorous and relatable. Example format: "Top text here|Bottom text here"`;
    } else {
      // Enhance existing caption
      prompt = `Make this meme funnier or suggest improvements. Template: ${template}, Top: "${topText}", Bottom: "${bottomText}". Provide a witty comment or alternative caption.`;
    }

    // Initialize OpenAI client at runtime
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a meme expert and comedian. Create funny, relatable meme captions that follow internet meme culture. Keep them appropriate but humorous."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    const caption = completion.choices[0]?.message?.content || 'Unable to generate caption.';

    return NextResponse.json({ caption });
  } catch (error) {
    console.error('Error generating meme caption:', error);
    
    // Return fallback caption on error
    const { template, generateCaption } = await request.json();
    const fallbackCaption = generateFallbackCaption(template, generateCaption);
    return NextResponse.json({ caption: fallbackCaption });
  }
}

function generateFallbackCaption(template: string, generateCaption: boolean): string {
  const fallbackCaptions: { [key: string]: string[] } = {
    'drake': [
      'Using outdated technology|Using the latest AI tools',
      'Doing things the hard way|Letting AI help you out',
      'Manual work|Automation'
    ],
    'distracted': [
      'Me|New AI tool|My current workflow',
      'Students|ChatGPT|Textbooks',
      'Me|This new app|My productivity'
    ],
    'woman-cat': [
      'When someone says AI will replace humans|AI just helping humans be more creative',
      'People worried about AI|AI making memes for them',
      'Old way of doing things|New AI-powered way'
    ],
    'brain': [
      'Using basic tools|Using advanced tools|Using AI tools|Using AI to make AI tools',
      'Manual coding|Stack Overflow|GitHub Copilot|AI writing the entire app',
      'Thinking|Overthinking|Using AI|AI doing the thinking'
    ],
    'custom': [
      'When you upload a custom image|And the AI makes it funnier',
      'Your original idea|AI-enhanced version',
      'Before AI|After AI'
    ]
  };

  if (generateCaption) {
    const captions = fallbackCaptions[template] || fallbackCaptions['custom'];
    const randomCaption = captions[Math.floor(Math.random() * captions.length)];
    return randomCaption;
  } else {
    return "That's a great meme! Here's a suggestion: Make it even funnier by adding more relatable context or using current trends.";
  }
}
