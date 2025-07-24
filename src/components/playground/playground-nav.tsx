'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  BookOpen, 
  FileText, 
  Scissors, 
  Image,
  Code,
  Gem,
  ArrowLeft,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const playgroundApps = [
  {
    id: 'chatbot',
    title: 'AI Chatbot',
    path: '/playground/chatbot',
    icon: <MessageCircle className="h-4 w-4" />,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'story-generator',
    title: 'Story Generator',
    path: '/playground/story-generator',
    icon: <BookOpen className="h-4 w-4" />,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'text-summarizer',
    title: 'Text Summarizer',
    path: '/playground/text-summarizer',
    icon: <Scissors className="h-4 w-4" />,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'image-generator',
    title: 'Image Generator',
    path: '/playground/image-generator',
    icon: <Image className="h-4 w-4" />,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'code-explainer',
    title: 'Code Explainer',
    path: '/playground/code-explainer',
    icon: <Code className="h-4 w-4" />,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'fortune-teller',
    title: 'Fortune Teller',
    path: '/playground/fortune-teller',
    icon: <Gem className="h-4 w-4" />,
    color: 'from-purple-600 to-indigo-600'
  }
];

export default function PlaygroundNav() {
  const pathname = usePathname();

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/playground">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Playground Hub
              </Button>
            </Link>
          </div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Creative Hub
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {playgroundApps.map((app) => (
            <Link key={app.id} href={app.path}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={pathname === app.path ? "default" : "outline"}
                  size="sm"
                  className={pathname === app.path ? `bg-gradient-to-r ${app.color} text-white` : ""}
                >
                  {app.icon}
                  <span className="ml-2 hidden sm:inline">{app.title}</span>
                </Button>
              </motion.div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
