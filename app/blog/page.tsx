import { BlogFilter } from "@/components/blog/blog-filter";
import { PageHeader } from "@/components/sections/page-header";

export default function BlogPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Blog"
        title="클라우드, DevOps, CS를 기록하는 기술 블로그"
        description="MDX 기반 콘텐츠 구조를 전제로 카테고리별 글 목록과 검색 UI의 기본 골격을 구성했습니다."
      />
      <BlogFilter />
    </div>
  );
}
