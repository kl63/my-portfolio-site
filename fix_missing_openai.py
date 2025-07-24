#!/usr/bin/env python3
import os
import re

# Routes that are failing TypeScript check
failing_routes = [
    "src/app/api/playground/math-solver/route.ts",
    "src/app/api/playground/meme/route.ts", 
    "src/app/api/playground/resume/route.ts",
    "src/app/api/playground/summarize/route.ts",
    "src/app/api/playground/voice-to-text/route.ts"
]

for route_path in failing_routes:
    if os.path.exists(route_path):
        print(f"Fixing {route_path}...")
        
        with open(route_path, 'r') as f:
            content = f.read()
        
        # Check if OpenAI client instantiation is missing
        if 'const openai = new OpenAI({' not in content:
            # Find the API key check and add OpenAI instantiation after it
            pattern = r'(if \(!process\.env\.OPENAI_API_KEY\) \{[^}]+\}\s*\n)'
            replacement = r'\1\n    // Initialize OpenAI client at runtime\n    const openai = new OpenAI({\n      apiKey: process.env.OPENAI_API_KEY,\n    });\n'
            
            content = re.sub(pattern, replacement, content, flags=re.MULTILINE | re.DOTALL)
            
            with open(route_path, 'w') as f:
                f.write(content)
            
            print(f"Fixed {route_path}")
        else:
            print(f"{route_path} already has OpenAI client instantiation")

print("All failing routes fixed!")
