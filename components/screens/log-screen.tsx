"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { getRuleIcon } from "@/lib/icons"
import { ChevronLeft, Minus, Plus, Check, Circle, Zap } from "lucide-react"

export function LogScreen() {
  const { setScreen, submitLog, rules } = useAppStore()
  const activeRules = rules.filter((r) => r.isActive)

  // Track values for each rule
  const [values, setValues] = useState<Record<string, boolean | number>>(() => {
    const initial: Record<string, boolean | number> = {}
    activeRules.forEach((rule) => {
      if (rule.type === "boolean" || rule.type === "time") {
        initial[rule.id] = false
      } else if (rule.type === "numeric") {
        initial[rule.id] = 0
      }
    })
    return initial
  })

  function updateValue(id: string, value: boolean | number) {
    setValues((prev) => ({ ...prev, [id]: value }))
  }

  function handleSubmit() {
    submitLog(values)
    setScreen("home")
  }

  // Calculate preview XP
  const previewXP = activeRules.reduce((sum, rule) => {
    const val = values[rule.id]
    if (rule.type === "boolean" && val === true) return sum + rule.xpReward
    if (rule.type === "time" && val === true) return sum + rule.xpReward
    if (rule.type === "numeric" && typeof val === "number" && rule.targetValue && val >= rule.targetValue) {
      return sum + rule.xpReward
    }
    return sum
  }, 0)

  const completedCount = activeRules.filter((rule) => {
    const val = values[rule.id]
    if (rule.type === "boolean" || rule.type === "time") return val === true
    if (rule.type === "numeric" && typeof val === "number" && rule.targetValue) return val >= rule.targetValue
    return false
  }).length

  return (
    <div className="flex flex-col gap-5 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => setScreen("home")} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-xl">Daily Log</h1>
          <p className="text-muted-foreground text-xs">{completedCount}/{activeRules.length} rules completed</p>
        </div>
      </div>

      {/* Date badge */}
      <div className="text-center">
        <span className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full font-medium">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </span>
      </div>

      {/* Rule Inputs */}
      <div className="flex flex-col gap-3">
        {activeRules.map((rule) => {
          const Icon = getRuleIcon(rule.icon)
          const val = values[rule.id]
          const isCompleted = rule.type === "boolean" || rule.type === "time"
            ? val === true
            : typeof val === "number" && rule.targetValue ? val >= rule.targetValue : false

          return (
            <div
              key={rule.id}
              className={`bg-card border rounded-3xl p-5 transition-all duration-300 ${
                isCompleted ? "border-primary/40 bg-primary/5" : "border-border"
              }`}
            >
              {/* Rule Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  isCompleted ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                }`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{rule.name}</p>
                    {rule.isCustom && (
                      <span className="text-[10px] font-semibold text-accent bg-accent/15 px-1.5 py-0.5 rounded">
                        CUSTOM
                      </span>
                    )}
                  </div>
                  {rule.targetValue && (
                    <p className="text-xs text-muted-foreground">Target: {rule.targetValue} for +{rule.xpReward} XP</p>
                  )}
                  {rule.targetTime && (
                    <p className="text-xs text-muted-foreground">Before {rule.targetTime} for +{rule.xpReward} XP</p>
                  )}
                  {rule.type === "boolean" && (
                    <p className="text-xs text-muted-foreground">+{rule.xpReward} XP</p>
                  )}
                </div>
                {isCompleted && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </div>

              {/* Input based on type */}
              {rule.type === "boolean" && (
                <button
                  onClick={() => updateValue(rule.id, !val)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                    val ? "bg-success-green/10 border-success-green/40" : "bg-secondary/50 border-border"
                  }`}
                >
                  <span className={`font-medium text-sm ${val ? "text-success-green" : "text-muted-foreground"}`}>
                    {val ? "Completed" : "Mark as done"}
                  </span>
                  <div className={`w-11 h-6 rounded-full transition-all duration-300 relative ${val ? "bg-success-green" : "bg-muted"}`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${val ? "left-[calc(100%-22px)]" : "left-0.5"}`} />
                  </div>
                </button>
              )}

              {rule.type === "time" && (
                <button
                  onClick={() => updateValue(rule.id, !val)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                    val ? "bg-success-green/10 border-success-green/40" : "bg-secondary/50 border-border"
                  }`}
                >
                  <span className={`font-medium text-sm ${val ? "text-success-green" : "text-muted-foreground"}`}>
                    {val ? `Done before ${rule.targetTime}` : `Did you do it before ${rule.targetTime}?`}
                  </span>
                  <div className={`w-11 h-6 rounded-full transition-all duration-300 relative ${val ? "bg-success-green" : "bg-muted"}`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${val ? "left-[calc(100%-22px)]" : "left-0.5"}`} />
                  </div>
                </button>
              )}

              {rule.type === "numeric" && typeof val === "number" && (
                <div>
                  {/* Slider */}
                  <input
                    type="range"
                    min={0}
                    max={(rule.targetValue ?? 100) * 1.5}
                    step={rule.targetValue && rule.targetValue > 100 ? 100 : 1}
                    value={val}
                    onChange={(e) => updateValue(rule.id, Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none bg-secondary cursor-pointer"
                    style={{ accentColor: isCompleted ? "oklch(0.65 0.18 150)" : "oklch(0.65 0.22 290)" }}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">0</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateValue(rule.id, Math.max(0, val - (rule.targetValue && rule.targetValue > 100 ? 500 : 1)))}
                        className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className={`text-xl font-bold min-w-16 text-center ${isCompleted ? "text-success-green" : "text-foreground"}`}>
                        {rule.targetValue && rule.targetValue >= 1000 ? val.toLocaleString() : val}
                      </span>
                      <button
                        onClick={() => updateValue(rule.id, val + (rule.targetValue && rule.targetValue > 100 ? 500 : 1))}
                        className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-xs text-muted-foreground">{((rule.targetValue ?? 100) * 1.5).toLocaleString()}</span>
                  </div>
                  {/* Progress indicator */}
                  {rule.targetValue && (
                    <div className="flex gap-1 mt-3">
                      {Array.from({ length: 10 }, (_, i) => {
                        const threshold = (rule.targetValue! / 10) * (i + 1)
                        return (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              val >= threshold ? (isCompleted ? "bg-success-green" : "bg-primary") : "bg-secondary"
                            }`}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {activeRules.length === 0 && (
        <div className="bg-card border border-border rounded-3xl p-8 text-center">
          <p className="text-muted-foreground text-sm mb-2">No active rules to log</p>
          <button
            onClick={() => setScreen("manage-rules")}
            className="text-primary text-sm font-semibold"
          >
            Add some rules first
          </button>
        </div>
      )}

      {/* XP Preview */}
      <div className="bg-primary/10 border border-primary/30 rounded-3xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-xp-gold fill-xp-gold" />
          <span className="font-semibold text-sm">XP you&apos;ll earn</span>
        </div>
        <span className="text-2xl font-bold text-xp-gold">+{previewXP} XP</span>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={activeRules.length === 0}
        className="w-full py-4 rounded-2xl bg-primary font-bold text-white text-base shadow-lg shadow-primary/30 transition-all active:scale-98 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Log Day & Earn XP
      </button>
    </div>
  )
}
