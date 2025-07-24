#!/bin/bash

# List of files that need to be fixed
files=(
  "src/app/api/playground/personality-generator/route.ts"
  "src/app/api/playground/voice-to-text/route.ts"
  "src/app/api/playground/meme/route.ts"
  "src/app/api/playground/resume/route.ts"
  "src/app/api/playground/guess-prompt/route.ts"
  "src/app/api/playground/summarize/route.ts"
  "src/app/api/playground/text-to-speech/route.ts"
  "src/app/api/playground/language-tutor/route.ts"
  "src/app/api/playground/story/route.ts"
  "src/app/api/playground/math-solver/route.ts"
  "src/app/api/playground/fortune/route.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file..."
    
    # Remove the module-level OpenAI instantiation
    sed -i '' '/^const openai = new OpenAI({$/,/^});$/d' "$file"
    
    # Find the line with the API key check and add OpenAI instantiation after it
    sed -i '' '/if (!process\.env\.OPENAI_API_KEY) {/,/}$/{
      /}$/a\
\
    // Initialize OpenAI client at runtime\
    const openai = new OpenAI({\
      apiKey: process.env.OPENAI_API_KEY,\
    });
    }' "$file"
  fi
done

echo "All OpenAI routes fixed!"
