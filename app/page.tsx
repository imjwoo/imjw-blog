import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Mail } from "lucide-react";
import { publicPath } from "@/lib/paths";

type TechItem = {
  name: string;
  image: string;
  iconClassName?: string;
};

const techGroups: Array<{ title: string; items: TechItem[] }> = [
  {
    title: "Cloud & DevOps",
    items: [
      { name: "AWS", image: publicPath("/images/tech/aws.svg"), iconClassName: "h-12 w-12" },
      { name: "Azure", image: publicPath("/images/tech/azure.svg") },
      { name: "NCP", image: publicPath("/images/tech/ncp.svg"), iconClassName: "h-[58px] w-[58px]" },
      { name: "Docker", image: publicPath("/images/tech/docker.svg") },
      { name: "GitHub Actions", image: publicPath("/images/tech/github-actions.svg") },
      { name: "Jenkins", image: publicPath("/images/tech/jenkins.svg") },
    ],
  },
  {
    title: "Backend & Language",
    items: [
      { name: "Java", image: publicPath("/images/tech/java.svg"), iconClassName: "h-[46px] w-[46px]" },
      { name: "Python", image: publicPath("/images/tech/python.svg") },
      { name: "Spring Boot", image: publicPath("/images/tech/spring-boot.svg") },
      { name: "Shell Script", image: publicPath("/images/tech/shell.svg"), iconClassName: "h-16 w-16" },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { name: "Prometheus", image: publicPath("/images/tech/prometheus.svg") },
      { name: "Grafana", image: publicPath("/images/tech/grafana.svg") },
      { name: "CloudWatch", image: publicPath("/images/tech/cloudwatch.svg"), iconClassName: "h-16 w-16" },
    ],
  },
];

function TechIcon({ item }: { item: TechItem }) {
  return (
    <div className="group relative flex flex-col items-center">
      <div
        className="flex h-[72px] w-[72px] items-center justify-center rounded-lg border border-border bg-background transition-colors group-hover:border-muted-foreground"
        title={item.name}
        aria-label={item.name}
      >
        <Image
          src={item.image}
          alt=""
          width={64}
          height={64}
          className={`${item.iconClassName ?? "h-12 w-12"} object-contain`}
        />
      </div>
      <span className="pointer-events-none absolute top-full mt-2 whitespace-nowrap text-center text-[11px] leading-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
        {item.name}
      </span>
    </div>
  );
}

function VisualHero() {
  return (
    <section aria-label="Visual hero">
      <Image
        src={publicPath("/images/hero-visual.jpg")}
        alt=""
        width={1024}
        height={314}
        priority
        className="h-auto w-full object-contain"
      />
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-24">
      <VisualHero />

      <section>
        <h2 className="text-xl font-semibold">Tech Stack.</h2>
        <div className="mt-2 space-y-10">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Cloud & DevOps</h3>
            <div className="mt-5 flex flex-wrap gap-6">
              {techGroups[0].items.map((item) => (
                <TechIcon key={item.name} item={item} />
              ))}
            </div>
          </div>

          <div className="grid gap-x-16 gap-y-10 sm:grid-cols-2">
            {techGroups.slice(1).map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-medium text-muted-foreground">{group.title}</h3>
                <div className="mt-5 flex flex-wrap gap-6">
                  {group.items.map((item) => (
                    <TechIcon key={item.name} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Architecture.</h2>
        <p className="mt-2 text-base leading-7 text-muted-foreground">
          From writing in Notion to publishing on the web — fully automated.
        </p>
        <Link
          href="/architecture"
          aria-label="Architecture 페이지로 이동"
          className="mt-10 block rounded-xl border border-border bg-background p-5 transition-colors hover:border-muted-foreground"
        >
          <Image
            src={publicPath("/images/architecture-preview.png")}
            alt="Architecture preview"
            width={1200}
            height={760}
            priority
            className="mx-auto h-auto w-full object-contain transition-opacity hover:opacity-80"
          />
        </Link>
      </section>

      <section className="pb-16">
        <h2 className="text-xl font-semibold">Contact.</h2>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <Link
            href="https://github.com/imjwoo"
            target="_blank"
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/10"
          >
            <Image src={publicPath("/images/GitHub.svg")} alt="" width={28} height={28} className="h-7 w-7 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">GitHub</span>
              <span className="mt-1 block truncate text-sm text-muted-foreground">github.com/imjwoo</span>
            </span>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
          <Link
            href="mailto:dlawjddn15@gmail.com"
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/10"
          >
            <Mail className="h-7 w-7 shrink-0 text-foreground" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">Email</span>
              <span className="mt-1 block truncate text-sm text-muted-foreground">dlawjddn15@gmail.com</span>
            </span>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        </div>
      </section>
    </div>
  );
}
