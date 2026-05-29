import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repoName = "imjw-blog";

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  output: "export",
  basePath: isGitHubPages ? `/${repoName}` : "",
  assetPrefix: isGitHubPages ? `/${repoName}/` : "",
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    unoptimized: true,
  },
};

export default withMDX(nextConfig);
