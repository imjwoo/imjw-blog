# IMJW Blog Analytics Worker

정적 블로그의 방문자와 게시글 조회수를 집계하는 Cloudflare Worker입니다.

## 집계 기준

- `Today`: 동일 브라우저를 한국 시간 기준 하루에 한 번 집계합니다.
- 게시글 조회수: 동일 브라우저와 동일 게시글 조합을 하루에 한 번 집계합니다.
- 날짜가 바뀌면 다시 집계합니다.
- IP 주소는 읽거나 저장하지 않습니다.
- 브라우저에는 무작위 식별자를 HttpOnly 쿠키로 저장하고, D1에는 날짜별 HMAC 해시만 저장합니다.
- 일반적인 검색 봇, 링크 미리보기, prefetch 요청은 제외합니다.

## 배포 준비

1. `npx wrangler d1 create imjw-blog-analytics`로 D1 데이터베이스를 만듭니다.
2. GitHub Actions 저장소 Secret에 아래 값을 등록합니다.
   - `CLOUDFLARE_WORKERS_API_TOKEN`: Workers Scripts 편집과 D1 편집 권한을 가진 토큰
   - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 계정 ID
   - `CLOUDFLARE_ZONE_ID`: `imjwoo.com` 영역 ID
   - `CLOUDFLARE_D1_DATABASE_ID`: 1단계에서 발급된 D1 ID
   - `ANALYTICS_HASH_SECRET`: 충분히 긴 임의 문자열
3. GitHub Actions의 `Deploy Analytics Worker` 워크플로를 수동 실행합니다.

워크플로는 설정 파일 생성, D1 마이그레이션, Worker Secret 등록, Worker 배포를 순서대로 처리합니다.

Worker는 `imjwoo.com/api/analytics/*` 요청만 처리하며 나머지 정적 사이트 요청은 기존 NCP Object Storage로 전달됩니다.
