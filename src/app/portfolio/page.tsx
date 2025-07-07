import React from 'react'
import DeveloperPortfolioHero from '@/components/ui/developer-portfolio-hero'
import PortfolioProjects from '@/components/ui/portfolio-projects'
import SkillsExperienceTimeline from '@/components/ui/skills-experience-timeline'

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background">
      <DeveloperPortfolioHero 
        name="Kevin Lin"
        title="Full Stack Developer"
        roles={["Web Developer", "UI Designer", "Problem Solver", "Tech Enthusiast"]}
        bio="I craft elegant solutions with modern technologies to build responsive and intuitive user experiences."
        imageUrl="/profile-placeholder.png"
        skills={["React", "TypeScript", "Next.js", "Node.js", "Tailwind CSS"]}
        githubUrl="https://github.com/kl63"
        linkedinUrl="https://linkedin.com/in/kevin-lin"
        emailAddress="hello@kevinlin.dev"
        resumeUrl="/resume.pdf"
      />
      <PortfolioProjects />
      <SkillsExperienceTimeline />
    </div>
  )
}
