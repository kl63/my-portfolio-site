"use client"

import React, { useState, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram,
  Calendar,
  Clock
} from "lucide-react"



interface ComingSoonProps {
  title?: string
  subtitle?: string
  description?: string
  launchDate?: Date
  socialLinks?: {
    github?: string
    twitter?: string
    linkedin?: string
    instagram?: string
  }
  className?: string
}

// Countdown Component
function Countdown({ launchDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) }) {
  // Convert the launch date to a timestamp for comparison
  const targetTimestamp = React.useMemo(() => launchDate.getTime(), [launchDate]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = targetTimestamp - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [targetTimestamp])

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, icon: Calendar },
    { label: 'Hours', value: timeLeft.hours, icon: Clock },
    { label: 'Minutes', value: timeLeft.minutes, icon: Clock },
    { label: 'Seconds', value: timeLeft.seconds, icon: Clock }
  ]

  return (
    <div className="flex flex-wrap justify-center md:justify-between gap-4 py-4">
      {timeUnits.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center p-3 w-[90px] bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <unit.icon className="w-4 h-4 mb-1 text-primary/70" />
          <span className="text-2xl font-bold">{unit.value}</span>
          <span className="text-xs text-muted-foreground">{unit.label}</span>
        </div>
      ))}
    </div>
  )
}

// Social Links Component
function SocialLinks({ links }: { links?: ComingSoonProps['socialLinks'] }) {
  if (!links) return null
  
  const socialIcons = [
    { key: 'github', url: links.github, Icon: Github },
    { key: 'twitter', url: links.twitter, Icon: Twitter },
    { key: 'linkedin', url: links.linkedin, Icon: Linkedin },
    { key: 'instagram', url: links.instagram, Icon: Instagram }
  ].filter(item => item.url)
  
  if (socialIcons.length === 0) return null
  
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      {socialIcons.map(({ key, url, Icon }) => (
        url && (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <Icon className="w-5 h-5" />
            <span className="sr-only">{key}</span>
          </a>
        )
      ))}
    </div>
  )
}

// Main Component
export function ComingSoon({
  title = "Coming Soon",
  subtitle,
  description,
  launchDate,
  socialLinks,
  className
}: ComingSoonProps) {
  const shouldReduceMotion = useReducedMotion()
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }
  
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  // Background Effect Component
  function BackgroundEffect() {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-gradient-to-tr from-green-500 via-blue-500 to-purple-500 opacity-15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    )
  }

  return (
    <div className={cn("relative h-screen w-full flex items-center justify-center overflow-hidden p-4 md:p-6", className)}>
      <BackgroundEffect />
      
      <motion.div 
        className="relative z-10 w-full max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={!shouldReduceMotion ? containerVariants : {}}
      >
        <div className="flex flex-col items-center text-center space-y-10 backdrop-blur-sm p-8 rounded-xl bg-black/30 border border-white/10">
          {/* Main Content */}
          <motion.div 
            className="space-y-4"
            variants={!shouldReduceMotion ? childVariants : {}}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{title}</h1>
            {subtitle && <h2 className="text-xl md:text-2xl font-medium text-foreground/80">{subtitle}</h2>}
            {description && <p className="max-w-lg text-foreground/70">{description}</p>}
          </motion.div>

          {/* Countdown */}
          <motion.div 
            className="w-full"
            variants={!shouldReduceMotion ? childVariants : {}}
          >
            <Countdown launchDate={launchDate} />
          </motion.div>

          {/* Social Links */}
          <motion.div variants={!shouldReduceMotion ? childVariants : {}}>
            <SocialLinks links={socialLinks} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}



// Demo Component
export default function ComingSoonDemo() {
  // Use a fixed launch date (August 4th, 2025)
  const launchDate = new Date("2025-08-04T00:00:00");
  
  return (
    <ComingSoon
      title="My Portfolio"
      subtitle="Creative Developer & Designer"
      description="I'm building an immersive portfolio experience that showcases my passion for creating beautiful, functional digital experiences. Join the waitlist to be the first to explore my work!"
      launchDate={launchDate}
      socialLinks={{
        github: "https://github.com",
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        instagram: "https://instagram.com"
      }}
    />
  )
}
