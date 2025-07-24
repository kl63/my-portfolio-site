'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Download, Copy, Loader2, ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import Link from 'next/link';

const voices = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral, balanced voice' },
  { id: 'echo', name: 'Echo', description: 'Clear, professional voice' },
  { id: 'fable', name: 'Fable', description: 'Warm, storytelling voice' },
  { id: 'onyx', name: 'Onyx', description: 'Deep, authoritative voice' },
  { id: 'nova', name: 'Nova', description: 'Bright, energetic voice' },
  { id: 'shimmer', name: 'Shimmer', description: 'Soft, gentle voice' }
];

export default function TextToSpeechPage() {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [speed, setSpeed] = useState('1.0');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateSpeech = async () => {
    if (!text.trim()) {
      alert('Please enter some text to convert to speech');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/playground/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice: selectedVoice,
          speed: parseFloat(speed)
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Create new audio element
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(url);
        audioRef.current.onended = () => setIsPlaying(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate speech');
      }
    } catch (error) {
      console.error('Error generating speech:', error);
      alert('Sorry, there was an error generating speech. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const element = document.createElement('a');
      element.href = audioUrl;
      element.download = 'speech.mp3';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
  };

  const clearText = () => {
    setText('');
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  const sampleTexts = [
    "Welcome to the AI Text to Speech converter! This tool can transform any written text into natural-sounding speech using advanced AI voices.",
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is perfect for testing speech synthesis.",
    "In a world where technology meets creativity, artificial intelligence opens new possibilities for communication and expression.",
    "Once upon a time, in a digital realm far, far away, there lived an AI that could speak with the voice of a thousand storytellers."
  ];

  const loadSampleText = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setText(randomText);
  };

  const selectedVoiceData = voices.find(v => v.id === selectedVoice);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Text to Speech
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Convert any text to natural-sounding speech with voice options
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            Audio Tools
          </Badge>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Text Input
                </CardTitle>
                <CardDescription>
                  Enter text and customize voice settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Text Input */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Text to Convert</label>
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter the text you want to convert to speech..."
                    className="min-h-[150px] resize-none"
                    maxLength={4000}
                  />
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                    <span>{text.length}/4000 characters</span>
                    <Button variant="link" size="sm" onClick={loadSampleText} className="p-0 h-auto">
                      Load Sample Text
                    </Button>
                  </div>
                </div>

                {/* Voice Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Voice</label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <div>
                            <div className="font-medium">{voice.name}</div>
                            <div className="text-sm text-gray-500">{voice.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedVoiceData && (
                    <p className="text-sm text-gray-500 mt-1">{selectedVoiceData.description}</p>
                  )}
                </div>

                {/* Speed Control */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Speech Speed
                  </label>
                  <Select value={speed} onValueChange={setSpeed}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select speed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.25">0.25x (Very Slow)</SelectItem>
                      <SelectItem value="0.5">0.5x (Slow)</SelectItem>
                      <SelectItem value="0.75">0.75x (Slower)</SelectItem>
                      <SelectItem value="1.0">1.0x (Normal)</SelectItem>
                      <SelectItem value="1.25">1.25x (Faster)</SelectItem>
                      <SelectItem value="1.5">1.5x (Fast)</SelectItem>
                      <SelectItem value="2.0">2.0x (Very Fast)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button onClick={generateSpeech} disabled={isLoading || !text.trim()} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4 mr-2" />
                        Generate Speech
                      </>
                    )}
                  </Button>
                  {text && (
                    <Button onClick={clearText} variant="outline">
                      Clear
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Audio Player Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Audio Player
                  </span>
                  {audioUrl && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyText}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadAudio}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  Your generated speech will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {audioUrl ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="capitalize">
                        {selectedVoiceData?.name}
                      </Badge>
                      <Badge variant="outline">
                        {speed}x Speed
                      </Badge>
                      <Badge variant="outline">
                        {text.split(' ').length} words
                      </Badge>
                    </div>

                    {/* Audio Controls */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                      <div className="flex items-center justify-center gap-4">
                        <Button
                          onClick={resetAudio}
                          variant="outline"
                          size="icon"
                          disabled={!audioUrl}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          onClick={isPlaying ? pauseAudio : playAudio}
                          size="lg"
                          className="w-16 h-16 rounded-full"
                          disabled={!audioUrl}
                        >
                          {isPlaying ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6 ml-1" />
                          )}
                        </Button>

                        <Button
                          onClick={downloadAudio}
                          variant="outline"
                          size="icon"
                          disabled={!audioUrl}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-4 text-center text-sm text-gray-500">
                        {isPlaying ? 'Playing...' : 'Ready to play'}
                      </div>
                    </div>

                    {/* Text Preview */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Text:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">
                        {text}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <VolumeX className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter text and click "Generate Speech" to create audio</p>
                    <p className="text-sm mt-2">Supports multiple voices and speed control</p>
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
