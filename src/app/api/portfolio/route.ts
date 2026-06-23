import { DATA } from "@/data/resume";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

const DYNAMIC_PATH = path.join(process.cwd(), "src/data/dynamic.json");

function readDynamic() {
  try {
    const raw = fs.readFileSync(DYNAMIC_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function GET() {
  const overrides = readDynamic();

  // Merge static DATA with admin overrides
  const merged = {
    name: DATA.name,
    initials: DATA.initials,
    url: DATA.url,
    location: DATA.location,
    avatarUrl: DATA.avatarUrl,
    description: overrides.description ?? DATA.description,
    summary: overrides.summary ?? DATA.summary,
    skills: overrides.skills ?? [...DATA.skills],
    work: overrides.work ?? DATA.work.map((w) => ({
      company: w.company,
      href: w.href,
      badges: [...w.badges],
      location: w.location,
      title: w.title,
      logoUrl: w.logoUrl,
      start: w.start,
      end: w.end ?? null,
      description: w.description,
    })),
    education: DATA.education.map((e) => ({
      school: e.school,
      href: e.href,
      degree: e.degree,
      logoUrl: e.logoUrl,
      start: e.start,
      end: e.end,
    })),
    projects: overrides.projects ?? DATA.projects.map((p) => ({
      title: p.title,
      href: p.href,
      dates: p.dates,
      active: p.active,
      description: p.description,
      technologies: [...p.technologies],
      image: p.image,
      video: p.video,
      links: p.links.map((l) => ({ type: l.type, href: l.href })),
    })),
    hackathons: overrides.hackathons ?? DATA.hackathons.map((h) => ({
      title: h.title,
      dates: h.dates,
      location: h.location,
      description: h.description,
      image: h.image,
      links: [...h.links],
    })),
    languages: [...DATA.languages],
    contacts: overrides.contacts ?? {
      email: DATA.contact.email,
      phone: DATA.contact.tel,
      kakao: "010-4896-0111",
    },
  };

  return NextResponse.json(merged);
}
