"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileCode2,
  ListChecks,
  FlaskConical,
  BookOpen,
  Shield,
  Zap,
  Timer,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// Lazy-load Monaco so it doesn't bloat first paint
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type LangKey = "cpp" | "c" | "java" | "python" | "javascript";
const LANGS: Record<LangKey, { label: string; monaco: string; template: string }> = {
  cpp: {
    label: "C++",
    monaco: "cpp",
    template: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
  unordered_map<int,int> mp;
  for (int i = 0; i < nums.size(); ++i) {
    int need = target - nums[i];
    if (mp.count(need)) return {mp[need], i};
    mp[nums[i]] = i;
  }
  return {};
}

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);
  int n, target; cin >> n >> target;
  vector<int> a(n); for (int i=0;i<n;i++) cin >> a[i];
  auto ans = twoSum(a, target);
  if(ans.size()==2) cout<<ans[0]<<" "<<ans[1]<<endl;
  else cout<<"-1 -1\\n";
  return 0;
}`,
  },
  c: {
    label: "C",
    monaco: "c",
    template: `#include <stdio.h>

int main() {
  // Implement your solution here
  printf("Hello from C!\\n");
  return 0;
}`,
  },
  java: {
    label: "Java",
    monaco: "java",
    template: `import java.util.*;

class Main {
  public static int[] twoSum(int[] nums, int target) {
    Map<Integer,Integer> map = new HashMap<>();
    for (int i=0;i<nums.length;i++){
      int need = target - nums[i];
      if(map.containsKey(need)) return new int[]{map.get(need), i};
      map.put(nums[i], i);
    }
    return new int[]{-1,-1};
  }
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt(), t = sc.nextInt();
    int[] a = new int[n];
    for(int i=0;i<n;i++) a[i]=sc.nextInt();
    int[] ans = twoSum(a,t);
    System.out.println(ans[0] + " " + ans[1]);
  }
}`,
  },
  python: {
    label: "Python",
    monaco: "python",
    template: `def two_sum(nums, target):
    mp = {}
    for i, x in enumerate(nums):
        need = target - x
        if need in mp:
            return [mp[need], i]
        mp[x] = i
    return [-1, -1]

if __name__ == "__main__":
    import sys
    data = list(map(int, sys.stdin.read().strip().split()))
    n, target = data[0], data[1]
    arr = data[2:]
    print(*two_sum(arr, target))`,
  },
  javascript: {
    label: "JavaScript",
    monaco: "javascript",
    template: `function twoSum(nums, target){
  const mp = new Map();
  for(let i=0;i<nums.length;i++){
    const need = target - nums[i];
    if(mp.has(need)) return [mp.get(need), i];
    mp.set(nums[i], i);
  }
  return [-1, -1];
}

// Node-style stdin:
const fs = require('fs');
const input = fs.readFileSync(0,'utf8').trim().split(/\\s+/).map(Number);
const n = input[0], target = input[1], arr = input.slice(2);
console.log(twoSum(arr, target).join(' '));`,
  },
};

// mock problem db (slug -> details)
const PROBLEMS: Record<
  string,
  {
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    tags: string[];
    acceptance: number;
    timeLimit: string;
    memoryLimit: string;
    description: string;
    examples: { input: string; output: string; explain?: string }[];
    defaultTests: { name: string; input: string; expected: string }[];
  }
> = {
  "two-sum": {
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    acceptance: 48,
    timeLimit: "1s",
    memoryLimit: "256 MB",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: `n = 4, target = 9
nums = [2,7,11,15]`,
        output: `0 1`,
        explain: "Because nums[0] + nums[1] = 2 + 7 = 9.",
      },
      {
        input: `n = 3, target = 6
nums = [3,2,3]`,
        output: `0 2`,
      },
    ],
    defaultTests: [
      { name: "Sample #1", input: "4 9\n2 7 11 15\n", expected: "0 1" },
      { name: "Sample #2", input: "3 6\n3 2 3\n", expected: "0 2" },
    ],
  },
};

function DiffPill({ difficulty }: { difficulty: "Easy" | "Medium" | "Hard" }) {
  const color =
    difficulty === "Easy"
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      : difficulty === "Medium"
      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
      : "bg-rose-500/15 text-rose-400 border-rose-500/30";
  return (
    <span className={`text-xs px-2 py-1 rounded border ${color}`}>{difficulty}</span>
  );
}

export default function IDEPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const problem = PROBLEMS[slug ?? "two-sum"] ?? PROBLEMS["two-sum"];

  // UI state
  const [tab, setTab] = useState<"description" | "tests" | "examples">("description");
  const [lang, setLang] = useState<LangKey>("cpp");
  const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [code, setCode] = useState<string>(LANGS.cpp.template);
  const [tests, setTests] = useState(problem.defaultTests);
  const [activeTestIdx, setActiveTestIdx] = useState(0);
  const [running, setRunning] = useState<"run" | "submit" | null>(null);
  const [output, setOutput] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const editorRef = useRef<any>(null);

  // when language changes, load its starter
  useEffect(() => {
    setCode(LANGS[lang].template);
  }, [lang]);

  // fake execution (frontend only). Backend team will replace this.
  const simulateRun = (mode: "run" | "submit") => {
    setRunning(mode);
    setOutput("");
    setProgress(0);

    // animated progress bar
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(100, p + Math.random() * 22);
      setProgress(p);
    }, 200);

    // fake result after ~1.6s
    setTimeout(() => {
      clearInterval(iv);
      setProgress(100);
      // mock check: if code contains 'twoSum' or 'two_sum' -> pass else fail
      const looksOk = /twoSum|two_sum/.test(code);
      if (mode === "run") {
        setOutput(
          looksOk
            ? `✅ Ran 1 test — Output matched expected.\n\n${tests[activeTestIdx].expected}`
            : `❌ Runtime Error: check input parsing or function name.\n\n(Frontend mock)`
        );
      } else {
        const passed = looksOk ? `${tests.length}/${tests.length}` : `0/${tests.length}`;
        setOutput(
          looksOk
            ? `✅ Submitted: All tests passed (${passed}).`
            : `❌ Submitted: Some tests failed (${passed}).\n\nOpen "Tests" tab to inspect failing cases.`
        );
      }
      setRunning(null);
    }, 1600);
  };

  // keyboard shortcut: Ctrl/Cmd + Enter => Run
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter") {
        e.preventDefault();
        if (!running) simulateRun("run");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, code, tests, activeTestIdx]);

  const topTabs = [
    { key: "description", label: "Description", icon: BookOpen },
    { key: "tests", label: "Test Cases", icon: ListChecks },
    { key: "examples", label: "Examples", icon: FlaskConical },
  ] as const;

  const difficultyGradient =
    problem.difficulty === "Easy"
      ? "from-emerald-500/10"
      : problem.difficulty === "Medium"
      ? "from-amber-500/10"
      : "from-rose-500/10";

  const passRate = useMemo(() => Math.max(20, Math.min(95, problem.acceptance)), [problem]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border/60 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/40">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-muted/50 border border-border/50"
            aria-label="Back"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold">{problem.title}</h1>
              <DiffPill difficulty={problem.difficulty} />
              <span className="text-xs text-muted-foreground">Acceptance</span>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${passRate}%` }}
                  aria-label={`Acceptance ${passRate}%`}
                />
              </div>
              <span className="text-xs text-muted-foreground">{passRate}%</span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> {problem.timeLimit} time
              </span>
              <span className="inline-flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" /> {problem.memoryLimit} memory
              </span>
              <div className="hidden md:flex items-center gap-1">
                {problem.tags.map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-muted">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Lang & theme */}
          <div className="flex items-center gap-2">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LangKey)}
              className="px-3 py-2 rounded-md border bg-card text-sm"
              aria-label="Language"
            >
              {Object.entries(LANGS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>

            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as "vs-dark" | "light")}
              className="px-3 py-2 rounded-md border bg-card text-sm"
              aria-label="Editor Theme"
            >
              <option value="vs-dark">Dark</option>
              <option value="light">Light</option>
            </select>

            <button
              onClick={() => simulateRun("run")}
              disabled={!!running}
              className="inline-flex items-center gap-2 bg-secondary/90 hover:bg-secondary text-secondary-foreground px-4 py-2 rounded-md border border-border disabled:opacity-60"
            >
              {running === "run" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Run
            </button>
            <button
              onClick={() => simulateRun("submit")}
              disabled={!!running}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-md border border-border disabled:opacity-60"
            >
              {running === "submit" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <AnimatePresence>
          {running && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              exit={{ width: 0 }}
              transition={{ ease: "easeOut", duration: 0.2 }}
              className="h-0.5 bg-accent"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Body: left problem / right editor */}
      <div className="max-w-[1400px] mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* LEFT: problem */}
        <div className="border-r border-border/60 min-h-0">
          {/* Tabs */}
          <div className={`px-4 py-2 sticky top-0 z-10 bg-gradient-to-b ${difficultyGradient} to-background border-b border-border/60`}>
            <div className="flex items-center gap-2">
              {topTabs.map((t) => {
                const Icon = t.icon;
                const active = tab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`px-3 py-2 rounded-lg text-sm border transition ${
                      active ? "bg-card shadow-sm" : "hover:bg-muted/60"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-4 overflow-auto h-[calc(100vh-110px)]">
            <AnimatePresence mode="wait">
              {tab === "description" && (
                <motion.div
                  key="desc"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="prose prose-invert max-w-none"
                >
                  <h2 className="text-lg font-semibold mb-2">Problem</h2>
                  <p className="leading-7 text-foreground/90">{problem.description}</p>
                  <h3 className="mt-6 font-semibold">Constraints</h3>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground">
                    <li>Time Limit: {problem.timeLimit}</li>
                    <li>Memory Limit: {problem.memoryLimit}</li>
                    <li>Exactly one valid answer exists.</li>
                  </ul>
                </motion.div>
              )}

              {tab === "tests" && (
                <motion.div
                  key="tests"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  {/* Test list header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold">Test Cases</div>
                    <button
                      onClick={() =>
                        setTests((t) => [
                          ...t,
                          {
                            name: `Custom #${t.length + 1}`,
                            input: "4 9\n2 7 11 15\n",
                            expected: "0 1",
                          },
                        ])
                      }
                      className="px-3 py-1.5 rounded-md border bg-card text-sm hover:bg-muted/60"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="grid grid-cols-12 gap-3">
                    {/* test list */}
                    <div className="col-span-5 border rounded-lg overflow-hidden">
                      <div className="max-h-[60vh] overflow-auto">
                        {tests.map((t, i) => {
                          const active = i === activeTestIdx;
                          return (
                            <button
                              key={i}
                              onClick={() => setActiveTestIdx(i)}
                              className={`w-full text-left px-3 py-2 border-b hover:bg-muted/50 ${
                                active ? "bg-card" : ""
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{t.name}</span>
                                <span className="text-xs text-muted-foreground">stdin / stdout</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* test editor */}
                    <div className="col-span-7">
                      <div className="grid grid-rows-2 gap-3">
                        <div className="border rounded-lg p-3">
                          <div className="text-xs text-muted-foreground mb-2">Input</div>
                          <textarea
                            value={tests[activeTestIdx]?.input ?? ""}
                            onChange={(e) => {
                              const copy = [...tests];
                              copy[activeTestIdx] = {
                                ...copy[activeTestIdx],
                                input: e.target.value,
                              };
                              setTests(copy);
                            }}
                            className="w-full h-32 bg-transparent outline-none text-sm resize-none"
                          />
                        </div>
                        <div className="border rounded-lg p-3">
                          <div className="text-xs text-muted-foreground mb-2">Expected Output</div>
                          <textarea
                            value={tests[activeTestIdx]?.expected ?? ""}
                            onChange={(e) => {
                              const copy = [...tests];
                              copy[activeTestIdx] = {
                                ...copy[activeTestIdx],
                                expected: e.target.value,
                              };
                              setTests(copy);
                            }}
                            className="w-full h-24 bg-transparent outline-none text-sm resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {tab === "examples" && (
                <motion.div
                  key="ex"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="space-y-4">
                    {problem.examples.map((ex, idx) => (
                      <div key={idx} className="border rounded-lg p-3">
                        <div className="text-sm font-medium mb-1">Example #{idx + 1}</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Input</div>
                            <pre className="bg-muted/40 p-2 rounded">{ex.input}</pre>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Output</div>
                            <pre className="bg-muted/40 p-2 rounded">{ex.output}</pre>
                          </div>
                        </div>
                        {ex.explain && (
                          <p className="text-sm text-muted-foreground mt-2">{ex.explain}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: editor */}
        <div className="min-h-0 flex flex-col">
          <div className="flex-1 min-h-0">
            <MonacoEditor
              height="calc(100vh - 170px)"
              theme={theme}
              language={LANGS[lang].monaco}
              value={code}
              onChange={(v) => setCode(v || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace",
                smoothScrolling: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                cursorBlinking: "expand",
                roundedSelection: true,
                renderLineHighlight: "all",
              }}
              onMount={(editor) => (editorRef.current = editor)}
            />
          </div>

          {/* Output / verdict bar */}
          <div className="border-t border-border/60">
            <div className="flex items-center justify-between px-4 py-2 bg-card/60">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">
                  Shortcut: <b>Ctrl/Cmd + Enter</b> to Run
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => simulateRun("run")}
                  disabled={!!running}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-card hover:bg-muted disabled:opacity-60"
                >
                  <Play className="w-4 h-4" /> Run
                </button>
                <button
                  onClick={() => simulateRun("submit")}
                  disabled={!!running}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" /> Submit
                </button>
              </div>
            </div>

            {/* Verdict strip */}
            <div className="px-4 py-3 bg-card">
              <div className="flex items-center gap-3 text-sm">
                {running ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-muted-foreground">
                      {running === "run" ? "Running…" : "Submitting…"}
                    </span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </>
                ) : output ? (
                  <>
                    {output.startsWith("✅") ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    )}
                    <pre className="whitespace-pre-wrap text-sm">{output}</pre>
                  </>
                ) : (
                  <span className="text-muted-foreground">Output will appear here…</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bottom spacer on mobile */}
      <div className="h-2 lg:hidden" />
    </div>
  );
}
