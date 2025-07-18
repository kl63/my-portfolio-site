"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Github, Linkedin, Mail, Code, Terminal, Zap, Layers } from "lucide-react";

// Main Hero Component
interface DeveloperPortfolioHeroProps {
  name?: string;
  title?: string;
  roles?: string[];
  bio?: string;
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
  skills = ["React", "TypeScript", "Node.js", "Next.js", "Tailwind CSS"],
  githubUrl = "https://github.com",
  linkedinUrl = "https://linkedin.com",
  emailAddress = "hello@example.com",
  resumeUrl = "/resume.pdf",
  className = "",
}) => {
  // Define our animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Using proper framer-motion types
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0 
    }
  };
  
  // Animation transition values are directly applied to each component

  const iconsArray = [<Code key="code" />, <Terminal key="terminal" />, <Zap key="zap" />, <Layers key="layers" />];

  return (
    <div className={`w-full bg-gradient-to-b from-background via-background/90 to-background relative overflow-hidden py-8 md:py-12 ${className}`}>
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Gradient blobs */}
        <div className="absolute top-1/3 -left-24 w-96 h-96 bg-blue-500 opacity-10 blur-[128px] rounded-full" />
        <div className="absolute bottom-1/3 -right-24 w-96 h-96 bg-purple-500 opacity-10 blur-[128px] rounded-full" />
        
        {/* Animated floating icons */}
        {iconsArray.map((icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white/5 text-4xl"
            style={{
              top: `${20 + (i * 15)}%`,
              left: `${10 + (i * 20)}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{
              repeat: Infinity,
              duration: 5 + i,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          >
            {icon}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6">
        <motion.div
          className="flex flex-col items-center text-center max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main heading with gradient */}
          <motion.h1 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-5xl md:text-6xl font-bold tracking-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500">
              {name}
            </span>
          </motion.h1>

          {/* Job title */}
          <motion.h2 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-xl md:text-2xl mt-3 font-medium text-foreground/80"
          >
            {title}
          </motion.h2>

          {/* Roles */}
          <motion.div 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-wrap justify-center gap-2 mt-2">
            {roles.map((role, index) => (
              <div key={role} className="flex items-center">
                {index > 0 && <span className="mx-2 text-muted-foreground">•</span>}
                <span className="text-muted-foreground">{role}</span>
              </div>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full my-4"
          />

          {/* Bio */}
          <motion.p 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-base text-muted-foreground max-w-2xl leading-relaxed"
          >
            {bio}
          </motion.p>

          {/* Skills */}
          <motion.div 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-wrap justify-center gap-2 mt-8 max-w-2xl mx-auto">
            {skills && skills.map((skill) => (
              <motion.span
                key={skill}
                className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium
                  bg-gradient-to-r from-blue-500/80 to-indigo-500/80 text-white
                  hover:from-blue-600 hover:to-indigo-600 shadow-md"
                whileHover={{ scale: 1.05 }}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>

          {/* Action buttons */}
          <motion.div 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-wrap justify-center gap-4 mt-6">
            <Button 
              size="lg"
              className="rounded-full px-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 border-0"
              onClick={() => window.location.href = `mailto:${emailAddress}`}
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Me
            </Button>
            {resumeUrl && (
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-full px-8 border-muted hover:bg-secondary/80"
                asChild
              >
                <a href={resumeUrl} download>
                  <Download className="mr-2 h-4 w-4" />
                  Resume
                </a>
              </Button>
            )}
          </motion.div>

          {/* Social links */}
          <motion.div 
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex justify-center space-x-6 mt-6">
            {githubUrl && (
              <motion.a 
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-secondary/50 hover:bg-secondary text-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className="h-5 w-5" />
              </motion.a>
            )}
            {linkedinUrl && (
              <motion.a 
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-secondary/50 hover:bg-secondary text-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
            )}
            {emailAddress && (
              <motion.a 
                href={`mailto:${emailAddress}`}
                className="p-3 rounded-full bg-secondary/50 hover:bg-secondary text-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail className="h-5 w-5" />
              </motion.a>
            )}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <motion.div 
              className="w-6 h-10 border-2 border-muted rounded-full flex justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="w-1 h-3 bg-muted rounded-full mt-2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeveloperPortfolioHero;
