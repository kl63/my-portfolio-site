"use client"

import * as React from "react"
import { motion, useScroll, HTMLMotionProps, LayoutGroup } from "framer-motion"
import { Code, Database, Globe, Smartphone, Server, Palette, Calendar, MapPin, ExternalLink } from "lucide-react"
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
    if (percentage < 0.7) return "stroke-emerald-500"
    if (percentage < 0.9) return "stroke-amber-500"
    return "stroke-red-500"
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
    level: 90,
    maxLevel: 100,
    icon: <Code className="w-5 h-5" />,
    category: "Frontend",
  },
  {
    name: "Next.js",
    level: 85,
    maxLevel: 100,
    icon: <Code className="w-5 h-5" />,
    category: "Frontend",
  },
  {
    name: "TypeScript",
    level: 80,
    maxLevel: 100,
    icon: <Code className="w-5 h-5" />,
    category: "Language",
  },
  {
    name: "Tailwind CSS",
    level: 95,
    maxLevel: 100,
    icon: <Palette className="w-5 h-5" />,
    category: "Frontend",
  },
  {
    name: "Node.js",
    level: 85,
    maxLevel: 100,
    icon: <Server className="w-5 h-5" />,
    category: "Backend",
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
    level: 85,
    maxLevel: 100,
    icon: <Globe className="w-5 h-5" />,
    category: "Backend",
  },
  {
    name: "GraphQL",
    level: 70,
    maxLevel: 100,
    icon: <Database className="w-5 h-5" />,
    category: "Backend",
  },
  {
    name: "React Native",
    level: 65,
    maxLevel: 100,
    icon: <Smartphone className="w-5 h-5" />,
    category: "Mobile",
  },
  {
    name: "UI/UX Design",
    level: 80,
    maxLevel: 100,
    icon: <Palette className="w-5 h-5" />,
    category: "Design",
  },
]

// Experience data
const EXPERIENCE: Experience[] = [
  {
    company: "Innovative Tech Solutions",
    position: "Senior Frontend Developer",
    duration: "2022 - Present",
    location: "San Francisco, CA",
    description:
      "Lead the frontend development team in building modern, responsive web applications for enterprise clients.",
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux"],
    achievements: [
      "Led the development of a new design system that reduced development time by 30%",
      "Improved application performance by 40% through code optimization and lazy loading",
      "Mentored junior developers and established frontend best practices",
    ],
    url: "https://example.com/company1",
  },
  {
    company: "WebSphere Technologies",
    position: "Frontend Developer",
    duration: "2020 - 2022",
    location: "Austin, TX",
    description:
      "Developed and maintained multiple client-facing web applications with a focus on performance and accessibility.",
    technologies: ["React", "JavaScript", "SCSS", "REST API", "Jest"],
    achievements: [
      "Implemented accessibility improvements resulting in WCAG AA compliance",
      "Built reusable component library used across 10+ projects",
      "Reduced bundle size by 25% through code splitting and optimization",
    ],
    url: "https://example.com/company2",
  },
  {
    company: "Digital Solutions Inc.",
    position: "Web Developer",
    duration: "2018 - 2020",
    location: "Chicago, IL",
    description:
      "Worked on full-stack development for e-commerce and SaaS applications.",
    technologies: ["JavaScript", "Node.js", "Express", "MongoDB", "Bootstrap"],
    achievements: [
      "Developed custom e-commerce platform serving 10,000+ daily users",
      "Implemented payment gateway integrations with Stripe and PayPal",
      "Reduced server response time by 60% through database optimization",
    ],
    url: "https://example.com/company3",
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
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">Technical Skills</h3>
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
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6"
              >
                {filteredSkills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-card/80 transition-colors"
                  >
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      {skill.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium truncate">{skill.name}</p>
                        {isClient && (
                          <CircleProgress
                            value={skill.level}
                            maxValue={skill.maxLevel}
                            size={36}
                            strokeWidth={3}
                          />
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
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{experience.position}</h3>
                      {experience.url && (
                        <a
                          href={experience.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <span>{experience.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {experience.duration}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {experience.location}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {experience.description}
                  </p>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Key Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Achievements</h4>
                    <ul className="space-y-1">
                      {experience.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start space-x-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{achievement}</span>
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
