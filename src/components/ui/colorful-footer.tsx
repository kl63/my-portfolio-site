"use client"

import React from 'react';
import { Github, Linkedin, Mail,  MapPin,  Home, FolderOpen, Award } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface FooterLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface ContactInfo {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

interface ColorfulFooterProps {
  sections?: FooterSection[];
  socialLinks?: SocialLink[];
  contactInfo?: ContactInfo[];
  companyName?: string;
  description?: string;
}

const ColorfulFooter: React.FC<ColorfulFooterProps> = ({
  sections = [
    {
      title: "Navigation",
      links: [
        { label: "Home", href: "/", icon: <Home size={16} /> },
        { label: "Projects", href: "/projects", icon: <FolderOpen size={16} /> },
        { label: "Skills", href: "/skills", icon: <Award size={16} /> },
        { label: "Contact", href: "/contact", icon: <Mail size={16} /> }
      ]
    }
  ],
  socialLinks = [
    { icon: <Github className="h-5 w-5" />, href: "https://github.com/kl63", label: "GitHub" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com/in/linkevin19", label: "LinkedIn" },
  ],
  contactInfo = [
    { icon: <Mail className="h-5 w-5" />, label: "Email", value: "lin.kevin.1923@gmail.com", href: "mailto:lin.kevin.1923@gmail.com" },
    { icon: <MapPin className="h-5 w-5" />, label: "Location", value: "Newark, NJ", href: undefined },
  ],
  companyName = "Kevin Lin",
  description = "Software engineer and designer specializing in creating beautiful, functional, and user-friendly applications."
}) => {
  const shouldReduceMotion = useReducedMotion();

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : 0.2,
        duration: shouldReduceMotion ? 0 : 0.6
      }
    }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.4
      }
    }
  };
  
  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1
      }
    }
  };

  return (
    <footer className="relative py-16 overflow-hidden bg-background border-t border-border/20">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section with Logo and Description */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12 mb-12">
          <motion.div 
            className="md:col-span-2 space-y-4"
            variants={childVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link href="/" className="block">
              <div className="flex items-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  KL
                </div>
                <div className="ml-2">
                  <span className="font-bold text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                    {companyName}
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              {description}
            </p>
            
            {/* Social Links */}
            <motion.div 
              className="flex space-x-4 mt-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10 hover:from-purple-600/20 hover:via-pink-600/20 hover:to-blue-600/20 text-foreground hover:text-purple-600 transition-all duration-300"
                  aria-label={social.label}
                  variants={childVariants}
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.1 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Navigation Sections */}
          <motion.div 
            className="md:col-span-2 space-y-8"
            variants={childVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-base font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIdx) => (
                    <motion.li 
                      key={linkIdx}
                      whileHover={{ x: shouldReduceMotion ? 0 : 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Link href={link.href} className="text-sm text-foreground hover:text-purple-600 transition-colors flex items-center gap-2">
                        {link.icon}
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
          
          {/* Contact Information */}
          <motion.div 
            className="md:col-span-2 space-y-6"
            variants={childVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-base font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Contact
            </h3>
            <div className="space-y-4">
              {contactInfo.map((contact, index) => (
                <div key={index} className="flex">
                  <div className="mt-0.5 text-purple-600">
                    {contact.icon}
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-muted-foreground mb-1">{contact.label}</p>
                    {contact.href ? (
                      <a
                        href={contact.href}
                        className="text-sm hover:text-purple-600 focus:outline-none focus:text-purple-500 focus:underline break-words"
                      >
                        {contact.value}
                      </a>
                    ) : (
                      <p className="text-sm text-foreground break-words">
                        {contact.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Section */}
        <motion.div 
          className="mt-12 pt-8 border-t border-border/30"
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span> {new Date().getFullYear()} {companyName}. All rights reserved.</span>
            </div>
            
          </div>
        </motion.div>
      </div>
      
      {/* Decorative Gradient Elements */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-pink-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
    </footer>
  );
};

export default ColorfulFooter;
