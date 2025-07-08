"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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

// Sample projects data for the featured projects component
const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with modern UI/UX, payment integration, and admin dashboard.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com'
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Collaborative task management tool with real-time updates, team collaboration, and progress tracking.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com'
  },
  {
    id: '3',
    title: 'AI Content Generator',
    description: 'AI-powered content generator with customizable templates, multilingual support, and export options.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    technologies: ['OpenAI API', 'React', 'Express', 'Redis'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com'
  },
  {
    id: '4',
    title: 'Portfolio Website',
    description: 'Modern portfolio website with animations, dark mode, and responsive design.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
    technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com'
  }
];

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  projects = sampleProjects,
  onViewAllClick,
  title = "Featured Projects",
  subtitle = "Explore some of my recent work"
}) => {
  // Reference for the scrollable container
  const containerRef = React.useRef<HTMLDivElement>(null)

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
                className="min-w-[300px] md:min-w-[400px] flex-shrink-0 overflow-hidden snap-start border border-border/40 hover:border-primary/20 transition-all duration-300 group"
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
                  <div className="absolute top-2 right-2 flex space-x-2">
                    {project.liveUrl && (
                      <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="icon" variant="secondary" className="h-8 w-8 opacity-80 hover:opacity-100">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    {project.githubUrl && (
                      <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="icon" variant="secondary" className="h-8 w-8 opacity-80 hover:opacity-100">
                          <Github className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-5 bg-gradient-to-br from-background to-background/70">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge 
                        key={tech} 
                        variant="secondary"
                        className="text-xs bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
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
