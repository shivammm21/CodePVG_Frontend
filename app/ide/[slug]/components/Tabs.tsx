'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LucideIcon, History } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Tab {
  id: string
  label: string
  icon: LucideIcon
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
  testCases: Array<{
    id: number
    input: string
    expected: string
  }>
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  problem: Problem
}

export function Tabs({ tabs, activeTab, onTabChange, problem }: TabsProps) {
  return (
    <>
      {/* Tab Headers */}
      <div className="flex border-b bg-muted/30">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-all hover:bg-muted/50 ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-background'
                  : 'border-transparent text-muted-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-line text-foreground leading-relaxed">
                    {problem.description}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'testcases' && (
              <motion.div
                key="testcases"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {problem.testCases.map((testCase, index) => (
                  <Card key={testCase.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="font-medium text-foreground mb-3 flex items-center">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold mr-2">
                        #{index + 1}
                      </span>
                      Test Case {index + 1}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex flex-col space-y-1">
                        <span className="text-muted-foreground font-medium">Input:</span>
                        <code className="bg-muted px-3 py-2 rounded-md font-mono text-foreground">
                          {testCase.input}
                        </code>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-muted-foreground font-medium">Expected:</span>
                        <code className="bg-muted px-3 py-2 rounded-md font-mono text-foreground">
                          {testCase.expected}
                        </code>
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}

            {activeTab === 'examples' && (
              <motion.div
                key="examples"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {problem.examples.map((example, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="font-medium text-foreground mb-3 flex items-center">
                      <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded text-xs font-bold mr-2">
                        Ex {index + 1}
                      </span>
                      Example {index + 1}
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex flex-col space-y-1">
                        <span className="text-muted-foreground font-medium">Input:</span>
                        <code className="bg-muted px-3 py-2 rounded-md font-mono text-foreground">
                          {example.input}
                        </code>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-muted-foreground font-medium">Output:</span>
                        <code className="bg-muted px-3 py-2 rounded-md font-mono text-foreground">
                          {example.output}
                        </code>
                      </div>
                      <div className="pt-2 border-t">
                        <span className="text-muted-foreground font-medium">Explanation:</span>
                        <p className="text-foreground mt-1 leading-relaxed">
                          {example.explanation}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}

            {activeTab === 'submissions' && (
              <motion.div
                key="submissions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-center py-16"
              >
                <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No submissions yet</h3>
                <p className="text-muted-foreground">
                  Your submission history will appear here after you submit your first solution
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
