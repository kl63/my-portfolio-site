#!/bin/bash

# Fix unused imports and variables
sed -i '' 's/import { CheckCircle, XCircle, Lightbulb } from "lucide-react";/import { CheckCircle, Lightbulb } from "lucide-react";/' src/app/playground/guess-prompt/page.tsx
sed -i '' 's/import { Button, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Download } from "@\/components\/ui";/import { Button, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@\/components\/ui";/' src/app/playground/language-tutor/page.tsx
sed -i '' 's/import { Button, Input, Textarea, Card, CardContent, CardHeader, CardTitle } from "@\/components\/ui";/import { Button, Textarea, Card, CardContent, CardHeader, CardTitle } from "@\/components\/ui";/' src/app/playground/math-solver/page.tsx
sed -i '' 's/import { Button, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, CardContent, CardHeader, CardTitle } from "@\/components\/ui";/import { Button, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, CardContent, CardHeader, CardTitle } from "@\/components\/ui";/' src/app/playground/personality-generator/page.tsx
sed -i '' 's/import { FileText, Sparkles, Download, Copy, Save, Upload } from "lucide-react";/import { Sparkles, Download, Copy, Save, Upload } from "lucide-react";/' src/components/playground/playground-nav.tsx

# Fix unused variables in destructuring
sed -i '' 's/const { resumeData, resumeType } = await request.json();/const { resumeData } = await request.json();/' src/app/api/playground/resume/route.ts
sed -i '' 's/const { prompt, genre, length, tone } = await request.json();/const { prompt, genre, length } = await request.json();/' src/app/api/playground/story/route.ts
sed -i '' 's/const getThemePrompt = (theme: string) => {/\/\/ const getThemePrompt = (theme: string) => {/' src/app/playground/chatbot/page.tsx

echo "Basic lint fixes applied"
