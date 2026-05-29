import { ProjectCard } from "@/components/sections/project-card";
import { projects } from "@/data/site";

const sortedProjects = [...projects].sort((a, b) => b.date.localeCompare(a.date));

export default function ProjectsPage() {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Projects.</h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
