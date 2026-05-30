import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const isNcpDeploy = process.env.NCP_DEPLOY === "true";
const ncpBucketPath = process.env.NCP_BASE_PATH ?? "/imjw-blog";
const ncpObjectStorageUrl =
  process.env.NCP_ASSET_PREFIX ?? "https://kr.object.ncloudstorage.com/imjw-blog";

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  output: "export",
  basePath: isNcpDeploy ? ncpBucketPath : "",
  assetPrefix: isNcpDeploy ? ncpObjectStorageUrl : "",
  trailingSlash: isNcpDeploy,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    unoptimized: true,
  },
};

export default withMDX(nextConfig);
