import type { APIRoute } from "astro";

export const prerender = false;

interface ContributionDay {
  weekday: number;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionWeek {
  index: number;
  first_day: string;
  contribution_days: ContributionDay[];
}

interface ContributionData {
  schema: string;
  generated_at: string;
  from: string;
  to: string;
  range_days: number;
  total_contributions: number;
  private_contributions_included: boolean;
  colors_full: string[];
  weeks: ContributionWeek[];
}

const USERNAME_RE = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const cache = new Map<string, { data: ContributionData; cachedAt: number }>();

function json(body: unknown, status: number, extra?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...extra },
  });
}

export const GET: APIRoute = async ({ params }) => {
  const username = params.username ?? "";

  if (!USERNAME_RE.test(username)) {
    return json({ error: "Invalid username" }, 400);
  }

  const key = username.toLowerCase();
  const cached = cache.get(key);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return json(cached.data, 200, { "X-Cache": "HIT" });
  }

  let response: Response;
  try {
    response = await fetch(`https://github.com/${key}.contribs`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "mona-mayhem",
      },
    });
  } catch {
    return json({ error: "Failed to reach GitHub" }, 502);
  }

  if (response.status === 404) {
    return json({ error: "User not found" }, 404);
  }
  if (!response.ok) {
    return json({ error: "GitHub returned an unexpected response" }, 502);
  }

  const data = (await response.json()) as ContributionData;
  cache.set(key, { data, cachedAt: Date.now() });

  return json(data, 200, { "X-Cache": "MISS" });
};
