"use client";

import React, { useMemo, useState } from "react";
import {
  Trophy,
  Star,
  Target,
  CheckCircle2,
  XCircle,
  Check,
  Circle,
  BarChart3,
  LogOut,
  User,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";

type ProblemItem = {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  solved: boolean;
  acceptance: number;
  year: "First Year" | "Second Year" | "Third Year" | "Final Year";
  frequency?: number;
};



const ALL_PROBLEMS: ProblemItem[] = [
  { id: 1, title: "Two Sum", difficulty: "Easy", tags: ["Array", "Hash Table"], solved: true, acceptance: 56.2, year: "First Year" },
  { id: 2, title: "Add Two Numbers", difficulty: "Medium", tags: ["Linked List", "Math"], solved: true, acceptance: 46.8, year: "First Year" },
  { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", tags: ["Hash Table", "String"], solved: true, acceptance: 37.4, year: "First Year" },
  { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", tags: ["Array", "Binary Search"], solved: false, acceptance: 44.5, year: "First Year" },
  { id: 5, title: "Longest Palindromic Substring", difficulty: "Medium", tags: ["String", "Dynamic Programming"], solved: false, acceptance: 36.3, year: "First Year" },
  { id: 6, title: "Zigzag Conversion", difficulty: "Medium", tags: ["String"], solved: true, acceptance: 52.2, year: "First Year" },
  { id: 7, title: "Reverse Integer", difficulty: "Medium", tags: ["Math"], solved: true, acceptance: 30.7, year: "First Year" },
  { id: 8, title: "String to Integer (atoi)", difficulty: "Medium", tags: ["String"], solved: true, acceptance: 19.7, year: "First Year" },
  { id: 9, title: "Palindrome Number", difficulty: "Easy", tags: ["Math"], solved: true, acceptance: 59.6, year: "First Year" },
  { id: 10, title: "Regular Expression Matching", difficulty: "Hard", tags: ["String", "Dynamic Programming"], solved: false, acceptance: 29.6, year: "First Year" },
  { id: 11, title: "Container With Most Water", difficulty: "Medium", tags: ["Array", "Two Pointers"], solved: true, acceptance: 58.2, year: "Second Year" },
  { id: 12, title: "Integer to Roman", difficulty: "Medium", tags: ["Hash Table", "Math"], solved: true, acceptance: 69.2, year: "Second Year" },
  { id: 13, title: "Roman to Integer", difficulty: "Easy", tags: ["Hash Table", "Math"], solved: false, acceptance: 65.3, year: "Second Year" },
  { id: 14, title: "Longest Common Prefix", difficulty: "Easy", tags: ["String"], solved: true, acceptance: 46.0, year: "Second Year" },
  { id: 15, title: "3Sum", difficulty: "Medium", tags: ["Array", "Two Pointers"], solved: false, acceptance: 37.6, year: "Second Year" },
  { id: 16, title: "3Sum Closest", difficulty: "Medium", tags: ["Array", "Two Pointers"], solved: false, acceptance: 46.2, year: "Third Year" },
  { id: 17, title: "Letter Combinations of a Phone Number", difficulty: "Medium", tags: ["Hash Table", "String"], solved: false, acceptance: 65.8, year: "Third Year" },
  { id: 18, title: "4Sum", difficulty: "Medium", tags: ["Array", "Two Pointers"], solved: false, acceptance: 38.4, year: "Third Year" },
  { id: 19, title: "Remove Nth Node From End of List", difficulty: "Medium", tags: ["Linked List", "Two Pointers"], solved: false, acceptance: 45.2, year: "Final Year" },
  { id: 20, title: "Valid Parentheses", difficulty: "Easy", tags: ["String", "Stack"], solved: true, acceptance: 42.8, year: "Final Year" },
];

function DashboardContent() {
  const { user, logout } = useAuth();
  const years = ["First Year", "Second Year", "Third Year", "Final Year"] as const;
  const [activeYear, setActiveYear] = useState<typeof years[number]>("First Year");
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");

  // Filter problems by year and difficulty
  const filteredProblems = useMemo(() => {
    let problems = ALL_PROBLEMS.filter((p) => p.year === activeYear);
    if (difficultyFilter !== "All") {
      problems = problems.filter((p) => p.difficulty === difficultyFilter);
    }
    return problems;
  }, [activeYear, difficultyFilter]);

  const groupByDifficulty = useMemo(() => {
    const map: Record<string, ProblemItem[]> = { Easy: [], Medium: [], Hard: [] };
    ALL_PROBLEMS.filter((p) => p.year === activeYear).forEach((p) => map[p.difficulty].push(p));
    return map;
  }, [activeYear]);

  const progressFor = (difficulty: "Easy" | "Medium" | "Hard") => {
    const list = groupByDifficulty[difficulty] || [];
    const total = list.length;
    const solved = list.filter((p) => p.solved).length;
    const pct = total === 0 ? 0 : Math.round((solved / total) * 100);
    return { total, solved, pct };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-600";
      case "Medium": return "text-amber-600";
      case "Hard": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header with user info and logout */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <User className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">Continue your coding journey</p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>

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

      {/* LeetCode-style Problem Set */}
      <div className="rounded-xl bg-card border border-border shadow">
        {/* Header with filters */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Year-wise DSA Problems</h2>
            <div className="flex gap-2">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setActiveYear(y)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${y === activeYear
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted hover:bg-accent/10 text-muted-foreground hover:text-foreground"
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
              const color = d === "Easy" ? "bg-green-500" : d === "Medium" ? "bg-amber-500" : "bg-red-500";
              return (
                <div key={d} className="p-4 rounded-lg border border-border/60 bg-background/60">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{d}</div>
                    <div className="text-sm text-muted-foreground">{solved}/{total}</div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">{pct}% solved</div>
                </div>
              );
            })}
          </div>

          {/* Difficulty filter */}
          <div className="flex gap-2">
            {(["All", "Easy", "Medium", "Hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${d === difficultyFilter
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted hover:bg-accent/10 text-muted-foreground hover:text-foreground"
                  }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* LeetCode-style table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Title</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Acceptance</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Difficulty</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem, index) => (
                <tr
                  key={problem.id}
                  className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => {
                    // Handle problem click - navigate to problem page
                    console.log(`Navigate to problem ${problem.id}`);
                  }}
                >
                  <td className="p-4">
                    <div className="flex items-center">
                      {problem.solved ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground font-mono">
                        {problem.id}.
                      </span>
                      <span className="font-medium hover:text-accent transition-colors">
                        {problem.title}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {problem.acceptance}%
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((bar) => (
                          <div
                            key={bar}
                            className={`w-1 h-4 rounded-sm ${bar <= (problem.frequency || Math.floor(Math.random() * 5) + 1)
                              ? "bg-muted-foreground"
                              : "bg-muted"
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProblems.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No problems found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole="student">
      <DashboardContent />
    </ProtectedRoute>
  );
}
