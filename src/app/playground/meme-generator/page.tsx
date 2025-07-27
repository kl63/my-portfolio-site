'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Smile, Upload, Download, Copy, Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

const memeTemplates = [
  { id: 'drake', name: 'Drake Pointing', description: 'Two-panel preference meme' },
  { id: 'distracted', name: 'Distracted Boyfriend', description: 'Three-person relationship meme' },
  { id: 'woman-cat', name: 'Woman Yelling at Cat', description: 'Argument reaction meme' },
  { id: 'brain', name: 'Expanding Brain', description: 'Four-level intelligence meme' },
  { id: 'custom', name: 'Upload Custom', description: 'Use your own image' }
];

export default function MemeGeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('drake');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [generatedMemeImage, setGeneratedMemeImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomImage(e.target?.result as string);
        setSelectedTemplate('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCaption = async () => {
    if (!topText && !bottomText) {
      alert('Please enter some text or let AI generate captions');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/playground/meme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: selectedTemplate,
          topText,
          bottomText,
          context: 'Generate funny meme caption'
        }),
      });

      const data = await response.json();
      setGeneratedCaption(data.caption);
    } catch (error) {
      console.error('Error generating caption:', error);
      setGeneratedCaption('Error generating caption. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAICaption = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/playground/meme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: selectedTemplate,
          generateCaption: true,
          context: 'Generate a funny meme caption for this template'
        }),
      });

      const data = await response.json();
      const captions = data.caption.split('|');
      setTopText(captions[0] || '');
      setBottomText(captions[1] || '');
    } catch (error) {
      console.error('Error generating AI caption:', error);
      setTopText('When you try to be funny');
      setBottomText('But the AI is funnier');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMemeImage = async () => {
    console.log('🎨 generateMemeImage called with:', { topText, bottomText, selectedTemplate });
    
    if (!topText || !bottomText) {
      alert('Please enter both top and bottom text first');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/playground/meme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: selectedTemplate,
          topText,
          bottomText,
          generateImage: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate meme image');
      }

      const data = await response.json();
      console.log('Meme API response:', data);
      setGeneratedMemeImage(data.imageUrl);
    } catch (error) {
      console.error('Error generating meme image:', error);
      alert('Failed to generate meme image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = () => {
    const memeText = `${topText}\n${bottomText}`;
    navigator.clipboard.writeText(memeText);
  };

  const downloadMeme = async () => {
    // If we have a generated meme image, download that
    if (generatedMemeImage) {
      try {
        const filename = `meme-${selectedTemplate}-${Date.now()}.png`;
        
        // Use server-side proxy to download the image
        const response = await fetch('/api/download-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: generatedMemeImage,
            filename: filename
          }),
        });
        
        if (!response.ok) {
          throw new Error('Download failed');
        }
        
        // Create blob from response and trigger download
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
        
      } catch (error) {
        console.error('Error downloading meme image:', error);
        alert('Failed to download meme image. Please try again.');
        return;
      }
    }
    
    // Fallback: download meme text if no image is generated
    const memeContent = `MEME: ${selectedTemplate.toUpperCase()}\n\nTop Text: ${topText}\nBottom Text: ${bottomText}`;
    const element = document.createElement('a');
    const file = new Blob([memeContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'meme.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const selectedTemplateData = memeTemplates.find(t => t.id === selectedTemplate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-yellow-900 dark:to-orange-900">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Meme Generator
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Upload images or pick templates and let AI write funny captions
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Fun & Creative
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
                  <Smile className="h-5 w-5" />
                  Meme Creator
                </CardTitle>
                <CardDescription>
                  Choose a template and add your funny captions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Template Selection */}
                <div>
                  <Label htmlFor="template">Meme Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a meme template" />
                    </SelectTrigger>
                    <SelectContent>
                      {memeTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-sm text-gray-500">{template.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Image Upload */}
                {selectedTemplate === 'custom' && (
                  <div>
                    <Label>Upload Custom Image</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Image
                      </Button>
                    </div>
                    {customImage && (
                      <div className="mt-4">
                        <img
                          src={customImage}
                          alt="Custom meme template"
                          className="w-full max-w-xs mx-auto rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Text Inputs */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="top-text">Top Text</Label>
                    <Input
                      id="top-text"
                      value={topText}
                      onChange={(e) => setTopText(e.target.value)}
                      placeholder="Enter top text..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="bottom-text">Bottom Text</Label>
                    <Input
                      id="bottom-text"
                      value={bottomText}
                      onChange={(e) => setBottomText(e.target.value)}
                      placeholder="Enter bottom text..."
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button onClick={generateAICaption} disabled={isLoading} variant="outline" className="flex-1">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Smile className="h-4 w-4 mr-2" />
                          AI Caption
                        </>
                      )}
                    </Button>
                    <Button onClick={generateCaption} disabled={isLoading} className="flex-1">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Create Meme
                        </>
                      )}
                    </Button>
                  </div>
                  <Button 
                    onClick={generateMemeImage}
                    disabled={isLoading || !topText || !bottomText} 
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Meme Image...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Generate Meme Image
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Meme Preview
                  </span>
                  {(topText || bottomText || generatedMemeImage) && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyText}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={downloadMeme}
                        title={generatedMemeImage ? "Download meme image" : "Download meme text"}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  Your meme will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {topText || bottomText ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="capitalize">
                        {selectedTemplateData?.name}
                      </Badge>
                    </div>
                    
                    {/* Meme Preview */}
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center space-y-4">
                      {generatedMemeImage ? (
                        <div className="w-full">
                          <img
                            src={generatedMemeImage}
                            alt={`Generated meme: ${topText} / ${bottomText}`}
                            className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                          />
                          <p className="text-sm text-gray-500 mt-2">AI-Generated Meme</p>
                        </div>
                      ) : customImage ? (
                        <img
                          src={customImage}
                          alt="Meme template"
                          className="w-full max-w-sm mx-auto rounded-lg"
                        />
                      ) : (
                        <div className="w-full max-w-sm mx-auto h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">{selectedTemplateData?.name} Template</p>
                          </div>
                        </div>
                      )}
                      
                      {!generatedMemeImage && topText && (
                        <div className="text-lg font-bold text-white bg-black bg-opacity-75 px-4 py-2 rounded">
                          {topText}
                        </div>
                      )}
                      
                      {!generatedMemeImage && bottomText && (
                        <div className="text-lg font-bold text-white bg-black bg-opacity-75 px-4 py-2 rounded">
                          {bottomText}
                        </div>
                      )}
                    </div>

                    {generatedCaption && (
                      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                        <h4 className="font-semibold mb-2">AI Suggestion:</h4>
                        <p className="text-sm">{generatedCaption}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Smile className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Choose a template and add text to create your meme</p>
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
