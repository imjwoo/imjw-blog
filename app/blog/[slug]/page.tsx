import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BlogContentBlock } from "@/data/site";
import { posts } from "@/data/site";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

function BlogContent({ content }: { content: BlogContentBlock[] }) {
  return (
    <div className="prose-cloud mt-16 max-w-none">
      {content.map((block, index) => {
        if (block.type === "heading") {
          if (block.level === 1) {
            return <h1 key={`${block.id}-${index}`}>{block.text}</h1>;
          }
          if (block.level === 2) {
            return <h2 key={`${block.id}-${index}`}>{block.text}</h2>;
          }
          return <h3 key={`${block.id}-${index}`}>{block.text}</h3>;
        }

        if (block.type === "paragraph") {
          return <p key={`${block.text}-${index}`}>{block.text}</p>;
        }

        if (block.type === "quote") {
          return <blockquote key={`${block.text}-${index}`}>{block.text}</blockquote>;
        }

        if (block.type === "code") {
          return (
            <pre key={`${block.language}-${index}`}>
              <code>{block.code}</code>
            </pre>
          );
        }

        if (block.type === "bulletedList") {
          return (
            <ul key={`ul-${index}`}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "numberedList") {
          return (
            <ol key={`ol-${index}`}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          );
        }

        if (block.type === "image") {
          return (
            <figure key={`${block.src}-${index}`}>
              <Image
                src={block.src}
                alt={block.alt ?? ""}
                width={1200}
                height={760}
                className="h-auto w-full rounded-lg border border-border object-contain"
              />
              {block.alt ? <figcaption>{block.alt}</figcaption> : null}
            </figure>
          );
        }

        return <hr key={`hr-${index}`} />;
      })}
    </div>
  );
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-[760px]">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-base font-semibold text-foreground transition-colors hover:text-[#ea580c]"
        aria-label="Blog list"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Blog</span>
      </Link>

      <header className="mt-8">
        <p className="text-sm font-medium text-[#ea580c]">
          {post.category}
          {post.subcategory ? ` / ${post.subcategory}` : ""}
        </p>
        <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">{post.title}</h1>
        <p className="mt-5 text-sm text-muted-foreground">{formatDate(post.date)}</p>
        <p className="mt-6 text-base leading-8 text-muted-foreground">{post.excerpt}</p>
        <p className="mt-5 text-xs text-muted-foreground">{post.tags.join(" / ")}</p>
      </header>

      {post.content?.length ? (
        <BlogContent content={post.content} />
      ) : (
        <div className="prose-cloud mt-16 max-w-none">
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
      )}
    </article>
  );
}
