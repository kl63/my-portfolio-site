'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  BookOpen, 
  FileText, 
  Scissors, 
  HelpCircle,
  Image,
  User,
  Wand2,
  Smile,
  Mic,
  Volume2,
  Music,
  Code,
  Calculator,
  Languages,
  Gamepad2,
  Gem,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AIApp {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  status: 'available' | 'coming-soon';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const aiApps: AIApp[] = [
  // TEXT & CHAT
  {
    id: 'chatbot',
    title: 'AI Chatbot',
    description: 'Chat with an AI assistant that can be your study buddy, career coach, or therapist.',
    icon: <MessageCircle className="h-6 w-6" />,
    category: 'text',
    status: 'available',
    difficulty: 'beginner'
  },
  {
    id: 'story-generator',
    title: 'Story Generator',
    description: 'Enter a topic and get a creative mini-story or poem generated instantly.',
    icon: <BookOpen className="h-6 w-6" />,
    category: 'text',
    status: 'available',
    difficulty: 'beginner'
  },
  {
    id: 'resume-generator',
    title: 'Resume Builder',
    description: 'Generate tailored resumes and cover letters from your experience.',
    icon: <FileText className="h-6 w-6" />,
    category: 'text',
    status: 'available',
    difficulty: 'intermediate'
  },
  {
    id: 'text-summarizer',
    title: 'Text Summarizer',
    description: 'Paste any article or essay and get an instant TL;DR summary.',
    icon: <Scissors className="h-6 w-6" />,
    category: 'text',
    status: 'available',
    difficulty: 'beginner'
  },
  {
    id: 'blog-qa',
    title: 'Blog Q&A',
    description: 'Ask questions and get answers from your blog posts using AI.',
    icon: <HelpCircle className="h-6 w-6" />,
    category: 'text',
    status: 'coming-soon',
    difficulty: 'advanced'
  },

  // IMAGE & MEDIA
  {
    id: 'image-generator',
    title: 'AI Image Generator',
    description: 'Create stunning images from text prompts using advanced AI models.',
    icon: <Image className="h-6 w-6" />,
    category: 'image',
    status: 'available',
    difficulty: 'beginner'
  },
  {
    id: 'avatar-creator',
    title: 'Avatar Creator',
    description: 'Upload a selfie and get styled variations in different art styles.',
    icon: <User className="h-6 w-6" />,
    category: 'image',
    status: 'coming-soon',
    difficulty: 'intermediate'
  },
  {
    id: 'image-enhancer',
    title: 'Image Enhancer',
    description: 'Upscale images, remove backgrounds, and apply AI enhancements.',
    icon: <Wand2 className="h-6 w-6" />,
    category: 'image',
    status: 'coming-soon',
    difficulty: 'intermediate'
  },
  {
    id: 'meme-generator',
    title: 'Meme Generator',
    description: 'Upload images or pick templates and let AI write funny captions.',
    icon: <Smile className="h-6 w-6" />,
    category: 'image',
    status: 'available',
    difficulty: 'beginner'
  },

  // AUDIO & VIDEO
  {
    id: 'voice-to-text',
    title: 'Voice to Text',
    description: 'Speak into your microphone and get instant transcription.',
    icon: <Mic className="h-6 w-6" />,
    category: 'audio',
    status: 'available',
    difficulty: 'beginner'
  },
  {
    id: 'text-to-speech',
    title: 'Text to Speech',
    description: 'Convert any text to natural-sounding speech with voice options.',
    icon: <Volume2 className="h-6 w-6" />,
    category: 'audio',
    status: 'available',
    difficulty: 'beginner'
  },
  {
    id: 'music-generator',
    title: 'Music Mood Generator',
    description: 'Enter a mood and get AI-generated music playlists or lyrics.',
    icon: <Music className="h-6 w-6" />,
    category: 'audio',
    status: 'coming-soon',
    difficulty: 'advanced'
  },

  // LEARNING TOOLS
  {
    id: 'code-explainer',
    title: 'Code Explainer',
    description: 'Paste any code and get it explained in plain English.',
    icon: <Code className="h-6 w-6" />,
    category: 'learning',
    status: 'available',
    difficulty: 'intermediate'
  },
  {
    id: 'math-solver',
    title: 'Math Solver',
    description: 'Solve math problems with step-by-step explanations.',
    icon: <Calculator className="h-6 w-6" />,
    category: 'learning',
    status: 'available',
    difficulty: 'intermediate'
  },
  {
    id: 'language-tutor',
    title: 'Language Tutor',
    description: 'Translate, correct grammar, and practice conversations.',
    icon: <Languages className="h-6 w-6" />,
    category: 'learning',
    status: 'available',
    difficulty: 'intermediate'
  },

  // FUN & INTERACTIVE
  {
    id: 'guess-prompt',
    title: 'Guess the Prompt',
    description: 'Look at AI-generated images and guess the original prompt.',
    icon: <Gamepad2 className="h-6 w-6" />,
    category: 'fun',
    status: 'available',
    difficulty: 'beginner'
  },
  {
    id: 'fortune-teller',
    title: 'AI Fortune Teller',
    description: 'Ask questions and get humorous or inspiring AI fortunes.',
    icon: <Gem className="h-6 w-6" />,
    category: 'fun',
    status: 'available',
    difficulty: 'beginner'
  },
  {
    id: 'personality-generator',
    title: 'Personality Generator',
    description: 'Generate unique personas with backgrounds and dialogue styles.',
    icon: <Users className="h-6 w-6" />,
    category: 'fun',
    status: 'available',
    difficulty: 'beginner'
  }
];

const categories = [
  { id: 'all', label: 'All Apps', icon: <Wand2 className="h-4 w-4" /> },
  { id: 'text', label: 'Text & Chat', icon: <MessageCircle className="h-4 w-4" /> },
  { id: 'image', label: 'Image & Media', icon: <Image className="h-4 w-4" /> },
  { id: 'audio', label: 'Audio & Video', icon: <Mic className="h-4 w-4" /> },
  { id: 'learning', label: 'Learning Tools', icon: <Code className="h-4 w-4" /> },
  { id: 'fun', label: 'Fun & Interactive', icon: <Gamepad2 className="h-4 w-4" /> }
];

export default function PlaygroundPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredApps = (selectedCategory === 'all' 
    ? aiApps 
    : aiApps.filter(app => app.category === selectedCategory))
    .sort((a, b) => {
      // Sort by status: available first, then coming soon
      if (a.status === 'available' && b.status === 'coming-soon') return -1;
      if (a.status === 'coming-soon' && b.status === 'available') return 1;
      return 0;
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'available' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            AI Creative Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore the power of AI with our collection of creative tools and interactive experiences. 
            From chatbots to image generators, discover what artificial intelligence can do for you.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                {category.icon}
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-purple-600">{aiApps.length}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Apps</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">
                  {aiApps.filter(app => app.status === 'available').length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available Now</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {categories.length - 1}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-indigo-600">∞</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Possibilities</p>
              </CardContent>
            </Card>
          </motion.div>

          <TabsContent value={selectedCategory}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredApps.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className={`h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                      app.status === 'coming-soon' ? 'opacity-70' : ''
                    }`}
                    onClick={() => {
                      if (app.status === 'available') {
                        // Navigate to the specific app page
                        window.location.href = `/playground/${app.id}`;
                      }
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                          {app.icon}
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getDifficultyColor(app.difficulty)}>
                            {app.difficulty}
                          </Badge>
                          <Badge className={getStatusColor(app.status)}>
                            {app.status === 'available' ? 'Available' : 'Coming Soon'}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{app.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {app.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}


