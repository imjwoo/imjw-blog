import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getProjectBySlug, projects } from "@/data/site";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return {
    title: `${project.title} | Projects`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-[760px]">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Projects
      </Link>

      <header className="mt-10">
        <p className="text-sm text-muted-foreground">{project.meta}</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-5 text-base leading-8 text-muted-foreground">{project.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
          <span>{project.period}</span>
          <Link
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline"
          >
            GitHub
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-lg border border-border bg-muted/20">
        <Image
          src={project.coverImage}
          alt={`${project.title} cover`}
          fill
          priority
          sizes="760px"
          className="object-cover"
        />
      </div>

      <div className="mt-16 space-y-16">
        <ProjectSection title="Role.">
          <SimpleList items={project.role} />
        </ProjectSection>

        <ProjectSection title="Architecture.">
          <SimpleList items={project.architecture} />
        </ProjectSection>

        <ProjectSection title="Gallery.">
          <div className="space-y-8">
            {project.images.map((image) => (
              <figure key={image.src}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border bg-white p-4 dark:bg-background">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="760px"
                    className="object-contain"
                  />
                </div>
                {image.caption ? (
                  <figcaption className="mt-3 text-sm text-muted-foreground">{image.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </ProjectSection>

        <ProjectSection title="Key Work.">
          <SimpleList items={project.keyWork} />
        </ProjectSection>

        <ProjectSection title="Troubleshooting.">
          <div className="space-y-8">
            {project.troubleshooting.map((item) => (
              <div key={item.problem} className="space-y-5 border-t border-border pt-6">
                <DetailBlock title="Problem" body={item.problem} />
                <DetailBlock title="Root Cause" body={item.rootCause} />
                <DetailBlock title="Action" body={item.action} />
              </div>
            ))}
          </div>
        </ProjectSection>

        <ProjectSection title="Stack.">
          <p className="text-sm leading-7 text-muted-foreground">{project.tech.join(" / ")}</p>
        </ProjectSection>

        <ProjectSection title="Learning.">
          <SimpleList items={project.learnings} />
        </ProjectSection>

        {project.nextSteps ? (
          <ProjectSection title="Next.">
            <SimpleList items={project.nextSteps} />
          </ProjectSection>
        ) : null}
      </div>
    </article>
  );
}

function ProjectSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SimpleList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function DetailBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{body}</p>
    </div>
  );
}
