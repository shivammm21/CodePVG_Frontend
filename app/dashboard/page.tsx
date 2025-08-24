// app/dashboard/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Trophy, Flame, Star, Target, BookOpen } from "lucide-react";

/* Reusable Card */
function Card({
  className = "",
  children,
  title,
  subtitle,
  right,
}: {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl bg-card border border-border/70 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {(title || right) && (
        <div className="flex items-center justify-between px-5 pt-4">
          {title && (
            <div>
              <h3 className="text-base font-semibold">{title}</h3>
              {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
          )}
          {right}
        </div>
      )}
      <div className={title ? "p-5 pt-4" : "p-5"}>{children}</div>
    </div>
  );
}

/* Donut (pure SVG, no libs) */
function DonutChart({
  data,
  size = 140,
  stroke = 14,
}: {
  data: { label: string; value: number; colorVar: string }[];
  size?: number;
  stroke?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  let acc = 0;
  const segments = data.map((d) => {
    const frac = d.value / total;
    const dash = frac * circumference;
    const seg = { ...d, dash, offset: circumference - acc };
    acc += dash;
    return seg;
  });

  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} className="shrink-0">
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle r={radius} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
          {segments.map((s, i) => (
            <circle
              key={s.label + i}
              r={radius}
              fill="none"
              stroke={`var(${s.colorVar})`}
              strokeWidth={stroke}
              strokeDasharray={`${s.dash} ${circumference}`}
              strokeDashoffset={s.offset}
              strokeLinecap="round"
              transform="rotate(-90)"
            />
          ))}
          <text textAnchor="middle" dominantBaseline="central" className="fill-foreground" style={{ fontSize: 18, fontWeight: 700 }}>
            {Math.round((data[0].value / total) * 100)}%
          </text>
        </g>
      </svg>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-sm">
            <span className="inline-block w-3 h-3 rounded" style={{ background: `var(${d.colorVar})` }} />
            <span className="text-muted-foreground w-28">{d.label}</span>
            <span className="font-medium">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Compact streak strip (not full-year here) */
function StreakStrip({ weeks = 16, square = 10, gap = 2 }: { weeks?: number; square?: number; gap?: number }) {
  const cols = new Array(weeks).fill(0).map((_, i) => i);
  const levelFor = (week: number, day: number) => ((week * 3 + day * 2 + 1) % 5);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1">
        {cols.map((w) => (
          <div key={w} className="flex flex-col gap-1" style={{ marginRight: gap }}>
            {new Array(7).fill(0).map((_, d) => {
              const lvl = levelFor(w, d);
              const cls =
                lvl === 0 ? "bg-accent/10" : lvl === 1 ? "bg-accent/25" : lvl === 2 ? "bg-accent/45" : lvl === 3 ? "bg-accent/70" : "bg-accent";
              return <div key={`${w}-${d}`} className={`rounded-sm ${cls}`} style={{ width: square, height: square }} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const [yearTab, setYearTab] = useState("First Year");

  // mock, deterministic
  const solved = { easy: 46, medium: 31, hard: 9 };
  const donutData = useMemo(
    () => [
      { label: "Easy", value: solved.easy, colorVar: "--chart-3" },
      { label: "Medium", value: solved.medium, colorVar: "--chart-1" },
      { label: "Hard", value: solved.hard, colorVar: "--chart-4" },
    ],
    []
  );

  const yearProgress = [
    { name: "First Year", pct: 76 },
    { name: "Second Year", pct: 54 },
    { name: "Third Year", pct: 28 },
    { name: "Final Year", pct: 12 },
  ];

  const problemsForYear: Record<string, string[]> = {
    "First Year": ["Array Basics", "Two Sum", "Binary Search", "Recursion"],
    "Second Year": ["Linked List", "Stack & Queue", "Sliding Window", "Sorting"],
    "Third Year": ["Trees Intro", "BST Inorder", "Heaps", "Greedy"],
    "Final Year": ["Graphs BFS", "Dijkstra", "Union-Find", "DP Knapsack"],
  };

  const leaderboard = [
    { name: "Aditi", score: 1240 },
    { name: "Rahul", score: 1185 },
    { name: "Ishita", score: 1102 },
    { name: "Sahil", score: 975 },
    { name: "Neha", score: 942 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/15"><Trophy className="text-accent" /></div>
            <div><p className="text-xs text-muted-foreground">Rank</p><div className="text-2xl font-bold">#12</div></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/15"><Flame className="text-secondary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Streak</p>
              <div className="text-2xl font-bold flex items-center gap-2">27 days <Flame className="w-5 h-5 text-secondary" /></div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/15"><Star className="text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">Badges</p><div className="text-2xl font-bold">8</div></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-3/15"><Target className="text-chart-3" /></div>
            <div><p className="text-xs text-muted-foreground">Weekly Goal</p><div className="text-2xl font-bold">5/7</div></div>
          </div>
        </Card>
      </div>

      {/* Charts & Streak */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card title="Solved by Difficulty" subtitle="Easy / Medium / Hard"><DonutChart data={donutData} /></Card>

        <Card title="Year-wise Completion" subtitle="Progress across semesters">
          <div className="space-y-4">
            {yearProgress.map((y) => (
              <div key={y.name}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{y.name}</span>
                  <span className="font-medium">{y.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-accent" style={{ width: `${y.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Streak (last 16 weeks)" subtitle="Daily problem-solving activity">
          <StreakStrip weeks={16} square={10} gap={2} />
        </Card>
      </div>

      {/* Year-wise Problems (teaser) */}
      <Card title="Year-wise DSA Problems">
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.keys(problemsForYear).map((y) => (
            <a key={y} href="/dashboard/problems" className="px-4 py-2 rounded-lg border text-sm bg-muted hover:bg-accent/10">
              {y}
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {problemsForYear["First Year"].map((pb) => (
            <div key={pb} className="p-4 rounded-lg bg-card border border-border/60 flex items-center justify-between hover:shadow-md transition">
              <div className="font-medium">{pb}</div>
              <BookOpen className="text-muted-foreground" />
            </div>
          ))}
        </div>
      </Card>

      {/* Leaderboard snapshot */}
      <Card title="Leaderboard Snapshot">
        <div className="space-y-3">
          {leaderboard.map((u, i) => (
            <div key={u.name} className="flex items-center justify-between p-3 rounded-lg bg-card/80 border border-border/60">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold ${
                  i === 0 ? "bg-yellow-400/30 text-yellow-800"
                  : i === 1 ? "bg-gray-300/30 text-gray-800"
                  : i === 2 ? "bg-amber-500/30 text-amber-900"
                  : "bg-muted text-foreground/70"
                }`}>{i + 1}</div>
                <span className="font-medium">{u.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{u.score} pts</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
