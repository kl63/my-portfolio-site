"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Check, X } from 'lucide-react'
import Link from 'next/link'

interface CookieConsentProps {
  className?: string
}

const CookieConsent: React.FC<CookieConsentProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('cookie-consent')
    
    if (!hasConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setIsVisible(false)
  }



  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`fixed bottom-0 left-0 right-0 z-[9997] ${className}`}
      >
        <div className="bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 backdrop-blur-md border-t border-purple-200/30 shadow-2xl relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-blue-600/5" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              {/* Icon and main content */}
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-full bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 border border-purple-300/30 mt-1">
                  <Cookie className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">We use cookies</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This site uses cookies to enhance your experience, analyze site usage, and provide personalized content. 
                    {!showDetails && (
                      <button
                        onClick={() => setShowDetails(true)}
                        className="text-purple-600 hover:text-pink-600 hover:underline ml-1 transition-colors"
                      >
                        Learn more
                      </button>
                    )}
                  </p>
                  
                  {/* Detailed information */}
                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 pt-3 border-t border-purple-200/30 bg-gradient-to-r from-purple-50/10 via-pink-50/10 to-blue-50/10"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
                          <div>
                            <strong className="text-purple-700">Essential Cookies:</strong>
                            <br />Required for basic site functionality and security.
                          </div>
                          <div>
                            <strong className="text-pink-700">Analytics Cookies:</strong>
                            <br />Help us understand how visitors interact with our site.
                          </div>
                        </div>
                        <div className="mt-2 text-xs">
                          <Link href="/privacy" className="text-purple-600 hover:text-pink-600 hover:underline transition-colors">
                            Privacy Policy
                          </Link>
                          {" • "}
                          <button
                            onClick={() => setShowDetails(false)}
                            className="text-purple-600 hover:text-pink-600 hover:underline transition-colors"
                          >
                            Hide details
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  onClick={handleAcceptAll}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-[1.02] transition-all text-sm"
                >
                  <Check className="w-4 h-4" />
                  Accept
                </button>
                
                <button
                  onClick={handleDecline}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-300 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 hover:border-gray-400 transition-all text-sm"
                  aria-label="Decline cookies"
                >
                  <X className="w-4 h-4" />
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CookieConsent
