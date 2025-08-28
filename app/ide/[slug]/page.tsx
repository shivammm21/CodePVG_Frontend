'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code, TestTube, Lightbulb, History } from 'lucide-react'
import confetti from 'canvas-confetti'

// Components
import { Tabs } from './components/Tabs'
import { EditorHeader } from './components/EditorHeader'
import { ResultsDrawer } from './components/ResultsDrawer'

// Monaco Editor dynamic import
const MonacoEditor = React.lazy(() => import('@monaco-editor/react'))

interface TestCase {
  id: number
  input: string
  expected: string
  yourOutput?: string
  status?: 'pass' | 'fail' | 'pending' | 'running'
  runtime?: string
  memory?: string
}

interface Problem {
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  acceptanceRate: number
  timeComplexity: string
  description: string
  examples: Array<{
    input: string
    output: string
    explanation: string
  }>
  testCases: TestCase[]
}

const LANGUAGE_TEMPLATES = {
  'Python': {
    code: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your code here
        pass`,
    fileName: 'Solution.py'
  },
  'Java': {
    code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`,
    fileName: 'Solution.java'
  },
  'C++': {
    code: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};`,
    fileName: 'main.cpp'
  },
  'JavaScript': {
    code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your code here
};`,
    fileName: 'index.js'
  }
}

export default function IDEPage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState('description')
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof LANGUAGE_TEMPLATES>('Python')
  const [editorTheme, setEditorTheme] = useState('vs-dark')
  const [code, setCode] = useState(LANGUAGE_TEMPLATES['Python'].code)
  const [originalCode, setOriginalCode] = useState(LANGUAGE_TEMPLATES['Python'].code)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [testResults, setTestResults] = useState<TestCase[]>([])
  const [leftPanelWidth, setLeftPanelWidth] = useState(45)
  const [isResizing, setIsResizing] = useState(false)
  const [executionProgress, setExecutionProgress] = useState({ current: 0, total: 0 })
  const [consoleLogs, setConsoleLogs] = useState<string[]>([])
  const [resultsHeight, setResultsHeight] = useState(300)
  const [isResizingResults, setIsResizingResults] = useState(false)
  
  const resizeRef = useRef<HTMLDivElement>(null)
  const resultsResizeRef = useRef<HTMLDivElement>(null)
  
  // Sample problem data
  const problem: Problem = {
    title: "Two Sum",
    difficulty: "Easy",
    acceptanceRate: 49.2,
    timeComplexity: "O(n)",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.

**Constraints:**
- 2 ≤ nums.length ≤ 10⁴
- -10⁹ ≤ nums[i] ≤ 10⁹
- -10⁹ ≤ target ≤ 10⁹
- Only one valid answer exists.

**Follow-up:** Can you come up with an algorithm that is less than O(n²) time complexity?`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    testCases: [
      { id: 1, input: "[2,7,11,15], 9", expected: "[0,1]" },
      { id: 2, input: "[3,2,4], 6", expected: "[1,2]" },
      { id: 3, input: "[3,3], 6", expected: "[0,1]" },
      { id: 4, input: "[1,2,3,4,5], 9", expected: "[3,4]" },
      { id: 5, input: "[-1,-2,-3,-4,-5], -8", expected: "[2,4]" }
    ]
  }

  useEffect(() => {
    const template = LANGUAGE_TEMPLATES[selectedLanguage]
    setCode(template.code)
    setOriginalCode(template.code)
  }, [selectedLanguage])

  // Panel resizing logic
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }

  const handleResultsMouseDown = (e: React.MouseEvent) => {
    setIsResizingResults(true)
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const containerWidth = window.innerWidth
        const newWidth = (e.clientX / containerWidth) * 100
        if (newWidth >= 25 && newWidth <= 75) {
          setLeftPanelWidth(newWidth)
        }
      }
      
      if (isResizingResults) {
        const containerHeight = window.innerHeight
        const editorContainer = document.querySelector('.editor-container')
        if (editorContainer) {
          const rect = editorContainer.getBoundingClientRect()
          const newHeight = rect.bottom - e.clientY
          if (newHeight >= 150 && newHeight <= 500) {
            setResultsHeight(newHeight)
          }
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setIsResizingResults(false)
    }

    if (isResizing || isResizingResults) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, isResizingResults])

  const runCode = async () => {
    setIsRunning(true)
    setShowResults(true)
    setExecutionProgress({ current: 0, total: problem.testCases.length })
    setConsoleLogs(['Running test cases...'])
    
    // Reset all test cases to pending
    const pendingResults = problem.testCases.map(tc => ({ ...tc, status: 'pending' as const }))
    setTestResults(pendingResults)
    
    // Run test cases with streaming updates
    for (let i = 0; i < problem.testCases.length; i++) {
      const testCase = problem.testCases[i]
      
      // Mark as running
      setTestResults(prev => prev.map((tc, idx) => 
        idx === i ? { ...tc, status: 'running' as const } : tc
      ))
      
      setExecutionProgress({ current: i + 1, total: problem.testCases.length })
      
      // Simulate execution delay
      await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 600))
      
      // Simulate test result
      const passed = Math.random() > 0.2 // 80% pass rate
      const runtime = `${Math.floor(Math.random() * 50 + 10)}ms`
      const memory = `${(Math.random() * 5 + 10).toFixed(1)}MB`
      
      setTestResults(prev => prev.map((tc, idx) => 
        idx === i ? {
          ...tc,
          yourOutput: passed ? tc.expected : "[1,0]",
          status: passed ? 'pass' as const : 'fail' as const,
          runtime,
          memory
        } : tc
      ))
      
      // Add console log
      setConsoleLogs(prev => [...prev, `Test Case ${i + 1}: ${passed ? 'PASS' : 'FAIL'} (${runtime})`])
    }
    
    setIsRunning(false)
  }

  const submitCode = async () => {
    setIsSubmitting(true)
    
    // Simulate submission process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsSubmitting(false)
    
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']
    })
  }

  const resetCode = () => {
    setCode(originalCode)
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      // You can add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500 bg-green-50 border-green-200'
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'Hard': return 'text-red-500 bg-red-50 border-red-200'
      default: return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  const tabs = [
    { id: 'description', label: 'Description', icon: Code },
    { id: 'testcases', label: 'Test Cases', icon: TestTube },
    { id: 'examples', label: 'Examples', icon: Lightbulb },
    { id: 'submissions', label: 'Submissions', icon: History }
  ]

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-foreground">
              {problem.title}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <span>Acceptance: {problem.acceptanceRate}%</span>
            <span>Time: {problem.timeComplexity}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div 
          className="bg-card border-r flex flex-col shadow-sm"
          style={{ width: `${leftPanelWidth}%` }}
        >
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            problem={problem}
          />
        </div>

        {/* Resize Handle */}
        <div
          ref={resizeRef}
          className="w-1 bg-border hover:bg-primary cursor-col-resize transition-colors"
          onMouseDown={handleMouseDown}
        />

        {/* Right Panel */}
        <div className="flex-1 flex flex-col bg-background editor-container">
          <EditorHeader
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            editorTheme={editorTheme}
            onThemeChange={setEditorTheme}
            fileName={LANGUAGE_TEMPLATES[selectedLanguage].fileName}
            onCopy={copyCode}
            onReset={resetCode}
            onRun={runCode}
            onSubmit={submitCode}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
          />

          {/* Monaco Editor */}
          <div className="flex-1 relative overflow-hidden">
            <React.Suspense fallback={
              <div className="flex items-center justify-center h-full bg-muted/50">
                <div className="text-muted-foreground">Loading editor...</div>
              </div>
            }>
              <MonacoEditor
                height="100%"
                language={selectedLanguage.toLowerCase() === 'c++' ? 'cpp' : selectedLanguage.toLowerCase()}
                theme={editorTheme}
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  padding: { top: 16, bottom: 16 }
                }}
              />
            </React.Suspense>
          </div>

          {/* Results Drawer */}
          <ResultsDrawer
            isVisible={showResults}
            onClose={() => setShowResults(false)}
            testResults={testResults}
            consoleLogs={consoleLogs}
            executionProgress={executionProgress}
            isRunning={isRunning}
            height={resultsHeight}
            onResizeStart={handleResultsMouseDown}
            isResizing={isResizingResults}
          />
        </div>
      </div>

      {/* Submission Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card rounded-xl p-8 shadow-2xl max-w-md w-full mx-4"
            >
              <div className="text-center">
                <div className="mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  🚀 Submitting Solution...
                </h3>
                <p className="text-muted-foreground">
                  Running comprehensive tests on your code
                </p>
                <div className="mt-4 bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.8, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
