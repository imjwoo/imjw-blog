import { BlogFilter } from "@/components/blog/blog-filter";

export default function BlogPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-xl font-semibold">Blog.</h1>
      <BlogFilter />
    </div>
  );
}
