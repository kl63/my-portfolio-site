#!/usr/bin/env python3
import os
import re

# Routes that still need fixing
routes = [
    "src/app/api/playground/fortune/route.ts",
    "src/app/api/playground/guess-prompt/route.ts", 
    "src/app/api/playground/language-tutor/route.ts",
    "src/app/api/playground/math-solver/route.ts",
    "src/app/api/playground/meme/route.ts",
    "src/app/api/playground/personality-generator/route.ts",
    "src/app/api/playground/resume/route.ts",
    "src/app/api/playground/summarize/route.ts",
    "src/app/api/playground/text-to-speech/route.ts",
    "src/app/api/playground/voice-to-text/route.ts"
]

for route_path in routes:
    if os.path.exists(route_path):
        print(f"Fixing {route_path}...")
        
        with open(route_path, 'r') as f:
            content = f.read()
        
        # Remove module-level OpenAI instantiation
        content = re.sub(
            r'const openai = new OpenAI\(\{\s*apiKey: process\.env\.OPENAI_API_KEY,\s*\}\);?\s*\n',
            '',
            content
        )
        
        # Find the API key check and add OpenAI instantiation after it
        pattern = r'(if \(!process\.env\.OPENAI_API_KEY\) \{[^}]+\}\s*\n)'
        replacement = r'\1\n    // Initialize OpenAI client at runtime\n    const openai = new OpenAI({\n      apiKey: process.env.OPENAI_API_KEY,\n    });\n'
        
        content = re.sub(pattern, replacement, content, flags=re.MULTILINE | re.DOTALL)
        
        with open(route_path, 'w') as f:
            f.write(content)
        
        print(f"Fixed {route_path}")

print("All remaining routes fixed!")
