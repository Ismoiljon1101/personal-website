"use client";

import { useEffect, useRef, useState } from "react";

type Section = "bio" | "skills" | "work" | "projects" | "hackathons" | "contacts" | "analytics";

interface WorkEntry {
  company: string;
  title: string;
  titleKo: string;
  location: string;
  start: string;
  end: string | null;
  description: string;
  descriptionKo: string;
  href: string;
  logoUrl: string;
  badges: string[];
}

interface ProjectEntry {
  title: string;
  href: string;
  dates: string;
  active: boolean;
  description: string;
  descriptionKo: string;
  technologies: string[];
  image: string;
  video: string;
  links: { type: string; href: string }[];
}

interface HackathonEntry {
  title: string;
  dates: string;
  location: string;
  description: string;
  image: string;
  links: { title?: string; href: string }[];
}

interface ContactInfo {
  email: string;
  phone: string;
  kakao: string;
}

const EMPTY_WORK: WorkEntry = {
  company: "", title: "", titleKo: "", location: "", start: "", end: null,
  description: "", descriptionKo: "", href: "", logoUrl: "", badges: [],
};

const EMPTY_PROJ: ProjectEntry = {
  title: "", href: "", dates: "", active: true,
  description: "", descriptionKo: "", technologies: [], image: "", video: "", links: [],
};

const EMPTY_HACK: HackathonEntry = {
  title: "", dates: "", location: "", description: "", image: "", links: [],
};

// ── Reusable field components ─────────────────────────────────────────────
function Field({ label, sublabel, children }: { label: string; sublabel?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        {sublabel && <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded">{sublabel}</span>}
      </div>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, className = "" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded border bg-background/80 px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring ${className}`}
    />
  );
}

function Textarea({ value, onChange, rows = 3, placeholder }: {
  value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full rounded border bg-background/80 px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring resize-none"
    />
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [token, setToken] = useState("");
  const [activeSection, setActiveSection] = useState<Section>("bio");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [skillsText, setSkillsText] = useState("");

  const [work, setWork] = useState<WorkEntry[]>([]);
  const [editWorkIdx, setEditWorkIdx] = useState<number | null>(null);
  const [workForm, setWorkForm] = useState<WorkEntry>(EMPTY_WORK);

  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [editProjIdx, setEditProjIdx] = useState<number | null>(null);
  const [projForm, setProjForm] = useState<ProjectEntry>(EMPTY_PROJ);

  const [hackathons, setHackathons] = useState<HackathonEntry[]>([]);
  const [editHackIdx, setEditHackIdx] = useState<number | null>(null);
  const [hackForm, setHackForm] = useState<HackathonEntry>(EMPTY_HACK);

  const [contacts, setContacts] = useState<ContactInfo>({ email: "", phone: "", kakao: "" });

  interface VisitEntry { ip: string; page: string; referrer: string; device: string; location: string; timestamp: string; }
  const [analytics, setAnalytics] = useState<{ visits: VisitEntry[] } | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const tokenRef = useRef("");

  const loadAnalytics = async (t: string) => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch("/api/track", { headers: { "x-admin-token": t } });
      if (res.ok) setAnalytics(await res.json());
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const login = async () => {
    const res = await fetch("/api/admin", { headers: { "x-admin-token": password } });
    if (res.ok) {
      setToken(password);
      tokenRef.current = password;
      setAuthed(true);
      const data = await res.json();
      loadOverrides(data);
      if (!data.description) {
        const portfolio = await fetch("/api/portfolio").then((r) => r.json());
        setDescription(portfolio.description ?? "");
        setSummary(portfolio.summary ?? "");
        setSkillsText((portfolio.skills ?? []).join(", "));
        setWork(portfolio.work?.map(normalizeWork) ?? []);
        setProjects(portfolio.projects?.map(normalizeProject) ?? []);
        setHackathons(portfolio.hackathons ?? []);
        setContacts(portfolio.contacts ?? { email: "", phone: "", kakao: "" });
      }
    } else {
      setLoginError("Wrong password");
    }
  };

  // Ensure older entries without Ko fields still work
  function normalizeWork(w: Partial<WorkEntry>): WorkEntry {
    return { ...EMPTY_WORK, ...w };
  }
  function normalizeProject(p: Partial<ProjectEntry>): ProjectEntry {
    return { ...EMPTY_PROJ, ...p };
  }

  const loadOverrides = (data: Record<string, unknown>) => {
    if (data.description) setDescription(data.description as string);
    if (data.summary) setSummary(data.summary as string);
    if (data.skills) setSkillsText((data.skills as string[]).join(", "));
    if (data.work) setWork((data.work as Partial<WorkEntry>[]).map(normalizeWork));
    if (data.projects) setProjects((data.projects as Partial<ProjectEntry>[]).map(normalizeProject));
    if (data.hackathons) setHackathons(data.hackathons as HackathonEntry[]);
    if (data.contacts) setContacts(data.contacts as ContactInfo);
  };

  const save = async (section: string, data: unknown) => {
    setSaving(true);
    setSaveMsg("");
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "content-type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ section, data }),
    });
    setSaving(false);
    setSaveMsg(res.ok ? "✓ Saved!" : "✗ Error saving");
    setTimeout(() => setSaveMsg(""), 2500);
  };

  // ── Login screen ─────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm space-y-6 border rounded-2xl p-8 bg-background/90 backdrop-blur-sm shadow-xl">
          <div className="text-center">
            <div className="text-3xl mb-2">🔐</div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your admin password</p>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="Password"
              className="w-full rounded-lg border bg-background/80 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            {loginError && <p className="text-red-500 text-xs">{loginError}</p>}
            <button
              onClick={login}
              className="w-full rounded-lg bg-foreground text-background py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sections: { id: Section; label: string; emoji: string }[] = [
    { id: "analytics",  label: "Analytics",         emoji: "📊" },
    { id: "bio",        label: "Bio & Summary",     emoji: "📝" },
    { id: "contacts",   label: "Contacts",           emoji: "📞" },
    { id: "skills",     label: "Skills",             emoji: "⚡" },
    { id: "work",       label: "Work Experience",    emoji: "💼" },
    { id: "projects",   label: "Projects",           emoji: "🚀" },
    { id: "hackathons", label: "Hackathons",         emoji: "🏆" },
  ];

  const btnBase = "rounded-lg bg-foreground text-background px-5 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity";

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-background/80 backdrop-blur-sm border rounded-2xl px-5 py-4">
          <div>
            <h1 className="text-2xl font-bold">Portfolio Admin</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your portfolio content</p>
          </div>
          <div className="flex items-center gap-3">
            {saveMsg && (
              <span className={`text-sm font-medium ${saveMsg.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>
                {saveMsg}
              </span>
            )}
            {saving && <span className="text-sm text-muted-foreground animate-pulse">Saving…</span>}
            <a href="/" target="_blank" className="text-sm text-muted-foreground hover:text-foreground border rounded-lg px-3 py-1.5 transition-colors bg-background/60">
              View Site ↗
            </a>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-48 shrink-0 space-y-1 bg-background/80 backdrop-blur-sm border rounded-2xl p-3 h-fit">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => { setActiveSection(s.id); if (s.id === "analytics") loadAnalytics(tokenRef.current); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeSection === s.id
                    ? "bg-foreground text-background"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <span>{s.emoji}</span> {s.label}
              </button>
            ))}
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 bg-background/80 backdrop-blur-sm border rounded-2xl p-6">

            {/* ── ANALYTICS ── */}
            {activeSection === "analytics" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Visitor Analytics</h2>
                  <button onClick={() => loadAnalytics(tokenRef.current)} className="text-xs border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors">
                    {analyticsLoading ? "Loading…" : "Refresh"}
                  </button>
                </div>

                {!analytics && !analyticsLoading && (
                  <p className="text-sm text-muted-foreground">Click Refresh to load visitor data.</p>
                )}

                {analyticsLoading && (
                  <div className="py-8 text-center text-muted-foreground animate-pulse text-sm">Loading analytics…</div>
                )}

                {analytics && (() => {
                  const visits = analytics.visits ?? [];
                  const total = visits.length;
                  const unique = new Set(visits.map((v) => v.ip)).size;
                  const today = new Date().toISOString().slice(0, 10);
                  const todayCount = visits.filter((v) => v.timestamp.startsWith(today)).length;
                  const refCounts: Record<string, number> = {};
                  visits.forEach((v) => {
                    const key = v.referrer === "direct" || !v.referrer ? "Direct" : (() => { try { return new URL(v.referrer).hostname; } catch { return v.referrer; } })();
                    refCounts[key] = (refCounts[key] ?? 0) + 1;
                  });
                  const topRefs = Object.entries(refCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
                  const mobilePct = total ? Math.round(visits.filter((v) => v.device?.includes("Mobile")).length / total * 100) : 0;

                  return (
                    <div className="space-y-5">
                      {/* Stats cards */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Total Visits", value: total },
                          { label: "Unique IPs", value: unique },
                          { label: "Today", value: todayCount },
                        ].map((s) => (
                          <div key={s.label} className="border rounded-xl p-3 bg-background/60 text-center">
                            <div className="text-2xl font-bold">{s.value}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Device + top referrers */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-xl p-4 bg-background/60">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">DEVICE SPLIT</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm"><span>📱 Mobile</span><span className="font-mono">{mobilePct}%</span></div>
                            <div className="flex justify-between text-sm"><span>🖥 Desktop</span><span className="font-mono">{100 - mobilePct}%</span></div>
                          </div>
                        </div>
                        <div className="border rounded-xl p-4 bg-background/60">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">TOP REFERRERS</p>
                          <div className="space-y-1">
                            {topRefs.length === 0 && <p className="text-xs text-muted-foreground">No data yet</p>}
                            {topRefs.map(([ref, count]) => (
                              <div key={ref} className="flex justify-between text-xs">
                                <span className="truncate max-w-[130px]">{ref}</span>
                                <span className="font-mono">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Recent visits */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">RECENT VISITS</p>
                        <div className="space-y-1.5 max-h-72 overflow-y-auto">
                          {visits.slice(0, 30).map((v, i) => (
                            <div key={i} className="border rounded-lg px-3 py-2 bg-background/60 text-xs flex flex-wrap gap-x-3 gap-y-0.5">
                              <span className="font-mono text-muted-foreground">{new Date(v.timestamp).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</span>
                              <span className="text-foreground font-medium">{v.location}</span>
                              <span className="text-muted-foreground">{v.device}</span>
                              <span className="text-muted-foreground truncate max-w-[200px]">{v.referrer === "direct" || !v.referrer ? "Direct" : v.referrer}</span>
                            </div>
                          ))}
                          {visits.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No visits recorded yet. Check back after you share the portfolio!</p>}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ── BIO ── */}
            {activeSection === "bio" && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold">Bio & Summary</h2>
                <Field label="Short Description (hero tagline)">
                  <Textarea value={description} onChange={setDescription} rows={2} />
                </Field>
                <Field label="Full Summary (About section)">
                  <Textarea value={summary} onChange={setSummary} rows={7} />
                </Field>
                <button disabled={saving} onClick={() => { save("description", description); save("summary", summary); }} className={btnBase}>
                  Save Bio
                </button>
              </div>
            )}

            {/* ── CONTACTS ── */}
            {activeSection === "contacts" && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold">Contacts</h2>
                <div className="rounded-xl bg-muted/30 border p-4 text-sm text-muted-foreground space-y-1">
                  <p>These update the contact buttons in the hero section.</p>
                  <p>Phone / KakaoTalk use the same number — Korean HRs find you on KakaoTalk via phone number.</p>
                </div>
                <Field label="Email address">
                  <Input
                    value={contacts.email}
                    onChange={(v) => setContacts({ ...contacts, email: v })}
                    placeholder="career@ismaildev.uz"
                  />
                </Field>
                <Field label="Phone number" sublabel="tel: link">
                  <Input
                    value={contacts.phone}
                    onChange={(v) => setContacts({ ...contacts, phone: v })}
                    placeholder="+821048960111"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Format: +82XXXXXXXXXX (international) or 010-XXXX-XXXX</p>
                </Field>
                <Field label="KakaoTalk ID" sublabel="카카오톡">
                  <Input
                    value={contacts.kakao}
                    onChange={(v) => setContacts({ ...contacts, kakao: v })}
                    placeholder="010-4896-0111"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Korean HRs add you by this number on KakaoTalk</p>
                </Field>
                <button disabled={saving} onClick={() => save("contacts", contacts)} className={btnBase}>
                  Save Contacts
                </button>
              </div>
            )}

            {/* ── SKILLS ── */}
            {activeSection === "skills" && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold">Skills</h2>
                <Field label="Comma-separated list">
                  <Textarea value={skillsText} onChange={setSkillsText} rows={5} placeholder="TypeScript, React, NestJS, ..." />
                </Field>
                <div className="flex flex-wrap gap-1.5 p-3 border rounded-lg bg-muted/30 min-h-12">
                  {skillsText.split(",").filter(Boolean).map((s, i) => (
                    <span key={i} className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">{s.trim()}</span>
                  ))}
                </div>
                <button disabled={saving} onClick={() => save("skills", skillsText.split(",").map((s) => s.trim()).filter(Boolean))} className={btnBase}>
                  Save Skills
                </button>
              </div>
            )}

            {/* ── WORK ── */}
            {activeSection === "work" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Work Experience</h2>
                  <button onClick={() => { setWorkForm(EMPTY_WORK); setEditWorkIdx(work.length); }} className="text-sm border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors">
                    + Add Entry
                  </button>
                </div>

                <div className="space-y-2">
                  {work.map((w, i) => (
                    <div key={i} className="flex items-start gap-3 border rounded-lg p-3 bg-background/60">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{w.company}</p>
                        <p className="text-xs text-muted-foreground">{w.title} {w.titleKo ? `· ${w.titleKo}` : ""}</p>
                        <p className="text-xs text-muted-foreground">{w.start} – {w.end ?? "Present"}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => { setWorkForm({ ...EMPTY_WORK, ...w }); setEditWorkIdx(i); }} className="text-xs border rounded px-2 py-1 hover:bg-muted transition-colors">Edit</button>
                        <button onClick={() => { const n = work.filter((_, j) => j !== i); setWork(n); save("work", n); }} className="text-xs border border-red-200 text-red-500 rounded px-2 py-1 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                {editWorkIdx !== null && (
                  <div className="border rounded-xl p-5 space-y-4 bg-muted/20">
                    <h3 className="font-semibold text-sm">{editWorkIdx < work.length ? "Edit" : "Add"} Work Entry</h3>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Company">
                        <Input value={workForm.company} onChange={(v) => setWorkForm({ ...workForm, company: v })} placeholder="Company name" />
                      </Field>
                      <Field label="Location">
                        <Input value={workForm.location} onChange={(v) => setWorkForm({ ...workForm, location: v })} placeholder="Seoul, South Korea" />
                      </Field>
                      <Field label="Start date">
                        <Input value={workForm.start} onChange={(v) => setWorkForm({ ...workForm, start: v })} placeholder="Aug 2025" />
                      </Field>
                      <Field label="End date">
                        <Input value={workForm.end ?? ""} onChange={(v) => setWorkForm({ ...workForm, end: v || null })} placeholder="Leave empty = Present" />
                      </Field>
                      <Field label="Website URL">
                        <Input value={workForm.href} onChange={(v) => setWorkForm({ ...workForm, href: v })} placeholder="https://..." />
                      </Field>
                      <Field label="Logo URL">
                        <Input value={workForm.logoUrl} onChange={(v) => setWorkForm({ ...workForm, logoUrl: v })} placeholder="https://..." />
                      </Field>
                    </div>

                    {/* Title EN + KO side by side */}
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Job Title" sublabel="EN">
                        <Input value={workForm.title} onChange={(v) => setWorkForm({ ...workForm, title: v })} placeholder="Software Engineer" />
                      </Field>
                      <Field label="직책" sublabel="한국어">
                        <Input value={workForm.titleKo} onChange={(v) => setWorkForm({ ...workForm, titleKo: v })} placeholder="소프트웨어 엔지니어" />
                      </Field>
                    </div>

                    {/* Description EN + KO */}
                    <Field label="Description" sublabel="EN">
                      <Textarea value={workForm.description} onChange={(v) => setWorkForm({ ...workForm, description: v })} rows={4} placeholder="Describe what you did..." />
                    </Field>
                    <Field label="설명" sublabel="한국어">
                      <Textarea value={workForm.descriptionKo} onChange={(v) => setWorkForm({ ...workForm, descriptionKo: v })} rows={4} placeholder="TypeScript, React, NestJS로 프로덕션 SaaS 앱 개발..." />
                    </Field>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          const n = [...work];
                          if (editWorkIdx < work.length) n[editWorkIdx] = workForm;
                          else n.push(workForm);
                          setWork(n);
                          save("work", n);
                          setEditWorkIdx(null);
                        }}
                        className={btnBase}
                      >
                        Save Entry
                      </button>
                      <button onClick={() => setEditWorkIdx(null)} className="text-sm text-muted-foreground hover:text-foreground px-2">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── PROJECTS ── */}
            {activeSection === "projects" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Projects</h2>
                  <button onClick={() => { setProjForm(EMPTY_PROJ); setEditProjIdx(projects.length); }} className="text-sm border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors">
                    + Add Project
                  </button>
                </div>

                <div className="space-y-2">
                  {projects.map((p, i) => (
                    <div key={i} className="flex items-start gap-3 border rounded-lg p-3 bg-background/60">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.dates}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.description.slice(0, 70)}…</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => { setProjForm({ ...EMPTY_PROJ, ...p }); setEditProjIdx(i); }} className="text-xs border rounded px-2 py-1 hover:bg-muted transition-colors">Edit</button>
                        <button onClick={() => { const n = projects.filter((_, j) => j !== i); setProjects(n); save("projects", n); }} className="text-xs border border-red-200 text-red-500 rounded px-2 py-1 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                {editProjIdx !== null && (
                  <div className="border rounded-xl p-5 space-y-4 bg-muted/20">
                    <h3 className="font-semibold text-sm">{editProjIdx < projects.length ? "Edit" : "Add"} Project</h3>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Title">
                        <Input value={projForm.title} onChange={(v) => setProjForm({ ...projForm, title: v })} placeholder="MediTech" />
                      </Field>
                      <Field label="Dates">
                        <Input value={projForm.dates} onChange={(v) => setProjForm({ ...projForm, dates: v })} placeholder="Aug 2024 - Present" />
                      </Field>
                      <Field label="Website URL">
                        <Input value={projForm.href} onChange={(v) => setProjForm({ ...projForm, href: v })} placeholder="https://..." />
                      </Field>
                      <Field label="Image URL">
                        <Input value={projForm.image} onChange={(v) => setProjForm({ ...projForm, image: v })} placeholder="https://..." />
                      </Field>
                    </div>

                    <Field label="Description" sublabel="EN">
                      <Textarea value={projForm.description} onChange={(v) => setProjForm({ ...projForm, description: v })} rows={4} />
                    </Field>
                    <Field label="설명" sublabel="한국어">
                      <Textarea value={projForm.descriptionKo} onChange={(v) => setProjForm({ ...projForm, descriptionKo: v })} rows={4} placeholder="NestJS, Next.js 기반 프로젝트..." />
                    </Field>

                    <Field label="Technologies (comma-separated)">
                      <Input
                        value={projForm.technologies.join(", ")}
                        onChange={(v) => setProjForm({ ...projForm, technologies: v.split(",").map((s) => s.trim()).filter(Boolean) })}
                        placeholder="NestJS, React, MongoDB, Docker"
                      />
                    </Field>

                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="active" checked={projForm.active} onChange={(e) => setProjForm({ ...projForm, active: e.target.checked })} />
                      <label htmlFor="active" className="text-xs text-muted-foreground">Active project</label>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          const n = [...projects];
                          if (editProjIdx < projects.length) n[editProjIdx] = projForm;
                          else n.push(projForm);
                          setProjects(n);
                          save("projects", n);
                          setEditProjIdx(null);
                        }}
                        className={btnBase}
                      >
                        Save Project
                      </button>
                      <button onClick={() => setEditProjIdx(null)} className="text-sm text-muted-foreground hover:text-foreground px-2">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── HACKATHONS ── */}
            {activeSection === "hackathons" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Hackathons</h2>
                  <button onClick={() => { setHackForm(EMPTY_HACK); setEditHackIdx(hackathons.length); }} className="text-sm border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors">
                    + Add Hackathon
                  </button>
                </div>

                <div className="space-y-2">
                  {hackathons.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 border rounded-lg p-3 bg-background/60">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{h.title}</p>
                        <p className="text-xs text-muted-foreground">{h.dates} · {h.location}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => { setHackForm({ ...h }); setEditHackIdx(i); }} className="text-xs border rounded px-2 py-1 hover:bg-muted transition-colors">Edit</button>
                        <button onClick={() => { const n = hackathons.filter((_, j) => j !== i); setHackathons(n); save("hackathons", n); }} className="text-xs border border-red-200 text-red-500 rounded px-2 py-1 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                {editHackIdx !== null && (
                  <div className="border rounded-xl p-5 space-y-4 bg-muted/20">
                    <h3 className="font-semibold text-sm">{editHackIdx < hackathons.length ? "Edit" : "Add"} Hackathon</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Title">
                        <Input value={hackForm.title} onChange={(v) => setHackForm({ ...hackForm, title: v })} />
                      </Field>
                      <Field label="Dates">
                        <Input value={hackForm.dates} onChange={(v) => setHackForm({ ...hackForm, dates: v })} />
                      </Field>
                      <Field label="Location">
                        <Input value={hackForm.location} onChange={(v) => setHackForm({ ...hackForm, location: v })} />
                      </Field>
                      <Field label="Image URL">
                        <Input value={hackForm.image} onChange={(v) => setHackForm({ ...hackForm, image: v })} />
                      </Field>
                    </div>
                    <Field label="Description">
                      <Textarea value={hackForm.description} onChange={(v) => setHackForm({ ...hackForm, description: v })} rows={4} />
                    </Field>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          const n = [...hackathons];
                          if (editHackIdx < hackathons.length) n[editHackIdx] = hackForm;
                          else n.push(hackForm);
                          setHackathons(n);
                          save("hackathons", n);
                          setEditHackIdx(null);
                        }}
                        className={btnBase}
                      >
                        Save
                      </button>
                      <button onClick={() => setEditHackIdx(null)} className="text-sm text-muted-foreground hover:text-foreground px-2">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
