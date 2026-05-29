import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { publicPath } from "@/lib/paths";

type TimelineItem = {
  title: string;
  description: string;
  period: string;
  logo: string;
  logoAlt: string;
  activities?: string[];
};

type CertificationItem = {
  title: string;
  issuer: string;
  date: string;
  logo: string;
  logoAlt: string;
};

const education: TimelineItem[] = [
  {
    title: "INHA University",
    description: "Bachelor of Arts in Economics",
    period: "Education",
    logo: publicPath("/images/about/inha-university.svg"),
    logoAlt: "INHA University logo",
  },
];

const experience: TimelineItem[] = [
  {
    title: "AI Champion Advanced Course",
    description: "AI Education Assistant Instructor (Part-time)",
    period: "2025.05 ~ Present",
    logo: publicPath("/images/about/ai-champion.svg"),
    logoAlt: "AI Champion logo",
    activities: [
      "공무원·공공기관 종사자 대상 AI 실전 역량 강화 교육 보조",
      "RAG, MCP, AI Agent 실습 과정 멘토링 및 질의응답 지원",
      "바이브 코딩 실습 보조 및 워크플로우 설계 지원",
    ],
  },
  {
    title: "TOBE System",
    description: "Web Development Team, Assistant Manager",
    period: "2022.04 ~ 2024.09",
    logo: publicPath("/images/about/tobe-system.svg"),
    logoAlt: "TOBE System logo",
    activities: [
      "MES 웹 개발 및 운영 유지보수",
      "Spring Boot WAR 배포, HTTPS 구성, Cafe24 서버 운영",
      "현장 네트워크 인프라 구성 및 폐쇄망 온프레미스 배포 경험",
    ],
  },
];

const certifications: CertificationItem[] = [
  {
    title: "Linux Master Level 2",
    issuer: "KAIT",
    date: "2026.04",
    logo: publicPath("/images/about/linux-master.svg"),
    logoAlt: "Linux Master badge",
  },
  {
    title: "Network Administrator Level 2",
    issuer: "ICQA",
    date: "2026.03",
    logo: publicPath("/images/about/network-manager.svg"),
    logoAlt: "Network Administrator badge",
  },
];

const training: TimelineItem[] = [
  {
    title: "Gyeonggi Job Foundation",
    description: "Cloud Operator Course",
    period: "2025.07 ~ 2025.08",
    logo: publicPath("/images/about/gyeonggi-job-foundation.svg"),
    logoAlt: "Gyeonggi Job Foundation logo",
    activities: ["AWS 중심 인프라 설계 및 운영, ECS·RDS·ALB·VPC·Terraform 실습"],
  },
  {
    title: "Programmers",
    description: "Generative AI Backend Developer Course",
    period: "2025.01 ~ 2025.06",
    logo: publicPath("/images/about/programmers.svg"),
    logoAlt: "Programmers logo",
    activities: ["Spring Boot·React 풀스택, AI API 연동, CI/CD 자동화, AWS 인프라 구축"],
  },
  {
    title: "Ansan Green Computer Academy",
    description: "Java-based Developer Course",
    period: "2021.09 ~ 2022.04",
    logo: publicPath("/images/about/ansan-green-computer.svg"),
    logoAlt: "Ansan Green Computer Academy logo",
    activities: ["Java, Spring 기반 백엔드 개발 기초"],
  },
];

function LogoBox({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-white">
      <Image src={src} alt={alt} fill sizes="64px" className="object-contain p-2" />
    </div>
  );
}

function TimelineCard({ item }: { item: TimelineItem }) {
  return (
    <div className="flex items-start gap-4">
      <LogoBox src={item.logo} alt={item.logoAlt} />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-foreground">{item.title}</div>
        <div className="mt-1 text-xs text-muted-foreground">{item.description}</div>
        <div className="mt-2 text-xs text-muted-foreground">{item.period}</div>
        {item.activities ? (
          <ul className="mt-3 space-y-1">
            {item.activities.map((activity) => (
              <li key={activity} className="flex items-start text-xs leading-5 text-muted-foreground">
                <span className="mr-2 text-primary">•</span>
                <span>{activity}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  divider = true,
}: {
  title: string;
  children: React.ReactNode;
  divider?: boolean;
}) {
  return (
    <>
      <section>
        <h2 className="mb-4 text-xl font-semibold">{title}</h2>
        {children}
      </section>
      {divider ? <hr className="my-16 border-t border-border/60" /> : null}
    </>
  );
}

export default function AboutPage() {
  return (
    <section>
      <div className="mb-16 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-5">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
            <Image
              src={publicPath("/images/about/profile-placeholder.svg")}
              alt="Profile placeholder"
              fill
              sizes="80px"
              className="object-cover"
              priority
            />
          </div>
          <div className="min-w-0 pt-1">
            <h1 className="text-xl font-semibold">임정우</h1>
            <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
              개발과 운영 사이에서 문제를 작게 나누고, 배운 내용을 꾸준히 기록합니다.
            </p>
          </div>
        </div>
        <Link
          href={publicPath("/files/portfolio.pdf")}
          download
          className="group inline-flex shrink-0 items-center gap-3 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-foreground sm:mt-5"
        >
          <span>Portfolio</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:translate-y-[-1px]">
            <Download className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>

      <Section title="Education.">
        <div className="space-y-6">
          {education.map((item) => (
            <TimelineCard key={item.title} item={item} />
          ))}
        </div>
      </Section>

      <Section title="Experience.">
        <div className="space-y-8">
          {experience.map((item) => (
            <TimelineCard key={item.title} item={item} />
          ))}
        </div>
      </Section>

      <Section title="Certifications.">
        <div className="grid gap-4 sm:grid-cols-2">
          {certifications.map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/10">
              <div className="flex items-center gap-3">
                <LogoBox src={item.logo} alt={item.logoAlt} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{item.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{item.issuer}</div>
                  <div className="mt-2 text-xs text-muted-foreground">{item.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Training.">
        <div className="space-y-8">
          {training.map((item) => (
            <TimelineCard key={item.title} item={item} />
          ))}
        </div>
      </Section>
    </section>
  );
}
