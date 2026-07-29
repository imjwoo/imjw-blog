import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteShell } from "@/components/layout/site-shell";

export const metadata: Metadata = {
  // og:image 를 절대 URL 로 내보내기 위해 필요합니다. 없으면 상대 경로로 나가서
  // 카카오톡·슬랙 같은 미리보기 크롤러가 이미지를 읽지 못합니다.
  metadataBase: new URL("https://imjwoo.com"),
  title: "임정우 · Cloud Engineer",
  description: "아키텍처와 배포 파이프라인을 개발자 관점에서 설계합니다.",
  openGraph: {
    type: "website",
    url: "https://imjwoo.com",
    siteName: "임정우 · Cloud Engineer",
    title: "임정우 · Cloud Engineer",
    description: "아키텍처와 배포 파이프라인을 개발자 관점에서 설계합니다.",
  },
  twitter: {
    card: "summary_large_image",
    title: "임정우 · Cloud Engineer",
    description: "아키텍처와 배포 파이프라인을 개발자 관점에서 설계합니다.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
