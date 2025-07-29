import DeveloperPortfolioHero from "@/components/ui/developer-portfolio-hero"
import FeaturedProjects from "@/components/ui/featured-projects"
import SkillsShowcase from "@/components/ui/skills-showcase"
import AIPlaygroundPopup from "@/components/ui/ai-playground-popup"

export default function Home() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-hidden pt-16"> {/* pt-16 accounts for fixed navbar height */}
      {/* Hero Section */}
      <section className="w-full bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <DeveloperPortfolioHero 
            name="Kevin Lin"
            title="AI Full Stack Developer"
            roles={["AI Engineer", "Full Stack Developer","Software Engineer"]}
            bio="I craft intelligent applications that leverage AI/ML technologies to solve complex problems, delivering responsive and intuitive user experiences."
            skills={["React", "TypeScript", "Next.js", "Nodes.js", "Python", "LLM Integration"]}
            githubUrl="https://github.com/kl63"
            linkedinUrl="https://www.linkedin.com/in/linkevin19/"
            emailAddress="hello@kevinlin.dev"
            resumeUrl="/resume.pdf"
          />
        </div>
      </section>
      
      {/* AI Playground Popup */}
      <AIPlaygroundPopup delay={3000} />
      
      {/* Featured Projects Section */}
      <section id="projects" className="w-full bg-gradient-to-b from-background to-muted/30 mt-[-1px]">
        <div className="w-full">
          <FeaturedProjects 
            title="Featured Projects"
            subtitle="Explore some of my recent work and side projects"
          />
        </div>
      </section>
      
      {/* Skills Showcase Section */}
      <section id="skills" className="w-full bg-gradient-to-b from-muted/30 to-background mt-[-1px]">
        <div className="w-full">
          <SkillsShowcase 
            title="Skills & Expertise"
            subtitle="My technical knowledge and proficiency across various technologies"
          />
        </div>
      </section>
    </main>
  )
}
