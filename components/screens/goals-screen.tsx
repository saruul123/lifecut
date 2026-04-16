"use client"

import { useAppStore } from "@/lib/store"
import { ChevronLeft, Trophy, Lock, Check } from "lucide-react"
import { GoalCard } from "@/components/goal-card"

export function GoalsScreen() {
  const { setScreen, goals } = useAppStore()

  const unlockedGoals = goals.filter((g) => g.isUnlocked)
  const lockedGoals = goals.filter((g) => !g.isUnlocked)

  return (
    <div className="flex flex-col gap-5 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => setScreen("home")}
          className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-xl">Goals</h1>
          <p className="text-muted-foreground text-xs">Track your achievements</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success-green/15 flex items-center justify-center">
            <Check size={18} className="text-success-green" />
          </div>
          <div>
            <p className="text-xl font-bold text-success-green">{unlockedGoals.length}</p>
            <p className="text-xs text-muted-foreground">Unlocked</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <Lock size={18} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-xl font-bold">{lockedGoals.length}</p>
            <p className="text-xs text-muted-foreground">Locked</p>
          </div>
        </div>
      </div>

      {/* Unlocked Goals */}
      {unlockedGoals.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={16} className="text-success-green" />
            <h2 className="font-bold text-sm text-success-green uppercase tracking-wider">Unlocked</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {unlockedGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {/* Locked Goals */}
      {lockedGoals.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lock size={16} className="text-muted-foreground" />
            <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">In Progress</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {lockedGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <div className="bg-card border border-border rounded-3xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Trophy size={28} className="text-muted-foreground" />
          </div>
          <h3 className="font-bold text-base mb-1">No Goals Yet</h3>
          <p className="text-muted-foreground text-sm">Goals will appear here as you progress</p>
        </div>
      )}
    </div>
  )
}
