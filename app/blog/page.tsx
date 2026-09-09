import { TodayVisitors } from "@/components/analytics/blog-analytics";
import { BlogFilter } from "@/components/blog/blog-filter";

export default function BlogPage() {
  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-xl font-semibold">Blog.</h1>
        <TodayVisitors />
      </div>
      <BlogFilter />
    </div>
  );
}
