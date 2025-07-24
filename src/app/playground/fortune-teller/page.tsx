'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, ArrowLeft, Sparkles, RefreshCw, Copy, Shuffle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const fortuneTypes = [
  { id: 'general', name: 'General Fortune', description: 'Life guidance and wisdom' },
  { id: 'love', name: 'Love & Relationships', description: 'Matters of the heart' },
  { id: 'career', name: 'Career & Success', description: 'Professional guidance' },
  { id: 'health', name: 'Health & Wellness', description: 'Mind and body wisdom' },
  { id: 'travel', name: 'Adventure & Travel', description: 'Journey predictions' },
  { id: 'creative', name: 'Creativity & Arts', description: 'Artistic inspiration' }
];

const fortuneStyles = [
  { id: 'mystical', name: 'Mystical', description: 'Ancient wisdom and mystery' },
  { id: 'humorous', name: 'Humorous', description: 'Light-hearted and funny' },
  { id: 'inspirational', name: 'Inspirational', description: 'Uplifting and motivating' },
  { id: 'philosophical', name: 'Philosophical', description: 'Deep thoughts and reflection' }
];

const quickQuestions = [
  "What does my future hold?",
  "Will I find love this year?",
  "Should I take that new job?",
  "What creative project should I pursue?",
  "How can I improve my health?",
  "What adventure awaits me?",
  "What should I focus on this month?",
  "How can I find more happiness?"
];

export default function FortuneTellerPage() {
  const [question, setQuestion] = useState('');
  const [fortuneType, setFortuneType] = useState('general');
  const [fortuneStyle, setFortuneStyle] = useState('mystical');
  const [fortune, setFortune] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fortuneHistory, setFortuneHistory] = useState<Array<{id: string, question: string, fortune: string}>>([]);

  const getFortune = async () => {
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/playground/fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          type: fortuneType,
          style: fortuneStyle
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get fortune');
      }

      const data = await response.json();
      setFortune(data.fortune);
      
      // Add to history
      const newFortune = {
        id: Date.now().toString(),
        question,
        fortune: data.fortune
      };
      setFortuneHistory(prev => [newFortune, ...prev.slice(0, 4)]); // Keep last 5 fortunes
    } catch (error) {
      console.error('Error getting fortune:', error);
      setFortune("The cosmic energies are clouded at the moment. Please try again when the stars align better.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyFortune = () => {
    navigator.clipboard.writeText(`Question: ${question}\n\nFortune: ${fortune}`);
  };

  const getRandomQuestion = () => {
    const randomQuestion = quickQuestions[Math.floor(Math.random() * quickQuestions.length)];
    setQuestion(randomQuestion);
  };

  const selectedType = fortuneTypes.find(type => type.id === fortuneType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link href="/playground">
              <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-purple-300 bg-clip-text text-transparent">
                AI Fortune Teller
              </h1>
              <p className="text-purple-200">
                Seek wisdom from the digital crystal ball
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-800/50 text-purple-200 border-purple-600">
            Mystical AI
          </Badge>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gem className="h-5 w-5 text-purple-300" />
                  Ask the Oracle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fortune Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-purple-200">Fortune Type</Label>
                    <Select value={fortuneType} onValueChange={setFortuneType}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {fortuneTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-purple-300">
                      {selectedType?.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="style" className="text-purple-200">Fortune Style</Label>
                    <Select value={fortuneStyle} onValueChange={setFortuneStyle}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {fortuneStyles.map((style) => (
                          <SelectItem key={style.id} value={style.id}>
                            {style.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Question Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="question" className="text-purple-200">Your Question</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={getRandomQuestion}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Shuffle className="h-3 w-3 mr-1" />
                      Random
                    </Button>
                  </div>
                  <Input
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What do you seek to know?"
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                  />
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={getFortune}
                  disabled={!question.trim() || isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Consulting the Oracle...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Reveal My Fortune
                    </>
                  )}
                </Button>

                {/* Quick Questions */}
                <div className="space-y-2">
                  <Label className="text-purple-200">Quick Questions:</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {quickQuestions.slice(0, 4).map((q) => (
                      <Button
                        key={q}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuestion(q)}
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-left justify-start text-xs"
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Fortune Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Gem className="h-5 w-5 text-yellow-300" />
                    Your Fortune
                  </CardTitle>
                  {fortune && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyFortune}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="min-h-[300px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-center"
                      >
                        <div className="relative">
                          <Gem className="h-16 w-16 mx-auto mb-4 text-yellow-300 animate-pulse" />
                          <div className="absolute inset-0 animate-spin">
                            <Sparkles className="h-4 w-4 text-purple-300 absolute top-0 left-1/2 transform -translate-x-1/2" />
                          </div>
                        </div>
                        <p className="text-purple-200">
                          The cosmic energies are aligning...
                        </p>
                      </motion.div>
                    ) : fortune ? (
                      <motion.div
                        key="fortune"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full"
                      >
                        <div className="p-6 bg-gradient-to-br from-purple-800/30 to-indigo-800/30 rounded-lg border border-purple-500/30 backdrop-blur-sm">
                          <div className="text-center mb-4">
                            <Gem className="h-8 w-8 mx-auto text-yellow-300 mb-2" />
                            <p className="text-sm text-purple-300 italic">&ldquo;{question}&rdquo;</p>
                          </div>
                          <div className="prose prose-sm max-w-none text-white">
                            <div className="whitespace-pre-wrap text-center leading-relaxed">
                              {fortune}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center text-purple-300"
                      >
                        <Gem className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>The crystal ball awaits your question</p>
                        <p className="text-sm mt-2">Ask anything and discover your fortune</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Fortune History */}
                {fortuneHistory.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <h3 className="text-sm font-medium mb-3 text-purple-200">Recent Fortunes</h3>
                    <div className="space-y-2">
                      {fortuneHistory.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="p-2 bg-white/5 rounded text-xs cursor-pointer hover:bg-white/10 transition-colors"
                          onClick={() => {
                            setQuestion(item.question);
                            setFortune(item.fortune);
                          }}
                        >
                          <p className="text-purple-300 italic">&ldquo;{item.question}&rdquo;</p>
                          <p className="text-white/80 mt-1 truncate">{item.fortune}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
