"use client";

import React, { useMemo } from "react";

/**
 * Leaderboard page with two separate cards:
 *  - 🔥 12-Month Streak (full-width card)
 *  - 🏆 Leaderboard Rankings (card)
 *
 * Uses only Tailwind and simple deterministic data so it renders identically server/client.
 */

type LBUser = {
  id: string;
  name: string;
  score: number;
  streakDays: number;
};

const SAMPLE_USERS: LBUser[] = [
  { id: "u1", name: "Aditi", score: 1240, streakDays: 120 },
  { id: "u2", name: "Rahul", score: 1185, streakDays: 95 },
  { id: "u3", name: "Ishita", score: 1102, streakDays: 60 },
  { id: "u4", name: "Sahil", score: 975, streakDays: 10 },
  { id: "u5", name: "Neha", score: 942, streakDays: 5 },
];

function MonthColumn({ monthIndex }: { monthIndex: number }) {
  // deterministic pattern of 5 levels for each month for nice visuals
  const levels = [0, 1, 2, 3, 4].map((r) => ((monthIndex * 3 + r * 2) % 5));
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col gap-1">
        {levels.map((lvl, i) => {
          const cls =
            lvl === 0
              ? "bg-muted"
              : lvl === 1
              ? "bg-accent/25"
              : lvl === 2
              ? "bg-accent/45"
              : lvl === 3
              ? "bg-accent/70"
              : "bg-accent";
          return <div key={i} className={`${cls} w-8 h-2 rounded-sm`} />;
        })}
      </div>
      <div className="text-xs text-muted-foreground mt-2">M{monthIndex + 1}</div>
    </div>
  );
}

export default function LeaderboardPage() {
  const users = useMemo(() => SAMPLE_USERS.sort((a, b) => b.score - a.score), []);
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Streak card */}
        <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">🔥 12-Month Streak</h3>
            <div className="text-sm text-muted-foreground">Overview</div>
          </div>

          <div className="w-full">
            <div className="flex gap-4 items-start justify-between">
              {/* Legend left */}
              <div className="w-48 text-sm">
                <div className="font-medium mb-2">Streak intensity</div>
                <div className="flex gap-2 items-center text-xs text-muted-foreground">
                  <div className="w-6 h-2 rounded-sm bg-muted" />
                  <span>None</span>
                </div>
                <div className="flex gap-2 items-center text-xs text-muted-foreground mt-1">
                  <div className="w-6 h-2 rounded-sm bg-accent/25" />
                  <span>Low</span>
                </div>
                <div className="flex gap-2 items-center text-xs text-muted-foreground mt-1">
                  <div className="w-6 h-2 rounded-sm bg-accent/45" />
                  <span>Medium</span>
                </div>
                <div className="flex gap-2 items-center text-xs text-muted-foreground mt-1">
                  <div className="w-6 h-2 rounded-sm bg-accent/70" />
                  <span>High</span>
                </div>
              </div>

              {/* Full width heatmap */}
              <div className="flex-1">
                <div className="grid grid-cols-12 gap-6 items-end">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <MonthColumn key={i} monthIndex={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard card */}
        <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">🏆 Leaderboard Rankings</h3>
            <div className="text-sm text-muted-foreground">Top performers</div>
          </div>

          <div className="space-y-3">
            {users.map((u, idx) => (
              <div
                key={u.id}
                className="p-3 rounded-lg border border-border/60 bg-background/50 flex items-center justify-between transition-transform hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full grid place-items-center bg-muted text-foreground font-bold">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">Streak: {u.streakDays} days</div>
                  </div>
                </div>

                <div className="text-sm font-semibold">{u.score} pts</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
