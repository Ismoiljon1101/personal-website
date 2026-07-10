"use client";

import { HackathonCard } from "@/components/hackathon-card";
import { useLang } from "@/components/language-provider";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import {
  KO_LANGUAGES,
  KO_PROJECTS,
  KO_WORK,
  formatPeriodKo,
} from "@/data/ko-translations";
import { trackClick } from "@/components/visit-tracker";
import Link from "next/link";
import Markdown from "react-markdown";

const BLUR_FADE_DELAY = 0.04;

const KO = {
  available: "구직 중 · D-10 비자 2026년 8월 취득 예정",
  name: "이스모일존 마샤리포프",
  role: "풀스택 소프트웨어 엔지니어",
  location: "서울, 대한민국",
  about: "소개",
  summary:
    "풀스택 소프트웨어 엔지니어로서 확장 가능한 웹 애플리케이션, SaaS 플랫폼, API 및 클라우드 기반 솔루션 설계·개발·배포 경험을 보유하고 있습니다. 백엔드 개발, 마이크로서비스 아키텍처, 데이터베이스 설계, 시스템 통합 및 최신 프론트엔드 프레임워크에 강점이 있습니다. 세종대학교 컴퓨터공학과 졸업 예정(2026년 7월). D-10 구직 비자 신청 가능(2026년 8월~).",
  work: "경력",
  education: "학력",
  educationDegree: "컴퓨터공학 이학사",
  skills: "기술 스택",
  projects: "프로젝트",
  selectedWork: "주요 작업물",
  projectsDesc:
    "실제 사용자가 쓰는 프로덕션 시스템 위주로 만들었습니다. 각 프로젝트를 클릭하면 자세히 볼 수 있습니다.",
  hackathons: "해커톤",
  hackathonsTitle: "만드는 것을 좋아합니다",
  hackathonsDesc: (n: number) =>
    `대학 재학 중 ${n}개 이상의 해커톤에 참가했습니다.`,
  languages: "언어",
  contactSection: "연락처",
  getInTouch: "함께 일해요",
  contactDesc:
    "서울에서 정규직 포지션을 찾고 있습니다. 간단한 질문이든 채용 제안이든 모든 메시지를 읽고 24시간 내에 답변드립니다.",
};

function SectionHeading({
  overline,
  title,
  description,
  delay,
}: {
  overline: string;
  title: string;
  description?: string;
  delay: number;
}) {
  return (
    <BlurFade delay={delay}>
      <div className="space-y-2">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-brand">
          {overline}
        </p>
        <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </BlurFade>
  );
}

export default function Page() {
  const { lang, t } = useLang();

  const stats = [
    { num: "5+", labelEn: "Production systems", labelKo: "프로덕션 시스템" },
    { num: "3+", labelEn: "Years experience", labelKo: "년 경력" },
    { num: "60%", labelEn: "Faster APIs shipped", labelKo: "API 속도 개선" },
    { num: "3", labelEn: "Hackathons", labelKo: "해커톤" },
  ];

  return (
    <main className="flex min-h-[100dvh] flex-col space-y-20 sm:space-y-24">
      {/* ── HERO ── */}
      <section id="hero" className="pt-4">
        <div className="space-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 0.5}>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-foreground/80">
                {t(
                  "Available for opportunities · D-10 Visa eligible Aug 2026",
                  KO.available
                )}
              </span>
            </div>
          </BlurFade>

          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <BlurFadeText
                  delay={BLUR_FADE_DELAY}
                  className="font-serif text-4xl tracking-tight sm:text-6xl"
                  yOffset={8}
                  text={t(DATA.name, KO.name)}
                />
                <BlurFadeText
                  delay={BLUR_FADE_DELAY * 2}
                  className="text-lg text-muted-foreground"
                  text={t("Full Stack Software Engineer", KO.role)}
                />
              </div>

              <BlurFade delay={BLUR_FADE_DELAY * 3}>
                <p className="max-w-md text-[15px] leading-relaxed text-foreground/80">
                  {t(
                    "I ship production SaaS — scalable APIs, microservices, and clean code that runs real businesses.",
                    "프로덕션 SaaS 개발 전문 · 확장 가능한 API · 실제 서비스 운영 경험"
                  )}
                </p>
              </BlurFade>

              <BlurFade delay={BLUR_FADE_DELAY * 4}>
                <p className="font-mono text-xs tracking-wide text-muted-foreground">
                  NestJS · React/Next.js · TypeScript · AWS ·{" "}
                  {t("Seoul, South Korea", KO.location)}
                </p>
              </BlurFade>
            </div>

            <BlurFade delay={BLUR_FADE_DELAY}>
              <Avatar className="size-24 border border-border shadow-sm sm:size-28">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>

          {/* CTAs */}
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/Korean_Resume.pdf"
                target="_blank"
                onClick={() => trackClick("resume_download")}
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all hover:opacity-85 active:scale-95"
              >
                {t("View Resume", "이력서 보기")}
              </Link>
              <Link
                href="mailto:career@ismaildev.uz"
                onClick={() => trackClick("email_cta")}
                className="inline-flex items-center gap-2 rounded-lg border border-foreground/20 px-5 py-2.5 text-sm font-medium transition-all hover:bg-foreground/5 active:scale-95"
              >
                {t("Email Me", "이메일")}
              </Link>
              <Link
                href="tel:+821048960111"
                onClick={() => trackClick("phone_cta")}
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {t("Call / KakaoTalk · 010-4896-0111", "전화 / 카카오톡 · 010-4896-0111")}
              </Link>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {t(
                "Usually replies within 24h · Open to full-time roles in Seoul",
                "보통 24시간 내 답변 · 서울 정규직 포지션 지원 가능"
              )}
            </p>
          </BlurFade>

          {/* Stats */}
          <BlurFade delay={BLUR_FADE_DELAY * 6}>
            <div className="grid grid-cols-2 gap-y-6 border-y border-border py-6 sm:grid-cols-4">
              {stats.map(({ num, labelEn, labelKo }) => (
                <div key={labelEn}>
                  <div className="font-serif text-3xl tracking-tight">
                    {num}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {t(labelEn, labelKo)}
                  </div>
                </div>
              ))}
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="space-y-4">
        <SectionHeading
          overline={t("About", KO.about)}
          title={t("A little background", "소개")}
          delay={BLUR_FADE_DELAY * 7}
        />
        <BlurFade delay={BLUR_FADE_DELAY * 8}>
          <Markdown className="prose max-w-prose text-pretty font-sans text-sm leading-relaxed text-muted-foreground dark:prose-invert">
            {t(DATA.summary, KO.summary)}
          </Markdown>
        </BlurFade>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="space-y-8">
        <SectionHeading
          overline={t("Projects", KO.projects)}
          title={t("Selected work", KO.selectedWork)}
          description={t(
            "Production systems with real users — click any project for a closer look.",
            KO.projectsDesc
          )}
          delay={BLUR_FADE_DELAY * 9}
        />
        <div className="flex flex-col gap-6">
          {DATA.projects.map((project, id) => (
            <BlurFade
              key={project.title}
              delay={BLUR_FADE_DELAY * 10 + id * 0.05}
            >
              <ProjectCard
                href={project.href}
                title={project.title}
                description={
                  lang === "ko"
                    ? (KO_PROJECTS[project.title] ?? project.description)
                    : project.description
                }
                dates={project.dates}
                tags={project.technologies}
                image={project.image}
                video={project.video}
                links={project.links}
              />
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ── WORK ── */}
      <section id="work" className="space-y-6">
        <SectionHeading
          overline={t("Experience", "경력")}
          title={t("Work Experience", KO.work)}
          delay={BLUR_FADE_DELAY * 11}
        />
        <div className="flex flex-col gap-y-4">
          {DATA.work.map((work, id) => {
            const koData = KO_WORK[work.company];
            return (
              <BlurFade
                key={work.company}
                delay={BLUR_FADE_DELAY * 12 + id * 0.05}
              >
                <ResumeCard
                  logoUrl={work.logoUrl}
                  altText={work.company}
                  title={work.company}
                  subtitle={
                    lang === "ko" && koData ? koData.title : work.title
                  }
                  href={work.href}
                  badges={work.badges}
                  period={
                    lang === "ko"
                      ? formatPeriodKo(work.start, work.end)
                      : `${work.start} - ${work.end ?? "Present"}`
                  }
                  description={
                    lang === "ko" && koData
                      ? koData.description
                      : work.description
                  }
                />
              </BlurFade>
            );
          })}
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section id="education" className="space-y-6">
        <SectionHeading
          overline={t("Education", KO.education)}
          title={t("Education", KO.education)}
          delay={BLUR_FADE_DELAY * 13}
        />
        <div className="flex flex-col gap-y-4">
          {DATA.education.map((edu, id) => (
            <BlurFade key={edu.school} delay={BLUR_FADE_DELAY * 14 + id * 0.05}>
              <ResumeCard
                href={edu.href}
                logoUrl={edu.logoUrl}
                altText={edu.school}
                title={edu.school}
                subtitle={lang === "ko" ? KO.educationDegree : edu.degree}
                period={
                  lang === "ko"
                    ? formatPeriodKo(edu.start, edu.end)
                    : `${edu.start} - ${edu.end}`
                }
              />
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="space-y-6">
        <SectionHeading
          overline={t("Skills", KO.skills)}
          title={t("Tools I work with", "기술 스택")}
          delay={BLUR_FADE_DELAY * 15}
        />
        <div className="space-y-5">
          {DATA.skillGroups.map((group, id) => (
            <BlurFade
              key={group.title}
              delay={BLUR_FADE_DELAY * 16 + id * 0.05}
            >
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-[160px_1fr] sm:gap-4">
                <p className="pt-0.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {lang === "ko" ? group.titleKo : group.title}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <Badge variant="secondary" key={skill}>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ── HACKATHONS ── */}
      <section id="hackathons" className="space-y-8">
        <SectionHeading
          overline={t("Hackathons", KO.hackathons)}
          title={t("I like building things", KO.hackathonsTitle)}
          description={
            lang === "ko"
              ? KO.hackathonsDesc(DATA.hackathons.length)
              : `During university I attended ${DATA.hackathons.length}+ hackathons, building working products with new teammates in 2–3 days.`
          }
          delay={BLUR_FADE_DELAY * 17}
        />
        <BlurFade delay={BLUR_FADE_DELAY * 18}>
          <ul className="mb-4 ml-4 divide-y divide-dashed border-l">
            {DATA.hackathons.map((project, id) => (
              <BlurFade
                key={project.title + project.dates}
                delay={BLUR_FADE_DELAY * 19 + id * 0.05}
              >
                <HackathonCard
                  title={project.title}
                  description={project.description}
                  location={project.location}
                  dates={project.dates}
                  image={project.image}
                  links={project.links}
                />
              </BlurFade>
            ))}
          </ul>
        </BlurFade>
      </section>

      {/* ── LANGUAGES ── */}
      <section id="languages" className="space-y-6">
        <SectionHeading
          overline={t("Languages", KO.languages)}
          title={t("Languages I speak", "구사 언어")}
          delay={BLUR_FADE_DELAY * 20}
        />
        <div className="flex flex-wrap gap-2">
          {DATA.languages.map((language, id) => (
            <BlurFade
              key={language.name}
              delay={BLUR_FADE_DELAY * 20 + id * 0.05}
            >
              <div className="flex flex-col rounded-lg border px-3 py-2 text-sm">
                <span className="font-semibold">{language.name}</span>
                <span className="text-xs text-muted-foreground">
                  {lang === "ko"
                    ? (KO_LANGUAGES[language.name] ?? language.level)
                    : language.level}
                </span>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="pb-8">
        <BlurFade delay={BLUR_FADE_DELAY * 21}>
          <div className="space-y-5 border-t border-border pt-14 text-center">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-brand">
              {t("Contact", KO.contactSection)}
            </p>
            <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
              {t("Let's work together", KO.getInTouch)}
            </h2>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
              {t(
                "I'm actively looking for full-time roles in Seoul. Whether it's a quick question or a job offer — I read every message and reply within 24 hours.",
                KO.contactDesc
              )}
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-1">
              <Link
                href="mailto:career@ismaildev.uz"
                onClick={() => trackClick("email_cta")}
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all hover:opacity-85 active:scale-95"
              >
                {t("Email Me", "이메일 보내기")}
              </Link>
              <Link
                href="/Korean_Resume.pdf"
                target="_blank"
                onClick={() => trackClick("resume_download")}
                className="inline-flex items-center gap-2 rounded-lg border border-foreground/20 px-5 py-2.5 text-sm font-medium transition-all hover:bg-foreground/5 active:scale-95"
              >
                {t("View Resume", "이력서 보기")}
              </Link>
            </div>

            <p className="text-xs text-muted-foreground">
              <Link
                href="tel:+821048960111"
                onClick={() => trackClick("phone_cta")}
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                010-4896-0111
              </Link>{" "}
              · career@ismaildev.uz ·{" "}
              {t("KakaoTalk: 010-4896-0111", "카카오톡: 010-4896-0111")}
            </p>
          </div>
        </BlurFade>
      </section>
    </main>
  );
}
