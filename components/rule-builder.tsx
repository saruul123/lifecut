"use client"

import { useState } from "react"
import { useAppStore, RuleType, Rule } from "@/lib/store"
import { getRuleIcon, AVAILABLE_ICONS } from "@/lib/icons"
import { X, Check } from "lucide-react"

interface RuleBuilderProps {
  onClose: () => void
  editingRule?: Rule
}

export function RuleBuilder({ onClose, editingRule }: RuleBuilderProps) {
  const { createRule, updateRule } = useAppStore()

  const [name, setName] = useState(editingRule?.name ?? "")
  const [type, setType] = useState<RuleType>(editingRule?.type ?? "boolean")
  const [targetValue, setTargetValue] = useState(editingRule?.targetValue?.toString() ?? "")
  const [targetTime, setTargetTime] = useState(editingRule?.targetTime ?? "22:00")
  const [xpReward, setXpReward] = useState(editingRule?.xpReward?.toString() ?? "15")
  const [icon, setIcon] = useState(editingRule?.icon ?? "target")
  const [description, setDescription] = useState(editingRule?.description ?? "")
  const [showIconPicker, setShowIconPicker] = useState(false)

  const isValid = name.trim() && xpReward && (type !== "numeric" || targetValue)

  function handleSubmit() {
    if (!isValid) return

    const ruleData = {
      name: name.trim(),
      type,
      targetValue: type === "numeric" ? Number(targetValue) : undefined,
      targetTime: type === "time" ? targetTime : undefined,
      xpReward: Number(xpReward),
      icon,
      description: description.trim(),
      isCustom: true,
      isActive: true,
    }

    if (editingRule) {
      updateRule(editingRule.id, ruleData)
    } else {
      createRule(ruleData)
    }
    onClose()
  }

  const SelectedIcon = getRuleIcon(icon)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-3xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-lg">{editingRule ? "Edit Rule" : "Create Custom Rule"}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-2">Rule Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. No social media"
              className="w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-2">Icon</label>
            <button
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="flex items-center gap-3 w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-left hover:border-primary/30 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                <SelectedIcon size={16} />
              </div>
              <span className="text-sm font-medium text-muted-foreground capitalize">{icon.replace("-", " ")}</span>
            </button>

            {showIconPicker && (
              <div className="mt-2 p-3 bg-secondary border border-border rounded-2xl grid grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                {AVAILABLE_ICONS.map((iconKey) => {
                  const IconComp = getRuleIcon(iconKey)
                  return (
                    <button
                      key={iconKey}
                      onClick={() => { setIcon(iconKey); setShowIconPicker(false) }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        icon === iconKey ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <IconComp size={16} />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-2">Rule Type</label>
            <div className="flex gap-2">
              {([
                { value: "boolean", label: "Yes/No" },
                { value: "numeric", label: "Number" },
                { value: "time", label: "Time" },
              ] as const).map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    type === t.value
                      ? "bg-primary text-white shadow-md shadow-primary/30"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Value for Numeric */}
          {type === "numeric" && (
            <div>
              <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-2">Target Value</label>
              <input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="e.g. 8000"
                className="w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>
          )}

          {/* Target Time for Time type */}
          {type === "time" && (
            <div>
              <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-2">Target Time</label>
              <input
                type="time"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-foreground text-sm font-medium focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>
          )}

          {/* XP Reward */}
          <div>
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-2">XP Reward</label>
            <div className="flex gap-2">
              {["10", "15", "20", "25", "30"].map((val) => (
                <button
                  key={val}
                  onClick={() => setXpReward(val)}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    xpReward === val
                      ? "bg-xp-gold/20 text-xp-gold border border-xp-gold/40"
                      : "bg-secondary text-muted-foreground hover:text-foreground border border-transparent"
                  }`}
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-2">Description (optional)</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of this rule"
              className="w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border">
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full py-4 rounded-2xl bg-primary font-bold text-white text-base shadow-lg shadow-primary/30 transition-all active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 flex items-center justify-center gap-2"
          >
            <Check size={18} />
            {editingRule ? "Save Changes" : "Create Rule"}
          </button>
        </div>
      </div>
    </div>
  )
}
