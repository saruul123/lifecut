"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Plus, X, NotebookPen, Sparkles } from "lucide-react"

interface FloatingActionButtonProps {
  onCreateRule: () => void
}

export function FloatingActionButton({ onCreateRule }: FloatingActionButtonProps) {
  const { setScreen } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-3">
      {/* Options */}
      <div className={`flex flex-col items-end gap-2 transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        <button
          onClick={() => { onCreateRule(); setIsOpen(false) }}
          className="flex items-center gap-2 bg-accent shadow-lg shadow-accent/30 text-white pl-4 pr-3 py-2.5 rounded-2xl font-semibold text-sm transition-all active:scale-95"
        >
          <Sparkles size={16} />
          New Rule
        </button>
        <button
          onClick={() => { setScreen("log"); setIsOpen(false) }}
          className="flex items-center gap-2 bg-primary shadow-lg shadow-primary/30 text-white pl-4 pr-3 py-2.5 rounded-2xl font-semibold text-sm transition-all active:scale-95"
        >
          <NotebookPen size={16} />
          Log Day
        </button>
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 active:scale-95 ${
          isOpen
            ? "bg-muted text-foreground rotate-45"
            : "bg-primary text-white shadow-primary/40"
        }`}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  )
}
