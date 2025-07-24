'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Languages, Copy, Download, Loader2, ArrowLeft, MessageCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const languages = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' }
];

const proficiencyLevels = [
  { id: 'beginner', name: 'Beginner', description: 'Just starting out' },
  { id: 'intermediate', name: 'Intermediate', description: 'Some experience' },
  { id: 'advanced', name: 'Advanced', description: 'Quite fluent' }
];

export default function LanguageTutorPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [proficiency, setProficiency] = useState('beginner');
  const [activeTab, setActiveTab] = useState('translate');
  
  // Translation
  const [textToTranslate, setTextToTranslate] = useState('');
  const [translation, setTranslation] = useState('');
  
  // Grammar Check
  const [textToCheck, setTextToCheck] = useState('');
  const [grammarResult, setGrammarResult] = useState('');
  
  // Conversation
  const [conversationTopic, setConversationTopic] = useState('');
  const [conversation, setConversation] = useState<Array<{role: string, message: string}>>([]);
  const [userMessage, setUserMessage] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const translateText = async () => {
    if (!textToTranslate.trim()) {
      alert('Please enter text to translate');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/playground/language-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'translate',
          text: textToTranslate,
          targetLanguage: selectedLanguage,
          proficiency
        }),
      });

      const data = await response.json();
      setTranslation(data.result);
    } catch (error) {
      console.error('Error translating text:', error);
      setTranslation('Sorry, there was an error translating the text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkGrammar = async () => {
    if (!textToCheck.trim()) {
      alert('Please enter text to check');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/playground/language-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'grammar',
          text: textToCheck,
          targetLanguage: selectedLanguage,
          proficiency
        }),
      });

      const data = await response.json();
      setGrammarResult(data.result);
    } catch (error) {
      console.error('Error checking grammar:', error);
      setGrammarResult('Sorry, there was an error checking the grammar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startConversation = async () => {
    if (!conversationTopic.trim()) {
      alert('Please enter a conversation topic');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/playground/language-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'conversation_start',
          topic: conversationTopic,
          targetLanguage: selectedLanguage,
          proficiency
        }),
      });

      const data = await response.json();
      setConversation([{ role: 'tutor', message: data.result }]);
    } catch (error) {
      console.error('Error starting conversation:', error);
      setConversation([{ role: 'tutor', message: 'Hello! Let\'s practice conversation. What would you like to talk about?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const newConversation = [...conversation, { role: 'user', message: userMessage }];
    setConversation(newConversation);
    setUserMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/playground/language-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'conversation_reply',
          message: userMessage,
          conversation: newConversation,
          targetLanguage: selectedLanguage,
          proficiency
        }),
      });

      const data = await response.json();
      setConversation([...newConversation, { role: 'tutor', message: data.result }]);
    } catch (error) {
      console.error('Error in conversation:', error);
      setConversation([...newConversation, { role: 'tutor', message: 'I apologize, but I had trouble understanding. Could you try again?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const selectedLang = languages.find(l => l.code === selectedLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Language Tutor
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Translate, correct grammar, and practice conversations
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
            Learning Tools
          </Badge>
        </motion.div>

        {/* Language & Proficiency Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <Card>
            <CardContent className="pt-6">
              <label className="text-sm font-medium mb-2 block">Target Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <label className="text-sm font-medium mb-2 block">Your Level</label>
              <Select value={proficiency} onValueChange={setProficiency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select proficiency" />
                </SelectTrigger>
                <SelectContent>
                  {proficiencyLevels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      <div>
                        <div className="font-medium">{level.name}</div>
                        <div className="text-sm text-gray-500">{level.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="translate">Translation</TabsTrigger>
              <TabsTrigger value="grammar">Grammar Check</TabsTrigger>
              <TabsTrigger value="conversation">Conversation</TabsTrigger>
            </TabsList>

            {/* Translation Tab */}
            <TabsContent value="translate" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>English Text</CardTitle>
                    <CardDescription>Enter text to translate</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={textToTranslate}
                      onChange={(e) => setTextToTranslate(e.target.value)}
                      placeholder="Enter English text to translate..."
                      className="min-h-[150px]"
                    />
                    <Button onClick={translateText} disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Translating...
                        </>
                      ) : (
                        <>
                          <Languages className="h-4 w-4 mr-2" />
                          Translate to {selectedLang?.name}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedLang?.flag} {selectedLang?.name} Translation</span>
                      {translation && (
                        <Button variant="outline" size="sm" onClick={() => copyText(translation)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </CardTitle>
                    <CardDescription>Translation will appear here</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {translation ? (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <p className="whitespace-pre-wrap">{translation}</p>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Languages className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Enter text and click translate to see the result</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Grammar Check Tab */}
            <TabsContent value="grammar" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Text to Check</CardTitle>
                    <CardDescription>Enter text in {selectedLang?.name} for grammar checking</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={textToCheck}
                      onChange={(e) => setTextToCheck(e.target.value)}
                      placeholder={`Enter ${selectedLang?.name} text to check grammar...`}
                      className="min-h-[150px]"
                    />
                    <Button onClick={checkGrammar} disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Check Grammar
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Grammar Analysis</span>
                      {grammarResult && (
                        <Button variant="outline" size="sm" onClick={() => copyText(grammarResult)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </CardTitle>
                    <CardDescription>Corrections and suggestions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {grammarResult ? (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <p className="whitespace-pre-wrap">{grammarResult}</p>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Enter text and click check to see grammar analysis</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Conversation Tab */}
            <TabsContent value="conversation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Practice Conversation</CardTitle>
                  <CardDescription>Practice speaking {selectedLang?.name} with an AI tutor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {conversation.length === 0 ? (
                    <div className="space-y-4">
                      <Input
                        value={conversationTopic}
                        onChange={(e) => setConversationTopic(e.target.value)}
                        placeholder="Enter a topic to discuss (e.g., travel, food, hobbies)"
                      />
                      <Button onClick={startConversation} disabled={isLoading} className="w-full">
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          <>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Start Conversation
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Conversation History */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
                        {conversation.map((msg, index) => (
                          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.role === 'user' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white dark:bg-gray-700 border'
                            }`}>
                              <p className="text-sm">{msg.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Message Input */}
                      <div className="flex gap-2">
                        <Input
                          value={userMessage}
                          onChange={(e) => setUserMessage(e.target.value)}
                          placeholder={`Type your message in ${selectedLang?.name}...`}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button onClick={sendMessage} disabled={isLoading || !userMessage.trim()}>
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Send'
                          )}
                        </Button>
                      </div>

                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setConversation([]);
                          setConversationTopic('');
                          setUserMessage('');
                        }}
                        className="w-full"
                      >
                        Start New Conversation
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
