const ncpBucketPath = process.env.NCP_BASE_PATH ?? "/imjw-blog";

export const basePath = process.env.NCP_DEPLOY === "true" ? ncpBucketPath : "";

export function publicPath(path: string) {
  if (!path.startsWith("/") || !basePath || path.startsWith(`${basePath}/`)) {
    return path;
  }

  return `${basePath}${path}`;
}
