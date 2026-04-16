"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

const weightData = [
  { day: "Jan 1", kg: 84 },
  { day: "Jan 3", kg: 83.5 },
  { day: "Jan 5", kg: 83 },
  { day: "Jan 7", kg: 82.8 },
  { day: "Jan 9", kg: 82.4 },
  { day: "Jan 11", kg: 82 },
  { day: "Today", kg: 82 },
]

type Tab = "weight" | "xp" | "streaks"

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-xl">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-bold text-sm text-foreground">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

export function StatsScreen() {
  const { logs, streak, totalXP, level, currentWeight, targetWeight } = useAppStore()
  const [activeTab, setActiveTab] = useState<Tab>("weight")

  const xpData = logs.slice(0, 7).reverse().map((log, i) => ({
    day: `Day ${i + 1}`,
    xp: log.xpEarned,
  }))

  const streakData = logs.slice(0, 7).reverse().map((log, i) => ({
    day: `D${i + 1}`,
    streak: log.xpEarned > 50 ? 1 : 0.4,
  }))

  const tabs: { key: Tab; label: string }[] = [
    { key: "weight", label: "Weight" },
    { key: "xp", label: "XP History" },
    { key: "streaks", label: "Streaks" },
  ]

  const weightLost = 84 - currentWeight
  const progressPct = Math.round(((84 - currentWeight) / (84 - targetWeight)) * 100)

  return (
    <div className="flex flex-col gap-4 pb-32">
      <div className="pt-2">
        <h1 className="font-bold text-2xl">Your Stats</h1>
        <p className="text-muted-foreground text-sm">Keep pushing forward</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Streak", value: `${streak}d`, color: "text-streak-orange" },
          { label: "Total XP", value: totalXP, color: "text-xp-gold" },
          { label: "Level", value: `Lv.${level}`, color: "text-primary" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-2xl p-3 text-center">
            <p className={`font-bold text-xl ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Weight Progress Card */}
      <div className="bg-card border border-border rounded-3xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Weight Journey</p>
            <p className="font-bold text-base">{currentWeight} kg <span className="text-muted-foreground font-normal text-sm">current</span></p>
          </div>
          <div className="text-right">
            <p className="text-success-green font-bold text-lg">-{weightLost} kg</p>
            <p className="text-xs text-muted-foreground">lost so far</p>
          </div>
        </div>
        <div className="h-2 bg-secondary rounded-full mb-1">
          <div className="h-full rounded-full bg-gradient-to-r from-accent to-success-green transition-all duration-700" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Start: 84 kg</span>
          <span className="text-success-green font-semibold">{progressPct}% to goal</span>
          <span>Goal: {targetWeight} kg</span>
        </div>
      </div>

      {/* Chart Tabs */}
      <div className="bg-card border border-border rounded-3xl p-5">
        <div className="flex gap-1 bg-secondary rounded-2xl p-1 mb-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === tab.key ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === "weight" ? (
              <LineChart data={weightData}>
                <CartesianGrid stroke="oklch(0.22 0.025 270)" strokeDasharray="4 4" />
                <XAxis dataKey="day" tick={{ fill: "oklch(0.58 0.04 270)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[81, 85]} tick={{ fill: "oklch(0.58 0.04 270)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="kg" stroke="oklch(0.60 0.18 230)" strokeWidth={2.5} dot={{ fill: "oklch(0.60 0.18 230)", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            ) : activeTab === "xp" ? (
              <BarChart data={xpData}>
                <CartesianGrid stroke="oklch(0.22 0.025 270)" strokeDasharray="4 4" />
                <XAxis dataKey="day" tick={{ fill: "oklch(0.58 0.04 270)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.58 0.04 270)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="xp" fill="oklch(0.65 0.22 290)" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={streakData}>
                <CartesianGrid stroke="oklch(0.22 0.025 270)" strokeDasharray="4 4" />
                <XAxis dataKey="day" tick={{ fill: "oklch(0.58 0.04 270)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="streak" fill="oklch(0.72 0.22 40)" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Logs */}
      <div className="bg-card border border-border rounded-3xl p-5">
        <h3 className="font-bold text-base mb-3">Recent Days</h3>
        <div className="flex flex-col gap-2">
          {logs.slice(0, 5).map((log) => {
            const completions = log.ruleCompletions || {}
            const steps = typeof completions.steps === "number" ? completions.steps : 0
            const water = typeof completions.water === "number" ? completions.water : 0
            const sleep = typeof completions.sleep === "number" ? completions.sleep : 0
            const completedCount = Object.values(completions).filter((v) => v === true || (typeof v === "number" && v > 0)).length
            return (
              <div key={log.date} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{new Date(log.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                  <p className="text-xs text-muted-foreground">
                    {steps > 0 && `${steps.toLocaleString()} steps`}
                    {steps > 0 && water > 0 && " · "}
                    {water > 0 && `${water}L water`}
                    {(steps > 0 || water > 0) && sleep > 0 && " · "}
                    {sleep > 0 && `${sleep}h sleep`}
                    {steps === 0 && water === 0 && sleep === 0 && `${completedCount} rules completed`}
                  </p>
                </div>
                <span className="text-xp-gold font-bold text-sm">+{log.xpEarned} XP</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
