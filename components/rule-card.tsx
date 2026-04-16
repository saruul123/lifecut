"use client"

import { Rule } from "@/lib/store"
import { getRuleIcon } from "@/lib/icons"
import { Check, Circle, Pencil, Trash2 } from "lucide-react"

interface RuleCardProps {
  rule: Rule
  isCompleted?: boolean
  onToggle?: () => void
  onEdit?: () => void
  onDelete?: () => void
  showActions?: boolean
  showXPFloater?: boolean
  compact?: boolean
}

export function RuleCard({
  rule,
  isCompleted = false,
  onToggle,
  onEdit,
  onDelete,
  showActions = false,
  showXPFloater = false,
  compact = false,
}: RuleCardProps) {
  const Icon = getRuleIcon(rule.icon)

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
          isCompleted
            ? "bg-primary/10 border-primary/40"
            : "bg-secondary/50 border-border"
        }`}
      >
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isCompleted ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
          <Icon size={12} />
        </div>
        <span className={`text-xs font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
          {rule.name}
        </span>
        <span className="ml-auto text-[10px] font-semibold text-xp-gold">+{rule.xpReward}</span>
      </div>
    )
  }

  return (
    <div
      onClick={onToggle}
      className={`relative flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-300 ${
        onToggle ? "cursor-pointer" : ""
      } ${
        isCompleted
          ? "bg-primary/10 border-primary/40 quest-glow"
          : "bg-secondary/50 border-border hover:border-border/80"
      }`}
    >
      <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-300 ${
        isCompleted ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
      }`}>
        <Icon size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-sm ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
            {rule.name}
          </span>
          {rule.isCustom && (
            <span className="text-[10px] font-semibold text-accent bg-accent/15 px-1.5 py-0.5 rounded">
              CUSTOM
            </span>
          )}
        </div>
        {rule.description && (
          <p className="text-xs text-muted-foreground truncate">{rule.description}</p>
        )}
      </div>

      <span className="text-xs font-semibold text-xp-gold bg-xp-gold/10 px-2 py-0.5 rounded-full whitespace-nowrap">
        +{rule.xpReward} XP
      </span>

      {onToggle && (
        <div className={`flex-shrink-0 transition-all duration-200 ${isCompleted ? "text-primary scale-110" : "text-muted-foreground"}`}>
          {isCompleted ? <Check size={20} /> : <Circle size={20} />}
        </div>
      )}

      {showActions && (
        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit() }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && rule.isCustom && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}

      {showXPFloater && isCompleted && (
        <span className="absolute right-4 top-0 text-xp-gold font-bold text-sm pointer-events-none xp-float">
          +{rule.xpReward} XP
        </span>
      )}
    </div>
  )
}
