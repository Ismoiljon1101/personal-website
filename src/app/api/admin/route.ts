import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const DYNAMIC_PATH = path.join(process.cwd(), "src/data/dynamic.json");

function checkAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  return token === process.env.ADMIN_PASSWORD;
}

// GET — return current dynamic overrides
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const raw = fs.readFileSync(DYNAMIC_PATH, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({});
  }
}

// POST — save a section override
// Body: { section: "projects" | "work" | "skills" | "description" | "summary" | "hackathons", data: any }
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { section, data } = body;

    const allowed = ["projects", "work", "skills", "description", "summary", "hackathons", "contacts"];
    if (!allowed.includes(section)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    let current: Record<string, unknown> = {};
    try {
      current = JSON.parse(fs.readFileSync(DYNAMIC_PATH, "utf-8"));
    } catch {}

    current[section] = data;
    fs.writeFileSync(DYNAMIC_PATH, JSON.stringify(current, null, 2), "utf-8");

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// DELETE — clear all overrides (reset to static)
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  fs.writeFileSync(DYNAMIC_PATH, "{}", "utf-8");
  return NextResponse.json({ ok: true });
}
