"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, X, Zap, Brain, Image, MessageSquare, Mic, FileText } from 'lucide-react'
import Link from 'next/link'
import { useReducedMotion, getTransitionDuration } from '@/hooks/useReducedMotion'

interface AIPlaygroundPromoProps {
  className?: string
}

const AIPlaygroundPromo: React.FC<AIPlaygroundPromoProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const aiTools = [
    { icon: <MessageSquare className="w-4 h-4" />, name: "AI Chat", description: "Interactive conversations", url: "/playground/chatbot" },
    { icon: <Image className="w-4 h-4" />, name: "Image Generator", description: "DALL-E 3 powered", url: "/playground/image-generator" },
    { icon: <Brain className="w-4 h-4" />, name: "Meme Creator", description: "AI-powered memes", url: "/playground/meme-generator" },
    { icon: <FileText className="w-4 h-4" />, name: "Text Tools", description: "Summarize & explain", url: "/playground/text-summarizer" },
    { icon: <Mic className="w-4 h-4" />, name: "Voice Features", description: "Speech & audio tools", url: "/playground/voice-to-text" },
    { icon: <Zap className="w-4 h-4" />, name: "Smart Tools", description: "Resume, stories & more", url: "/playground/resume-generator" },
  ]

  if (!isVisible) return null

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
      transition={shouldReduceMotion ? { duration: 0 } : undefined}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Main Promo Card */}
      <div className="relative bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10 border border-purple-200/20 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-background/50 transition-colors z-10"
          aria-label="Close promotion"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-blue-600/5 rounded-2xl" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-600/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-600/10 to-transparent rounded-full blur-xl" />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                🚀 Explore My AI Playground
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Discover powerful AI tools I&apos;ve built - from image generation to smart text processing
              </p>
            </div>
          </div>

          {/* Quick preview of tools */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {aiTools.slice(0, isExpanded ? aiTools.length : 6).map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: index * 0.1 }}
              >
                <Link
                  href={tool.url}
                  className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-background/80 hover:border-primary/30 transition-all duration-200 group cursor-pointer"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    {tool.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate group-hover:text-primary transition-colors">{tool.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{tool.description}</div>
                  </div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Call to action */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/playground"
              className="flex-1 group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => {
                // Optional: Track click for analytics
                console.log('AI Playground promo clicked');
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore AI Playground</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-4 py-3 border border-border rounded-lg font-medium hover:bg-muted/50 transition-colors text-sm"
            >
              {isExpanded ? 'Show Less' : 'View All Tools'}
            </button>
          </div>

          {/* Stats or highlights */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border/50">
            <div className="text-center">
              <div className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">12+</div>
              <div className="text-xs text-muted-foreground">AI Tools</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">GPT-4</div>
              <div className="text-xs text-muted-foreground">Powered</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Free</div>
              <div className="text-xs text-muted-foreground">To Use</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AIPlaygroundPromo
