import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { resumeData, resumeType } = await request.json();

    // Fallback resume if no API key
    if (!process.env.OPENAI_API_KEY) {
      const fallbackResume = generateFallbackResume(resumeData, resumeType);
      return NextResponse.json({ resume: fallbackResume });
    }

    // Create the prompt based on resume type and data
    const prompt = createResumePrompt(resumeData, resumeType);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer and career coach. Create well-formatted, ATS-friendly resumes that highlight the candidate's strengths and are tailored to their target role. Use proper formatting with clear sections and bullet points."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const resume = completion.choices[0]?.message?.content || 'Unable to generate resume.';

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error generating resume:', error);
    
    // Return fallback resume on error
    const { resumeData, resumeType } = await request.json();
    const fallbackResume = generateFallbackResume(resumeData, resumeType);
    return NextResponse.json({ resume: fallbackResume });
  }
}

function createResumePrompt(resumeData: any, resumeType: string): string {
  const { personalInfo, summary, experience, education, skills, jobTitle, jobDescription } = resumeData;
  
  let styleInstructions = '';
  switch (resumeType) {
    case 'creative':
      styleInstructions = 'Use a creative, modern format with engaging language while maintaining professionalism.';
      break;
    case 'technical':
      styleInstructions = 'Focus on technical skills, projects, and quantifiable achievements. Use technical terminology appropriately.';
      break;
    case 'executive':
      styleInstructions = 'Use executive-level language focusing on leadership, strategy, and high-level achievements.';
      break;
    default:
      styleInstructions = 'Use a clean, professional format suitable for most industries.';
  }

  const targetJobSection = jobTitle && jobDescription 
    ? `Target Position: ${jobTitle}\nJob Requirements: ${jobDescription}\n\nPlease tailor the resume to match these requirements and highlight relevant experience.`
    : '';

  return `Create a professional resume with the following information:

PERSONAL INFORMATION:
Name: ${personalInfo.name}
Email: ${personalInfo.email}
Phone: ${personalInfo.phone}
Location: ${personalInfo.location}
LinkedIn: ${personalInfo.linkedin}

PROFESSIONAL SUMMARY:
${summary}

WORK EXPERIENCE:
${experience}

EDUCATION:
${education}

SKILLS:
${skills}

${targetJobSection}

STYLE REQUIREMENTS:
${styleInstructions}

Please format this as a complete, professional resume with proper sections, bullet points, and formatting. Make it ATS-friendly and highlight the most relevant qualifications for the target role.`;
}

function generateFallbackResume(resumeData: any, resumeType: string): string {
  const { personalInfo, summary, experience, education, skills, jobTitle } = resumeData;
  
  return `${personalInfo.name.toUpperCase()}
${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}
${personalInfo.linkedin}

PROFESSIONAL SUMMARY
${summary || 'Dedicated professional with strong background in their field, seeking to contribute expertise and drive results in a challenging role.'}

WORK EXPERIENCE
${experience || 'Please provide your work experience details.'}

EDUCATION
${education || 'Educational background information.'}

SKILLS
${skills || 'Relevant technical and soft skills.'}

${jobTitle ? `\nTARGET POSITION: ${jobTitle}` : ''}

---
Note: This is a basic resume template. For a more polished, AI-enhanced resume, please ensure your OpenAI API key is configured.`;
}
