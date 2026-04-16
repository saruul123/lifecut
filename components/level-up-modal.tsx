"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { Star, X } from "lucide-react"

const CONFETTI_COLORS = ["#a855f7", "#6366f1", "#3b82f6", "#f59e0b", "#10b981", "#ec4899"]

function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => i)
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      {pieces.map((i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 20}%`,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animation: `confetti-fall ${1 + Math.random() * 1.5}s ease-out ${Math.random() * 0.3}s forwards`,
          }}
        />
      ))}
    </div>
  )
}

export function LevelUpModal() {
  const { showLevelUpModal, newLevel, levelTitle, setShowLevelUpModal } = useAppStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (showLevelUpModal) {
      setVisible(true)
      const t = setTimeout(() => {
        setVisible(false)
        setTimeout(() => setShowLevelUpModal(false), 300)
      }, 4000)
      return () => clearTimeout(t)
    }
  }, [showLevelUpModal, setShowLevelUpModal])

  if (!showLevelUpModal) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={() => { setVisible(false); setTimeout(() => setShowLevelUpModal(false), 300) }}
    >
      <div
        className="relative bg-gradient-to-br from-card via-card to-primary/10 border border-primary/40 rounded-3xl p-8 w-full max-w-sm text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Confetti />

        <button
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
          onClick={() => { setVisible(false); setTimeout(() => setShowLevelUpModal(false), 300) }}
        >
          <X size={18} />
        </button>

        {/* Animated stars */}
        <div className="relative mb-4">
          <div className="absolute -top-2 -left-2 text-xp-gold animate-pulse opacity-60">
            <Star size={20} fill="currentColor" />
          </div>
          <div className="absolute -top-4 right-4 text-primary animate-pulse opacity-60 delay-100">
            <Star size={16} fill="currentColor" />
          </div>
          <div className="absolute top-8 -right-2 text-accent animate-pulse opacity-60 delay-200">
            <Star size={18} fill="currentColor" />
          </div>

          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-accent to-primary mx-auto flex items-center justify-center level-up-glow">
            <span className="text-white font-black text-4xl">{newLevel}</span>
          </div>
        </div>

        <p className="text-primary text-sm font-bold uppercase tracking-widest mb-1 animate-pulse">Level Up!</p>
        <h2 className="text-4xl font-black text-foreground mb-2">Level {newLevel}</h2>
        <p className="text-xl font-bold text-primary mb-4">{levelTitle}</p>
        <p className="text-muted-foreground text-sm">Keep crushing it, champion!</p>

        <button
          onClick={() => { setVisible(false); setTimeout(() => setShowLevelUpModal(false), 300) }}
          className="mt-6 w-full py-3.5 rounded-2xl bg-primary font-bold text-white shadow-lg shadow-primary/30 transition-all active:scale-98"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
