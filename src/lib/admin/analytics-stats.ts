import type { SupabaseClient } from "@supabase/supabase-js";

export interface PeriodCounts {
  pv: number;
  uv: number;
}

export interface DashboardStats {
  persisted: boolean;
  total: { pv: PeriodCounts; share: number };
  today: { pv: PeriodCounts; share: number };
  yesterday: { pv: PeriodCounts; share: number };
}

function startOfUtcDay(d: Date): string {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  ).toISOString();
}

function emptyPeriod(): PeriodCounts {
  return { pv: 0, uv: 0 };
}

export async function fetchDashboardStats(
  supabase: SupabaseClient | null
): Promise<DashboardStats> {
  const empty: DashboardStats = {
    persisted: false,
    total: { pv: emptyPeriod(), share: 0 },
    today: { pv: emptyPeriod(), share: 0 },
    yesterday: { pv: emptyPeriod(), share: 0 },
  };

  if (!supabase) return empty;

  const now = new Date();
  const todayStart = startOfUtcDay(now);
  const yesterday = new Date(now);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayStart = startOfUtcDay(yesterday);

  const { data: events, error } = await supabase
    .from("analytics_events")
    .select("event_type, session_id, created_at")
    .in("event_type", ["page_view", "share"]);

  if (error || !events) {
    return { ...empty, persisted: true };
  }

  const stats: DashboardStats = {
    persisted: true,
    total: { pv: emptyPeriod(), share: 0 },
    today: { pv: emptyPeriod(), share: 0 },
    yesterday: { pv: emptyPeriod(), share: 0 },
  };

  const uvSets = {
    total: new Set<string>(),
    today: new Set<string>(),
    yesterday: new Set<string>(),
  };

  for (const e of events) {
    const ts = e.created_at as string;
    const isToday = ts >= todayStart;
    const isYesterday = ts >= yesterdayStart && ts < todayStart;
    const sid = (e.session_id as string) || "";

    if (e.event_type === "page_view") {
      stats.total.pv.pv++;
      if (sid) uvSets.total.add(sid);
      if (isToday) {
        stats.today.pv.pv++;
        if (sid) uvSets.today.add(sid);
      }
      if (isYesterday) {
        stats.yesterday.pv.pv++;
        if (sid) uvSets.yesterday.add(sid);
      }
    }

    if (e.event_type === "share") {
      stats.total.share++;
      if (isToday) stats.today.share++;
      if (isYesterday) stats.yesterday.share++;
    }
  }

  stats.total.pv.uv = uvSets.total.size;
  stats.today.pv.uv = uvSets.today.size;
  stats.yesterday.pv.uv = uvSets.yesterday.size;

  return stats;
}
