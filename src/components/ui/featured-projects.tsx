"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Image from 'next/image'
import { PROJECTS } from '@/components/ui/portfolio-projects'

interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
}

interface FeaturedProjectsProps {
  projects?: Project[]
  onViewAllClick?: () => void
  title?: string
  subtitle?: string
}

// Featured projects - curated selection from the main PROJECTS array
const featuredProjects: Project[] = [
  PROJECTS[0], // Personal Portfolio
  PROJECTS[4], // SmartContent Flow - LinkedIn AI Content Generator  
  PROJECTS[2], // Task Management App
  PROJECTS[1], // FastAPI Application
];

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  projects = featuredProjects,
  onViewAllClick,
  title = "Featured Projects",
  subtitle = "Explore some of my recent work"
}) => {
  // Reference for the scrollable container
  const containerRef = React.useRef<HTMLDivElement>(null)

  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="w-full py-0 px-0 md:px-0">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="space-y-2 max-w-[45ch]">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground md:text-lg">{subtitle}</p>
          </div>
          
          {/* Desktop View All Button */}
          <div className="hidden md:flex items-center mt-4 md:mt-0">
            <Link href="/portfolio">
              <Button 
                onClick={onViewAllClick}
                variant="outline"
                className="group"
              >
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Scroll Container with Cards */}
        <div className="relative">
          <div 
            ref={containerRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          >
            {projects.map((project, index) => (
              <Card 
                key={project.id}
                className="min-w-[200px] md:min-w-[220px] lg:min-w-[240px] flex-shrink-0 overflow-hidden snap-start border border-border/40 hover:border-primary/20 transition-all duration-300 group"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image 
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 400px) 100vw, 400px"
                    priority={index < 2} /* Prioritize loading first 2 images */
                    loading={index < 2 ? "eager" : "lazy"}
                  />

                </div>
                
                <CardContent className="p-5 bg-gradient-to-br from-background to-background/70">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech: string) => (
                      <Badge 
                        key={tech} 
                        variant="secondary"
                        className="text-xs bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    {project.liveUrl && (
                      <Button 
                        size="sm" 
                        className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => window.open(project.liveUrl, '_blank', 'noopener,noreferrer')}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        onClick={() => window.open(project.githubUrl, '_blank', 'noopener,noreferrer')}
                      >
                        <Github className="w-4 h-4" />
                        View Code
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Gradient Fade */}
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>

        {/* Mobile View All Button */}
        <div className="flex justify-center mt-8 md:hidden">
          <Link href="/portfolio">
            <Button 
              onClick={onViewAllClick}
              variant="outline"
              className="group"
            >
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default FeaturedProjects
