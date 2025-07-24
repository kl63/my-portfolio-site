"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Navigation() {
  const pathname = usePathname()
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <nav className="bg-black/20 backdrop-blur-lg rounded-full p-2 border border-white/10">
        <ul className="flex space-x-1">
          <li>
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors relative block ${
                pathname === '/' ? 'text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              {pathname === '/' && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-primary/30 rounded-full -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              Coming Soon
            </Link>
          </li>
          <li>
            <Link 
              href="/portfolio" 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors relative block ${
                pathname === '/portfolio' ? 'text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              {pathname === '/portfolio' && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-primary/30 rounded-full -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              Portfolio
            </Link>
          </li>
          <li>
            <Link 
              href="/playground" 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors relative block ${
                pathname.startsWith('/playground') ? 'text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              {pathname.startsWith('/playground') && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-primary/30 rounded-full -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              AI Playground
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
