"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Skills", path: "/skills" },
  { name: "AI Playground", path: "/playground" },
  { name: "Contact", path: "/contact" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16 mx-auto px-4">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            Kevin<span className="text-primary">Lin</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "relative px-2 py-1 text-sm font-medium transition-colors",
                pathname === item.path 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {pathname === item.path && (
                <motion.span 
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              {item.name}
            </Link>
          ))}
        </div>
        
        {/* GitHub Actions Status Badge */}
        <div className="hidden md:flex items-center">
          <a
            href="https://github.com/kl63/my-portfolio-site/actions"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src="https://github.com/kl63/my-portfolio-site/workflows/Deploy%20to%20Production/badge.svg"
              alt="GitHub Actions Status"
              width={120}
              height={20}
              className="h-5 w-auto"
            />
          </a>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden border-t border-border bg-background"
        >
          <div className="flex flex-col space-y-4 py-4 px-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-2 rounded-md transition-colors",
                  pathname === item.path 
                    ? "text-foreground bg-muted" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.name}
              </Link>
            ))}
            
            {/* GitHub Actions Status Badge - Mobile */}
            <div className="px-4 py-2">
              <a
                href="https://github.com/kl63/my-portfolio-site/actions"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80 block"
              >
                <Image
                  src="https://github.com/kl63/my-portfolio-site/workflows/Deploy%20to%20Production/badge.svg"
                  alt="GitHub Actions Status"
                  width={120}
                  height={20}
                  className="h-5 w-auto"
                />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}
