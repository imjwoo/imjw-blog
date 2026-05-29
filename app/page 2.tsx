import Image from "next/image";
import Link from "next/link";
import { Github, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const techGroups = [
  {
    title: "Cloud & DevOps",
    items: ["AWS", "Azure", "NCP", "Docker", "GitHub Actions", "Jenkins"],
  },
  {
    title: "Backend & Language",
    items: ["Java", "Python", "Spring Boot", "Shell Script"],
  },
  {
    title: "Monitoring",
    items: ["Prometheus", "Grafana", "CloudWatch"],
  },
];

function TechIcon({ name }: { name: string }) {
  const shortName =
    {
      "GitHub Actions": "GHA",
      "Spring Boot": "SB",
      "Shell Script": "SH",
      Prometheus: "PR",
      CloudWatch: "CW",
    }[name] ?? name.slice(0, 3).toUpperCase();

  return (
    <div className="group flex flex-col items-center gap-3" title={name} aria-label={name}>
      <div className="flex h-14 w-14 items-center justify-center text-foreground transition-colors group-hover:text-primary">
        <TechMark name={name} />
      </div>
      <span className="max-w-20 text-center text-[11px] leading-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
        {shortName}
      </span>
    </div>
  );
}

function TechMark({ name }: { name: string }) {
  const common = "fill-none stroke-current stroke-[2.5] stroke-linecap-round stroke-linejoin-round";

  if (name === "AWS" || name === "Azure" || name === "NCP" || name === "CloudWatch") {
    return (
      <svg viewBox="0 0 64 64" role="img" className="h-12 w-12" aria-hidden="true">
        <path className={common} d="M22 42h25a9 9 0 0 0 0-18 14 14 0 0 0-26-4 11 11 0 0 0 1 22Z" />
        <path className={common} d={name === "Azure" ? "M27 38 35 20l8 18H27Z" : "M24 35c5 4 12 4 18 0"} />
      </svg>
    );
  }

  if (name === "Docker") {
    return (
      <svg viewBox="0 0 64 64" role="img" className="h-12 w-12" aria-hidden="true">
        <path className={common} d="M18 35h28c-2 7-8 11-15 11-6 0-11-3-13-11Z" />
        <path className={common} d="M20 27h6v6h-6zM28 27h6v6h-6zM36 27h6v6h-6zM28 19h6v6h-6z" />
      </svg>
    );
  }

  if (name === "GitHub Actions" || name === "Jenkins") {
    return (
      <svg viewBox="0 0 64 64" role="img" className="h-12 w-12" aria-hidden="true">
        <circle className={common} cx="32" cy="32" r="18" />
        <path className={common} d={name === "Jenkins" ? "M25 28h14M25 36h14M32 20v24" : "M23 32h18M34 25l7 7-7 7"} />
      </svg>
    );
  }

  if (name === "Java") {
    return (
      <svg viewBox="0 0 64 64" role="img" className="h-12 w-12" aria-hidden="true">
        <path className={common} d="M28 17c8 5-7 8 1 13M37 15c9 6-8 10 0 16M22 39c7 3 17 3 24 0M20 46c9 5 25 5 30-2" />
      </svg>
    );
  }

  if (name === "Python") {
    return (
      <svg viewBox="0 0 64 64" role="img" className="h-12 w-12" aria-hidden="true">
        <path className={common} d="M24 18h16a6 6 0 0 1 6 6v8H30a6 6 0 0 0-6 6v8h-2a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6h2Z" />
        <path className={common} d="M40 46H24a6 6 0 0 1-6-6v-8h16a6 6 0 0 0 6-6v-8h2a6 6 0 0 1 6 6v16a6 6 0 0 1-6 6h-2Z" />
      </svg>
    );
  }

  if (name === "Spring Boot") {
    return (
      <svg viewBox="0 0 64 64" role="img" className="h-12 w-12" aria-hidden="true">
        <path className={common} d="M48 18c-18 0-30 10-30 24 17 4 30-3 30-24Z" />
        <path className={common} d="M20 43c8-9 15-13 26-18" />
      </svg>
    );
  }

  if (name === "Shell Script") {
    return (
      <svg viewBox="0 0 64 64" role="img" className="h-12 w-12" aria-hidden="true">
        <rect className={common} x="14" y="18" width="36" height="28" rx="4" />
        <path className={common} d="m22 28 6 5-6 5M32 38h10" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" role="img" className="h-12 w-12" aria-hidden="true">
      <circle className={common} cx="32" cy="32" r="18" />
      <path className={common} d="M32 20v12l8 8" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-28">
      <section className="flex min-h-[42vh] items-center justify-center pt-10 text-center">
        <h1 className="text-5xl font-semibold tracking-normal text-foreground sm:text-7xl">
          Engineer 임정우
        </h1>
      </section>

      <section className="space-y-14">
        {techGroups.map((group) => (
          <div key={group.title} className="space-y-8">
            <h2 className="text-center text-sm font-semibold text-muted-foreground">{group.title}</h2>
            <div
              className={cn(
                "mx-auto grid max-w-xl justify-items-center gap-x-8 gap-y-8",
                group.items.length >= 6 ? "grid-cols-3 sm:grid-cols-6" : "grid-cols-2 sm:grid-cols-4",
              )}
            >
              {group.items.map((item) => (
                <TechIcon key={item} name={item} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="pt-6">
        <Link href="/architecture" aria-label="Architecture 페이지로 이동" className="block">
          <Image
            src="/images/architecture-preview.png"
            alt="Architecture preview"
            width={1200}
            height={760}
            priority
            className="mx-auto h-auto w-full object-contain transition-opacity hover:opacity-80"
          />
        </Link>
      </section>

      <section className="flex items-center justify-center gap-10 py-20">
        <Link
          href="https://github.com/imjwoo"
          target="_blank"
          aria-label="GitHub"
          className="text-foreground transition-colors hover:text-primary"
        >
          <Github className="h-8 w-8" />
        </Link>
        <Link
          href="mailto:hello@example.com"
          aria-label="Email"
          className="text-foreground transition-colors hover:text-primary"
        >
          <Mail className="h-8 w-8" />
        </Link>
      </section>
    </div>
  );
}
