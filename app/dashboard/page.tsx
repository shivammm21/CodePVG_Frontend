"use client";

import React, { useMemo, useState } from "react";
import {
  Trophy,
  Star,
  Target,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/*
  Dashboard: Removed leaderboard & streak. Focus on year-wise DSA
  problems grouped by difficulty; each difficulty section has a progress
  bar + problem cards.
*/

type ProblemItem = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  solved: boolean;
  year: "First Year" | "Second Year" | "Third Year" | "Final Year";
};

const ALL_PROBLEMS: ProblemItem[] = [
  { id: "two-sum", title: "Two Sum", difficulty: "Easy", tags: ["Array", "Hashmap"], solved: true, year: "First Year" },
  { id: "max-subarray", title: "Maximum Subarray", difficulty: "Medium", tags: ["Array", "Kadane"], solved: false, year: "First Year" },
  { id: "rotate-array", title: "Rotate Array", difficulty: "Easy", tags: ["Array"], solved: true, year: "First Year" },
  { id: "linked-list-reverse", title: "Reverse Linked List", difficulty: "Easy", tags: ["Linked List"], solved: false, year: "Second Year" },
  { id: "stack-min", title: "Min Stack", difficulty: "Medium", tags: ["Stack"], solved: false, year: "Second Year" },
  { id: "binary-tree-inorder", title: "Binary Tree Inorder", difficulty: "Medium", tags: ["Tree"], solved: false, year: "Third Year" },
  { id: "dijkstra", title: "Dijkstra", difficulty: "Hard", tags: ["Graph", "Shortest Path"], solved: false, year: "Final Year" },
  // ... add more realistic sample problems or pull from your backend
];

export default function DashboardPage() {
  const years = ["First Year", "Second Year", "Third Year", "Final Year"] as const;
  const [activeYear, setActiveYear] = useState<typeof years[number]>("First Year");

  // compute difficulty buckets for the selected year
  const yearProblems = useMemo(() => ALL_PROBLEMS.filter((p) => p.year === activeYear), [activeYear]);

  const groupByDifficulty = useMemo(() => {
    const map: Record<string, ProblemItem[]> = { Easy: [], Medium: [], Hard: [] };
    yearProblems.forEach((p) => map[p.difficulty].push(p));
    return map;
  }, [yearProblems]);

  const progressFor = (difficulty: "Easy" | "Medium" | "Hard") => {
    const list = groupByDifficulty[difficulty] || [];
    const total = list.length;
    const solved = list.filter((p) => p.solved).length;
    const pct = total === 0 ? 0 : Math.round((solved / total) * 100);
    return { total, solved, pct };
  };

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Top cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10"><Trophy className="text-accent" /></div>
            <div>
              <div className="text-xs text-muted-foreground">Rank</div>
              <div className="text-2xl font-bold">#12</div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10"><Star className="text-secondary" /></div>
            <div>
              <div className="text-xs text-muted-foreground">Badges</div>
              <div className="text-2xl font-bold">8</div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-3/10"><Target className="text-chart-3" /></div>
            <div>
              <div className="text-xs text-muted-foreground">Weekly Goal</div>
              <div className="text-2xl font-bold">5/7</div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
          <div className="text-xs text-muted-foreground">Total Problems Solved</div>
          <div className="text-2xl font-bold">
            {ALL_PROBLEMS.filter((p) => p.solved).length}
          </div>
        </div>
      </div>

      {/* Year-wise problems - full width */}
      <div className="rounded-xl bg-card border border-border p-6 shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Year-wise DSA Problems</h2>
          <div className="flex gap-2">
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setActiveYear(y)}
                className={`px-3 py-1 rounded-md text-sm ${
                  y === activeYear ? "bg-accent text-accent-foreground" : "bg-muted hover:bg-accent/10"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty progress bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {(["Easy", "Medium", "Hard"] as const).map((d) => {
            const { total, solved, pct } = progressFor(d);
            const color = d === "Easy" ? "bg-green-500" : d === "Medium" ? "bg-amber-500" : "bg-rose-500";
            return (
              <div key={d} className="p-4 rounded-md border border-border/60 bg-background/60">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{d}</div>
                  <div className="text-sm text-muted-foreground">{solved}/{total}</div>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="text-xs text-muted-foreground mt-2">{pct}% solved</div>
              </div>
            );
          })}
        </div>

        {/* Problems list (cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {yearProblems.length === 0 && (
            <div className="p-4 text-muted-foreground">No problems for this year yet.</div>
          )}

          {yearProblems.map((p) => (
            <div key={p.id} className="p-4 rounded-lg bg-card border border-border/60 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium">{p.title}</h3>
                  <div className={`text-xs px-2 py-1 rounded-full ${p.difficulty === "Easy" ? "bg-green-100 text-green-700" : p.difficulty === "Medium" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                    {p.difficulty}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {p.tags.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">{p.year}</div>
                <div className="flex items-center gap-2 text-sm">
                  {p.solved ? (
                    <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Solved</span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1"><XCircle className="w-4 h-4" /> Not Solved</span>
                  )}
                  <button className="px-3 py-1 rounded-md bg-accent/10 text-accent text-sm">Open</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
