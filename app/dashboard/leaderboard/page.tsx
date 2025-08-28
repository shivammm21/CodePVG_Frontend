"use client";

import React, { useMemo } from "react";
import { CheckCircle2, Star } from "lucide-react";

/*
  Leaderboard page: includes full-width 12-month streak heatmap
  placed above the leaderboard list. Ranks are shown as #1, #2, ...
*/

type LeaderboardUser = {
  id: string;
  name: string;
  score: number;
  streakDays: number;
};

const SAMPLE_USERS: LeaderboardUser[] = [
  { id: "u1", name: "Aditi", score: 1240, streakDays: 120 },
  { id: "u2", name: "Rahul", score: 1185, streakDays: 95 },
  { id: "u3", name: "Ishita", score: 1102, streakDays: 60 },
  { id: "u4", name: "Sahil", score: 975, streakDays: 10 },
  { id: "u5", name: "Neha", score: 942, streakDays: 5 },
  // ...more users as needed
];

// compact 12-month heatmap (visual only)
function StreakHeatmap() {
  // We'll render 12 columns (months) each column with 4 rows of squares representing weeks (approx)
  const months = new Array(12).fill(0).map((_, i) => i);
  const levelFor = (m: number, r: number) => ((m * 5 + r * 3) % 5); // deterministic variation
  return (
    <div className="w-full mb-6">
      <div className="text-sm font-semibold mb-3">12-month streak</div>
      <div className="grid grid-cols-12 gap-2">
        {months.map((m) => (
          <div key={m} className="flex flex-col gap-2 items-center">
            {new Array(5).fill(0).map((_, r) => {
              const level = levelFor(m, r);
              const cls =
                level === 0 ? "bg-muted" :
                level === 1 ? "bg-accent/25" :
                level === 2 ? "bg-accent/45" :
                level === 3 ? "bg-accent/70" : "bg-accent";
              return <div key={r} className={`${cls} w-6 h-3 rounded-sm`} />;
            })}
            <div className="text-xs text-muted-foreground mt-1">{`M${m+1}`}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const users = useMemo(() => SAMPLE_USERS.sort((a, b) => b.score - a.score), []);
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="rounded-xl bg-card border border-border p-6">
        <h2 className="text-lg font-semibold mb-4">Leaderboard</h2>

        {/* Streak Heatmap full width */}
        <StreakHeatmap />

        {/* Leaderboard list */}
        <div className="space-y-3">
          {users.map((u, idx) => (
            <div key={u.id} className="p-3 rounded-lg border border-border/60 bg-background/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full grid place-items-center font-semibold bg-muted text-foreground">
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
  );
}
