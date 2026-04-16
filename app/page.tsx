"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { BottomNav } from "@/components/bottom-nav"
import { XPModal } from "@/components/xp-modal"
import { LevelUpModal } from "@/components/level-up-modal"
import { FloatingActionButton } from "@/components/floating-action-button"
import { RuleBuilder } from "@/components/rule-builder"
import { HomeScreen } from "@/components/screens/home-screen"
import { LogScreen } from "@/components/screens/log-screen"
import { StatsScreen } from "@/components/screens/stats-screen"
import { ChallengeScreen } from "@/components/screens/challenge-screen"
import { CreateChallengeScreen } from "@/components/screens/create-challenge-screen"
import { ProfileScreen } from "@/components/screens/profile-screen"
import { StoryScreen } from "@/components/screens/story-screen"
import { GoalsScreen } from "@/components/screens/goals-screen"
import { ManageRulesScreen } from "@/components/screens/manage-rules-screen"

function AppShell() {
  const { screen } = useAppStore()
  const [showRuleBuilder, setShowRuleBuilder] = useState(false)

  const showBottomNav = !["log", "create-challenge", "story", "goals", "manage-rules"].includes(screen)
  const showFAB = ["home", "challenge", "stats", "profile"].includes(screen)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile phone frame feel - max width centered */}
      <div className="max-w-md mx-auto min-h-screen relative">
        {/* Subtle top gradient */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-10" />

        {/* Main scrollable content */}
        <main className="px-4 pt-14 relative z-0">
          <div className="animate-fade-in-up">
            {screen === "home" && <HomeScreen />}
            {screen === "log" && <LogScreen />}
            {screen === "stats" && <StatsScreen />}
            {screen === "challenge" && <ChallengeScreen />}
            {screen === "create-challenge" && <CreateChallengeScreen />}
            {screen === "challenge-dashboard" && <ChallengeScreen />}
            {screen === "profile" && <ProfileScreen />}
            {screen === "story" && <StoryScreen />}
            {screen === "goals" && <GoalsScreen />}
            {screen === "manage-rules" && <ManageRulesScreen />}
          </div>
        </main>

        {/* Bottom Navigation */}
        {showBottomNav && <BottomNav />}

        {/* Floating Action Button */}
        {showFAB && (
          <FloatingActionButton onCreateRule={() => setShowRuleBuilder(true)} />
        )}

        {/* Modals */}
        <XPModal />
        <LevelUpModal />

        {/* Rule Builder */}
        {showRuleBuilder && (
          <RuleBuilder onClose={() => setShowRuleBuilder(false)} />
        )}
      </div>
    </div>
  )
}

export default function Page() {
  return <AppShell />
}
