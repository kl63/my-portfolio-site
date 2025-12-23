"use client"

import * as React from "react"
import { motion, useScroll, HTMLMotionProps, LayoutGroup } from "framer-motion"
import { Code, Database, Globe, Smartphone, Server, Palette, Calendar, MapPin, ExternalLink } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from "@/lib/utils"

// CircleProgress Component
interface CircleProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  maxValue: number
  size?: number
  strokeWidth?: number
  animationDuration?: number
  disableAnimation?: boolean
  className?: string
}

const CircleProgress = ({
  value,
  maxValue,
  size = 40,
  strokeWidth = 3,
  animationDuration = 300,
  disableAnimation = false,
  className,
  ...props
}: CircleProgressProps) => {
  const [animatedValue, setAnimatedValue] = React.useState(disableAnimation ? value : 0)
  const animatedValueRef = React.useRef(animatedValue)

  React.useEffect(() => {
    animatedValueRef.current = animatedValue
  }, [animatedValue])

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const fillPercentage = Math.min(animatedValue / maxValue, 1)
  const strokeDashoffset = circumference * (1 - fillPercentage)

  const defaultGetColor = (percentage: number) => {
    if (percentage >= 0.85) return "stroke-emerald-500" // Green for high (85%+)
    if (percentage >= 0.70) return "stroke-amber-500"  // Yellow for middle (70-84%)
    return "stroke-red-500"                            // Red for low (<70%)
  }

  const currentColor = defaultGetColor(fillPercentage)

  React.useEffect(() => {
    if (disableAnimation) {
      setAnimatedValue(value)
      return
    }

    if (value !== animatedValueRef.current) {
      const startValue = animatedValueRef.current
      const startTime = performance.now()
      const endValue = value

      const animateCircle = (time: number) => {
        const elapsedTime = time - startTime
        const progress = Math.min(elapsedTime / animationDuration, 1)
        const currentValue = startValue + progress * (endValue - startValue)
        
        setAnimatedValue(currentValue)
        
        if (progress < 1) {
          requestAnimationFrame(animateCircle)
        }
      }

      requestAnimationFrame(animateCircle)
    }
  }, [animationDuration, disableAnimation, value])
  
  return (
    <div
      className={cn("inline-flex items-center justify-center", className)}
      style={{
        width: size,
        height: size,
      }}
      {...props}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted-foreground/30"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={currentColor}
          style={{
            transition: disableAnimation ? undefined : "stroke-dashoffset 0.5s ease",
          }}
        />
      </svg>
      <span className="absolute text-xs font-medium">{Math.round(fillPercentage * 100)}%</span>
    </div>
  )
}

// Skill type definition
interface Skill {
  name: string
  level: number
  maxLevel: number
  icon: React.ReactNode
  category: string
}

// Experience type definition
interface Experience {
  company: string
  position: string
  duration: string
  location: string
  description: string
  technologies: string[]
  achievements: string[]
  url?: string
}

// Skills data
const SKILLS: Skill[] = [
  {
    name: "React",
    level: 95,
    maxLevel: 100,
    icon: <Code className="w-5 h-5" />,
    category: "Frontend",
  },
  {
    name: "Next.js",
    level: 95,
    maxLevel: 100,
    icon: <Code className="w-5 h-5" />,
    category: "Frontend",
  },
  {
    name: "Node.js",
    level: 95,
    maxLevel: 100,
    icon: <Server className="w-5 h-5" />,
    category: "Backend",
  },
  {
    name: "Git",
    level: 95,
    maxLevel: 100,
    icon: <Code className="w-5 h-5" />,
    category: "DevOps",
  },
  {
    name: "TypeScript",
    level: 90,
    maxLevel: 100,
    icon: <Code className="w-5 h-5" />,
    category: "Language",
  },
  {
    name: "Tailwind CSS",
    level: 90,
    maxLevel: 100,
    icon: <Palette className="w-5 h-5" />,
    category: "Frontend",
  },
  {
    name: "PostgreSQL",
    level: 90,
    maxLevel: 100,
    icon: <Database className="w-5 h-5" />,
    category: "Database",
  },
  {
    name: "FastAPI",
    level: 90,
    maxLevel: 100,
    icon: <Server className="w-5 h-5" />,
    category: "Backend",
  },
  {
    name: "Python",
    level: 90,
    maxLevel: 100,
    icon: <Code className="w-5 h-5" />,
    category: "Language",
  },
  {
    name: "Docker",
    level: 80,
    maxLevel: 100,
    icon: <Server className="w-5 h-5" />,
    category: "DevOps",
  },
  {
    name: "UI/UX Design",
    level: 80,
    maxLevel: 100,
    icon: <Palette className="w-5 h-5" />,
    category: "Design",
  },
  {
    name: "MongoDB",
    level: 75,
    maxLevel: 100,
    icon: <Database className="w-5 h-5" />,
    category: "Database",
  },
  {
    name: "REST API",
    level: 70,
    maxLevel: 100,
    icon: <Globe className="w-5 h-5" />,
    category: "Backend",
  },
  {
    name: "Swift",
    level: 65,
    maxLevel: 100,
    icon: <Smartphone className="w-5 h-5" />,
    category: "Mobile",
  },
]

// Experience data
const EXPERIENCE: Experience[] = [
  {
    company: "Theoforge AI Consulting",
    position: "Project Manager",
    duration: " Jan. 2025 - May. 2025",
    location: "Newark, NJ",
    description:
      "Lead the frontend development team in building modern, responsive web applications for enterprise clients.",
    technologies: ["React", "TypeScript", "Next.js", "FastAPI", "Python", "Docker", "PostgreSQL", "Neo4j", "LLM", "MCP", "PgAdmin", "Jira"],
    achievements: [
      "Led the development of a new design system that reduced development time by 30%",
      "Improved application performance by 40% through code optimization and lazy loading",
      "Mentored junior developers and established frontend best practices",
    ],
    url: "https://github.com/tomasGonz67/theoforge-be",
  },
  {
    company: "MetLife Group",
    position: "Product Development Engineering Intern",
    duration: "Jun. 2024 - Aug. 2024",
    location: "Bridgewaters, NJ",
    description:
      "Developed and maintained multiple client-facing web applications with a focus on performance and accessibility.",
    technologies: ["Microsoft Azure", "Maven", "MS Sharepoint", "React Native", "Jest"],
    achievements: [
      "Implemented accessibility improvements resulting in WCAG AA compliance",
      "Built reusable component library used across 10+ projects",
      "Reduced bundle size by 25% through code splitting and optimization",
    ],
    url: "https://",
  },

]

// Categories
const ALL_CATEGORIES = ["All", ...Array.from(new Set(SKILLS.map((skill) => skill.category)))]

// Container Scroll component
interface ContainerScrollProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  titleComponent?: React.ReactNode
  speed?: number
}

// This component is preserved for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ContainerScroll: React.FC<ContainerScrollProps> = ({
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  titleComponent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  speed = 0.5,
  ...rest
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  return (
    <motion.div ref={containerRef} className="relative z-10" {...rest}>
      {children}
    </motion.div>
  )
}

// Container Sticky component
interface ContainerStickyProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  contentClassName?: string
}

// This component is preserved for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ContainerSticky: React.FC<ContainerStickyProps> = ({
  children,
  contentClassName,
  ...rest
}) => {
  return (
    // @ts-expect-error - Known issue with framer-motion types
<div className="sticky-container relative h-[300vh]" {...rest}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className={cn("container mx-auto p-4", contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  )
}

// Timeline Card Component
interface TimelineCardProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number
  active: boolean
  year: string
  children: React.ReactNode
}

const TimelineCard: React.FC<TimelineCardProps> = ({ 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  index, 
  active, 
  year, 
  children, 
  className 
}) => {
  return (
    <motion.div
      className={cn(
        "timeline-card border relative rounded-lg p-6 transition-all",
        active
          ? "border-primary/50 bg-primary/5 shadow-lg"
          : "border-border bg-background/50",
        className
      )}
      animate={active ? { scale: 1, opacity: 1 } : { scale: 0.98, opacity: 0.7 }}
      transition={{ duration: 0.3 }}
      initial={false}
    >
      <div className="absolute top-4 right-4 text-sm font-semibold text-primary">
        {year}
      </div>
      {children}
    </motion.div>
  )
}

interface SkillsExperienceTimelineProps {
  className?: string
}

function SkillsExperienceTimeline({ className }: SkillsExperienceTimelineProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [activeExperience, setActiveExperience] = React.useState(0)
  const experienceRef = React.useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = React.useState(false)
  const shouldReduceMotion = useReducedMotion()

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const filteredSkills = React.useMemo(() => {
    return selectedCategory === "All"
      ? SKILLS
      : SKILLS.filter((skill) => skill.category === selectedCategory)
  }, [selectedCategory])

  const handleScroll = React.useCallback(() => {
    if (!experienceRef.current) return
    
    const { top, height } = experienceRef.current.getBoundingClientRect()
    const scrollPosition = window.innerHeight / 2
    const sectionPosition = top + height / 2
    
    // Calculate which experience should be active based on scroll position
    const scrollPercentage = Math.abs(scrollPosition - sectionPosition) / (window.innerHeight / 2)
    const experienceIndex = Math.min(
      Math.floor(scrollPercentage * EXPERIENCE.length),
      EXPERIENCE.length - 1
    )
    
    setActiveExperience(experienceIndex)
  }, [])

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <div className={cn("py-20", className)} id="skills">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="space-y-2 text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Skills & Experience</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            My professional skills and work history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          {/* Skills Section */}
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    className={cn(
                      "px-3 py-1 text-sm rounded-full transition-colors",
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <LayoutGroup>
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
              >
                {filteredSkills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    layout={!shouldReduceMotion}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-lg border bg-card hover:bg-card/80 transition-colors"
                  >
                    <div className="p-2 rounded-full bg-primary/10 text-primary flex-shrink-0">
                      {skill.icon}
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex justify-between items-center gap-2">
                        <p className="font-medium text-sm sm:text-base leading-tight">{skill.name}</p>
                        {isClient && (
                          <div className="flex-shrink-0">
                            <CircleProgress
                              value={skill.level}
                              maxValue={skill.maxLevel}
                              size={32}
                              strokeWidth={3}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </LayoutGroup>
          </div>

          {/* Experience Section */}
          <div ref={experienceRef} className="relative">
            <h3 className="text-2xl font-bold mb-8">Work Experience</h3>
            
            {EXPERIENCE.map((experience, index) => (
              <TimelineCard
                key={index}
                index={index}
                active={activeExperience === index}
                year={experience.duration.split(" - ")[0]}
                className="mb-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold leading-tight">{experience.position}</h3>
                      {experience.url && (
                        <a
                          href={experience.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 flex-shrink-0 mt-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="font-medium">{experience.company}</div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {experience.duration}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {experience.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {experience.description}
                  </p>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2 text-sm">Key Technologies</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {experience.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 bg-primary/10 text-primary text-xs sm:text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2 text-sm">Achievements</h4>
                    <ul className="space-y-1.5">
                      {experience.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-muted-foreground flex items-start space-x-2">
                          <span className="text-primary mt-1 flex-shrink-0">•</span>
                          <span className="leading-relaxed">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TimelineCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillsExperienceTimeline
