'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Play, Send, Code, TestTube, Lightbulb, History, Moon, Sun, Maximize2, Minimize2 } from 'lucide-react'
import confetti from 'canvas-confetti'

// Monaco Editor dynamic import
const MonacoEditor = React.lazy(() => import('@monaco-editor/react'))

interface TestCase {
  id: number
  input: string
  expected: string
  yourOutput?: string
  status?: 'pass' | 'fail' | 'pending'
  runtime?: string
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
  'C++': `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};`,
  'Java': `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`,
  'Python': `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your code here
        pass`,
  'JavaScript': `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your code here
};`
}

export default function IDEPage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState('description')
  const [selectedLanguage, setSelectedLanguage] = useState('Python')
  const [editorTheme, setEditorTheme] = useState('vs-dark')
  const [code, setCode] = useState(LANGUAGE_TEMPLATES['Python'])
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [testResults, setTestResults] = useState<TestCase[]>([])
  const [leftPanelWidth, setLeftPanelWidth] = useState(45)
  const [isResizing, setIsResizing] = useState(false)
  const [runningTestIndex, setRunningTestIndex] = useState(-1)
  
  const resizeRef = useRef<HTMLDivElement>(null)
  
  // Sample problem data
  const problem: Problem = {
    title: "Two Sum",
    difficulty: "Easy",
    acceptanceRate: 49.2,
    timeComplexity: "O(n)",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

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
    setCode(LANGUAGE_TEMPLATES[selectedLanguage as keyof typeof LANGUAGE_TEMPLATES])
  }, [selectedLanguage])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const containerWidth = window.innerWidth
      const newWidth = (e.clientX / containerWidth) * 100
      
      if (newWidth >= 25 && newWidth <= 75) {
        setLeftPanelWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const runCode = async () => {
    setIsRunning(true)
    setShowResults(false)
    setRunningTestIndex(0)
    
    const results = [...problem.testCases]
    
    for (let i = 0; i < results.length; i++) {
      setRunningTestIndex(i)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Simulate test execution
      const passed = Math.random() > 0.2 // 80% pass rate
      results[i] = {
        ...results[i],
        yourOutput: passed ? results[i].expected : "[1,0]",
        status: passed ? 'pass' : 'fail',
        runtime: `${Math.floor(Math.random() * 50 + 10)}ms`
      }
    }
    
    setTestResults(results)
    setIsRunning(false)
    setRunningTestIndex(-1)
    setShowResults(true)
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500'
      case 'Medium': return 'text-yellow-500'
      case 'Hard': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const tabs = [
    { id: 'description', label: 'Description', icon: Code },
    { id: 'testcases', label: 'Test Cases', icon: TestTube },
    { id: 'examples', label: 'Examples', icon: Lightbulb },
    { id: 'submissions', label: 'Submissions', icon: History }
  ]

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {problem.title}
            </h1>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <span>Acceptance: {problem.acceptanceRate}%</span>
            <span>Time: {problem.timeComplexity}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div 
          className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
          style={{ width: `${leftPanelWidth}%` }}
        >
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="prose dark:prose-invert max-w-none"
                >
                  <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                    {problem.description}
                  </div>
                </motion.div>
              )}

              {activeTab === 'testcases' && (
                <motion.div
                  key="testcases"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {problem.testCases.map((testCase, index) => (
                    <div key={testCase.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="font-semibold text-gray-900 dark:text-white mb-2">
                        Test Case #{index + 1}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Input: </span>
                          <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                            {testCase.input}
                          </code>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Expected: </span>
                          <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                            {testCase.expected}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'examples' && (
                <motion.div
                  key="examples"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {problem.examples.map((example, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="font-semibold text-gray-900 dark:text-white mb-3">
                        Example {index + 1}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Input: </span>
                          <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                            {example.input}
                          </code>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Output: </span>
                          <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                            {example.output}
                          </code>
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 mt-2">
                          <span className="text-gray-600 dark:text-gray-400">Explanation: </span>
                          {example.explanation}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'submissions' && (
                <motion.div
                  key="submissions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-12"
                >
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No submissions yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Your submission history will appear here
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          ref={resizeRef}
          className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors"
          onMouseDown={handleMouseDown}
        />

        {/* Right Panel */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
          {/* Editor Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.keys(LANGUAGE_TEMPLATES).map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setEditorTheme(editorTheme === 'vs-dark' ? 'light' : 'vs-dark')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {editorTheme === 'vs-dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative">
            <React.Suspense fallback={
              <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                <div className="text-gray-500">Loading editor...</div>
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
                }}
              />
            </React.Suspense>

            {/* Running Overlay */}
            <AnimatePresence>
              {isRunning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="text-gray-900 dark:text-white">
                        Running Test Case #{runningTestIndex + 1}...
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={runCode}
                disabled={isRunning || isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Running...' : 'Run'}</span>
              </button>
              
              <button
                onClick={submitCode}
                disabled={isRunning || isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
              </button>
            </div>
          </div>

          {/* Results Drawer */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Test Results
                    </h3>
                    <button
                      onClick={() => setShowResults(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {testResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          result.status === 'pass' 
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`text-sm font-medium ${
                            result.status === 'pass' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                          }`}>
                            Test Case #{index + 1}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            result.status === 'pass' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          }`}>
                            {result.status === 'pass' ? '✅ Pass' : '❌ Fail'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                          <span>Expected: {result.expected}</span>
                          <span>Got: {result.yourOutput}</span>
                          <span className="text-blue-600 dark:text-blue-400">{result.runtime}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Submission Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl max-w-md w-full mx-4"
            >
              <div className="text-center">
                <div className="mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  🚀 Submitting Solution...
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Running comprehensive tests on your code
                </p>
                <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
