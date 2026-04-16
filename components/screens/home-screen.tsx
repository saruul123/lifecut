"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { getRuleIcon } from "@/lib/icons"
import { Zap, CheckCircle2, Circle, Share2, ChevronRight, Settings } from "lucide-react"
import { GoalCard } from "@/components/goal-card"

function XPFloater({ amount, visible }: { amount: number; visible: boolean }) {
  if (!visible) return null
  return (
    <span className="absolute right-4 top-0 text-xp-gold font-bold text-sm pointer-events-none xp-float">
      +{amount} XP
    </span>
  )
}

export function HomeScreen() {
  const {
    rules,
    goals,
    streak,
    totalXP,
    level,
    levelTitle,
    xpToNextLevel,
    xpProgress,
    setScreen,
    username,
    avatar,
  } = useAppStore()

  const [completedRules, setCompletedRules] = useState<Record<string, boolean>>({})
  const [floaters, setFloaters] = useState<Record<string, boolean>>({})

  const activeRules = rules.filter((r) => r.isActive)
  const todayXP = activeRules
    .filter((r) => completedRules[r.id])
    .reduce((sum, r) => sum + r.xpReward, 0)

  const progressPct = Math.min(100, Math.round((xpProgress / xpToNextLevel) * 100))

  const upcomingGoals = goals.filter((g) => !g.isUnlocked).slice(0, 2)

  function handleToggle(ruleId: string, xp: number) {
    const wasChecked = completedRules[ruleId]
    setCompletedRules((prev) => ({ ...prev, [ruleId]: !prev[ruleId] }))

    if (!wasChecked) {
      setFloaters((prev) => ({ ...prev, [ruleId]: true }))
      setTimeout(() => setFloaters((prev) => ({ ...prev, [ruleId]: false })), 1300)
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-base shadow-md shadow-primary/30">
            {avatar}
          </div>
          <div>
            <p className="text-xs text-muted-foreground leading-tight">Welcome back</p>
            <p className="font-bold text-base leading-tight">{username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-primary/15 border border-primary/30 px-3 py-1.5 rounded-full">
            <Zap size={14} className="text-primary fill-primary" />
            <span className="text-primary font-bold text-sm">Lv.{level}</span>
            <span className="text-primary/70 text-xs">{levelTitle}</span>
          </div>
          <button
            onClick={() => setScreen("manage-rules")}
            className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* XP Progress */}
      <div className="bg-card border border-border rounded-3xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">XP Progress</span>
          <span className="text-xs text-muted-foreground">{xpProgress} / {xpToNextLevel} XP</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">Lv.{level}</span>
          <span className="text-xs font-semibold text-primary">{progressPct}%</span>
          <span className="text-xs text-muted-foreground">Lv.{level + 1}</span>
        </div>
      </div>

      {/* Today's Rules */}
      <div className="bg-card border border-border rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base">Today&apos;s Rules</h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            {Object.values(completedRules).filter(Boolean).length}/{activeRules.length} done
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {activeRules.map((rule) => {
            const Icon = getRuleIcon(rule.icon)
            const isChecked = completedRules[rule.id]
            return (
              <button
                key={rule.id}
                onClick={() => handleToggle(rule.id, rule.xpReward)}
                className={`relative flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-300 text-left ${
                  isChecked
                    ? "bg-primary/10 border-primary/40 quest-glow xp-pop"
                    : "bg-secondary/50 border-border hover:border-border/80"
                }`}
              >
                <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                  isChecked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium text-sm ${isChecked ? "text-foreground" : "text-muted-foreground"}`}>
                      {rule.name}
                    </span>
                    {rule.isCustom && (
                      <span className="text-[10px] font-semibold text-accent bg-accent/15 px-1.5 py-0.5 rounded">
                        CUSTOM
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs font-semibold text-xp-gold bg-xp-gold/10 px-2 py-0.5 rounded-full">
                  +{rule.xpReward} XP
                </span>
                <div className={`flex-shrink-0 transition-all duration-200 ${isChecked ? "text-primary scale-110" : "text-muted-foreground"}`}>
                  {isChecked ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </div>
                <XPFloater amount={rule.xpReward} visible={!!floaters[rule.id]} />
              </button>
            )
          })}
        </div>
        {activeRules.length === 0 && (
          <div className="text-center py-6">
            <p className="text-muted-foreground text-sm mb-2">No active rules yet</p>
            <button
              onClick={() => setScreen("manage-rules")}
              className="text-primary text-sm font-semibold"
            >
              Add some rules to get started
            </button>
          </div>
        )}
      </div>

      {/* Streak + Today XP */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium">Current Streak</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl flame-pulse">🔥</span>
            <span className="text-2xl font-bold">{streak}</span>
            <span className="text-sm text-muted-foreground">days</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium">Today&apos;s XP</span>
          <div className="flex items-center gap-1.5">
            <Zap size={18} className="text-xp-gold fill-xp-gold" />
            <span className="text-2xl font-bold text-xp-gold">{todayXP}</span>
            <span className="text-sm text-muted-foreground">XP</span>
          </div>
        </div>
      </div>

      {/* Goals Preview */}
      {upcomingGoals.length > 0 && (
        <div className="bg-card border border-border rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base">Upcoming Goals</h2>
            <button
              onClick={() => setScreen("goals")}
              className="flex items-center gap-1 text-primary text-xs font-semibold"
            >
              View all
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {upcomingGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setScreen("log")}
          className="w-full py-4 rounded-2xl bg-primary font-bold text-white text-base shadow-lg shadow-primary/30 transition-all active:scale-98 hover:opacity-90"
        >
          Log Day
        </button>
        <button
          onClick={() => setScreen("story")}
          className="w-full py-3.5 rounded-2xl bg-secondary border border-border font-semibold text-sm text-foreground flex items-center justify-center gap-2 transition-all active:scale-98 hover:border-primary/40"
        >
          <Share2 size={16} className="text-primary" />
          Share Progress
        </button>
      </div>
    </div>
  )
}
