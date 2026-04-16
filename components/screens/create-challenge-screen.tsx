"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { getRuleIcon } from "@/lib/icons"
import { ChevronLeft, Check, Copy, Share2, QrCode, Zap } from "lucide-react"

const durations = [7, 14, 30]
const difficulties = [
  { value: "easy", label: "Easy", multiplier: "1x", desc: "Standard XP", color: "text-success-green bg-success-green/10 border-success-green/30" },
  { value: "medium", label: "Medium", multiplier: "1.5x", desc: "Bonus XP", color: "text-xp-gold bg-xp-gold/10 border-xp-gold/30" },
  { value: "hard", label: "Hard", multiplier: "2x", desc: "Double XP", color: "text-streak-orange bg-streak-orange/10 border-streak-orange/30" },
] as const

export function CreateChallengeScreen() {
  const { setScreen, rules, createChallenge } = useAppStore()
  const [name, setName] = useState("")
  const [duration, setDuration] = useState(14)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>(["sleep", "water", "steps"])
  const [created, setCreated] = useState(false)
  const [copied, setCopied] = useState(false)

  const inviteLink = "lifecut.app/join/XQZT7K"

  function toggleRule(id: string) {
    setSelectedRuleIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  const selectedRules = rules.filter((r) => selectedRuleIds.includes(r.id))
  const totalXP = selectedRules.reduce((sum, r) => sum + r.xpReward, 0)
  const multiplier = difficulty === "easy" ? 1 : difficulty === "medium" ? 1.5 : 2
  const adjustedXP = Math.round(totalXP * multiplier)

  function handleCreate() {
    if (!name.trim() || selectedRuleIds.length === 0) return
    createChallenge({
      name: name.trim(),
      duration,
      selectedRuleIds,
      difficulty,
    })
    setCreated(true)
  }

  function handleCopy() {
    navigator.clipboard.writeText(inviteLink).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (created) {
    return (
      <div className="flex flex-col gap-5 pb-32">
        <div className="flex items-center gap-3 pt-2">
          <button onClick={() => setScreen("challenge")} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h1 className="font-bold text-xl">Share Challenge</h1>
        </div>

        <div className="bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 rounded-3xl p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <Check size={28} className="text-primary" />
          </div>
          <h2 className="font-bold text-xl mb-1">{name || "Challenge"}</h2>
          <p className="text-muted-foreground text-sm">{duration} days · {selectedRuleIds.length} rules · {difficulty}</p>
        </div>

        {/* QR Code Placeholder */}
        <div className="bg-card border border-border rounded-3xl p-6 flex flex-col items-center gap-4">
          <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center">
            <div className="grid grid-cols-7 grid-rows-7 gap-0.5 p-2">
              {Array.from({ length: 49 }, (_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-sm"
                  style={{
                    backgroundColor: Math.random() > 0.4 ? "#1a1025" : "transparent",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <QrCode size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Scan to join challenge</span>
          </div>
        </div>

        {/* Invite Link */}
        <div className="bg-card border border-border rounded-3xl p-4">
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Invite Link</p>
          <div className="flex items-center gap-2 bg-secondary rounded-2xl px-3 py-2">
            <span className="flex-1 text-sm font-mono text-foreground truncate">{inviteLink}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-primary/15 text-primary px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <p className="text-center text-muted-foreground text-sm font-medium">
          Challenge your friends and compete together!
        </p>

        <button
          onClick={() => setScreen("challenge")}
          className="w-full py-4 rounded-2xl bg-primary font-bold text-white text-base shadow-lg shadow-primary/30 transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          <Share2 size={18} />
          Share Challenge
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 pb-32">
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => setScreen("challenge")} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-bold text-xl">Create Challenge</h1>
      </div>

      {/* Challenge Name */}
      <div className="bg-card border border-border rounded-3xl p-5">
        <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-3">Challenge Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. 14 Day Soft Challenge"
          className="w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
        />
      </div>

      {/* Rule Selector Grid */}
      <div className="bg-card border border-border rounded-3xl p-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Select Rules</label>
          <span className="text-xs text-primary font-semibold">{selectedRuleIds.length} selected</span>
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
          {rules.map((rule) => {
            const Icon = getRuleIcon(rule.icon)
            const isSelected = selectedRuleIds.includes(rule.id)
            return (
              <button
                key={rule.id}
                onClick={() => toggleRule(rule.id)}
                className={`flex items-center gap-2 p-3 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? "bg-primary/10 border-primary/40"
                    : "bg-secondary/50 border-border hover:border-border/80"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                    {rule.name}
                  </p>
                  <p className="text-[10px] text-xp-gold">+{rule.xpReward} XP</p>
                </div>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  isSelected ? "bg-primary border-primary" : "border-muted-foreground"
                }`}>
                  {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Difficulty */}
      <div className="bg-card border border-border rounded-3xl p-5">
        <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-3">Difficulty</label>
        <div className="flex gap-2">
          {difficulties.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              className={`flex-1 p-3 rounded-2xl border text-center transition-all ${
                difficulty === d.value ? d.color : "bg-secondary border-border text-muted-foreground"
              }`}
            >
              <p className="font-bold text-sm">{d.multiplier}</p>
              <p className="text-xs">{d.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="bg-card border border-border rounded-3xl p-5">
        <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-3">Duration</label>
        <div className="flex gap-2">
          {durations.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                duration === d ? "bg-primary text-white shadow-md shadow-primary/30" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {d} days
            </button>
          ))}
        </div>
      </div>

      {/* XP Preview */}
      <div className="bg-primary/10 border border-primary/30 rounded-3xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Daily XP Potential</span>
          <span className="text-lg font-bold text-xp-gold flex items-center gap-1">
            <Zap size={16} className="fill-xp-gold" />
            {adjustedXP} XP
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {selectedRules.length} rules × {difficulties.find((d) => d.value === difficulty)?.multiplier} multiplier
        </p>
      </div>

      <button
        onClick={handleCreate}
        disabled={!name.trim() || selectedRuleIds.length === 0}
        className="w-full py-4 rounded-2xl bg-primary font-bold text-white text-base shadow-lg shadow-primary/30 transition-all active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
      >
        Create Challenge
      </button>
    </div>
  )
}
