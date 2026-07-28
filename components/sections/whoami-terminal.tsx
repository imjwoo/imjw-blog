import Link from "next/link";
import { projects } from "@/data/site";

type SessionBlock =
  | { type: "command"; text: string }
  | { type: "output"; lines: string[] }
  | { type: "projects" };

const session: SessionBlock[] = [
  { type: "command", text: "whoami" },
  { type: "output", lines: ["임정우 · Cloud Engineer"] },
  { type: "command", text: "cat profile.txt" },
  {
    type: "output",
    lines: [
      "아키텍처와 배포 파이프라인을 개발자 관점에서 설계합니다.",
      "반복되는 운영 작업은 자동화하고, 사람이 개입하는 지점을 줄입니다.",
      "인프라는 코드로 관리해 재현 가능한 환경을 만듭니다.",
    ],
  },
  { type: "command", text: "ls ./projects" },
  { type: "projects" },
];

export function WhoamiTerminal() {
  return (
    <section aria-label="자기소개" className="terminal-surface rounded-xl">
      <div className="flex items-center gap-2 border-b bg-muted px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="ml-2 text-[11px] text-muted-foreground">imjw@portfolio — zsh</span>
      </div>

      <div className="space-y-5 px-5 py-6 sm:px-7 sm:py-8">
        {session.map((block) => {
          if (block.type === "command") {
            return (
              <p key={block.text} className="text-[13px] sm:text-sm">
                <span className="select-none text-primary">$</span> {block.text}
              </p>
            );
          }

          // 프로젝트 목록은 data/site.ts 에서 읽어옵니다. 프로젝트를 추가하면 여기에도 자동으로 나옵니다.
          if (block.type === "projects") {
            return (
              <div key="projects" className="flex flex-wrap gap-x-6 gap-y-2">
                {projects.map((project) => (
                  <Link
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    className="text-[13px] text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline sm:text-sm"
                  >
                    {project.slug}/
                  </Link>
                ))}
              </div>
            );
          }

          return (
            <div key={block.lines[0]} className="space-y-1">
              {block.lines.map((line) => (
                <p key={line} className="text-[13px] leading-7 text-muted-foreground sm:text-sm">
                  {line}
                </p>
              ))}
            </div>
          );
        })}

        <p className="flex items-center gap-2 text-[13px] sm:text-sm">
          <span className="select-none text-primary">$</span>
          <span
            aria-hidden="true"
            className="inline-block h-4 w-[7px] animate-pulse bg-foreground motion-reduce:animate-none"
          />
        </p>
      </div>
    </section>
  );
}
