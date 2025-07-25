'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Copy, Download, Loader2, ArrowLeft, Shuffle, User } from 'lucide-react';
import Link from 'next/link';

const personalityTypes = [
  { id: 'random', name: 'Random', description: 'Completely random personality' },
  { id: 'hero', name: 'Hero', description: 'Brave, noble, and inspiring' },
  { id: 'villain', name: 'Villain', description: 'Complex antagonist with motives' },
  { id: 'mentor', name: 'Mentor', description: 'Wise teacher or guide' },
  { id: 'rebel', name: 'Rebel', description: 'Anti-establishment, free-spirited' },
  { id: 'scholar', name: 'Scholar', description: 'Intellectual, curious, studious' },
  { id: 'artist', name: 'Artist', description: 'Creative, emotional, expressive' },
  { id: 'leader', name: 'Leader', description: 'Charismatic, decisive, influential' }
];

const genres = [
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'scifi', name: 'Sci-Fi' },
  { id: 'modern', name: 'Modern' },
  { id: 'historical', name: 'Historical' },
  { id: 'cyberpunk', name: 'Cyberpunk' },
  { id: 'steampunk', name: 'Steampunk' },
  { id: 'horror', name: 'Horror' },
  { id: 'romance', name: 'Romance' }
];

interface GeneratedPersonality {
  name: string;
  age: string;
  occupation: string;
  background: string;
  personality: string;
  appearance: string;
  quirks: string;
  dialogue: string;
  motivation: string;
  fears: string;
}

export default function PersonalityGeneratorPage() {
  const [personalityType, setPersonalityType] = useState('random');
  const [genre, setGenre] = useState('fantasy');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedPersonality, setGeneratedPersonality] = useState<GeneratedPersonality | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedPersonalities, setSavedPersonalities] = useState<GeneratedPersonality[]>([]);

  const generatePersonality = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/playground/personality-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalityType,
          genre,
          customPrompt
        }),
      });

      const data = await response.json();
      setGeneratedPersonality(data.personality);
    } catch (error) {
      console.error('Error generating personality:', error);
      // Fallback personality
      setGeneratedPersonality({
        name: 'Aria Shadowmere',
        age: '28',
        occupation: 'Wandering Scholar',
        background: 'Born in a small village, discovered ancient magic texts and became obsessed with forbidden knowledge.',
        personality: 'Curious but cautious, intelligent yet impulsive, kind-hearted but secretive about her past.',
        appearance: 'Tall and lean with silver hair, piercing green eyes, and intricate tattoos covering her arms.',
        quirks: 'Always carries a leather-bound journal, speaks to herself when thinking, has an irrational fear of mirrors.',
        dialogue: 'Knowledge is power, but wisdom is knowing when not to use it.',
        motivation: 'To uncover the truth about her mysterious heritage and master the ancient arts.',
        fears: 'Losing control of her magical abilities and hurting those she cares about.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const savePersonality = () => {
    if (generatedPersonality && !savedPersonalities.find(p => p.name === generatedPersonality.name)) {
      setSavedPersonalities(prev => [...prev, generatedPersonality]);
    }
  };

  const copyPersonality = () => {
    if (generatedPersonality) {
      const text = `Name: ${generatedPersonality.name}
Age: ${generatedPersonality.age}
Occupation: ${generatedPersonality.occupation}

Background:
${generatedPersonality.background}

Personality:
${generatedPersonality.personality}

Appearance:
${generatedPersonality.appearance}

Quirks:
${generatedPersonality.quirks}

Sample Dialogue:
"${generatedPersonality.dialogue}"

Motivation:
${generatedPersonality.motivation}

Fears:
${generatedPersonality.fears}`;

      navigator.clipboard.writeText(text);
    }
  };

  const downloadPersonality = () => {
    if (generatedPersonality) {
      const text = `Name: ${generatedPersonality.name}
Age: ${generatedPersonality.age}
Occupation: ${generatedPersonality.occupation}

Background:
${generatedPersonality.background}

Personality:
${generatedPersonality.personality}

Appearance:
${generatedPersonality.appearance}

Quirks:
${generatedPersonality.quirks}

Sample Dialogue:
"${generatedPersonality.dialogue}"

Motivation:
${generatedPersonality.motivation}

Fears:
${generatedPersonality.fears}`;

      const element = document.createElement('a');
      const file = new Blob([text], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${generatedPersonality.name.replace(/\s+/g, '_')}_character.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const loadSavedPersonality = (personality: GeneratedPersonality) => {
    setGeneratedPersonality(personality);
  };

  const clearAll = () => {
    setGeneratedPersonality(null);
    setCustomPrompt('');
  };

  const selectedPersonalityType = personalityTypes.find(t => t.id === personalityType);
  const selectedGenre = genres.find(g => g.id === genre);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-violet-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link href="/playground">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Personality Generator
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Generate unique personas with backgrounds and dialogue styles
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300">
            Fun & Interactive
          </Badge>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Character Settings
                </CardTitle>
                <CardDescription>
                  Customize your character generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personality Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Personality Type</label>
                  <Select value={personalityType} onValueChange={setPersonalityType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select personality type" />
                    </SelectTrigger>
                    <SelectContent>
                      {personalityTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div>
                            <div className="font-medium">{type.name}</div>
                            <div className="text-sm text-gray-500">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedPersonalityType && (
                    <p className="text-sm text-gray-500 mt-1">{selectedPersonalityType.description}</p>
                  )}
                </div>

                {/* Genre */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Genre/Setting</label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Prompt */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Custom Details (Optional)</label>
                  <Textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Add specific traits, background elements, or requirements..."
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button onClick={generatePersonality} disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Shuffle className="h-4 w-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                  {generatedPersonality && (
                    <Button onClick={clearAll} variant="outline">
                      Clear
                    </Button>
                  )}
                </div>

                {/* Save Button */}
                {generatedPersonality && (
                  <Button onClick={savePersonality} variant="outline" className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    Save Character
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Generated Personality Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Generated Character
                  </span>
                  {generatedPersonality && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyPersonality}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadPersonality}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  Your unique character will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedPersonality ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="capitalize">
                        {selectedPersonalityType?.name}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {selectedGenre?.name}
                      </Badge>
                    </div>

                    {/* Character Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-lg mb-2">{generatedPersonality.name}</h4>
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium">Age:</span> {generatedPersonality.age}</p>
                            <p><span className="font-medium">Occupation:</span> {generatedPersonality.occupation}</p>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-semibold mb-2">Background</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {generatedPersonality.background}
                          </p>
                        </div>

                        <div>
                          <h5 className="font-semibold mb-2">Personality</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {generatedPersonality.personality}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h5 className="font-semibold mb-2">Appearance</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {generatedPersonality.appearance}
                          </p>
                        </div>

                        <div>
                          <h5 className="font-semibold mb-2">Quirks & Habits</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {generatedPersonality.quirks}
                          </p>
                        </div>

                        <div>
                          <h5 className="font-semibold mb-2">Sample Dialogue</h5>
                          <blockquote className="text-sm italic text-gray-600 dark:text-gray-300 border-l-4 border-purple-400 pl-4">
                            "{generatedPersonality.dialogue}"
                          </blockquote>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <h5 className="font-semibold mb-2">Motivation</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {generatedPersonality.motivation}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-semibold mb-2">Fears</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {generatedPersonality.fears}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select your preferences and click "Generate" to create a unique character</p>
                    <p className="text-sm mt-2">Perfect for writers, game masters, and creative projects</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Characters */}
            {savedPersonalities.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Saved Characters ({savedPersonalities.length})</CardTitle>
                  <CardDescription>
                    Click on any character to view again
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {savedPersonalities.map((personality, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => loadSavedPersonality(personality)}
                        className="justify-start text-left h-auto p-3"
                      >
                        <div>
                          <div className="font-medium">{personality.name}</div>
                          <div className="text-sm text-gray-500">{personality.occupation}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
