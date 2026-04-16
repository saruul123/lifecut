"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { getRuleIcon } from "@/lib/icons"
import { Plus, Trophy, Users, Clock, ChevronRight, Crown, Flame, Zap, Target } from "lucide-react"

export function ChallengeScreen() {
  const { challenges, activeChallenge, setScreen, rules } = useAppStore()
  const [tab, setTab] = useState<"active" | "leaderboard">("active")

  const challenge = activeChallenge ?? challenges[0]

  const rankColors: Record<number, string> = {
    1: "text-xp-gold",
    2: "text-muted-foreground",
    3: "text-streak-orange",
  }

  // Get rule names for the challenge
  const challengeRules = challenge?.selectedRuleIds
    .map((id) => rules.find((r) => r.id === id))
    .filter(Boolean) ?? []

  const difficultyMultipliers: Record<string, { label: string; color: string }> = {
    easy: { label: "1x XP", color: "text-success-green" },
    medium: { label: "1.5x XP", color: "text-xp-gold" },
    hard: { label: "2x XP", color: "text-streak-orange" },
  }

  return (
    <div className="flex flex-col gap-4 pb-32">
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="font-bold text-2xl">Challenges</h1>
          <p className="text-muted-foreground text-sm">Compete with your crew</p>
        </div>
        <button
          onClick={() => setScreen("create-challenge")}
          className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30 transition-all active:scale-95"
        >
          <Plus size={20} className="text-white" />
        </button>
      </div>

      {/* Active Challenge Card */}
      {challenge && (
        <div className="bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 rounded-3xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-primary bg-primary/15 px-2 py-0.5 rounded-full">ACTIVE</span>
                {challenge.difficulty && (
                  <span className={`text-xs font-semibold ${difficultyMultipliers[challenge.difficulty]?.color}`}>
                    {difficultyMultipliers[challenge.difficulty]?.label}
                  </span>
                )}
              </div>
              <h2 className="font-bold text-lg text-balance">{challenge.name}</h2>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-streak-orange">
                <Clock size={14} />
                <span className="text-sm font-bold">{challenge.daysLeft}</span>
              </div>
              <p className="text-xs text-muted-foreground">days left</p>
            </div>
          </div>

          {/* Rules */}
          <div className="flex flex-wrap gap-2 mb-4">
            {challengeRules.map((rule) => {
              if (!rule) return null
              const Icon = getRuleIcon(rule.icon)
              return (
                <div
                  key={rule.id}
                  className="flex items-center gap-1.5 text-xs bg-secondary px-2.5 py-1.5 rounded-full font-medium text-muted-foreground"
                >
                  <Icon size={12} />
                  {rule.name}
                </div>
              )
            })}
          </div>

          {/* Participants avatars */}
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {challenge.participants.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    p.isCurrentUser ? "bg-primary border-primary text-white" : "bg-secondary border-card text-muted-foreground"
                  }`}
                >
                  {p.avatar}
                </div>
              ))}
              {challenge.participants.length > 4 && (
                <div className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                  +{challenge.participants.length - 4}
                </div>
              )}
            </div>
            <button
              onClick={() => setScreen("challenge-dashboard")}
              className="flex items-center gap-1 text-primary text-sm font-semibold"
            >
              <Users size={14} />
              View all
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-secondary rounded-2xl p-1">
        {(["active", "leaderboard"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 capitalize ${
              tab === t ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "active" ? "Overview" : "Leaderboard"}
          </button>
        ))}
      </div>

      {tab === "active" && challenge ? (
        <div className="bg-card border border-border rounded-3xl p-5">
          <h3 className="font-bold text-base mb-4">Your Progress</h3>
          {[
            { label: "Current Rank", value: "#1", icon: Crown, color: "text-xp-gold" },
            { label: "XP Earned", value: "540 XP", icon: Zap, color: "text-primary" },
            { label: "Streak", value: "5 days", icon: Flame, color: "text-streak-orange" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                  <Icon size={15} className={color} />
                </div>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
              <span className={`font-bold text-sm ${color}`}>{value}</span>
            </div>
          ))}

          {/* Challenge Rules */}
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Challenge Rules</h4>
            <div className="flex flex-col gap-2">
              {challengeRules.map((rule) => {
                if (!rule) return null
                const Icon = getRuleIcon(rule.icon)
                return (
                  <div key={rule.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/50">
                    <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center text-primary">
                      <Icon size={13} />
                    </div>
                    <span className="text-sm font-medium flex-1">{rule.name}</span>
                    <span className="text-xs text-xp-gold font-semibold">+{rule.xpReward} XP</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-3xl p-5">
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <Trophy size={16} className="text-xp-gold" />
            Leaderboard
          </h3>
          <div className="flex flex-col gap-2">
            {challenge?.participants.map((p) => (
              <div
                key={p.id}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                  p.isCurrentUser ? "bg-primary/10 border border-primary/30" : "bg-secondary/40"
                }`}
              >
                <span className={`w-6 text-center font-bold text-base ${rankColors[p.rank] ?? "text-muted-foreground"}`}>
                  {p.rank === 1 ? "👑" : p.rank}
                </span>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${p.isCurrentUser ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {p.avatar}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${p.isCurrentUser ? "text-primary" : "text-foreground"}`}>
                    {p.username} {p.isCurrentUser && <span className="text-xs font-normal">(you)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{p.streak}d streak</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-xp-gold">{p.xp} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Challenge State */}
      {!challenge && (
        <div className="bg-card border border-border rounded-3xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Target size={28} className="text-muted-foreground" />
          </div>
          <h3 className="font-bold text-base mb-1">No Active Challenge</h3>
          <p className="text-muted-foreground text-sm mb-4">Start a challenge with friends to compete together</p>
          <button
            onClick={() => setScreen("create-challenge")}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm"
          >
            Create Challenge
          </button>
        </div>
      )}

      {/* Create Challenge CTA */}
      <button
        onClick={() => setScreen("create-challenge")}
        className="w-full py-3.5 rounded-2xl border border-dashed border-primary/40 text-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
      >
        <Plus size={16} />
        Create New Challenge
      </button>
    </div>
  )
}
