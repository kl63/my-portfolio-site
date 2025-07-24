'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, ArrowLeft, Wand2, Download, RefreshCw, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const imageStyles = [
  { id: 'realistic', name: 'Realistic', description: 'Photorealistic images' },
  { id: 'artistic', name: 'Artistic', description: 'Painterly and artistic style' },
  { id: 'cartoon', name: 'Cartoon', description: 'Fun cartoon-style illustrations' },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Futuristic neon aesthetic' },
  { id: 'fantasy', name: 'Fantasy', description: 'Magical and fantastical themes' },
  { id: 'minimalist', name: 'Minimalist', description: 'Clean and simple design' }
];

const aspectRatios = [
  { id: '1:1', name: 'Square (1:1)', description: 'Perfect for social media' },
  { id: '16:9', name: 'Landscape (16:9)', description: 'Great for wallpapers' },
  { id: '9:16', name: 'Portrait (9:16)', description: 'Mobile-friendly format' },
  { id: '4:3', name: 'Classic (4:3)', description: 'Traditional photo format' }
];

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageHistory, setImageHistory] = useState<Array<{id: string, url: string, prompt: string}>>([]);

  const generateImage = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/playground/image-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          style,
          aspectRatio
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      
      // Add to history
      const newImage = {
        id: Date.now().toString(),
        url: data.imageUrl,
        prompt: prompt
      };
      setImageHistory(prev => [newImage, ...prev.slice(0, 4)]); // Keep last 5 images
    } catch (error) {
      console.error('Error generating image:', error);
      // Show placeholder for demo
      setGeneratedImage('/api/placeholder/512/512');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `ai-generated-${prompt.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
  };

  const selectedStyle = imageStyles.find(s => s.id === style);
  const selectedRatio = aspectRatios.find(r => r.id === aspectRatio);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Image Generator
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Create stunning images from text descriptions
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            Text-to-Image
          </Badge>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Image Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prompt Input */}
                <div className="space-y-2">
                  <Label htmlFor="prompt">Image Description</Label>
                  <Input
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A majestic dragon flying over a cyberpunk city at sunset"
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Describe the image you want to create in detail
                  </p>
                </div>

                {/* Style Selection */}
                <div className="space-y-2">
                  <Label htmlFor="style">Art Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {imageStyles.map((styleOption) => (
                        <SelectItem key={styleOption.id} value={styleOption.id}>
                          {styleOption.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedStyle?.description}
                  </p>
                </div>

                {/* Aspect Ratio */}
                <div className="space-y-2">
                  <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      {aspectRatios.map((ratio) => (
                        <SelectItem key={ratio.id} value={ratio.id}>
                          {ratio.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedRatio?.description}
                  </p>
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={generateImage}
                  disabled={!prompt.trim() || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Image className="h-4 w-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>

                {/* Example Prompts */}
                <div className="space-y-2">
                  <Label>Try these prompts:</Label>
                  <div className="space-y-2">
                    {[
                      'A serene mountain lake at sunrise',
                      'Cyberpunk cityscape with neon lights',
                      'A magical forest with glowing mushrooms',
                      'Abstract geometric patterns in blue',
                      'A cozy coffee shop in the rain'
                    ].map((example) => (
                      <Button
                        key={example}
                        variant="outline"
                        size="sm"
                        onClick={() => setPrompt(example)}
                        className="w-full text-left justify-start text-xs"
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Generated Image Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Generated Image
                  </CardTitle>
                  {generatedImage && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyPrompt}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadImage}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-square w-full max-w-lg mx-auto">
                  {isLoading ? (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-500" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Creating your image...
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                          This may take 10-30 seconds
                        </p>
                      </div>
                    </div>
                  ) : generatedImage ? (
                    <div className="w-full h-full relative">
                      <img
                        src={generatedImage}
                        alt={prompt || "AI generated image"}
                        className="w-full h-full object-cover rounded-lg shadow-lg"
                      />
                      <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white p-2 rounded text-sm">
                        &ldquo;{prompt}&rdquo;
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Your generated image will appear here</p>
                        <p className="text-sm mt-2">Enter a description and click "Generate Image"</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image History */}
                {imageHistory.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-3">Recent Generations</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {imageHistory.map((img) => (
                        <div
                          key={img.id}
                          className="aspect-square cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setGeneratedImage(img.url)}
                        >
                          <img
                            src={img.url}
                            alt={img.prompt || "AI generated image"}
                            className="w-full h-full object-cover rounded"
                          />
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
