import dns from "dns";
import { execFile } from "child_process";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// Force IPv4 — server blocks IPv6 to Telegram
dns.setDefaultResultOrder("ipv4first");

const ANALYTICS_PATH = path.join(process.cwd(), "analytics.json");

// In-memory rate limit: 1 Telegram notification per IP per 30 min
const notifiedAt = new Map<string, number>();
// Track clicks separately (5 min per IP per event)
const clickNotifiedAt = new Map<string, number>();

interface Visit {
  ip: string;
  page: string;
  referrer: string;
  device: string;
  location: string;
  timestamp: string;
  event?: string;
}

function readAnalytics(): { visits: Visit[] } {
  try {
    return JSON.parse(fs.readFileSync(ANALYTICS_PATH, "utf-8"));
  } catch {
    return { visits: [] };
  }
}

function writeAnalytics(data: { visits: Visit[] }) {
  try {
    fs.writeFileSync(ANALYTICS_PATH, JSON.stringify(data, null, 2));
  } catch {}
}

// Use curl via child_process — Node.js fetch uses undici which fails with IPv6
// execFile is safe against shell injection since args are passed as array
function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return Promise.resolve();
  return new Promise((resolve) => {
    execFile(
      "curl",
      [
        "-s", "-4", "-m", "10",
        `https://api.telegram.org/bot${token}/sendMessage`,
        "--data-urlencode", `chat_id=${chatId}`,
        "--data-urlencode", `text=${text}`,
        "-d", "parse_mode=HTML",
      ],
      { timeout: 12000 },
      (err) => {
        if (err) console.error("[track] Telegram error:", err.message);
        resolve();
      }
    );
  });
}

async function getLocation(ip: string): Promise<string> {
  if (!ip || ip === "unknown" || ip === "127.0.0.1" || ip === "::1" ||
      ip.startsWith("192.168") || ip.startsWith("10.")) {
    return "Local";
  }
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,regionName`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return "Unknown";
    const data = await res.json() as { status: string; city?: string; regionName?: string; country?: string };
    if (data.status !== "success") return "Unknown";
    return [data.city, data.regionName, data.country].filter(Boolean).join(", ") || "Unknown";
  } catch {
    return "Unknown";
  }
}

function parseDevice(ua: string): string {
  const mobile = /mobile|android|iphone|ipad|tablet/i.test(ua);
  let browser = "Browser";
  if (ua.includes("Chrome") && !ua.includes("Chromium") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Edg")) browser = "Edge";
  return `${mobile ? "📱 Mobile" : "🖥 Desktop"} · ${browser}`;
}

function formatRef(referrer: string): string {
  if (!referrer || referrer === "direct") return "Direct";
  try { return new URL(referrer).hostname; } catch { return referrer; }
}

export async function POST(req: NextRequest) {
  try {
    // Real IP: CF-Connecting-IP > X-Forwarded-For first element > X-Real-IP
    const ip =
      req.headers.get("cf-connecting-ip") ??
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";
    const ua = req.headers.get("user-agent") ?? "";
    const referrer = req.headers.get("referer") ?? "direct";
    const body = await req.json().catch(() => ({})) as Record<string, string>;
    const page = body.page ?? "/";
    const event = body.event ?? "";  // e.g. "resume_download", "phone_cta", "kakao_cta", "email_cta"

    // Skip admin
    if (page.startsWith("/admin")) return NextResponse.json({ ok: true });

    const device = parseDevice(ua);
    const location = await getLocation(ip);
    const timestamp = new Date().toISOString();

    // Persist
    const analytics = readAnalytics();
    analytics.visits.unshift({ ip, page, referrer, device, location, timestamp, event: event || undefined });
    if (analytics.visits.length > 2000) analytics.visits = analytics.visits.slice(0, 2000);
    writeAnalytics(analytics);

    const now = Date.now();
    const kst = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul", dateStyle: "short", timeStyle: "short" });
    const ref = formatRef(referrer);
    const isLocal = ip === "127.0.0.1" || ip === "::1" || ip === "unknown";

    if (isLocal) return NextResponse.json({ ok: true });

    if (event) {
      // Click event — rate limit 5 min per IP+event combo
      const clickKey = `${ip}:${event}`;
      const lastClick = clickNotifiedAt.get(clickKey) ?? 0;
      if (now - lastClick > 5 * 60 * 1000) {
        clickNotifiedAt.set(clickKey, now);
        const LABELS: Record<string, string> = {
          resume_download: "⬇️ Downloaded <b>Resume</b>",
          phone_cta:       "📞 Clicked <b>Call Now</b>",
          kakao_cta:       "💬 Clicked <b>KakaoTalk</b>",
          email_cta:       "✉️ Clicked <b>Email Me</b>",
        };
        const label = LABELS[event] ?? `🖱 Clicked: ${event}`;
        await sendTelegram(`${label}\n\n📍 ${location} · ${device}\n⏰ ${kst} KST`);
      }
    } else {
      // Page view — rate limit 30 min per IP
      const lastVisit = notifiedAt.get(ip) ?? 0;
      if (now - lastVisit > 30 * 60 * 1000) {
        notifiedAt.set(ip, now);
        const msg =
          `🌐 <b>Portfolio Visit!</b>\n\n` +
          `📍 ${location}\n` +
          `${device}\n` +
          `🔗 From: ${ref}\n` +
          `📄 Page: ${page}\n` +
          `⏰ ${kst} KST\n\n` +
          `👆 <i>You'll get another message if they click something</i>`;
        await sendTelegram(msg);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}

// Admin: GET analytics
export async function GET(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(readAnalytics());
}
