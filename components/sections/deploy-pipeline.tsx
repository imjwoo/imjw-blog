import { publicPath } from "@/lib/paths";
import { PIPELINE_ICONS } from "./pipeline-icons";

type IconNode = {
  cx: number;
  cy: number;
  icon?: keyof typeof PIPELINE_ICONS;
  image?: string;
  label: string;
  sub: string;
};

type Region = { x: number; y: number; w: number; label: string };

const VIEW_W = 840;
const VIEW_H = 420;

const ICON_SIZE = 40;
const REGION_H = 124;

const ROW1_Y = 44;
const ROW2_Y = 232;
const ROW1_CY = ROW1_Y + 42;
const ROW2_CY = ROW2_Y + 42;

const regions: Region[] = [
  { x: 120, y: ROW1_Y, w: 380, label: "GITHUB ACTIONS" },
  { x: 120, y: ROW2_Y, w: 150, label: "NCP" },
  { x: 320, y: ROW2_Y, w: 250, label: "CLOUDFLARE" },
];

const nodes: IconNode[] = [
  { cx: 54, cy: ROW1_CY, icon: "notion", label: "Notion", sub: "글 작성" },
  { cx: 180, cy: ROW1_CY, icon: "githubActions", label: "Actions", sub: "매일 07:00 KST" },
  { cx: 310, cy: ROW1_CY, icon: "markdown", label: "MDX", sub: "변환" },
  { cx: 440, cy: ROW1_CY, icon: "nextjs", label: "Next.js", sub: "static export" },
  {
    cx: 195,
    cy: ROW2_CY,
    image: publicPath("/images/tech/ncp.svg"),
    label: "Object Storage",
    sub: "정적 호스팅",
  },
  { cx: 380, cy: ROW2_CY, icon: "workers", label: "Workers", sub: "Host 재작성" },
  { cx: 510, cy: ROW2_CY, icon: "cloudflare", label: "CDN", sub: "엣지 캐시" },
  { cx: 650, cy: ROW2_CY, label: "Users", sub: "imjwoo.com" },
];

/** 아이콘 사이를 잇는 실선 화살표 (가로) */
function FlowArrow({ from, to, y }: { from: number; to: number; y: number }) {
  return (
    <g className="text-muted-foreground">
      <line x1={from} y1={y} x2={to - 6} y2={y} stroke="currentColor" strokeWidth={1.4} />
      <polygon points={`${to},${y} ${to - 7},${y - 4.5} ${to - 7},${y + 4.5}`} fill="currentColor" />
    </g>
  );
}

export function DeployPipeline() {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label="Notion에서 작성한 글이 GitHub Actions에서 MDX로 변환되고 Next.js로 정적 빌드된 뒤, NCP Object Storage에 올라가 Cloudflare Workers와 CDN을 거쳐 방문자에게 전달되는 구조"
      className="h-auto w-full min-w-[720px]"
    >
      {/* 서비스 영역 */}
      {regions.map((region) => (
        <g key={region.label}>
          <rect
            x={region.x}
            y={region.y}
            width={region.w}
            height={REGION_H}
            rx={10}
            className="fill-muted/40 text-border"
            stroke="currentColor"
            strokeWidth={1}
            strokeDasharray="5 4"
          />
          <text
            x={region.x + 14}
            y={region.y + 20}
            fontSize={9}
            letterSpacing="0.1em"
            className="fill-muted-foreground"
          >
            {region.label}
          </text>
        </g>
      ))}

      {/* 1행 — 글이 만들어지는 흐름 */}
      <FlowArrow from={76} to={114} y={ROW1_CY} />
      <FlowArrow from={202} to={284} y={ROW1_CY} />
      <FlowArrow from={332} to={414} y={ROW1_CY} />

      {/* 1행 → 2행 */}
      <g className="text-muted-foreground">
        <path
          d="M 440 168 V 200 H 195 V 246"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
        />
        <polygon points="195,252 190.5,243 199.5,243" fill="currentColor" />
      </g>

      {/* 2행 — 방문자에게 전달되는 흐름 */}
      <FlowArrow from={233} to={354} y={ROW2_CY} />
      <FlowArrow from={402} to={484} y={ROW2_CY} />
      <FlowArrow from={532} to={624} y={ROW2_CY} />

      {/* 배포 후 캐시 무효화 (점선) */}
      <g className="text-muted-foreground">
        <path
          d="M 500 86 H 620 V 210 H 510 V 226"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          strokeDasharray="4 4"
        />
        <polygon points="510,232 505.5,223 514.5,223" fill="currentColor" />
        <text x={558} y={202} textAnchor="middle" fontSize={9.5} fill="currentColor">
          배포 후 캐시 무효화
        </text>
      </g>

      {/* 아이콘 노드 */}
      {nodes.map((node) => {
        const icon = node.icon ? PIPELINE_ICONS[node.icon] : null;

        return (
          <g key={node.label}>
            {icon ? (
              <g
                transform={`translate(${node.cx - ICON_SIZE / 2}, ${node.cy - ICON_SIZE / 2}) scale(${ICON_SIZE / 24})`}
                className="text-foreground"
              >
                <path d={icon.d} fill={icon.fill} />
              </g>
            ) : node.image ? (
              <image
                href={node.image}
                x={node.cx - 32}
                y={node.cy - 22}
                width={64}
                height={44}
                preserveAspectRatio="xMidYMid meet"
              />
            ) : (
              // Users: 브랜드 아이콘이 없어 간단한 글리프로 표현합니다.
              <g
                transform={`translate(${node.cx - ICON_SIZE / 2}, ${node.cy - ICON_SIZE / 2}) scale(${ICON_SIZE / 24})`}
                className="text-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
              >
                <rect x={2.5} y={4} width={19} height={13} rx={2} />
                <path d="M9 20.5h6M12 17.5v3" />
              </g>
            )}

            <text
              x={node.cx}
              y={node.cy + 40}
              textAnchor="middle"
              fontSize={12}
              fontWeight={600}
              className="fill-foreground"
            >
              {node.label}
            </text>
            <text
              x={node.cx}
              y={node.cy + 56}
              textAnchor="middle"
              fontSize={9.5}
              className="fill-muted-foreground"
            >
              {node.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
