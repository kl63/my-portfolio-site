'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, ArrowLeft, Eye, Trophy, RotateCcw, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface GameImage {
  id: string;
  imageUrl: string;
  actualPrompt: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hints: string[];
}

const sampleImages: GameImage[] = [
  {
    id: '1',
    imageUrl: '/api/placeholder/400/400',
    actualPrompt: 'A majestic dragon flying over a medieval castle at sunset',
    difficulty: 'easy',
    hints: ['Fantasy creature', 'Medieval setting', 'Golden hour lighting']
  },
  {
    id: '2',
    imageUrl: '/api/placeholder/400/400',
    actualPrompt: 'Cyberpunk cityscape with neon lights reflecting in puddles',
    difficulty: 'medium',
    hints: ['Futuristic setting', 'Colorful lighting', 'Urban environment']
  },
  {
    id: '3',
    imageUrl: '/api/placeholder/400/400',
    actualPrompt: 'Abstract geometric shapes floating in space with cosmic background',
    difficulty: 'hard',
    hints: ['Non-realistic style', 'Mathematical elements', 'Outer space']
  }
];

export default function GuessPromptPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [usedHints, setUsedHints] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const currentImage = sampleImages[currentImageIndex];

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTotalAttempts(0);
    setCurrentImageIndex(0);
    setShowResult(false);
    setUserGuess('');
    setUsedHints([]);
  };

  const submitGuess = () => {
    if (!userGuess.trim()) {
      alert('Please enter your guess');
      return;
    }

    setShowResult(true);
    setTotalAttempts(prev => prev + 1);

    // Simple scoring algorithm
    const similarity = calculateSimilarity(userGuess.toLowerCase(), currentImage.actualPrompt.toLowerCase());
    if (similarity > 0.6) {
      setScore(prev => prev + Math.max(1, 3 - usedHints.length)); // Bonus for not using hints
    }
  };

  const calculateSimilarity = (guess: string, actual: string): number => {
    const guessWords = guess.split(' ').filter(word => word.length > 2);
    const actualWords = actual.split(' ').filter(word => word.length > 2);
    
    let matches = 0;
    guessWords.forEach(word => {
      if (actualWords.some(actualWord => actualWord.includes(word) || word.includes(actualWord))) {
        matches++;
      }
    });

    return matches / Math.max(guessWords.length, actualWords.length);
  };

  const nextImage = () => {
    if (currentImageIndex < sampleImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setUserGuess('');
      setShowResult(false);
      setUsedHints([]);
    } else {
      // Game over
      alert(`Game Over! Final Score: ${score}/${totalAttempts * 3}`);
      setGameStarted(false);
    }
  };

  const showHint = (hintIndex: number) => {
    if (!usedHints.includes(hintIndex)) {
      setUsedHints(prev => [...prev, hintIndex]);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentImageIndex(0);
    setUserGuess('');
    setShowResult(false);
    setScore(0);
    setTotalAttempts(0);
    setUsedHints([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-pink-900 dark:to-purple-900">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Guess the Prompt
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Look at AI-generated images and guess the original prompt
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300">
            Fun & Interactive
          </Badge>
        </motion.div>

        {!gameStarted ? (
          /* Game Start Screen */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Gamepad2 className="h-6 w-6" />
                  Welcome to Guess the Prompt!
                </CardTitle>
                <CardDescription>
                  Test your ability to reverse-engineer AI image prompts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">How to Play:</h3>
                  <div className="text-left space-y-2 text-sm">
                    <p>• Look at each AI-generated image carefully</p>
                    <p>• Try to guess the original prompt used to create it</p>
                    <p>• Use hints if you get stuck (but you&apos;ll score higher without them!)</p>
                    <p>• Score points based on how close your guess is to the actual prompt</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Badge className={getDifficultyColor('easy')}>Easy</Badge>
                    <p className="text-sm mt-1">3 points</p>
                  </div>
                  <div>
                    <Badge className={getDifficultyColor('medium')}>Medium</Badge>
                    <p className="text-sm mt-1">3 points</p>
                  </div>
                  <div>
                    <Badge className={getDifficultyColor('hard')}>Hard</Badge>
                    <p className="text-sm mt-1">3 points</p>
                  </div>
                </div>

                <Button onClick={startGame} size="lg" className="w-full max-w-xs">
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  Start Game
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Game Screen */
          <div className="space-y-6">
            {/* Score & Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <Trophy className="h-4 w-4 mr-2" />
                  Score: {score}
                </Badge>
                <Badge variant="outline">
                  Image {currentImageIndex + 1} of {sampleImages.length}
                </Badge>
                <Badge className={getDifficultyColor(currentImage.difficulty)}>
                  {currentImage.difficulty}
                </Badge>
              </div>
              <Button onClick={resetGame} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Game
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      AI-Generated Image
                    </CardTitle>
                    <CardDescription>
                      Study this image and guess the prompt
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
                      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">AI Generated Image Placeholder</p>
                      </div>
                    </div>

                    {/* Hints */}
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Hints Available:</h4>
                      <div className="space-y-2">
                        {currentImage.hints.map((hint, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {usedHints.includes(index) ? (
                              <Badge variant="secondary" className="flex-1">
                                {hint}
                              </Badge>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => showHint(index)}
                                className="flex-1"
                              >
                                Reveal Hint {index + 1}
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Guess Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Your Guess</CardTitle>
                    <CardDescription>
                      What prompt do you think created this image?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {!showResult ? (
                      <div className="space-y-4">
                        <Input
                          value={userGuess}
                          onChange={(e) => setUserGuess(e.target.value)}
                          placeholder="Enter your guess for the original prompt..."
                          className="text-lg"
                          onKeyPress={(e) => e.key === 'Enter' && submitGuess()}
                        />
                        <Button onClick={submitGuess} className="w-full" size="lg">
                          Submit Guess
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Your Guess:
                          </h4>
                          <p className="text-sm">{userGuess}</p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Eye className="h-4 w-4 text-blue-500" />
                            Actual Prompt:
                          </h4>
                          <p className="text-sm">{currentImage.actualPrompt}</p>
                        </div>

                        <div className="text-center">
                          <Badge variant="outline" className="text-lg px-4 py-2">
                            Similarity: {Math.round(calculateSimilarity(userGuess.toLowerCase(), currentImage.actualPrompt.toLowerCase()) * 100)}%
                          </Badge>
                        </div>

                        <Button onClick={nextImage} className="w-full" size="lg">
                          {currentImageIndex < sampleImages.length - 1 ? 'Next Image' : 'Finish Game'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
