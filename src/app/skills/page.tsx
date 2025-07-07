import SkillsExperienceTimeline from "@/components/ui/skills-experience-timeline"

export const metadata = {
  title: "Skills & Experience | Kevin Lin",
  description: "My technical skills and professional experience",
}

export default function SkillsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Skills & Experience</h1>
      <p className="text-lg text-muted-foreground mb-12">
        My technical expertise and professional journey
      </p>
      <SkillsExperienceTimeline />
    </div>
  )
}
