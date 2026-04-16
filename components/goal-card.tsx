"use client"

import { Goal, useAppStore } from "@/lib/store"
import {
  CalendarCheck, Zap, Shield, Crown, Trophy, Star, Lock, Check, Target,
  type LucideIcon
} from "lucide-react"

const GOAL_ICONS: Record<string, LucideIcon> = {
  "calendar-check": CalendarCheck,
  "zap": Zap,
  "shield": Shield,
  "crown": Crown,
  "trophy": Trophy,
  "star": Star,
  "target": Target,
}

function getGoalIcon(iconKey: string): LucideIcon {
  return GOAL_ICONS[iconKey] ?? Target
}

interface GoalCardProps {
  goal: Goal
}

export function GoalCard({ goal }: GoalCardProps) {
  const { level, totalXP, streak } = useAppStore()
  const Icon = getGoalIcon(goal.icon)

  let current = 0
  let target = goal.unlockValue
  let unit = ""

  if (goal.unlockType === "level") {
    current = level
    unit = "Lv"
  } else if (goal.unlockType === "xp") {
    current = totalXP
    unit = "XP"
  } else if (goal.unlockType === "streak") {
    current = streak
    unit = "days"
  }

  const progress = Math.min(100, Math.round((current / target) * 100))

  return (
    <div
      className={`relative p-4 rounded-2xl border transition-all duration-300 ${
        goal.isUnlocked
          ? "bg-success-green/10 border-success-green/40"
          : "bg-card border-border"
      }`}
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
        goal.isUnlocked
          ? "bg-success-green/20 text-success-green"
          : "bg-secondary text-muted-foreground"
      }`}>
        {goal.isUnlocked ? <Check size={24} /> : <Icon size={22} />}
      </div>

      {/* Title & Description */}
      <h3 className={`font-bold text-sm mb-0.5 ${goal.isUnlocked ? "text-success-green" : "text-foreground"}`}>
        {goal.title}
      </h3>
      <p className="text-xs text-muted-foreground mb-3">{goal.description}</p>

      {/* Progress */}
      {!goal.isUnlocked && (
        <>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">{current} / {target} {unit}</span>
            <span className="text-primary font-semibold">{progress}%</span>
          </div>
        </>
      )}

      {/* Locked/Unlocked Badge */}
      <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${
        goal.isUnlocked ? "bg-success-green text-white" : "bg-muted text-muted-foreground"
      }`}>
        {goal.isUnlocked ? <Check size={12} /> : <Lock size={10} />}
      </div>
    </div>
  )
}
