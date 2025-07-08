"use client"

import { useState, useEffect } from 'react';
import { motion, easeInOut, easeOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Code2, 
  Database, 
  Server, 
  Smartphone, 
  Zap,
  Shield,
  ArrowRight,
  Palette,
  Cloud,
  GitBranch
} from "lucide-react";
import Link from "next/link";

interface Skill {
  name: string
  icon: React.ElementType
  proficiency: number
  color: string
}

interface SkillCategory {
  title: string
  skills: Skill[]
  gradient: string
}

interface SkillsShowcaseProps {
  categories?: SkillCategory[]
  autoProgress?: boolean
  progressInterval?: number
  title?: string
  subtitle?: string
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      mass: 1
    } 
  },
  hover: {
    y: -5,
    scale: 1.03,
    transition: { 
      duration: 0.2, 
      ease: easeInOut
    }
  }
}

const skillCardVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    } 
  },
  hover: {
    scale: 1.02,
    x: 5,
    transition: { 
      duration: 0.2, 
      ease: easeOut
    }
  }
}

const progressVariants = {
  hidden: { width: 0 },
  visible: (proficiency: number) => ({
    width: `${proficiency}%`,
    transition: {
      duration: 0.8,
      ease: easeOut,
      delay: 0.3
    }
  })
}

// Default categories and skills
const defaultCategories: SkillCategory[] = [
  {
    title: "Frontend",
    gradient: "from-blue-500 to-cyan-400",
    skills: [
      { name: "React", icon: Code2, proficiency: 92, color: "#61DAFB" },
      { name: "TypeScript", icon: Code2, proficiency: 88, color: "#3178C6" },
      { name: "Next.js", icon: Code2, proficiency: 85, color: "#000000" },
      { name: "CSS/Tailwind", icon: Palette, proficiency: 90, color: "#06B6D4" }
    ]
  },
  {
    title: "Backend",
    gradient: "from-violet-500 to-purple-400",
    skills: [
      { name: "Node.js", icon: Server, proficiency: 87, color: "#339933" },
      { name: "Python", icon: Code2, proficiency: 80, color: "#3776AB" },
      { name: "PostgreSQL", icon: Database, proficiency: 78, color: "#4169E1" },
      { name: "Express", icon: Server, proficiency: 85, color: "#000000" }
    ]
  },
  {
    title: "DevOps",
    gradient: "from-amber-500 to-orange-400",
    skills: [
      { name: "Docker", icon: Cloud, proficiency: 75, color: "#2496ED" },
      { name: "Git", icon: GitBranch, proficiency: 90, color: "#F05032" },
      { name: "CI/CD", icon: Zap, proficiency: 80, color: "#4A154B" },
      { name: "AWS", icon: Cloud, proficiency: 72, color: "#FF9900" }
    ]
  },
  {
    title: "Other",
    gradient: "from-emerald-500 to-green-400",
    skills: [
      { name: "UI/UX", icon: Palette, proficiency: 85, color: "#FF61F6" },
      { name: "Mobile Dev", icon: Smartphone, proficiency: 70, color: "#61DBFB" },
      { name: "GraphQL", icon: Database, proficiency: 78, color: "#E10098" },
      { name: "Testing", icon: Shield, proficiency: 82, color: "#CB3837" }
    ]
  }
]

// Category Card Component
const CategoryCard = ({ category, index }: { category: SkillCategory, index: number }) => {
  return (
    <motion.div
      className="bg-card/50 border border-border/50 hover:border-primary/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay: index * 0.1 }}
    >
      <div className={`h-2 w-full bg-gradient-to-r ${category.gradient}`} />
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-3 text-primary">{category.title}</h3>
        <div className="space-y-3">
          {category.skills.map((skill) => (
            <motion.div 
              key={skill.name}
              className="flex items-center space-x-3"
              variants={skillCardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <div 
                className="p-1.5 rounded-md" 
                style={{ backgroundColor: `${skill.color}25` }}
              >
                <skill.icon className="h-4 w-4" style={{ color: skill.color }} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className="text-xs text-muted-foreground">{skill.proficiency}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${category.gradient}`}
                    variants={progressVariants}
                    initial="hidden"
                    animate="visible"
                    custom={skill.proficiency}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const SkillsShowcase: React.FC<SkillsShowcaseProps> = ({
  categories = defaultCategories,
  autoProgress = false,
  progressInterval = 5000,
  title = "Technical Skills",
  subtitle = "My expertise and proficiency across technologies"
}) => {
  const [currentCategory, setCurrentCategory] = useState(0)
  const displayCategories = categories

  // Auto-progress through categories if enabled
  useEffect(() => {
    if (!autoProgress) return
    
    const interval = setInterval(() => {
      setCurrentCategory((prev) => (prev + 1) % displayCategories.length)
    }, progressInterval)
    
    return () => clearInterval(interval)
  }, [autoProgress, displayCategories.length, progressInterval])

  return (
    <section className="w-full py-0 px-0 md:px-0">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <motion.h2 
              className="text-3xl font-bold tracking-tight"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h2>
            <motion.p 
              className="text-muted-foreground md:text-lg max-w-[45ch]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {subtitle}
            </motion.p>
          </div>
          
          <Link href="/skills" className="mt-4 md:mt-0">
            <Button
              variant="outline"
              className="group"
            >
              View Full Skills
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        {/* Skills Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, staggerChildren: 0.1 }}
        >
          {displayCategories.map((category, index) => (
            <CategoryCard 
              key={category.title} 
              category={category} 
              index={index} 
            />
          ))}
        </motion.div>

        {/* Progress Indicator */}
        {autoProgress && (
          <motion.div 
            className="flex justify-center mt-12 space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {displayCategories.map((_, index) => (
              <motion.button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentCategory === index ? 'bg-primary' : 'bg-muted'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentCategory(index)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default SkillsShowcase
