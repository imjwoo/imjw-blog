import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { posts } from "@/data/site";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <Button asChild variant="ghost" className="mb-6 px-0">
        <Link href="/blog">Blog</Link>
      </Button>

      <header className="max-w-3xl">
        <p className="text-sm text-muted-foreground">{formatDate(post.date)} · {post.category} · {post.readingTime}</p>
        <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">{post.title}</h1>
        <p className="mt-6 text-base leading-8 text-muted-foreground">{post.excerpt}</p>
        <p className="mt-5 text-xs text-muted-foreground">{post.tags.join(" / ")}</p>
      </header>

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
        <div className="prose-cloud max-w-none">
          <h2 id="overview">개요</h2>
          <p>
            이 페이지는 MDX 기반 상세 글을 렌더링하기 위한 기본 구조입니다. 현재는 예시 데이터로 본문을
            구성했으며, 이후 content/blog의 MDX 파일을 읽어와 동일한 레이아웃에 연결할 수 있습니다.
          </p>
          <h2 id="flow">{post.toc[0]}</h2>
          <p>
            문제의 배경, 사용한 클라우드 리소스, 배포 흐름, 의사결정 기준을 먼저 설명합니다. 글의 목적은
            단순 사용법보다 운영 가능한 구조를 이해시키는 것입니다.
          </p>
          <h2 id="implementation">{post.toc[1] ?? "구현"}</h2>
          <p>
            설정 파일, 네트워크 구성, 빌드 파이프라인, 권한 범위를 작은 단위로 나누어 정리합니다. 코드는
            필요한 부분만 발췌하고 전체 흐름은 다이어그램과 체크리스트로 보완합니다.
          </p>
          <h2 id="checkpoint">{post.toc[2] ?? "체크포인트"}</h2>
          <ul>
            <li>정적 빌드로 배포 가능한지 확인합니다.</li>
            <li>환경변수와 권한 정보가 저장소에 노출되지 않도록 분리합니다.</li>
            <li>장애 발생 시 확인할 로그와 지표를 함께 기록합니다.</li>
          </ul>
          <h2 id="retrospective">회고</h2>
          <p>
            최종 글에서는 실제 적용 결과, 개선 여지, 다음 실험 항목을 정리합니다. 이 영역은 포트폴리오의
            기술적 사고 과정을 보여주는 핵심 공간입니다.
          </p>
        </div>

        <aside className="order-first border-b pb-6 lg:sticky lg:top-24 lg:order-none lg:border-b-0 lg:pb-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Contents</p>
          <nav className="mt-4 grid gap-3 text-sm text-muted-foreground">
            {["개요", ...post.toc, "회고"].slice(0, 6).map((item, index) => (
              <a key={`${item}-${index}`} href={`#${index === 0 ? "overview" : index === 1 ? "flow" : index === 2 ? "implementation" : index === 3 ? "checkpoint" : "retrospective"}`} className="hover:text-foreground">
                {item}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </article>
  );
}
