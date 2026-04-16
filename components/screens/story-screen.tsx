"use client"

import { useRef, useState } from "react"
import { useAppStore } from "@/lib/store"
import { getRuleIcon } from "@/lib/icons"
import { ChevronLeft, Download, Share2, Zap, Flame, Check, Sparkles } from "lucide-react"

type Template = "minimal" | "bold" | "checklist"

const templates: { value: Template; label: string }[] = [
  { value: "minimal", label: "Minimal" },
  { value: "bold", label: "Bold" },
  { value: "checklist", label: "Checklist" },
]

export function StoryScreen() {
  const { setScreen, level, levelTitle, totalXP, streak, xpToNextLevel, rules, logs, username, avatar } = useAppStore()
  const cardRef = useRef<HTMLDivElement>(null)

  const [template, setTemplate] = useState<Template>("bold")
  const [showXP, setShowXP] = useState(true)
  const [showStreak, setShowStreak] = useState(true)
  const [showLevel, setShowLevel] = useState(true)
  const [showRules, setShowRules] = useState(true)
  const [customMessage, setCustomMessage] = useState("")

  const activeRules = rules.filter((r) => r.isActive)
  const todayXP = logs[0]?.xpEarned ?? 0
  const progressPct = Math.min(100, Math.round((totalXP / xpToNextLevel) * 100))
  const dayNumber = streak

  const toggles = [
    { label: "XP Today", value: showXP, setter: setShowXP },
    { label: "Streak", value: showStreak, setter: setShowStreak },
    { label: "Level Badge", value: showLevel, setter: setShowLevel },
    { label: "Rules Completed", value: showRules, setter: setShowRules },
  ]

  return (
    <div className="flex flex-col gap-5 pb-32">
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => setScreen("profile")}
          className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-xl">Story Card</h1>
          <p className="text-muted-foreground text-xs">Share your progress</p>
        </div>
      </div>

      {/* Template Selector */}
      <div className="flex gap-2">
        {templates.map((t) => (
          <button
            key={t.value}
            onClick={() => setTemplate(t.value)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              template === t.value
                ? "bg-primary text-white shadow-md shadow-primary/30"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 9:16 Story Card */}
      <div className="flex justify-center">
        <div
          ref={cardRef}
          className="relative w-64 rounded-3xl overflow-hidden"
          style={{ aspectRatio: "9/16" }}
        >
          {/* Background based on template */}
          {template === "minimal" && (
            <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.08_0.01_270)] to-[oklch(0.05_0.01_270)]" />
          )}
          {template === "bold" && (
            <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.14_0.04_290)] via-[oklch(0.10_0.03_270)] to-[oklch(0.06_0.02_240)]" />
          )}
          {template === "checklist" && (
            <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.12_0.02_200)] to-[oklch(0.08_0.02_220)]" />
          )}

          {/* Grid texture for bold */}
          {template === "bold" && (
            <div
              className="absolute inset-0 opacity-8"
              style={{
                backgroundImage: "linear-gradient(oklch(0.8 0 0 / 0.08) 1px, transparent 1px), linear-gradient(90deg, oklch(0.8 0 0 / 0.08) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
          )}

          {/* Top accent */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${
            template === "minimal" ? "bg-white/20" : "bg-gradient-to-r from-primary via-accent to-primary"
          }`} />

          {/* Content */}
          <div className="relative h-full flex flex-col p-5">
            {/* Branding */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-bold tracking-widest uppercase ${
                template === "minimal" ? "text-white/40" : "text-primary/80"
              }`}>LIFE CUT</span>
              {showLevel && (
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  template === "minimal" ? "bg-white/10 text-white/70" : "bg-primary/20 text-primary"
                }`}>
                  Lv.{level}
                </div>
              )}
            </div>

            {/* Avatar + Name */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                template === "minimal" ? "bg-white/20" : "bg-gradient-to-br from-primary to-accent shadow-primary/40"
              }`}>
                {avatar}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{username}</p>
                {showLevel && (
                  <p className={`text-[10px] ${template === "minimal" ? "text-white/50" : "text-white/60"}`}>
                    {levelTitle}
                  </p>
                )}
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col justify-center">
              {template === "checklist" && showRules ? (
                // Checklist view
                <div>
                  <p className="text-white/50 text-[10px] uppercase tracking-widest font-medium mb-2">Today&apos;s Rules</p>
                  <div className="flex flex-col gap-1.5">
                    {activeRules.slice(0, 5).map((rule) => {
                      const Icon = getRuleIcon(rule.icon)
                      return (
                        <div key={rule.id} className="flex items-center gap-2 bg-white/5 rounded-xl px-2.5 py-2">
                          <div className="w-5 h-5 rounded-md bg-success-green/20 flex items-center justify-center">
                            <Check size={10} className="text-success-green" />
                          </div>
                          <Icon size={12} className="text-white/60" />
                          <span className="text-white text-[11px] font-medium flex-1">{rule.name}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                // Day message
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium mb-1">
                    {template === "minimal" ? "Progress" : "Today"}
                  </p>
                  <h2 className={`text-white font-black leading-tight text-balance mb-1 ${
                    template === "bold" ? "text-2xl" : "text-xl"
                  }`}>
                    {customMessage || (
                      <>Day {dayNumber} –<br />still going!</>
                    )}
                  </h2>
                  {template !== "minimal" && (
                    <p className="text-white/40 text-[10px]">Consistency is the key</p>
                  )}
                </div>
              )}
            </div>

            {/* Stats */}
            {(showXP || showStreak) && (
              <div className={`grid gap-2 mb-4 ${showXP && showStreak ? "grid-cols-2" : "grid-cols-1"}`}>
                {showXP && (
                  <div className={`rounded-xl p-2.5 text-center ${
                    template === "minimal" ? "bg-white/5 border border-white/10" : "bg-white/5 border border-white/10"
                  }`}>
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <Zap size={11} className="text-xp-gold fill-xp-gold" />
                      <span className="font-bold text-white text-sm">{todayXP || totalXP}</span>
                    </div>
                    <p className="text-white/40 text-[9px]">{todayXP ? "XP today" : "Total XP"}</p>
                  </div>
                )}
                {showStreak && (
                  <div className={`rounded-xl p-2.5 text-center ${
                    template === "minimal" ? "bg-white/5 border border-white/10" : "bg-white/5 border border-white/10"
                  }`}>
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <Flame size={11} className="text-streak-orange" />
                      <span className="font-bold text-white text-sm">{streak}</span>
                    </div>
                    <p className="text-white/40 text-[9px]">Day streak</p>
                  </div>
                )}
              </div>
            )}

            {/* Progress Bar */}
            {template !== "minimal" && (
              <div className="mb-3">
                <div className="flex justify-between text-[9px] text-white/40 mb-1">
                  <span>XP Progress</span>
                  <span>{progressPct}%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className="text-white/20 text-[9px]">lifecut.app</span>
              <span className="text-white/20 text-[9px]">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="bg-card border border-border rounded-3xl p-4">
        <h3 className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Show on Card</h3>
        <div className="grid grid-cols-2 gap-2">
          {toggles.map(({ label, value, setter }) => (
            <button
              key={label}
              onClick={() => setter(!value)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                value ? "bg-primary/10 border-primary/30" : "bg-secondary/50 border-border"
              }`}
            >
              <span className={`text-sm font-medium ${value ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
              <div className={`w-9 h-5 rounded-full transition-all relative ${value ? "bg-primary" : "bg-muted"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${value ? "left-[calc(100%-18px)]" : "left-0.5"}`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Message */}
      <div className="bg-card border border-border rounded-3xl p-4">
        <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-2">Custom Message</label>
        <input
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder={`Day ${dayNumber} – still going!`}
          className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button className="w-full py-4 rounded-2xl bg-primary font-bold text-white text-base shadow-lg shadow-primary/30 transition-all active:scale-98 flex items-center justify-center gap-2 hover:opacity-90">
          <Share2 size={18} />
          Share Story
        </button>
        <button className="w-full py-3.5 rounded-2xl bg-secondary border border-border font-semibold text-sm text-foreground flex items-center justify-center gap-2 transition-all active:scale-98 hover:border-primary/30">
          <Download size={16} className="text-primary" />
          Download Image
        </button>
      </div>

      <p className="text-center text-muted-foreground text-xs">
        Tip: Screenshot the card above to share on Instagram Stories
      </p>
    </div>
  )
}
