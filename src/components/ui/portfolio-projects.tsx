"use client"

import * as React from "react";
import Image from "next/image";
import { motion, HTMLMotionProps, TargetAndTransition, VariantLabels } from "framer-motion"
import { ExternalLink, Github, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const TRANSITION_CONFIG = {
  duration: 0.7,
  ease: [0.4, 0.2, 0.2, 1],
  transition: "0.7s cubic-bezier(0.4, 0.2, 0.2, 1)",
} as const

const TRANSFORM_STYLES: React.CSSProperties = {
  transformStyle: "preserve-3d",
  perspective: "1000px",
  backfaceVisibility: "hidden",
}

interface FlipCardProps extends React.HTMLAttributes<HTMLDivElement> {
  flipDirection?: "horizontal" | "vertical"
  initialFlipped?: boolean
  onFlip?: (isFlipped: boolean) => void
  disabled?: boolean
}

interface FlipCardContextValue {
  isFlipped: boolean
  flipDirection: "horizontal" | "vertical"
  disabled?: boolean
}

const FlipCardContext = React.createContext<FlipCardContextValue | undefined>(undefined)

function useFlipCardContext() {
  const context = React.useContext(FlipCardContext)
  if (!context) {
    throw new Error("useFlipCardContext must be used within a FlipCard")
  }
  return context
}

const FlipCard = React.memo(
  React.forwardRef<HTMLDivElement, FlipCardProps>(
    (
      {
        className,
        flipDirection = "horizontal",
        initialFlipped = false,
        onFlip,
        disabled,
        ...props
      },
      ref
    ) => {
      const [isFlipped, setIsFlipped] = React.useState(initialFlipped)

      const handleFlip = React.useCallback(() => {
        if (disabled) return
        setIsFlipped((prev) => !prev)
        onFlip?.(!isFlipped)
      }, [disabled, isFlipped, onFlip])

      const contextValue = React.useMemo(
        () => ({
          isFlipped,
          flipDirection,
          disabled,
        }),
        [isFlipped, flipDirection, disabled]
      )

      return (
        <FlipCardContext.Provider value={contextValue}>
          <div
            ref={ref}
            className={cn("relative cursor-pointer", className)}
            onClick={handleFlip}
            {...props}
          />
        </FlipCardContext.Provider>
      )
    }
  )
)
FlipCard.displayName = "FlipCard"

interface FlipCardFrontProps extends Omit<HTMLMotionProps<"div">, "animate"> {
  // Adding properly typed animate prop for framer-motion
  animate?: TargetAndTransition | VariantLabels | boolean;
}

const FlipCardFront = React.memo(
  React.forwardRef<HTMLDivElement, FlipCardFrontProps>(({ className, style, ...props }, ref) => {
    const { isFlipped, flipDirection } = useFlipCardContext()

    const rotateValue = flipDirection === "horizontal" ? "rotateY(180deg)" : "rotateX(180deg)"

    return (
      <motion.div
        ref={ref}
        className={cn("absolute inset-0 w-full h-full", className)}
        style={{
          ...TRANSFORM_STYLES,
          ...style,
        }}
        animate={{
          transform: isFlipped ? rotateValue : "rotate(0deg)",
          opacity: isFlipped ? 0 : 1,
        }}
        transition={TRANSITION_CONFIG}
        {...props}
      />
    )
  })
)
FlipCardFront.displayName = "FlipCardFront"

interface FlipCardBackProps extends Omit<HTMLMotionProps<"div">, "animate" | "initial"> {
  // Adding properly typed animate and initial props for framer-motion
  animate?: TargetAndTransition | VariantLabels | boolean;
  initial?: TargetAndTransition | VariantLabels | boolean;
}

const FlipCardBack = React.memo(
  React.forwardRef<HTMLDivElement, FlipCardBackProps>(({ className, style, ...props }, ref) => {
    const { isFlipped, flipDirection } = useFlipCardContext()

    const rotateValue = flipDirection === "horizontal" ? "rotateY(180deg)" : "rotateX(180deg)"

    return (
      <motion.div
        ref={ref}
        className={cn("absolute inset-0 w-full h-full", className)}
        style={{
          ...TRANSFORM_STYLES,
          ...style,
        }}
        initial={{
          transform: rotateValue,
          opacity: 0,
        }}
        animate={{
          transform: isFlipped ? "rotate(0deg)" : rotateValue,
          opacity: isFlipped ? 1 : 0,
        }}
        transition={TRANSITION_CONFIG}
        {...props}
      />
    )
  })
)
FlipCardBack.displayName = "FlipCardBack"

// Project type
interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  category: string
  liveUrl?: string
  githubUrl?: string
}

/** 
 * @deprecated Will be used when implementing project modal detail view 
 * Keeping for documentation of planned feature
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

/** 
 * @deprecated Will be used when implementing individual project item component
 * Keeping for documentation of planned feature
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ProjectItemProps {
  project: Project;
  onClick?: () => void;
}

// Projects data will be defined below

interface PortfolioProjectsProps {
  className?: string
  title?: string
  subtitle?: string
}

function PortfolioProjects({
  className,
  title = "My Projects",
  subtitle = "Explore some of my recent work",
}: PortfolioProjectsProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    // Add a slight delay to trigger animations after initial render
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const filteredProjects = React.useMemo(() => {
    return selectedCategory === "All" 
      ? PROJECTS 
      : PROJECTS.filter(project => project.category === selectedCategory)
  }, [selectedCategory])

  return (
    <section className={cn("py-16", className)} id="projects">
      <div className="container px-4 md:px-6">
        <div className="space-y-2 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
          {subtitle && <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none">
            <Filter className="mr-1 h-3.5 w-3.5" />
            Filter:
          </div>
          {ALL_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <motion.div 
          initial={false} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1
              }}
              layout
              layoutId={project.id}
            >
              {project.image.endsWith(".mp4") ? (
                <video
                  src={project.image}
                  className="w-full h-48 object-cover"
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <div className="relative overflow-hidden">
                  <Image 
                    src={project.image} 
                    alt={project.title} 
                    width={600}
                    height={300}
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105" 
                    priority={index < 3} /* Prioritize loading first 3 images */
                    loading={index < 3 ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              
              {/* Card Content - Always Visible */}
              <div className="p-6">
                <h3 className="text-xl font-bold tracking-tight text-foreground mb-3">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {project.description}
                </p>
                
                {/* Technology Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
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
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default function PortfolioProjectsDemo() {
  return <PortfolioProjects />
}
export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Personal Portfolio",
    description: "A modern, responsive portfolio website showcasing projects and skills with interactive animations and a built-in AI playground.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GitHub Actions", "DigitalOcean"],
    category: "Web",
    liveUrl: "https://www.kevinlinportfolio.com/",
    githubUrl: "https://github.com/kl63/my-portfolio-site",
  },
  {
    id: "2",
    title: "FastAPI Application",
    description: "A high-performance REST API built with FastAPI, featuring PostgreSQL database integration and comprehensive API documentation.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    technologies: ["FastAPI", "PostgreSQL", "PgAdmin", "GitHub Actions", "DigitalOcean"],
    category: "Web",
    liveUrl: "https://fastapi.kevinlinportfolio.com/docs",
    githubUrl: "https://github.com/kl63/fastapi_app",
  },
  {
    id: "3",
    title: "Task Management App",
    description: "A full-stack .NET task management application with user authentication, CRUD operations, and responsive design.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800",
    technologies: ["ASP.NET Core", "Entity Framework", "SQL Server", "Bootstrap"],
    category: "App",
    liveUrl: "http://todo.kevinlinportfolio.com/",
    githubUrl: "https://github.com/kl63/DotNet-ToDo-App",
  },
  {
    id: "4",
    title: "GitHub Code Review MCP",
    description: "A Model Context Protocol server that integrates with Claude AI to provide intelligent GitHub code review capabilities and repository analysis.",
    image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800",
    technologies: ["Python", "MCP", "Claude AI", "GitHub API"],
    category: "Tool",
    githubUrl: "https://github.com/kl63/Mcp-Server-Demo",
  },
  {
    id: "5",
    title: "SmartContent Flow - LinkedIn AI Content Generator",
    description: "An AI-powered LinkedIn content creation platform with voice-to-text input, automated posting via Make.com, and intelligent content optimization.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "OpenAI API", "Shadcn UI", "Make.com API", "Web Speech API"],
    category: "Web",
    liveUrl: "https://smartcontent-flow.vercel.app/",
    githubUrl: "https://github.com/kl63/smartcontent-flow",
  },
  {
    id: "6",
    title: "RAG Demo with LangChain and OpenAI",
    description: "A Retrieval-Augmented Generation application demonstrating document processing, vector embeddings, and intelligent question-answering capabilities.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    technologies: ["LangChain", "OpenAI", "JavaScript", "Node.js", "Vector DB"],
    category: "AI",
    githubUrl: "https://github.com/kl63/RagTranslator",
  },
  {
    id: "7",
    title: "CalcMate - Swift Calculator",
    description: "A native iOS calculator app built with Swift, featuring a clean UI design, comprehensive testing suite, and CI/CD pipeline.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    technologies: ["Swift", "XCTest", "Figma", "GitHub Actions", "iOS"],
    category: "App",
    githubUrl: "https://github.com/kl63/CalcMate",
  },
]

// Get unique categories
const ALL_CATEGORIES = ["All", ...Array.from(new Set(PROJECTS.map((p: Project) => p.category)))]