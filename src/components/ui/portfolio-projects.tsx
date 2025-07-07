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

// Hover Reveal Card
interface CardHoverRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
}

interface CardHoverRevealContextValue {
  isOpen: boolean
}

const CardHoverRevealContext = React.createContext<CardHoverRevealContextValue | undefined>(
  undefined
)

function useCardHoverRevealContext() {
  const context = React.useContext(CardHoverRevealContext)
  if (!context) {
    throw new Error("useCardHoverRevealContext must be used within a CardHoverReveal")
  }
  return context
}

function CardHoverReveal({
  children,
  className,
  defaultOpen = false,
  ...props
}: CardHoverRevealProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  
  const contextValue = React.useMemo(() => ({ isOpen }), [isOpen])
  
  return (
    <CardHoverRevealContext.Provider value={contextValue}>
      <div 
        className={cn("group relative overflow-hidden rounded-lg", className)} 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        {...props}
      >
        {children}
      </div>
    </CardHoverRevealContext.Provider>
  )
}

interface CardHoverRevealContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

function CardHoverRevealContent({ 
  children, 
  className,
  ...props
}: CardHoverRevealContentProps) {
  const { isOpen } = useCardHoverRevealContext()
  
  return (
    <motion.div 
      className={cn(
        "absolute inset-0 bg-black/80 backdrop-blur-sm p-6 flex flex-col",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isOpen ? 1 : 0,
        y: isOpen ? 0 : 20
      }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

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

// Projects data
const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Personal Portfolio",
    description: "A modern portfolio site built with Next.js and Tailwind CSS.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    category: "Web",
    liveUrl: "https://example.com/portfolio",
    githubUrl: "https://github.com/example/portfolio",
  },
  {
    id: "2",
    title: "E-Commerce Platform",
    description: "A full-featured online store with product management and payment processing.",
    image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=2070",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    category: "Web",
    liveUrl: "https://example.com/ecommerce",
    githubUrl: "https://github.com/example/ecommerce",
  },
  {
    id: "3",
    title: "Task Management App",
    description: "An intuitive task manager with drag-and-drop functionality and team collaboration features.",
    image: "https://images.unsplash.com/photo-1611224885990-2ae811571c55?q=80&w=2069",
    technologies: ["React", "Redux", "Firebase", "Material UI"],
    category: "App",
    liveUrl: "https://example.com/task-app",
    githubUrl: "https://github.com/example/task-app",
  },
  {
    id: "4",
    title: "Weather Dashboard",
    description: "Real-time weather forecasting with interactive maps and location-based services.",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=2070",
    technologies: ["Vue.js", "Weather API", "Leaflet", "D3.js"],
    category: "Web",
    liveUrl: "https://example.com/weather",
    githubUrl: "https://github.com/example/weather",
  },
  {
    id: "5",
    title: "Social Media Dashboard",
    description: "A social media management platform with analytics and scheduling capabilities.",
    image: "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?q=80&w=2070",
    technologies: ["Angular", "Express", "PostgreSQL", "Chart.js"],
    category: "Web",
    liveUrl: "https://example.com/social",
    githubUrl: "https://github.com/example/social",
  },
  {
    id: "6",
    title: "Fitness Tracker",
    description: "A mobile app for tracking workouts, nutrition, and fitness goals.",
    image: "https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=2072",
    technologies: ["React Native", "Redux", "Firebase", "Expo"],
    category: "App",
    liveUrl: "https://example.com/fitness",
    githubUrl: "https://github.com/example/fitness",
  },
]

// Get unique categories
const ALL_CATEGORIES = ["All", ...Array.from(new Set(PROJECTS.map((p) => p.category)))]

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
              className="h-[350px] overflow-hidden rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1
              }}
              // @ts-expect-error - Known type issue with framer-motion
              layout
              layoutId={project.id}
            >
              {project.image.endsWith(".mp4") ? (
                <video
                  src={project.image}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <CardHoverReveal>
                  <Image 
                    src={project.image} 
                    alt={project.title} 
                    width={600}
                    height={400}
                    className="h-64 w-full object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105" 
                  />
                  <CardHoverRevealContent>
                    <div className="flex flex-col justify-between h-full text-white">
                      <h3 className="text-xl font-semibold tracking-tight text-foreground">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-3 pt-2">
                        {project.liveUrl && (
                          <Button size="sm" className="gap-2">
                            <ExternalLink className="w-4 h-4" />
                            Live Demo
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button size="sm" variant="outline" className="gap-2">
                            <Github className="w-4 h-4" />
                            Code
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHoverRevealContent>
                </CardHoverReveal>
              )}
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
