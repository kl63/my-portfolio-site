"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, easeInOut, easeIn } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { ChevronRight, Download, ExternalLink, Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

// Utility function
function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Animated Text Cycle Component
interface AnimatedTextCycleProps {
  words: string[];
  interval?: number;
  className?: string;
}

const AnimatedTextCycle: React.FC<AnimatedTextCycleProps> = ({
  words,
  interval = 3000,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, words.length]);

  const containerVariants = {
    hidden: { 
      y: -20,
      opacity: 0,
      filter: "blur(8px)"
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: easeInOut,
      }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      filter: "blur(8px)",
      transition: { 
        duration: 0.3, 
        ease: easeIn,
      }
    },
  };

  return (
    <motion.span className="relative inline-block min-w-[200px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={currentIndex}
          className={cn("block", className)}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
};

// Badge component for skills
interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className }) => (
  <span className={cn(
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
    "bg-primary/10 text-primary dark:bg-primary/20",
    className
  )}>
    {children}
  </span>
);

// Main Hero Component
interface DeveloperPortfolioHeroProps {
  name: string;
  title?: string;
  roles?: string[];
  bio?: string;
  imageUrl?: string;
  skills?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  emailAddress?: string;
  resumeUrl?: string;
  className?: string;
}

const DeveloperPortfolioHero: React.FC<DeveloperPortfolioHeroProps> = ({
  name = "Kevin Lin",
  title = "Full Stack Developer",
  roles = ["Web Developer", "UI Designer", "Problem Solver", "Tech Enthusiast"],
  bio = "I craft elegant solutions with modern technologies to build responsive and intuitive user experiences.",
  imageUrl = "/profile-placeholder.png", 
  skills = ["React", "TypeScript", "Node.js", "Next.js", "Tailwind CSS"],
  githubUrl = "https://github.com",
  linkedinUrl = "https://linkedin.com",
  emailAddress = "hello@example.com",
  resumeUrl = "/resume.pdf",
  className,
}) => {
  const fadeInUpVariants = {
    initial: { opacity: 0, y: 30 },
    animate: (i: number) => ({
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.6,
        ease: easeInOut,
      }
    }),
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <div className={cn("relative min-h-screen flex items-center justify-center overflow-hidden", className)}>
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-background/80">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -z-10 h-[310px] w-[310px] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute right-0 bottom-0 -z-10 h-[250px] w-[250px] rounded-full bg-secondary/20 blur-[100px]" />
      </div>
      
      <motion.main
        className="container px-4 md:px-6 flex flex-col lg:flex-row gap-8 lg:gap-16 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Text content */}
        <motion.div 
          className="flex-1 space-y-6"
          initial="initial"
          animate="animate"
          custom={0}
          variants={fadeInUpVariants}
        >
          <div>
            <motion.p 
              custom={1} 
              variants={fadeInUpVariants}
              className="text-lg font-medium text-primary"
            >
              Hello, I&apos;m
            </motion.p>
            <motion.h1 
              custom={2} 
              variants={fadeInUpVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-2"
            >
              {name}
            </motion.h1>
            <motion.div 
              custom={3} 
              variants={fadeInUpVariants}
              className="mt-4 text-xl md:text-2xl font-medium text-muted-foreground"
            >
              <span className="mr-2">{title} • </span>
              <AnimatedTextCycle 
                words={roles} 
                className="text-primary font-semibold" 
              />
            </motion.div>
          </div>
          
          <motion.p 
            custom={4} 
            variants={fadeInUpVariants}
            className="max-w-2xl text-muted-foreground leading-relaxed"
          >
            {bio}
          </motion.p>
          
          <motion.div 
            custom={5} 
            variants={fadeInUpVariants}
            className="flex flex-wrap gap-2"
          >
            {skills.map((skill) => (
              <motion.div 
                key={skill}
                whileHover="hover" 
                variants={fadeInUpVariants}
              >
                <Badge>{skill}</Badge>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            custom={6} 
            variants={fadeInUpVariants}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Button 
              size="lg" 
              className="group"
              onClick={() => window.location.href = `mailto:${emailAddress}`}
            >
              Contact Me
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              asChild
            >
              <a href={resumeUrl} download>
                <Download className="ml-1 h-4 w-4" />
                Resume
              </a>
            </Button>
          </motion.div>
          
          <motion.div 
            custom={7} 
            variants={fadeInUpVariants}
            className="flex gap-4 pt-2"
          >
            {githubUrl && (
              <motion.a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-background border border-border hover:bg-muted transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.97 }}
              >
                <Github className="h-5 w-5" />
              </motion.a>
            )}
            {linkedinUrl && (
              <motion.a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-background border border-border hover:bg-muted transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.97 }}
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
            )}
            {emailAddress && (
              <motion.a 
                href={`mailto:${emailAddress}`}
                className="p-2.5 rounded-full bg-background border border-border hover:bg-muted transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.97 }}
              >
                <Mail className="h-4 w-4 mr-2" />
              </motion.a>
            )}
          </motion.div>
        </motion.div>
        
        {/* Profile image */}
        <motion.div 
          className="relative flex-shrink-0 w-[280px] md:w-[320px] lg:w-[380px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div 
            className="relative z-10"
            whileHover={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Avatar className="w-full h-full rounded-full overflow-hidden border-4 border-primary/20">
              <Image 
                src={imageUrl} 
                alt={name} 
                width={400} 
                height={400} 
                className="w-full h-full object-cover" 
              />
            </Avatar>
            
            <motion.div
              className="absolute -top-4 -right-4 bg-secondary text-secondary-foreground p-3 rounded-full shadow-lg"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Github className="w-6 h-6" />
            </motion.div>
            
            <motion.div
              className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground p-3 rounded-full shadow-lg"
              animate={{
                rotate: [360, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <ExternalLink className="ml-1 h-3 w-3" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.main>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-muted-foreground rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DeveloperPortfolioHero;
