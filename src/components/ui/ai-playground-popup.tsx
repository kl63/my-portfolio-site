"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, X, Zap, Brain, Image, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface AIPlaygroundPopupProps {
  delay?: number // Delay in milliseconds before showing popup
  className?: string
}

const AIPlaygroundPopup: React.FC<AIPlaygroundPopupProps> = ({ 
  delay = 5000, // Default 5 seconds
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    // Show popup after delay on every page load
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        setHasShown(true)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [delay, hasShown])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isVisible) {
      // Prevent scrolling on mount
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '0px' // Prevent layout shift
      
      // Cleanup function to restore scrolling
      return () => {
        document.body.style.overflow = 'unset'
        document.body.style.paddingRight = 'unset'
      }
    }
  }, [isVisible])

  const handleClose = () => {
    setIsVisible(false)
    // No longer saving to sessionStorage - will show again on page refresh
  }

  const handleExplore = () => {
    handleClose()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Modal Backdrop - Blocks all interactions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : undefined}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998]"
            onClick={handleClose}
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden'
            }}
          />

          {/* Popup Modal */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 50 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 50 }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", damping: 20, stiffness: 300 }}
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-lg mx-4 ${className}`}
            style={{
              position: 'fixed',
              pointerEvents: 'auto'
            }}
          >
            <div className="relative bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
                aria-label="Close popup"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10" />
              
              {/* Content */}
              <div className="relative p-6">
                {/* Header with icon */}
                <div className="text-center mb-6">
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 shadow-lg mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    🎉 Check Out My AI Playground!
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Explore 12+ powerful AI tools I&apos;ve built with GPT-4 and DALL-E 3
                  </p>
                </div>

                {/* Featured tools preview */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">AI Chat</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Image className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Image Gen</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Meme Maker</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">& More!</span>
                  </div>
                </div>

                {/* Call to action */}
                <div className="space-y-3">
                  <Link
                    href="/playground"
                    onClick={() => {
                      handleExplore();
                      console.log('AI Playground popup clicked');
                    }}
                    className="w-full group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Explore AI Playground</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <button
                    onClick={handleClose}
                    className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Maybe later
                  </button>
                </div>

                {/* Small stats */}
                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="font-bold text-sm text-primary">Free</div>
                    <div className="text-xs text-muted-foreground">To Use</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-sm text-primary">12+</div>
                    <div className="text-xs text-muted-foreground">Tools</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-sm text-primary">GPT-4</div>
                    <div className="text-xs text-muted-foreground">Powered</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AIPlaygroundPopup
