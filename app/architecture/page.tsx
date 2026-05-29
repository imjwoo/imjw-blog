import { PageHeader } from "@/components/sections/page-header";
import { architectureSteps, principles } from "@/data/site";

export default function ArchitecturePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Architecture"
        title="글을 쓰고, 변환하고, 정적으로 배포하는 흐름"
        description="이번 단계에서는 실제 자동화 없이, 향후 Notion과 GitHub Actions, Velog, NCP 배포를 연결할 수 있는 구조만 차분히 보여줍니다."
      />

      <section className="border-t pt-12">
        <h2 className="text-xl font-semibold">Publishing Flow</h2>
        <div className="mt-10">
          {architectureSteps.map((step, index) => (
            <div key={step.title} className="grid gap-4 border-b py-7 sm:grid-cols-[48px_220px_1fr]">
              <p className="text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="text-sm font-semibold">{step.title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24 grid gap-12 border-t pt-12 lg:grid-cols-[0.8fr_1.2fr]">
        <h2 className="text-xl font-semibold">설계 기준</h2>
        <div className="space-y-8">
          {principles.map((item) => (
            <div key={item.title}>
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24 grid gap-12 border-t pt-12 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">현재 구현 범위</h2>
          <p className="mt-5 text-sm leading-8 text-muted-foreground">
            Next.js App Router / TypeScript / Tailwind CSS / shadcn/ui 기반 컴포넌트 / MDX 폴더 구조 / Static Export
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">다음 단계 후보</h2>
          <p className="mt-5 text-sm leading-8 text-muted-foreground">
            Notion API / GitHub Actions / Markdown 변환 / Velog 발행 / NCP Object Storage / Global CDN
          </p>
        </div>
      </section>
    </div>
  );
}
