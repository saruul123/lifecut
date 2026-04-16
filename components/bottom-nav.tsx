"use client"

import { useAppStore, type Screen } from "@/lib/store"
import { Home, BarChart2, Swords, User, Plus } from "lucide-react"

const tabs: { icon: React.ElementType; label: string; screen: Screen }[] = [
  { icon: Home, label: "Home", screen: "home" },
  { icon: BarChart2, label: "Stats", screen: "stats" },
  { icon: Swords, label: "Challenge", screen: "challenge" },
  { icon: User, label: "Profile", screen: "profile" },
]

export function BottomNav() {
  const { screen, setScreen } = useAppStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-end justify-center pb-safe">
      <div className="w-full max-w-md bg-card/90 backdrop-blur-xl border-t border-border px-2 pb-5 pt-2">
        <div className="flex items-center justify-around relative">
          {tabs.map((tab) => {
            const isActive = screen === tab.screen
            const Icon = tab.icon
            return (
              <button
                key={tab.screen}
                onClick={() => setScreen(tab.screen)}
                className={`flex flex-col items-center gap-1 px-4 py-1 rounded-2xl transition-all duration-200 ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? "bg-primary/15" : ""}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Floating action button */}
      <button
        onClick={() => setScreen("log")}
        className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary shadow-lg shadow-primary/40 flex items-center justify-center transition-transform active:scale-95 hover:scale-105"
        aria-label="Quick log"
      >
        <Plus size={22} className="text-white" strokeWidth={2.5} />
      </button>
    </nav>
  )
}
