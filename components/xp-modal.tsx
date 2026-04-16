"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { Zap, X, Sparkles } from "lucide-react"

const CONFETTI_COLORS = ["#a855f7", "#6366f1", "#3b82f6", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6"]

function Confetti() {
  const pieces = Array.from({ length: 32 }, (_, i) => i)
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      {pieces.map((i) => {
        const isCircle = Math.random() > 0.5
        const size = 6 + Math.random() * 6
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 20 - 10}%`,
              width: size,
              height: size,
              borderRadius: isCircle ? "50%" : "2px",
              backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              animation: `confetti-fall ${0.8 + Math.random() * 1.4}s ease-out ${Math.random() * 0.4}s forwards`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        )
      })}
    </div>
  )
}

export function XPModal() {
  const { showXPModal, lastXPEarned, setShowXPModal, streak, level, levelTitle } = useAppStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (showXPModal) {
      setVisible(true)
      const t = setTimeout(() => {
        setVisible(false)
        setTimeout(() => setShowXPModal(false), 300)
      }, 3500)
      return () => clearTimeout(t)
    }
  }, [showXPModal, setShowXPModal])

  if (!showXPModal) return null

  const isGreatDay = lastXPEarned >= 60

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={() => { setVisible(false); setTimeout(() => setShowXPModal(false), 300) }}
    >
      <div
        className="relative bg-card border border-border rounded-3xl p-8 w-full max-w-sm text-center overflow-hidden animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        <Confetti />

        <button
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
          onClick={() => { setVisible(false); setTimeout(() => setShowXPModal(false), 300) }}
        >
          <X size={18} />
        </button>

        {/* Sparkles decoration */}
        <div className="absolute top-6 left-6 text-xp-gold/60 animate-pulse">
          <Sparkles size={16} />
        </div>
        <div className="absolute top-12 right-8 text-primary/60 animate-pulse delay-100">
          <Sparkles size={12} />
        </div>

        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 mx-auto mb-4 shadow-lg shadow-primary/20">
          <Zap size={40} className="text-primary fill-primary" />
        </div>

        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">Day logged!</p>
        <h2 className="text-5xl font-black text-xp-gold mb-2 xp-pop">+{lastXPEarned} XP</h2>

        {isGreatDay && (
          <p className="text-primary text-sm font-semibold mb-3">Amazing work today!</p>
        )}

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 bg-secondary rounded-2xl px-4 py-2">
            <span className="text-streak-orange text-xl">🔥</span>
            <span className="font-bold text-foreground">{streak} day streak</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-sm">
          <Zap size={14} className="text-primary" />
          <span>Lv.{level} {levelTitle}</span>
        </div>
      </div>
    </div>
  )
}
