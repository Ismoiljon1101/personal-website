export const KO_WORK: Record<string, { title: string; description: string }> = {
  "Braintrust network": {
    title: "소프트웨어 엔지니어 (계약직)",
    description:
      "TypeScript, React, NestJS, GraphQL로 프로덕션 SaaS 앱 개발 및 마이크로서비스 확장. Redis 캐싱·쿼리 최적화로 API 응답시간 200ms → 50ms 미만 단축. Docker, GitHub Actions, AWS 배포 자동화.",
  },
  "TELUS International": {
    title: "AI 데이터 어노테이터 (Project Sonic)",
    description:
      "YOLO 기반 컴퓨터 비전 ML 모델용 동영상 프레임 500+장/일 라벨링, 97% 정확도 유지하며 프로덕션 납기 준수.",
  },
  "Sejong University": {
    title: "웹 개발 조교",
    description:
      "React, MongoDB, REST/GraphQL, Docker 등 50명 이상 학생 기술 멘토링. Docker 배포 문서 작성 (강의 자료로 채택). Angular 앱 개발 참여.",
  },
  "Devex.uz LLC": {
    title: "MIT18 부트캠프 리더",
    description:
      "백엔드, 프론트엔드, DB, API, 배포 풀스택 커리큘럼 설계 및 강의. 다수의 프로덕션급 앱 개발 주도. 수료생 소프트웨어 엔지니어 취업 지원.",
  },
  "NovaTech Solutions": {
    title: "소프트웨어 개발자",
    description:
      "C#, ASP.NET Core, Entity Framework, SQL Server로 비즈니스 앱 개발. Express.js, PostgreSQL 기반 SaaS 플랫폼 구축. 쿼리 최적화로 페이지 로드 ~25% 개선.",
  },
};

export const KO_PROJECTS: Record<string, string> = {
  MediTech:
    "NestJS(GraphQL+REST), Next.js, MongoDB 기반 의료 플랫폼. Redis 캐싱으로 DB 쿼리 60% 절감. WebSocket 실시간 채팅, JWT 인증, Docker+Nginx+PM2 배포.",
  PizzaHouse:
    "Express.js REST API + React 프론트엔드 풀스택 앱. SSR 관리자 대시보드, 세션 인증 26개 API, 포인트 리워드, 3단계 장바구니.",
  TableTap:
    "실제 레스토랑 운영 지원 QR 주문·POS 플랫폼. 오프라인 기능, 영수증 프린터 연동. NestJS, WebSocket, JWT+Google OAuth, PM2+Nginx 배포.",
  MemoAI:
    "AI 메모 SaaS 랜딩 페이지. Next.js, VPS Nginx 역방향 프록시 배포, 반응형 디자인.",
  "Pi System Monitor":
    "Raspberry Pi 경량 모니터링 앱. CPU/디스크/RAM 5초 주기 감지, Telegram 봇 알림, /status·/reboot·/shutdown 명령 지원.",
  "PasarHalal Korea":
    "한국 할랄 시장 멀티벤더 이커머스 플랫폼. NestJS+Next.js, PWA, Cloudflare+PM2 클라우드 배포.",
  "Smart IoT Monitoring Platform":
    "IoT 모니터링 솔루션 아키텍처 및 백엔드 개발. 실시간 데이터 파이프라인, WebSocket, AI 기능, 하드웨어-클라우드 연동.",
  "AI Clinical Decision Support":
    "RAG(BM25) 기반 다국어 임상 의사결정 지원 웹앱. FastAPI, PostgreSQL, Next.js 백엔드 및 검색 서비스 설계.",
};

export const KO_LANGUAGES: Record<string, string> = {
  English: "C1 — 비즈니스 프로페셔널",
  Korean: "TOPIK 3 — 중급",
  Uzbek: "모국어",
  Turkish: "이중 언어",
  Russian: "중급",
};

const MONTH_MAP: Record<string, string> = {
  Jan: "1월", Feb: "2월", Mar: "3월", Apr: "4월",
  May: "5월", Jun: "6월", Jul: "7월", Aug: "8월",
  Sept: "9월", Sep: "9월", Oct: "10월", Nov: "11월", Dec: "12월",
  July: "7월", June: "6월", March: "3월", April: "4월",
  August: "8월", February: "2월", January: "1월",
};

export function formatDateKo(dateStr: string): string {
  const parts = dateStr.trim().split(" ");
  if (parts.length === 2) {
    const [month, year] = parts;
    return `${year}년 ${MONTH_MAP[month] ?? month}`;
  }
  // Year-only (e.g. "2024") — just append 년
  if (parts.length === 1 && /^\d{4}$/.test(parts[0])) {
    return `${parts[0]}년`;
  }
  return dateStr;
}

export function formatPeriodKo(start: string, end?: string | null): string {
  return `${formatDateKo(start)} - ${end ? formatDateKo(end) : "현재"}`;
}
