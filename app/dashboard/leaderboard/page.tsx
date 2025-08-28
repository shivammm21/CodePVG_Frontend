"use client";

import React, { useState } from "react";
import {
    Trophy,
    Medal,
    Crown,
    TrendingUp,
    Calendar,
    Users,
    LogOut,
    User,
    Award,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";

// Types
type LeaderboardUser = {
    id: string;
    name: string;
    avatar?: string;
    totalSolved: number;
    streak: number;
    points: number;
    rank: number;
    branch: string;
    year: string;
    isCurrentUser?: boolean;
};

// Sample leaderboard data
const LEADERBOARD_DATA: LeaderboardUser[] = [
    { id: "1", name: "Aditi Sharma", totalSolved: 1240, streak: 45, points: 1240, rank: 1, branch: "CSE", year: "Third Year" },
    { id: "2", name: "Rahul Patel", totalSolved: 1185, streak: 32, points: 1185, rank: 2, branch: "IT", year: "Final Year" },
    { id: "3", name: "Ishita Gupta", totalSolved: 1102, streak: 28, points: 1102, rank: 3, branch: "ECE", year: "Third Year" },
    { id: "4", name: "Sahil Kumar", totalSolved: 970, streak: 15, points: 970, rank: 4, branch: "CSE", year: "Second Year" },
    { id: "5", name: "Neha Singh", totalSolved: 945, streak: 22, points: 945, rank: 5, branch: "IT", year: "Final Year" },
    { id: "6", name: "Arjun Mehta", totalSolved: 890, streak: 18, points: 890, rank: 6, branch: "CSE", year: "Third Year" },
    { id: "7", name: "Priya Joshi", totalSolved: 875, streak: 12, points: 875, rank: 7, branch: "ECE", year: "Second Year" },
    { id: "8", name: "Vikram Reddy", totalSolved: 820, streak: 25, points: 820, rank: 8, branch: "IT", year: "Final Year" },
    { id: "9", name: "Ananya Das", totalSolved: 785, streak: 8, points: 785, rank: 9, branch: "CSE", year: "First Year" },
    { id: "10", name: "Karan Sharma", totalSolved: 760, streak: 14, points: 760, rank: 10, branch: "ECE", year: "Second Year" },
];

// Monthly Timeline Component
function MonthlyTimeline() {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Generate sample activity data for each month
    const generateMonthlyActivity = (monthIndex: number) => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Calculate the month and year for this timeline position
        let targetMonth = currentMonth - (11 - monthIndex);
        let targetYear = currentYear;

        if (targetMonth < 0) {
            targetMonth += 12;
            targetYear -= 1;
        }

        const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
        const activity = [];

        for (let day = 1; day <= daysInMonth; day++) {
            // Generate random activity (0-4 levels)
            const level = Math.floor(Math.random() * 5);
            activity.push({
                date: new Date(targetYear, targetMonth, day),
                level: level,
                count: level * Math.floor(Math.random() * 3 + 1)
            });
        }

        return activity;
    };

    const getActivityColor = (level: number) => {
        switch (level) {
            case 0: return "bg-muted";
            case 1: return "bg-green-200";
            case 2: return "bg-green-300";
            case 3: return "bg-green-500";
            case 4: return "bg-green-700";
            default: return "bg-muted";
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4">
                {months.map((month, monthIndex) => {
                    const monthActivity = generateMonthlyActivity(monthIndex);
                    const totalActivity = monthActivity.reduce((sum, day) => sum + day.count, 0);

                    return (
                        <div key={month} className="text-center">
                            <div className="text-xs font-medium text-muted-foreground mb-2">
                                {month}
                            </div>

                            {/* Activity grid for the month */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {monthActivity.slice(0, 28).map((day, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className={`w-3 h-3 rounded-sm ${getActivityColor(day.level)}`}
                                        title={`${day.date.toDateString()}: ${day.count} problems solved`}
                                    />
                                ))}
                            </div>

                            {/* Monthly total */}
                            <div className="text-xs text-muted-foreground">
                                {totalActivity}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground">Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={`w-3 h-3 rounded-sm ${getActivityColor(level)}`}
                    />
                ))}
                <span className="text-xs text-muted-foreground">More</span>
            </div>
        </div>
    );
}

function LeaderboardContent() {
    const { user, logout } = useAuth();
    const [timeFilter, setTimeFilter] = useState<"all" | "month" | "week">("all");
    const [branchFilter, setBranchFilter] = useState<"all" | "CSE" | "IT" | "ECE">("all");

    // Filter leaderboard data
    const filteredData = LEADERBOARD_DATA.filter(user =>
        branchFilter === "all" || user.branch === branchFilter
    );

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
            case 2: return <Medal className="w-6 h-6 text-gray-400" />;
            case 3: return <Award className="w-6 h-6 text-amber-600" />;
            default: return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
        }
    };

    const getRankBg = (rank: number) => {
        switch (rank) {
            case 1: return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
            case 2: return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
            case 3: return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200";
            default: return "bg-card border-border";
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                        <Trophy className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Leaderboard</h1>
                        <p className="text-muted-foreground">See how you rank among your peers</p>
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

            {/* 12-Month Activity Timeline */}
            <div className="rounded-xl bg-card border border-border shadow mb-8">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-accent" />
                        <h2 className="text-xl font-semibold">12-Month Streak</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">Your coding activity over the past year</p>
                </div>
                <div className="p-6">
                    <MonthlyTimeline />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-yellow-100">
                            <Crown className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground">Your Rank</div>
                            <div className="text-2xl font-bold">#12</div>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground">Problems Solved</div>
                            <div className="text-2xl font-bold">847</div>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-100">
                            <Award className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground">Current Streak</div>
                            <div className="text-2xl font-bold">15 days</div>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground">Total Users</div>
                            <div className="text-2xl font-bold">2,847</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leaderboard */}
            <div className="rounded-xl bg-card border border-border shadow">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Top Performers</h2>
                        <div className="flex gap-2">
                            {/* Time Filter */}
                            <div className="flex gap-1">
                                {(["all", "month", "week"] as const).map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setTimeFilter(filter)}
                                        className={`px-3 py-1 rounded-md text-sm transition-colors capitalize ${filter === timeFilter
                                                ? "bg-accent text-accent-foreground"
                                                : "bg-muted hover:bg-accent/10 text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {filter === "all" ? "All Time" : filter}
                                    </button>
                                ))}
                            </div>

                            {/* Branch Filter */}
                            <div className="flex gap-1">
                                {(["all", "CSE", "IT", "ECE"] as const).map((branch) => (
                                    <button
                                        key={branch}
                                        onClick={() => setBranchFilter(branch)}
                                        className={`px-3 py-1 rounded-md text-sm transition-colors ${branch === branchFilter
                                                ? "bg-secondary text-secondary-foreground"
                                                : "bg-muted hover:bg-secondary/10 text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {branch === "all" ? "All Branches" : branch}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-3">
                        {filteredData.map((user, index) => (
                            <div
                                key={user.id}
                                className={`p-4 rounded-lg border transition-all hover:shadow-md ${getRankBg(user.rank)} ${user.isCurrentUser ? "ring-2 ring-accent" : ""
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center">
                                            {getRankIcon(user.rank)}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center">
                                                <User className="w-5 h-5 text-accent" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-foreground">
                                                    {user.name}
                                                    {user.isCurrentUser && (
                                                        <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {user.branch} • {user.year}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="text-center">
                                            <div className="font-semibold text-foreground">{user.totalSolved}</div>
                                            <div className="text-xs text-muted-foreground">Solved</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-semibold text-foreground">{user.streak}</div>
                                            <div className="text-xs text-muted-foreground">Streak</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-semibold text-foreground">{user.points}</div>
                                            <div className="text-xs text-muted-foreground">Points</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LeaderboardPage() {
    return (
        <ProtectedRoute requiredRole="student">
            <LeaderboardContent />
        </ProtectedRoute>
    );
}