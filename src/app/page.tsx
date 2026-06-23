"use client";

import { HackathonCard } from "@/components/hackathon-card";
import { HeroParticles } from "@/components/hero-particles";
import { useLang } from "@/components/language-provider";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { TiltCard } from "@/components/tilt-card";
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
import { motion } from "framer-motion";
import Link from "next/link";
import Markdown from "react-markdown";

const BLUR_FADE_DELAY = 0.04;

const KO = {
  available: "구직 중  ·  D-10 비자 2026년 8월 취득 예정",
  name: "이스모일존 마샤리포프",
  role: "풀스택 소프트웨어 엔지니어",
  specialization: "NestJS · React/Next.js · TypeScript · AWS",
  location: "서울, 대한민국",
  downloadCV: "이력서 다운로드",
  contact: "이메일",
  stat1Label: "프로덕션 시스템",
  stat2Label: "경력",
  stat3Label: "API 속도 향상",
  stat4Label: "해커톤",
  about: "소개",
  summary:
    "풀스택 소프트웨어 엔지니어로서 확장 가능한 웹 애플리케이션, SaaS 플랫폼, API 및 클라우드 기반 솔루션 설계·개발·배포 경험을 보유하고 있습니다. 백엔드 개발, 마이크로서비스 아키텍처, 데이터베이스 설계, 시스템 통합 및 최신 프론트엔드 프레임워크에 강점이 있습니다. 세종대학교 컴퓨터공학과 졸업 예정(2026년 7월). D-10 구직 비자 신청 가능(2026년 8월~).",
  work: "경력",
  education: "학력",
  educationDegree: "컴퓨터공학 이학사",
  skills: "기술 스택",
  projects: "프로젝트",
  myProjects: "나의 프로젝트",
  checkOut: "최신 작업물을 확인해보세요",
  projectsDesc:
    "간단한 웹사이트부터 복잡한 웹 애플리케이션까지 다양한 프로젝트를 진행했습니다.",
  hackathons: "해커톤",
  hackathonsTitle: "무언가를 만드는 것을 좋아합니다",
  hackathonsDesc: (n: number) =>
    `대학 재학 중 ${n}개 이상의 해커톤에 참가했습니다.`,
  languages: "언어",
  contactSection: "연락처",
  getInTouch: "연락하기",
  contactDesc: "궁금하신 점이 있으시면 이메일로 연락해 주세요.",
  contactLink: "직접 문의",
};

// Reusable card shimmer + corner glow wrapper
function GlowCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative group rounded-xl">
      {/* Corner glow — top-left */}
      <div
        aria-hidden
        className="absolute -top-px -left-px w-40 h-40 rounded-tl-xl pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(99,102,241,0.22) 0%, transparent 70%)",
          animation: "corner-pulse 2s ease-in-out infinite",
        }}
      />
      {/* Corner glow — bottom-right */}
      <div
        aria-hidden
        className="absolute -bottom-px -right-px w-40 h-40 rounded-br-xl pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle at 100% 100%, rgba(168,85,247,0.22) 0%, transparent 70%)",
          animation: "corner-pulse 2s ease-in-out infinite 1s",
        }}
      />
      {/* Shimmer sweep */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10"
      >
        <div className="absolute h-full w-[70px] top-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent -left-[100%] group-hover:animate-[shimmer-slide_0.75s_ease-in-out]" />
      </div>
      {/* Border on hover */}
      <div className="rounded-xl ring-0 group-hover:ring-1 group-hover:ring-primary/30 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}

export default function Page() {
  const { lang, t } = useLang();

  const stats = [
    { num: "5+",  labelEn: "Prod Systems",   labelKo: KO.stat1Label },
    { num: "3+",  labelEn: "Years Exp",       labelKo: KO.stat2Label },
    { num: "60%", labelEn: "API Faster",      labelKo: KO.stat3Label },
    { num: "3",   labelEn: "Hackathons",      labelKo: KO.stat4Label },
  ];

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      {/* ── HERO ── */}
      <section
        id="hero"
        className="relative overflow-hidden rounded-2xl -mx-2 px-4 pt-6 pb-8"
      >
        <HeroParticles />

        <div className="relative z-10 mx-auto w-full max-w-2xl space-y-5">
          {/* Available badge */}
          <BlurFade delay={BLUR_FADE_DELAY * 0.5}>
            <div className="inline-flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {t(
                  "Available for opportunities · D-10 Visa eligible Aug 2026",
                  KO.available
                )}
              </span>
            </div>
          </BlurFade>

          {/* Name + photo row */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-2">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                yOffset={8}
                text={t(DATA.name, KO.name)}
              />

              <BlurFadeText
                delay={BLUR_FADE_DELAY * 2}
                className="text-lg font-semibold text-muted-foreground"
                text={t("Full Stack Software Engineer", KO.role)}
              />

              <BlurFade delay={BLUR_FADE_DELAY * 2.5}>
                <p className="text-sm text-foreground/80 leading-relaxed max-w-sm">
                  {t(
                    "I ship production SaaS — scalable APIs, microservices, clean code that runs real businesses.",
                    "프로덕션 SaaS 개발 전문 · 확장 가능한 API · 실제 서비스 운영 경험"
                  )}
                </p>
              </BlurFade>

              <BlurFade delay={BLUR_FADE_DELAY * 3}>
                <p className="text-xs text-muted-foreground font-mono tracking-wide">
                  {t("NestJS · React/Next.js · TypeScript · AWS", KO.specialization)}
                </p>
              </BlurFade>

              <BlurFade delay={BLUR_FADE_DELAY * 4}>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3.5 h-3.5 shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.218-4.332 3.218-6.578C19.5 7.024 16.26 3.75 12 3.75S4.5 7.024 4.5 10.75c0 2.246 1.274 4.499 3.218 6.578a19.58 19.58 0 002.683 2.282 16.975 16.975 0 001.144.742z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{t("Seoul, South Korea", KO.location)}</span>
                </div>
              </BlurFade>

              {/* CTAs */}
              <BlurFade delay={BLUR_FADE_DELAY * 5}>
                <div className="flex flex-wrap gap-2 pt-1">
                  {/* Phone call — primary green CTA */}
                  <Link
                    href="tel:+821048960111"
                    onClick={() => trackClick("phone_cta")}
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-green-500/30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                    </svg>
                    {t("Call Now", "전화하기")}
                  </Link>

                  {/* KakaoTalk */}
                  <Link
                    href="tel:+821048960111"
                    onClick={() => trackClick("kakao_cta")}
                    className="inline-flex items-center gap-2 bg-[#FEE500] hover:bg-[#f0d800] active:scale-95 text-[#3B1E1E] px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-yellow-400/20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.638 1.557 4.966 3.927 6.339L4.73 20.47a.375.375 0 00.547.432l4.69-2.813A11.56 11.56 0 0012 18c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
                    </svg>
                    {t("KakaoTalk Chat", "카카오톡")}
                  </Link>

                  {/* Email */}
                  <Link
                    href="mailto:career@ismaildev.uz"
                    onClick={() => trackClick("email_cta")}
                    className="inline-flex items-center gap-2 border border-foreground/25 px-4 py-2 rounded-lg text-sm font-medium hover:bg-foreground/5 active:scale-95 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                    </svg>
                    {t("Email Me", "이메일")}
                  </Link>

                  {/* CV download */}
                  <Link
                    href="/Korean_Resume.pdf"
                    target="_blank"
                    onClick={() => trackClick("resume_download")}
                    className="inline-flex items-center gap-2 border border-foreground/25 px-4 py-2 rounded-lg text-sm font-medium hover:bg-foreground/5 active:scale-95 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                    {t("Resume", "이력서")}
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {t("⚡ Usually replies within 24h · Open to full-time roles in Seoul", "⚡ 보통 24시간 내 답변 · 서울 정규직 포지션 지원 가능")}
                </p>
              </BlurFade>
            </div>

            {/* Avatar */}
            <BlurFade delay={BLUR_FADE_DELAY}>
              <motion.div
                whileHover={{ scale: 1.08, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Avatar className="size-28 border-2 border-primary/20 shadow-lg">
                  <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                  <AvatarFallback>{DATA.initials}</AvatarFallback>
                </Avatar>
              </motion.div>
            </BlurFade>
          </div>

          {/* Impact stats strip */}
          <BlurFade delay={BLUR_FADE_DELAY * 6}>
            <div className="grid grid-cols-4 gap-3 pt-4 border-t border-border/50">
              {stats.map(({ num, labelEn, labelKo }) => (
                <div key={labelEn} className="text-center">
                  <div className="text-2xl font-bold tracking-tight">{num}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {t(labelEn, labelKo)}
                  </div>
                </div>
              ))}
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 7}>
          <h2 className="text-xl font-bold">{t("About", KO.about)}</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 8}>
          <Markdown className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
            {t(DATA.summary, KO.summary)}
          </Markdown>
        </BlurFade>
      </section>

      {/* ── WORK ── */}
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-xl font-bold">
              {t("Work Experience", KO.work)}
            </h2>
          </BlurFade>
          {DATA.work.map((work, id) => {
            const koData = KO_WORK[work.company];
            return (
              <BlurFade
                key={work.company}
                delay={BLUR_FADE_DELAY * 10 + id * 0.05}
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
      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <h2 className="text-xl font-bold">
              {t("Education", KO.education)}
            </h2>
          </BlurFade>
          {DATA.education.map((edu, id) => (
            <BlurFade
              key={edu.school}
              delay={BLUR_FADE_DELAY * 12 + id * 0.05}
            >
              <ResumeCard
                href={edu.href}
                logoUrl={edu.logoUrl}
                altText={edu.school}
                title={edu.school}
                subtitle={
                  lang === "ko" ? KO.educationDegree : edu.degree
                }
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
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 13}>
            <h2 className="text-xl font-bold">{t("Skills", KO.skills)}</h2>
          </BlurFade>
          <div className="flex flex-wrap gap-1">
            {DATA.skills.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 14 + id * 0.04}>
                <motion.div
                  whileHover={{ scale: 1.12, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Badge>{skill}</Badge>
                </motion.div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects">
        <div className="space-y-12 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 15}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  {t("My Projects", KO.myProjects)}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {t("Check out my latest work", KO.checkOut)}
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t(
                    "I've worked on a variety of projects, from simple websites to complex web applications. Here are a few of my favorites.",
                    KO.projectsDesc
                  )}
                </p>
              </div>
            </div>
          </BlurFade>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
            {DATA.projects.map((project, id) => (
              <BlurFade
                key={project.title}
                delay={BLUR_FADE_DELAY * 16 + id * 0.05}
              >
                <GlowCard>
                  <TiltCard intensity={6}>
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
                  </TiltCard>
                </GlowCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* ── HACKATHONS ── */}
      <section id="hackathons">
        <div className="space-y-12 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 17}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  {t("Hackathons", KO.hackathons)}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {t("I like building things", KO.hackathonsTitle)}
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {lang === "ko"
                    ? KO.hackathonsDesc(DATA.hackathons.length)
                    : `During my time in university, I attended ${DATA.hackathons.length}+ hackathons. People from around the country would come together and build incredible things in 2-3 days.`}
                </p>
              </div>
            </div>
          </BlurFade>
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
        </div>
      </section>

      {/* ── LANGUAGES ── */}
      <section id="languages">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 20}>
            <h2 className="text-xl font-bold">
              {t("Languages", KO.languages)}
            </h2>
          </BlurFade>
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
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact">
        <div className="w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 21}>
            <div className="relative rounded-2xl border border-border/60 bg-gradient-to-br from-muted/30 via-transparent to-muted/20 px-6 py-10 text-center overflow-hidden">
              {/* subtle glow */}
              <div aria-hidden className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />

              <div className="relative z-10 space-y-4">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm font-medium">
                  {t("Let's Work Together", KO.contactSection)}
                </div>

                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  {t("Ready to build something great?", "함께 만들어 볼까요?")}
                </h2>

                <p className="mx-auto max-w-md text-muted-foreground text-sm leading-relaxed">
                  {t(
                    "I'm actively looking for full-time roles in Seoul. Whether it's a quick question or a job offer — I read every message and reply within 24 hours.",
                    "서울에서 정규직 포지션을 찾고 있습니다. 간단한 질문이든 채용 제안이든 모든 메시지를 읽고 24시간 내에 답변드립니다."
                  )}
                </p>

                {/* Contact buttons */}
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <Link
                    href="tel:+821048960111"
                    onClick={() => trackClick("phone_cta")}
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-green-500/30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                    </svg>
                    {t("Call Now", "전화하기")}
                  </Link>

                  <Link
                    href="tel:+821048960111"
                    onClick={() => trackClick("kakao_cta")}
                    className="inline-flex items-center gap-2 bg-[#FEE500] hover:bg-[#f0d800] active:scale-95 text-[#3B1E1E] px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.638 1.557 4.966 3.927 6.339L4.73 20.47a.375.375 0 00.547.432l4.69-2.813A11.56 11.56 0 0012 18c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
                    </svg>
                    {t("KakaoTalk", "카카오톡")}
                  </Link>

                  <Link
                    href="mailto:career@ismaildev.uz"
                    onClick={() => trackClick("email_cta")}
                    className="inline-flex items-center gap-2 bg-foreground text-background hover:opacity-85 active:scale-95 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                    </svg>
                    {t("Email Me", "이메일 보내기")}
                  </Link>
                </div>

                <p className="text-xs text-muted-foreground pt-1">
                  {t("010-4896-0111 · career@ismaildev.uz · KakaoTalk: 010-4896-0111", "010-4896-0111 · career@ismaildev.uz · 카카오톡: 010-4896-0111")}
                </p>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
