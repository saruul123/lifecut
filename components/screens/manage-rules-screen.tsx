"use client"

import { useState } from "react"
import { useAppStore, Rule } from "@/lib/store"
import { getRuleIcon } from "@/lib/icons"
import { ChevronLeft, Plus, Check, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import { RuleBuilder } from "@/components/rule-builder"

export function ManageRulesScreen() {
  const { setScreen, rules, toggleRuleActive, deleteRule } = useAppStore()
  const [showBuilder, setShowBuilder] = useState(false)
  const [editingRule, setEditingRule] = useState<Rule | undefined>()
  const [tab, setTab] = useState<"active" | "all">("active")

  const activeRules = rules.filter((r) => r.isActive)
  const customRules = rules.filter((r) => r.isCustom)
  const displayRules = tab === "active" ? activeRules : rules

  function handleEdit(rule: Rule) {
    if (rule.isCustom) {
      setEditingRule(rule)
      setShowBuilder(true)
    }
  }

  return (
    <div className="flex flex-col gap-5 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen("home")}
            className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-xl">Manage Rules</h1>
            <p className="text-muted-foreground text-xs">{activeRules.length} active rules</p>
          </div>
        </div>
        <button
          onClick={() => { setEditingRule(undefined); setShowBuilder(true) }}
          className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30 transition-all active:scale-95"
        >
          <Plus size={20} className="text-white" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-secondary rounded-2xl p-1">
        {(["active", "all"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 capitalize ${
              tab === t ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "active" ? `Active (${activeRules.length})` : `All Rules (${rules.length})`}
          </button>
        ))}
      </div>

      {/* Rules List */}
      <div className="bg-card border border-border rounded-3xl p-4">
        <div className="flex flex-col gap-2">
          {displayRules.map((rule) => {
            const Icon = getRuleIcon(rule.icon)
            return (
              <div
                key={rule.id}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                  rule.isActive
                    ? "bg-primary/5 border-primary/30"
                    : "bg-secondary/30 border-border opacity-60"
                }`}
              >
                <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                  rule.isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  <Icon size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium text-sm ${rule.isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {rule.name}
                    </span>
                    {rule.isCustom && (
                      <span className="text-[10px] font-semibold text-accent bg-accent/15 px-1.5 py-0.5 rounded">
                        CUSTOM
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-xp-gold font-semibold">+{rule.xpReward} XP</span>
                    <span className="text-[10px] text-muted-foreground capitalize">{rule.type}</span>
                    {rule.targetValue && (
                      <span className="text-[10px] text-muted-foreground">Target: {rule.targetValue}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {rule.isCustom && (
                    <>
                      <button
                        onClick={() => handleEdit(rule)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => toggleRuleActive(rule.id)}
                    className={`w-12 h-7 rounded-full flex items-center transition-all duration-200 px-1 ${
                      rule.isActive ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${
                      rule.isActive ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Custom Rules Info */}
      <div className="bg-secondary/30 border border-border rounded-2xl p-4">
        <h3 className="font-semibold text-sm mb-1">Custom Rules</h3>
        <p className="text-muted-foreground text-xs">
          You have {customRules.length} custom rule{customRules.length !== 1 ? "s" : ""}. 
          Create your own rules with custom XP rewards to personalize your journey.
        </p>
      </div>

      {/* Create Rule CTA */}
      <button
        onClick={() => { setEditingRule(undefined); setShowBuilder(true) }}
        className="w-full py-3.5 rounded-2xl border border-dashed border-primary/40 text-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
      >
        <Plus size={16} />
        Create Custom Rule
      </button>

      {/* Rule Builder Modal */}
      {showBuilder && (
        <RuleBuilder
          onClose={() => { setShowBuilder(false); setEditingRule(undefined) }}
          editingRule={editingRule}
        />
      )}
    </div>
  )
}
