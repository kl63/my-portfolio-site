'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Wand2, Copy, Download, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

const storyTypes = [
  { id: 'short-story', name: 'Short Story', description: 'A complete narrative in 200-500 words' },
  { id: 'poem', name: 'Poem', description: 'Creative poetry in various styles' },
  { id: 'flash-fiction', name: 'Flash Fiction', description: 'Ultra-short story under 100 words' },
  { id: 'fairy-tale', name: 'Fairy Tale', description: 'Classic fairy tale style story' },
  { id: 'sci-fi', name: 'Sci-Fi', description: 'Science fiction themed story' },
  { id: 'mystery', name: 'Mystery', description: 'Suspenseful mystery story' }
];

const tones = [
  { id: 'whimsical', name: 'Whimsical' },
  { id: 'dramatic', name: 'Dramatic' },
  { id: 'humorous', name: 'Humorous' },
  { id: 'romantic', name: 'Romantic' },
  { id: 'dark', name: 'Dark' },
  { id: 'inspirational', name: 'Inspirational' }
];

export default function StoryGeneratorPage() {
  const [topic, setTopic] = useState('');
  const [storyType, setStoryType] = useState('short-story');
  const [tone, setTone] = useState('whimsical');
  const [generatedStory, setGeneratedStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateStory = async () => {
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/playground/story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          storyType,
          tone
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const data = await response.json();
      setGeneratedStory(data.story);
    } catch (error) {
      console.error('Error generating story:', error);
      setGeneratedStory("I'm sorry, I couldn't generate a story right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedStory);
  };

  const downloadStory = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedStory], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `story-${topic.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const selectedStoryType = storyTypes.find(type => type.id === storyType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-100 dark:from-gray-900 dark:via-orange-900 dark:to-red-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Story Generator
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Create unique stories and poems from any topic
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
            Creative Writing
          </Badge>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Story Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Topic Input */}
                <div className="space-y-2">
                  <Label htmlFor="topic">Story Topic or Theme</Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., A dragon who loves to bake cookies"
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter any topic, character, or situation you'd like the story to be about
                  </p>
                </div>

                {/* Story Type */}
                <div className="space-y-2">
                  <Label htmlFor="story-type">Story Type</Label>
                  <Select value={storyType} onValueChange={setStoryType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select story type" />
                    </SelectTrigger>
                    <SelectContent>
                      {storyTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedStoryType?.description}
                  </p>
                </div>

                {/* Tone */}
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone & Style</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((toneOption) => (
                        <SelectItem key={toneOption.id} value={toneOption.id}>
                          {toneOption.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={generateStory}
                  disabled={!topic.trim() || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Story...
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Generate Story
                    </>
                  )}
                </Button>

                {/* Example Topics */}
                <div className="space-y-2">
                  <Label>Need inspiration? Try these topics:</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'A time-traveling librarian',
                      'The last bookstore on Earth',
                      'A robot learning to paint',
                      'A magical coffee shop',
                      'The secret life of houseplants'
                    ].map((example) => (
                      <Button
                        key={example}
                        variant="outline"
                        size="sm"
                        onClick={() => setTopic(example)}
                        className="text-xs"
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Output Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Generated Story
                  </CardTitle>
                  {generatedStory && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadStory}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px] max-h-[600px] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Crafting your story...
                        </p>
                      </div>
                    </div>
                  ) : generatedStory ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{generatedStory}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Your generated story will appear here</p>
                        <p className="text-sm mt-2">Enter a topic and click "Generate Story" to begin</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
