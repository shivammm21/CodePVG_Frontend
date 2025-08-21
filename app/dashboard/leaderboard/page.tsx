// app/dashboard/leaderboard/page.tsx
"use client";

import { useMemo } from "react";

/** Full-year heatmap (52–53 weeks) — deterministic, no random, SSR-safe */
function YearHeatmap({
  months = 12,
  square = 9,
  gap = 2,
}: {
  months?: number;
  square?: number;
  gap?: number;
}) {
  // Build ~52 weeks worth of columns.
  const weeks = 53;
  const cols = new Array(weeks).fill(0).map((_, i) => i);

  // Fake stable intensity 0..4 (depends on week/day indexes only)
  const levelFor = (week: number, day: number) => ((week * 7 + day * 3 + 2) % 5);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-[2px]">
        {cols.map((w) => (
          <div key={w} className="flex flex-col gap-[2px]" style={{ marginRight: gap }}>
            {new Array(7).fill(0).map((_, d) => {
              const lvl = levelFor(w, d);
              const cls =
                lvl === 0 ? "bg-accent/10" : lvl === 1 ? "bg-accent/25" : lvl === 2 ? "bg-accent/45" : lvl === 3 ? "bg-accent/70" : "bg-accent";
              return <div key={`${w}-${d}`} className={`rounded-[2px] ${cls}`} style={{ width: square, height: square }} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const board = useMemo(
    () => [
      { name: "Aditi", pts: 1340 },
      { name: "Rahul", pts: 1285 },
      { name: "Ishita", pts: 1202 },
      { name: "Sahil", pts: 1040 },
      { name: "Neha", pts: 992 },
    ],
    []
  );

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Leaderboard</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-xl border border-border/70 bg-card">
          <div className="p-4 border-b border-border/70 font-semibold">Top Students</div>
          <div className="p-4 space-y-3">
            {board.map((u, i) => (
              <div key={u.name} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/60">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full grid place-items-center text-xs font-bold ${
                    i === 0 ? "bg-yellow-400/30 text-yellow-800"
                    : i === 1 ? "bg-gray-300/30 text-gray-800"
                    : i === 2 ? "bg-amber-500/30 text-amber-900"
                    : "bg-muted text-foreground/70"
                  }`}>{i + 1}</div>
                  <span className="font-medium">{u.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{u.pts} pts</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-card">
          <div className="p-4 border-b border-border/70">
            <div className="font-semibold">12-Month Streak Heatmap</div>
            <div className="text-xs text-muted-foreground">Contribution activity (theme-aware)</div>
          </div>
          <div className="p-4">
            <YearHeatmap square={9} gap={2} />
          </div>
        </div>
      </div>
    </div>
  );
}
