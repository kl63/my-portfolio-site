import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { problem, mathType, showSteps } = await request.json();

    if (!problem || problem.trim().length === 0) {
      return NextResponse.json({ error: 'No math problem provided' }, { status: 400 });
    }

    // Fallback solution if no API key
    if (!process.env.OPENAI_API_KEY) {
      const fallbackSolution = generateFallbackSolution(problem, mathType);
      return NextResponse.json({ solution: fallbackSolution });
    }

    // Initialize OpenAI client at runtime
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Create prompt based on math type and requirements
    const prompt = createMathPrompt(problem, mathType, showSteps);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a math tutor and expert problem solver. Provide clear, accurate solutions with step-by-step explanations when requested. Use proper mathematical notation and explain your reasoning."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.1,
    });

    const solution = completion.choices[0]?.message?.content || 'Unable to solve this problem.';

    return NextResponse.json({ solution });
  } catch (error) {
    console.error('Error solving math problem:', error);
    
    // Return fallback solution on error
    const { problem, mathType, showSteps } = await request.json();
    const fallbackSolution = generateFallbackSolution(problem, mathType);
    return NextResponse.json({ solution: fallbackSolution });
  }
}

function createMathPrompt(problem: string, mathType: string, showSteps: boolean): string {
  let prompt = `Solve this ${mathType} problem: ${problem}`;
  
  if (showSteps) {
    prompt += `\n\nPlease provide a detailed step-by-step solution showing all work and explaining each step clearly.`;
  } else {
    prompt += `\n\nPlease provide the final answer with a brief explanation.`;
  }

  // Add specific instructions based on math type
  switch (mathType) {
    case 'algebra':
      prompt += ` Show algebraic manipulation clearly and check your answer.`;
      break;
    case 'calculus':
      prompt += ` Show derivatives/integrals step by step and simplify the final answer.`;
      break;
    case 'geometry':
      prompt += ` Include relevant formulas and show all calculations for areas, volumes, or angles.`;
      break;
    case 'trigonometry':
      prompt += ` Show trigonometric identities used and convert to appropriate units.`;
      break;
    case 'statistics':
      prompt += ` Show all statistical calculations and interpret the results.`;
      break;
    case 'arithmetic':
      prompt += ` Show all arithmetic operations clearly, especially with fractions and decimals.`;
      break;
  }

  return prompt;
}

function generateFallbackSolution(problem: string, mathType: string): string {
  const fallbackSolutions: { [key: string]: string } = {
    'algebra': `Problem: ${problem}

Step 1: Identify the equation type and isolate the variable
Step 2: Apply algebraic operations (addition, subtraction, multiplication, division)
Step 3: Simplify and solve for the unknown variable
Step 4: Check the solution by substituting back into the original equation

Note: This is a sample solution format. For accurate solutions, please ensure your OpenAI API key is configured.`,

    'calculus': `Problem: ${problem}

Step 1: Identify the function and the operation needed (derivative or integral)
Step 2: Apply the appropriate calculus rules (power rule, chain rule, etc.)
Step 3: Simplify the result
Step 4: Evaluate at specific points if needed

Note: This is a sample solution format. For accurate calculus solutions, please ensure your OpenAI API key is configured.`,

    'geometry': `Problem: ${problem}

Step 1: Identify the geometric shape and given measurements
Step 2: Select the appropriate formula (area, volume, perimeter, etc.)
Step 3: Substitute the known values into the formula
Step 4: Calculate the result and include proper units

Note: This is a sample solution format. For accurate geometric calculations, please ensure your OpenAI API key is configured.`,

    'trigonometry': `Problem: ${problem}

Step 1: Identify the trigonometric function and given information
Step 2: Apply trigonometric identities if needed
Step 3: Solve for the unknown angle or side
Step 4: Convert to appropriate units (degrees/radians)

Note: This is a sample solution format. For accurate trigonometric solutions, please ensure your OpenAI API key is configured.`,

    'statistics': `Problem: ${problem}

Step 1: Organize the data and identify what statistical measure is needed
Step 2: Apply the appropriate statistical formula
Step 3: Calculate the result step by step
Step 4: Interpret the statistical meaning of the result

Note: This is a sample solution format. For accurate statistical analysis, please ensure your OpenAI API key is configured.`,

    'arithmetic': `Problem: ${problem}

Step 1: Identify the arithmetic operations needed
Step 2: Follow the order of operations (PEMDAS/BODMAS)
Step 3: Perform calculations step by step
Step 4: Simplify to the final answer

Note: This is a sample solution format. For accurate arithmetic solutions, please ensure your OpenAI API key is configured.`
  };

  return fallbackSolutions[mathType] || fallbackSolutions['algebra'];
}
