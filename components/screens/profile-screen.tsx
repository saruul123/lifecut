"use client"

import { useAppStore } from "@/lib/store"
import { Zap, Target, Scale, Settings, Bell, Shield, ChevronRight, Share2, LogOut, Trophy, Sparkles } from "lucide-react"

export function ProfileScreen() {
  const { level, levelTitle, totalXP, xpToNextLevel, streak, currentWeight, targetWeight, startWeight, setScreen, username, avatar, goals, rules } = useAppStore()

  const progressPct = Math.min(100, Math.round((totalXP / xpToNextLevel) * 100))
  const weightProgress = Math.round(((startWeight - currentWeight) / (startWeight - targetWeight)) * 100)
  const unlockedGoals = goals.filter((g) => g.isUnlocked).length
  const activeRules = rules.filter((r) => r.isActive).length

  const settings = [
    { icon: Bell, label: "Notifications", desc: "Daily reminders at 9 PM" },
    { icon: Target, label: "Daily Goal", desc: `${activeRules} active rules` },
    { icon: Scale, label: "Weight Goal", desc: `${targetWeight} kg target` },
    { icon: Shield, label: "Privacy", desc: "Profile visible to friends" },
  ]

  return (
    <div className="flex flex-col gap-4 pb-32">
      {/* Profile Header */}
      <div className="pt-2 flex items-center justify-between">
        <h1 className="font-bold text-2xl">Profile</h1>
        <button className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Settings size={18} />
        </button>
      </div>

      {/* Avatar + Info */}
      <div className="bg-card border border-border rounded-3xl p-6 text-center">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-primary/30">
            {avatar}
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary border-2 border-card flex items-center justify-center">
            <span className="text-white text-xs font-bold">{level}</span>
          </div>
        </div>
        <h2 className="font-bold text-xl">{username}</h2>
        <p className="text-primary font-medium text-sm">Lv.{level} {levelTitle}</p>
        <p className="text-muted-foreground text-xs mt-1">Member since Jan 2024</p>

        {/* XP Bar */}
        <div className="mt-4 bg-secondary rounded-full h-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{totalXP} XP</span>
          <span>{xpToNextLevel} XP to Lv.{level + 1}</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Total XP", value: totalXP, icon: Zap, color: "text-xp-gold" },
          { label: "Best Streak", value: `${streak}d`, icon: null, emoji: "🔥", color: "text-streak-orange" },
          { label: "Weight Lost", value: `${startWeight - currentWeight} kg`, icon: Scale, color: "text-success-green" },
        ].map(({ label, value, icon: Icon, emoji, color }) => (
          <div key={label} className="bg-card border border-border rounded-2xl p-3.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              {emoji ? <span className="text-base">{emoji}</span> : Icon && <Icon size={14} className={color} />}
              <span className={`font-bold text-base ${color}`}>{value}</span>
            </div>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setScreen("goals")}
          className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-primary/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-xp-gold/15 flex items-center justify-center">
            <Trophy size={18} className="text-xp-gold" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm">Goals</p>
            <p className="text-xs text-muted-foreground">{unlockedGoals}/{goals.length} unlocked</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground ml-auto" />
        </button>
        <button
          onClick={() => setScreen("manage-rules")}
          className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-primary/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
            <Sparkles size={18} className="text-accent" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm">Rules</p>
            <p className="text-xs text-muted-foreground">{activeRules} active</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground ml-auto" />
        </button>
      </div>

      {/* Weight Progress */}
      <div className="bg-card border border-border rounded-3xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base">Weight Progress</h3>
          <span className="text-xs text-primary font-semibold">{Math.max(0, weightProgress)}% to goal</span>
        </div>
        <div className="flex items-center justify-between mb-2 text-sm">
          <div className="text-center">
            <p className="font-bold text-lg">{startWeight} kg</p>
            <p className="text-xs text-muted-foreground">Start</p>
          </div>
          <div className="flex-1 mx-4">
            <div className="h-2 bg-secondary rounded-full">
              <div className="h-full rounded-full bg-gradient-to-r from-accent to-success-green transition-all duration-500" style={{ width: `${Math.max(0, weightProgress)}%` }} />
            </div>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-success-green">{targetWeight} kg</p>
            <p className="text-xs text-muted-foreground">Goal</p>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">Currently <span className="font-bold text-foreground">{currentWeight} kg</span></p>
      </div>

      {/* Share Story */}
      <button
        onClick={() => setScreen("story")}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 font-semibold text-sm text-foreground flex items-center justify-center gap-2 transition-all active:scale-98 hover:border-primary/50"
      >
        <Share2 size={16} className="text-primary" />
        Generate Story Card
      </button>

      {/* Settings */}
      <div className="bg-card border border-border rounded-3xl p-5">
        <h3 className="font-bold text-base mb-3">Settings</h3>
        <div className="flex flex-col gap-0">
          {settings.map(({ icon: Icon, label, desc }) => (
            <button key={label} className="flex items-center gap-3 py-3 border-b border-border last:border-0 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                <Icon size={15} className="text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Sign out */}
      <button className="w-full py-3.5 rounded-2xl border border-border text-muted-foreground font-medium text-sm flex items-center justify-center gap-2 hover:text-foreground hover:border-foreground/20 transition-colors">
        <LogOut size={15} />
        Sign Out
      </button>
    </div>
  )
}
