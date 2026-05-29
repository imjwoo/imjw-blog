import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/site";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <article className="overflow-hidden rounded-lg border border-border bg-card transition-colors hover:bg-accent/10 dark:hover:bg-accent/60">
        <div className="relative aspect-[16/10] w-full bg-muted/20">
          <Image
            src={project.coverImage}
            alt={`${project.title} preview`}
            fill
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <h2 className="px-4 py-4 text-base font-semibold leading-snug transition-colors group-hover:text-muted-foreground">
          {project.title}
        </h2>
      </article>
    </Link>
  );
}
