'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Download, Copy, Loader2, ArrowLeft, Volume2, Square } from 'lucide-react';
import Link from 'next/link';

export default function VoiceToTextPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' }
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language', language);

      const response = await fetch('/api/playground/voice-to-text', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setTranscribedText(data.text);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setTranscribedText('Sorry, there was an error transcribing your audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(transcribedText);
  };

  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([transcribedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'transcription.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const clearText = () => {
    setTranscribedText('');
    setRecordingTime(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Voice to Text
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Speak into your microphone and get instant transcription
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Audio Tools
          </Badge>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recording Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Voice Recording
                </CardTitle>
                <CardDescription>
                  Click record and start speaking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Language Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Language</label>
                  <Select value={language} onValueChange={setLanguage} disabled={isRecording}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Recording Controls */}
                <div className="text-center space-y-4">
                  {/* Recording Indicator */}
                  <div className="flex items-center justify-center">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isRecording 
                        ? 'bg-red-500 animate-pulse' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}>
                      {isRecording ? (
                        <MicOff className="h-12 w-12 text-white" />
                      ) : (
                        <Mic className="h-12 w-12 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Timer */}
                  {(isRecording || recordingTime > 0) && (
                    <div className="text-2xl font-mono font-bold text-center">
                      {formatTime(recordingTime)}
                    </div>
                  )}

                  {/* Control Buttons */}
                  <div className="flex gap-2 justify-center">
                    {!isRecording ? (
                      <Button onClick={startRecording} disabled={isLoading} className="flex-1 max-w-xs">
                        <Mic className="h-4 w-4 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <Button onClick={stopRecording} variant="destructive" className="flex-1 max-w-xs">
                        <Square className="h-4 w-4 mr-2" />
                        Stop Recording
                      </Button>
                    )}
                  </div>

                  {transcribedText && (
                    <Button onClick={clearText} variant="outline" className="w-full max-w-xs">
                      Clear Text
                    </Button>
                  )}
                </div>

                {/* Status */}
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {isRecording && (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      Recording... Speak clearly into your microphone
                    </div>
                  )}
                  {isLoading && (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Transcribing audio...
                    </div>
                  )}
                  {!isRecording && !isLoading && (
                    <p>Click the microphone to start recording</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transcription Section */}
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
                    Transcription
                  </span>
                  {transcribedText && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyText}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadText}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  Your speech will be converted to text here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transcribedText ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">
                        {languages.find(l => l.code === language)?.name}
                      </Badge>
                      <Badge variant="outline">
                        {transcribedText.split(' ').length} words
                      </Badge>
                    </div>
                    <Textarea
                      value={transcribedText}
                      onChange={(e) => setTranscribedText(e.target.value)}
                      className="min-h-[300px] resize-none"
                      placeholder="Your transcribed text will appear here..."
                    />
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Start recording to see your transcription here</p>
                    <p className="text-sm mt-2">Supports multiple languages and real-time transcription</p>
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
