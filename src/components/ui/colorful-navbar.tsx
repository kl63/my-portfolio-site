"use client"

import React, { useState, useEffect } from 'react'
import { Home, FolderOpen, Award, Mail, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
}

interface ColorfulNavbarProps {
  brandName?: string
  navItems?: NavItem[]
  className?: string
}

const ColorfulNavbar: React.FC<ColorfulNavbarProps> = ({
  brandName = "Kevin Lin",
  navItems = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Projects", href: "/projects", icon: <FolderOpen size={18} /> },
    { name: "Skills", href: "/skills", icon: <Award size={18} /> },
    { name: "AI Playground", href: "/playground", icon: <Sparkles size={18} /> },
    { name: "Contact", href: "/contact", icon: <Mail size={18} /> }
  ]
}) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    tap: { scale: 0.95 }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'py-2 bg-background/80 backdrop-blur-lg shadow-md'
          : 'py-4 bg-transparent'}`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" passHref>
            <motion.div
              className="flex items-center group cursor-pointer"
              variants={logoVariants}
              initial="initial"
              animate="animate"
              whileTap={shouldReduceMotion ? {} : "tap"}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                KL
              </div>
              <div className="ml-2">
                <span className="font-bold text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                  {brandName}
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.nav 
              className="flex items-center space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
            >
              {navItems.map((item, index) => {
                const isActive = item.href === '/playground' 
                  ? pathname.startsWith('/playground')
                  : pathname === item.href
                
                return (
                  <motion.div
                    key={item.name}
                    className="relative flex items-center gap-3 px-6 py-2 text-base font-medium transition-all"
                    variants={{
                      hidden: { opacity: 0, y: -10 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.3, delay: index * 0.1 },
                      },
                    }}
                    whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                    whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                  >
                    <Link 
                      key={item.name} 
                      href={item.href} 
                      className={`flex items-center gap-3 w-full relative ${isActive 
                        ? 'font-bold'
                        : 'text-foreground hover:text-purple-600'}`}
                    >
                      <span className={`${isActive 
                        ? 'text-purple-600'
                        : 'text-foreground'}`}>
                        {item.icon}
                      </span>
                      <span className={`ml-1 text-base ${isActive 
                        ? 'bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600'
                        : ''}`}>
                        {item.name}
                      </span>
                      {isActive && (
                        <motion.span 
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
                          layoutId="navbar-active-underline"
                        />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </motion.nav>
            
            {/* GitHub Actions Status Badge */}
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <a
                href="https://github.com/kl63/my-portfolio-site/actions"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80 rounded-md overflow-hidden"
                title="View Site Status & GitHub Actions"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://img.shields.io/badge/Site%20Status-Online-brightgreen?style=flat&logo=github"
                  alt="Site Status"
                  className="h-5 w-auto"
                  onError={(e) => {
                    // Fallback to basic badge if shields.io fails
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://img.shields.io/badge/Site-Status-blue';
                  }}
                />
              </a>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={toggleMenu}
            className={`flex md:hidden items-center justify-center p-3 rounded-full transition-all duration-300 relative z-50 ${
              scrolled 
                ? 'bg-muted/70 hover:bg-muted/90 text-foreground' 
                : 'bg-white/90 hover:bg-white text-gray-900 shadow-lg border border-gray-200'
            }`}
            whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            style={{ minWidth: '48px', minHeight: '48px' }}
          >
            {isOpen ? (
              // Close (X) icon
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-current"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger menu icon
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-current"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </motion.button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : undefined}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed right-0 top-0 bottom-0 w-3/4 z-50 md:hidden bg-background shadow-2xl"
              initial={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
              animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
              transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", damping: 20 }}
            >
              <div className="flex flex-col h-full">
                <div className="p-4 flex justify-between items-center border-b border-border">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      KL
                    </div>
                    <span className="ml-2 font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                      {brandName}
                    </span>
                  </div>
                  <motion.button
                    onClick={toggleMenu}
                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                    whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                  >
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                <div className="flex flex-col p-4 space-y-2 flex-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href
                    
                    return (
                      <motion.div
                        key={item.name}
                        className="flex items-center gap-4 px-6 py-3 text-base font-medium transition-all"
                        onClick={() => setIsOpen(false)}
                        whileHover={{ x: 8 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link 
                          href={item.href} 
                          className={`flex items-center gap-3 w-full relative ${isActive 
                            ? 'bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 font-bold'
                            : 'text-foreground hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-blue-600'}`}
                        >
                          {item.icon}
                          <span className="text-base">{item.name}</span>
                          {isActive && (
                            <motion.span 
                              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
                              layoutId="mobile-navbar-active-underline"
                            />
                          )}
                        </Link>
                      </motion.div>
                    )
                  })}
                  
                  {/* GitHub Actions Status Badge - Mobile */}
                  <motion.div
                    className="px-6 py-3 border-t border-border mt-4 pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-sm text-muted-foreground mb-2">Build Status</div>
                    <a
                      href="https://github.com/kl63/my-portfolio-site/actions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block transition-opacity hover:opacity-80"
                      onClick={() => setIsOpen(false)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://img.shields.io/badge/Site%20Status-Online-brightgreen?style=flat&logo=github"
                        alt="Site Status"
                        className="h-5 w-auto"
                        onError={(e) => {
                          // Fallback to basic badge if shields.io fails
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://img.shields.io/badge/Site-Status-blue';
                        }}
                      />
                    </a>
                  </motion.div>
                </div>
                
                <div className="px-6 py-4 border-t border-border">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-muted-foreground text-center"
                  >
                    © {new Date().getFullYear()} {brandName}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16" />
    </>
  )
}

export default ColorfulNavbar
