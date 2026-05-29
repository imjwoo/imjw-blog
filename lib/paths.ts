const githubPagesBasePath = "/imjw-blog";

export const basePath = process.env.GITHUB_PAGES === "true" ? githubPagesBasePath : "";

export function publicPath(path: string) {
  if (!path.startsWith("/") || !basePath || path.startsWith(`${basePath}/`)) {
    return path;
  }

  return `${basePath}${path}`;
}
