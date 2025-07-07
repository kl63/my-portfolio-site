import PortfolioProjects from "@/components/ui/portfolio-projects"

export const metadata = {
  title: "Projects | Kevin Lin",
  description: "Explore my latest projects and development work",
}

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h1>
      <p className="text-lg text-muted-foreground mb-12">
        Explore some of my recent work and development projects
      </p>
      <PortfolioProjects />
    </div>
  )
}
