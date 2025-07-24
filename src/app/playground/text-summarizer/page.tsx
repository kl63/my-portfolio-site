'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scissors, ArrowLeft, FileText, Copy, Download, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

const summaryLengths = [
  { id: 'short', name: 'Short', description: '1-2 sentences', words: '20-40 words' },
  { id: 'medium', name: 'Medium', description: '3-5 sentences', words: '50-100 words' },
  { id: 'long', name: 'Long', description: '1-2 paragraphs', words: '100-200 words' }
];

const summaryStyles = [
  { id: 'bullet', name: 'Bullet Points', description: 'Key points in bullet format' },
  { id: 'paragraph', name: 'Paragraph', description: 'Flowing paragraph summary' },
  { id: 'executive', name: 'Executive Summary', description: 'Professional business style' },
  { id: 'casual', name: 'Casual', description: 'Easy-to-read conversational tone' }
];

export default function TextSummarizerPage() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summaryStyle, setSummaryStyle] = useState('paragraph');
  const [isLoading, setIsLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const handleTextChange = (text: string) => {
    setInputText(text);
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
  };

  const summarizeText = async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/playground/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          length: summaryLength,
          style: summaryStyle
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to summarize text');
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error summarizing text:', error);
      setSummary("I'm sorry, I couldn't summarize the text right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
  };

  const downloadSummary = () => {
    const element = document.createElement('a');
    const file = new Blob([`Original Text:\n${inputText}\n\nSummary:\n${summary}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'text-summary.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleTextChange(text);
    } catch (error) {
      console.error('Failed to paste from clipboard:', error);
    }
  };

  const selectedLength = summaryLengths.find(length => length.id === summaryLength);
  const selectedStyle = summaryStyles.find(style => style.id === summaryStyle);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Text Summarizer
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Get instant TL;DR summaries of any text
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Text Analysis
          </Badge>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Input Text
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="length">Summary Length</Label>
                    <Select value={summaryLength} onValueChange={setSummaryLength}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        {summaryLengths.map((length) => (
                          <SelectItem key={length.id} value={length.id}>
                            {length.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedLength?.words}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="style">Summary Style</Label>
                    <Select value={summaryStyle} onValueChange={setSummaryStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {summaryStyles.map((style) => (
                          <SelectItem key={style.id} value={style.id}>
                            {style.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Text Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="input-text">Text to Summarize</Label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={pasteFromClipboard}>
                        Paste
                      </Button>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {wordCount} words
                      </span>
                    </div>
                  </div>
                  <Textarea
                    id="input-text"
                    value={inputText}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder="Paste your article, essay, or any text you want to summarize here..."
                    className="min-h-[300px] resize-none"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedStyle?.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    onClick={summarizeText}
                    disabled={!inputText.trim() || isLoading}
                    className="flex-1"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Summarizing...
                      </>
                    ) : (
                      <>
                        <Scissors className="h-4 w-4 mr-2" />
                        Summarize Text
                      </>
                    )}
                  </Button>
                </div>

                {/* Sample Text Options */}
                <div className="space-y-2">
                  <Label>Try with sample text:</Label>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTextChange(`Artificial Intelligence (AI) has rapidly evolved from a concept in science fiction to a transformative technology reshaping industries worldwide. Machine learning, a subset of AI, enables computers to learn and improve from experience without being explicitly programmed. Deep learning, which uses neural networks with multiple layers, has revolutionized fields such as image recognition, natural language processing, and autonomous vehicles. The applications of AI are vast and growing, including healthcare diagnostics, financial fraud detection, personalized recommendations, and smart home automation. However, the rise of AI also brings challenges, including job displacement concerns, privacy issues, and the need for ethical guidelines. As AI continues to advance, society must balance innovation with responsible development to ensure that these powerful technologies benefit humanity while minimizing potential risks.`)}
                      className="w-full text-left justify-start text-xs h-auto p-2"
                    >
                      Sample: AI Technology Article
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTextChange(`Climate change represents one of the most pressing challenges of our time, with far-reaching consequences for ecosystems, human societies, and the global economy. Rising global temperatures, largely attributed to increased greenhouse gas emissions from human activities, are causing ice caps to melt, sea levels to rise, and weather patterns to become more extreme. These changes threaten biodiversity, food security, and water resources, while also increasing the frequency and intensity of natural disasters such as hurricanes, droughts, and wildfires. Addressing climate change requires coordinated global action, including transitioning to renewable energy sources, implementing carbon pricing mechanisms, and developing sustainable transportation systems. Individual actions, such as reducing energy consumption, supporting sustainable practices, and advocating for policy changes, also play a crucial role in combating climate change. The window for effective action is narrowing, making immediate and sustained efforts essential to limit global warming and protect the planet for future generations.`)}
                      className="w-full text-left justify-start text-xs h-auto p-2"
                    >
                      Sample: Climate Change Article
                    </Button>
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
                    <Scissors className="h-5 w-5" />
                    Summary
                  </CardTitle>
                  {summary && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadSummary}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-green-500" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Analyzing and summarizing your text...
                        </p>
                      </div>
                    </div>
                  ) : summary ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <div className="whitespace-pre-wrap">{summary}</div>
                        </div>
                      </div>
                      
                      {/* Summary Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="font-medium">Original</div>
                          <div className="text-gray-600 dark:text-gray-400">{wordCount} words</div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="font-medium">Summary</div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {summary.trim().split(/\s+/).filter(word => word.length > 0).length} words
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <Scissors className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Your summary will appear here</p>
                        <p className="text-sm mt-2">Paste your text and click "Summarize Text"</p>
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
