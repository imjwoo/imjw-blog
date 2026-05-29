import {
  BookOpen,
  Boxes,
  Cloud,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Home,
  Info,
  Layers3,
  Network,
  Server,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { publicPath } from "@/lib/paths";

export const navItems = [
  { title: "Home", href: "/", icon: Home },
  { title: "About", href: "/about", icon: Info },
  { title: "Projects", href: "/projects", icon: Boxes },
  { title: "Blog", href: "/blog", icon: BookOpen },
  { title: "Architecture", href: "/architecture", icon: Layers3 },
];

export const categories = [
  "All",
  "CS",
  "Language",
  "AI",
  "Cloud",
  "DevOps",
  "Troubleshooting",
] as const;

export const techStacks = [
  { label: "Cloud", items: ["AWS", "NCP", "Azure", "VPC", "ECS", "RDS", "ALB"], icon: Cloud },
  { label: "Container", items: ["Docker", "ECR", "Fargate"], icon: Boxes },
  { label: "IaC", items: ["Terraform", "State 관리", "Module 설계"], icon: Layers3 },
  { label: "CI/CD", items: ["GitHub Actions", "Jenkins", "CodePipeline"], icon: GitBranch },
  { label: "Backend", items: ["Java", "Spring Boot", "Python", "Shell Script"], icon: Code2 },
  { label: "Database", items: ["MySQL", "MS-SQL", "Aiven"], icon: Database },
  { label: "Monitoring", items: ["CloudWatch", "Prometheus", "Grafana"], icon: Cpu },
  { label: "Network", items: ["Subnet", "Security Group", "NAT Gateway", "Transit Gateway"], icon: Network },
];

export type ProjectImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type ProjectTroubleshooting = {
  problem: string;
  rootCause: string;
  action: string;
};

export type Project = {
  slug: string;
  title: string;
  date: string;
  period: string;
  meta: string;
  summary: string;
  coverImage: string;
  github: string;
  tech: string[];
  role: string[];
  architecture: string[];
  images: ProjectImage[];
  keyWork: string[];
  troubleshooting: ProjectTroubleshooting[];
  learnings: string[];
  nextSteps?: string[];
};

export const projects: Project[] = [
  {
    slug: "spring-petclinic-msa",
    title: "Petclinic MSA",
    date: "2025-09",
    period: "2025.09 ~ 진행중",
    meta: "Spring PetClinic 오픈소스 기반 개인 프로젝트",
    summary:
      "Spring PetClinic 오픈소스를 MSA 구조로 전환하고, AWS 기반 3-tier 인프라와 배포 자동화 흐름을 설계하는 프로젝트입니다.",
    coverImage: publicPath("/images/projects/petclinic-cover.svg"),
    github: "https://github.com/imjwoo/spring-petclinic-microservices",
    tech: [
      "Spring Boot",
      "Docker",
      "AWS ECS",
      "ECR",
      "ALB",
      "Auto Scaling",
      "Terraform",
      "GitHub Actions",
      "Prometheus",
      "Grafana",
    ],
    role: [
      "Spring PetClinic 구조 분석 및 서비스 단위 분리",
      "ECS Fargate 기반 컨테이너 실행 환경 설계",
      "Blue-Green, Canary 배포 전략 실험",
      "Terraform 기반 인프라 코드화",
    ],
    architecture: [
      "VPC를 Public/Private Subnet으로 분리하고 ALB를 통해 서비스 트래픽을 진입시킵니다.",
      "각 서비스 컨테이너는 ECS Fargate에서 실행되며, 배포 이미지는 ECR에 저장합니다.",
      "GitHub Actions에서 이미지 빌드와 ECS 서비스 업데이트를 자동화하는 구조를 목표로 합니다.",
      "Prometheus와 Grafana를 붙여 서비스 상태와 배포 이후 지표를 관찰할 수 있도록 확장할 예정입니다.",
    ],
    images: [
      {
        src: publicPath("/images/projects/petclinic-architecture.svg"),
        alt: "Petclinic MSA architecture placeholder",
        caption: "Architecture draft",
      },
      {
        src: publicPath("/images/projects/petclinic-deployment.svg"),
        alt: "Petclinic deployment flow placeholder",
        caption: "Deployment flow",
      },
    ],
    keyWork: [
      "Spring PetClinic 오픈소스를 MSA 구조로 전환",
      "GitHub Actions를 활용한 Blue-Green 및 Canary 배포 흐름 구현",
      "AWS 3-tier 아키텍처 구성 및 Auto Scaling 적용",
      "ECR/ECS 기반 컨테이너 오케스트레이션 구성",
      "Terraform IaC로 인프라 전체 코드화",
      "Prometheus + Grafana 모니터링 구성 예정",
      "Azure, NCP 동일 환경 배포를 고려한 멀티 클라우드 확장 설계",
    ],
    troubleshooting: [
      {
        problem:
          "ECS Fargate 배포 시 태스크가 Target Group Health Check에서 Unhealthy 상태를 반복하며 롤백되었습니다.",
        rootCause:
          "ALB에서 컨테이너 포트 8080으로 접근하는 보안 그룹 인바운드 규칙이 누락되었고, Spring Security가 /actuator/health 요청을 401로 차단했습니다.",
        action:
          "ALB 보안 그룹에서 컨테이너 포트 접근을 허용하고, health check URL은 permitAll()로 예외 처리해 무중단 배포 파이프라인을 안정화했습니다.",
      },
    ],
    learnings: [
      "배포 자동화는 애플리케이션 설정, 네트워크, 헬스 체크 정책이 함께 맞아야 안정적으로 동작합니다.",
      "MSA 전환은 서비스 분리 자체보다 운영 경계와 관찰 지표를 함께 설계하는 것이 중요했습니다.",
    ],
    nextSteps: [
      "모니터링 대시보드 구성",
      "Canary 배포 단계별 검증 기준 정리",
      "NCP 또는 Azure 환경으로 동일 구조 배포 실험",
    ],
  },
  {
    slug: "kickytime",
    title: "Kickytime",
    date: "2025-08",
    period: "2025.07 ~ 2025.08",
    meta: "경기도 일자리재단 클라우드 운영자 과정 팀 프로젝트",
    summary:
      "풋살 매칭 플랫폼을 AWS 3-tier 아키텍처 위에 배포하고, ECS Fargate와 GitHub Actions 기반 CI/CD를 구성한 팀 프로젝트입니다.",
    coverImage: publicPath("/images/projects/kickytime-cover.svg"),
    github: "https://github.com/imjwoo/next-kickytime-server",
    tech: [
      "AWS ECS",
      "ECR",
      "ALB",
      "RDS",
      "VPC",
      "NAT Gateway",
      "Terraform",
      "GitHub Actions",
      "Docker",
      "Spring Boot",
      "MySQL",
    ],
    role: [
      "AWS 3-tier 아키텍처 설계 및 구축",
      "ECS Fargate 기반 컨테이너 배포",
      "GitHub Actions CI/CD 파이프라인 구성",
      "RDS, ALB, Target Group, 보안 그룹 구성",
    ],
    architecture: [
      "VPC 내부를 Public Subnet과 Private Subnet으로 분리했습니다.",
      "ALB는 Public Subnet에 배치하고, 애플리케이션 컨테이너와 RDS는 Private 영역 중심으로 구성했습니다.",
      "GitHub Actions에서 Docker 이미지를 빌드한 뒤 ECR에 푸시하고 ECS 서비스를 업데이트하는 흐름을 구성했습니다.",
      "Terraform으로 반복 가능한 인프라 구성을 목표로 IaC 구조를 정리했습니다.",
    ],
    images: [
      {
        src: publicPath("/images/architecture-preview.png"),
        alt: "Kickytime AWS architecture",
        caption: "AWS 3-tier architecture",
      },
      {
        src: publicPath("/images/projects/kickytime-deployment.svg"),
        alt: "Kickytime deployment flow placeholder",
        caption: "CI/CD deployment flow",
      },
    ],
    keyWork: [
      "AWS 3-tier 아키텍처 설계 및 구축",
      "VPC, Public/Private Subnet 분리",
      "ECS Fargate 기반 컨테이너 배포 및 서비스 운영",
      "ECR 이미지 빌드 후 ECS 자동 배포",
      "ALB와 Target Group 구성으로 트래픽 분산 처리",
      "RDS MySQL 프라이빗 서브넷 배포 및 보안 그룹 설정",
      "Transit Gateway를 활용한 VPC 간 통신 설계 시도",
    ],
    troubleshooting: [
      {
        problem:
          "관리형 DB(Aiven) 연동 시 데이터베이스에 한국 시간보다 9시간 느린 UTC 기준으로 데이터가 저장되었습니다.",
        rootCause:
          "클라우드 데이터베이스 전역 설정과 Docker 컨테이너 내부 JVM 타임존이 기본값 UTC로 유지되어 발생한 문제였습니다.",
        action:
          "Aiven 전역 설정을 변경하고 Dockerfile에 TZ=Asia/Seoul 환경변수를 주입해 인프라 전반의 타임존 기준을 KST로 맞췄습니다.",
      },
    ],
    learnings: [
      "클라우드 배포에서 시간 기준은 애플리케이션, 컨테이너, DB 설정을 함께 맞춰야 합니다.",
      "팀 프로젝트에서도 인프라 변경 사항은 Terraform처럼 재현 가능한 형태로 남겨야 운영 리스크가 줄어듭니다.",
    ],
  },
  {
    slug: "mentoss",
    title: "Mentoss",
    date: "2025-06",
    period: "2025",
    meta: "멘토링 기반 학습 플랫폼",
    summary:
      "멘토와 학습자를 연결하는 서비스로, 강의 탐색, 질문, 메시지, 알림, 프로필 등 학습 커뮤니티 흐름을 다루는 프로젝트입니다.",
    coverImage: publicPath("/images/projects/mentoss-cover.svg"),
    github: "https://github.com/1000hyehyang/mentos-frontend",
    tech: ["React", "Vite", "JavaScript", "MUI", "Axios", "Zustand", "Tiptap", "Spring Boot"],
    role: [
      "프론트엔드 라우팅 및 화면 구조 설계",
      "강의, 질문, 메시지, 프로필 중심 사용자 흐름 구성",
      "백엔드 API 연동 환경 분리",
      "에디터 기반 콘텐츠 작성 화면 구성",
    ],
    architecture: [
      "React/Vite 기반 프론트엔드에서 페이지별 라우팅을 구성했습니다.",
      "로컬 Spring Boot 서버와 배포 서버 API를 환경별로 분리해 연결할 수 있도록 구성했습니다.",
      "강의 상세, 검색, 질문, 메시지, 마이페이지 등 기능 단위로 화면을 분리했습니다.",
    ],
    images: [
      {
        src: publicPath("/images/projects/mentoss-architecture.png"),
        alt: "Mentoss architecture",
        caption: "Service architecture",
      },
      {
        src: publicPath("/images/projects/mentoss-logo.svg"),
        alt: "Mentoss logo",
        caption: "Project identity",
      },
    ],
    keyWork: [
      "React Router 기반 주요 페이지 라우팅 구성",
      "강의 등록, 강의 상세, 강의 검색 화면 구성",
      "질문, 메시지, 알림, 프로필 관련 화면 흐름 정리",
      "Tiptap 기반 텍스트 에디터 적용",
      "Axios 기반 API 클라이언트와 환경별 서버 URL 분리",
    ],
    troubleshooting: [
      {
        problem:
          "로컬 개발 서버와 배포 서버 주소가 다르기 때문에 API 요청 주소가 환경마다 달라지는 문제가 있었습니다.",
        rootCause:
          "프론트엔드 코드에서 API base URL을 고정하면 로컬 테스트와 배포 검증을 반복할 때 설정 변경이 필요했습니다.",
        action:
          "환경 변수 기반으로 API URL을 분리해 로컬과 배포 환경을 전환할 수 있는 구조로 정리했습니다.",
      },
    ],
    learnings: [
      "기능이 많은 서비스일수록 라우팅, 상태, API 계층을 명확히 분리해야 유지보수가 쉬워집니다.",
      "포트폴리오 프로젝트 상세 페이지에는 화면 이미지와 아키텍처 이미지를 함께 남기면 서비스 맥락을 더 빠르게 전달할 수 있습니다.",
    ],
  },
];

export const getProjectBySlug = (slug: string) => projects.find((project) => project.slug === slug);

export const posts = [
  {
    slug: "aws-ecs-cicd-pipeline",
    title: "AWS ECS와 GitHub Actions로 배포 파이프라인 구성하기",
    excerpt: "ECR 이미지 빌드부터 ECS 서비스 업데이트까지 정적 블로그에 정리할 DevOps 글의 예시 구조입니다.",
    date: "2026-05-12",
    category: "DevOps",
    tags: ["AWS", "ECS", "GitHub Actions", "CI/CD"],
    readingTime: "6분",
    toc: ["배포 흐름", "ECR 이미지 빌드", "ECS 서비스 업데이트", "체크포인트"],
  },
  {
    slug: "vpc-subnet-design",
    title: "VPC Public/Private Subnet 설계 기준",
    excerpt: "ALB, NAT Gateway, RDS 배치를 기준으로 3-tier 네트워크를 설명하는 Cloud 카테고리 글입니다.",
    date: "2026-05-08",
    category: "Cloud",
    tags: ["VPC", "Subnet", "RDS", "ALB"],
    readingTime: "5분",
    toc: ["왜 서브넷을 나누는가", "Public 영역", "Private 영역", "운영 시 주의점"],
  },
  {
    slug: "timezone-troubleshooting",
    title: "Docker와 관리형 DB의 타임존 불일치 해결",
    excerpt: "UTC와 KST가 어긋나는 현상을 인프라 관점에서 추적하고 재발 방지 포인트를 정리합니다.",
    date: "2026-05-02",
    category: "Troubleshooting",
    tags: ["Docker", "Database", "JVM", "KST"],
    readingTime: "4분",
    toc: ["문제 상황", "원인 분석", "수정 방법", "회고"],
  },
  {
    slug: "os-process-thread",
    title: "프로세스와 스레드 차이를 인프라 관점에서 보기",
    excerpt: "CS 기본기를 서버 운영과 장애 분석 맥락에 연결해서 정리하는 글입니다.",
    date: "2026-04-24",
    category: "CS",
    tags: ["OS", "Process", "Thread"],
    readingTime: "3분",
    toc: ["정의", "메모리 관점", "장애 분석 연결"],
  },
  {
    slug: "spring-health-check",
    title: "Spring Boot Health Check 엔드포인트 설계",
    excerpt: "ALB Target Group 헬스 체크와 애플리케이션 상태 점검을 연결하는 Language 카테고리 글입니다.",
    date: "2026-04-18",
    category: "Language",
    tags: ["Spring Boot", "Health Check", "ALB"],
    readingTime: "5분",
    toc: ["헬스 체크의 역할", "Actuator 구성", "ALB 연동"],
  },
  {
    slug: "rag-monitoring-notes",
    title: "RAG 서비스 운영에서 관찰해야 할 지표",
    excerpt: "AI 서비스를 운영 시스템으로 바라볼 때 필요한 지표와 로깅 포인트를 정리합니다.",
    date: "2026-04-10",
    category: "AI",
    tags: ["RAG", "Monitoring", "LLM"],
    readingTime: "5분",
    toc: ["응답 품질", "검색 지표", "비용과 지연시간"],
  },
];

export const architectureSteps = [
  { title: "Notion Publish", description: "Notion에서 작성한 글을 발행 대상으로 표시합니다.", icon: BookOpen },
  { title: "GitHub Actions", description: "스케줄 또는 수동 실행으로 콘텐츠 동기화 워크플로를 시작합니다.", icon: GitBranch },
  { title: "Markdown 변환", description: "Notion 블록을 MDX/Markdown 형식으로 변환합니다.", icon: Code2 },
  { title: "Repo Commit", description: "변환된 콘텐츠를 GitHub 저장소의 content/blog 경로에 커밋합니다.", icon: Server },
  { title: "Next.js Deploy", description: "정적 빌드 결과물을 CDN 친화적인 형태로 배포합니다.", icon: Cloud },
  { title: "Velog Publish", description: "동일 콘텐츠를 Velog에도 자동 발행하는 확장 지점입니다.", icon: Wrench },
];

export const credentials = [
  { title: "리눅스마스터 2급", issuer: "한국정보통신진흥협회", date: "2026.04" },
  { title: "네트워크관리사 2급", issuer: "한국정보통신자격협회", date: "2026.03" },
  { title: "클라우드 운영자 과정", issuer: "경기도 일자리재단", date: "2025.07 - 2025.08" },
  { title: "생성형 AI 백엔드 개발자 과정", issuer: "프로그래머스", date: "2025.01 - 2025.06" },
];

export const principles = [
  { title: "Static First", description: "DB와 별도 서버 없이 MDX 콘텐츠를 정적 페이지로 빌드합니다.", icon: ShieldCheck },
  { title: "Readable UI", description: "과한 장식보다 긴 글과 프로젝트 설명을 읽기 좋은 구조를 우선합니다.", icon: BookOpen },
  { title: "Cloud Native Ready", description: "NCP Object Storage와 Global CDN에 올리기 쉬운 export 구조를 유지합니다.", icon: Cloud },
];
