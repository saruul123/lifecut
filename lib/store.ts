"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Screen = "home" | "log" | "stats" | "challenge" | "profile" | "create-challenge" | "challenge-dashboard" | "story" | "goals" | "manage-rules"

export type RuleType = "boolean" | "numeric" | "time"

export interface Rule {
  id: string
  name: string
  type: RuleType
  targetValue?: number
  targetTime?: string
  xpReward: number
  icon: string
  description: string
  isCustom: boolean
  isActive: boolean
}

export interface Goal {
  id: string
  title: string
  description: string
  icon: string
  unlockType: "level" | "xp" | "streak"
  unlockValue: number
  isUnlocked: boolean
}

export interface DayLog {
  date: string
  ruleCompletions: Record<string, boolean | number>
  xpEarned: number
}

export interface Participant {
  id: string
  username: string
  avatar: string
  xp: number
  streak: number
  rank: number
  isCurrentUser?: boolean
}

export interface Challenge {
  id: string
  name: string
  duration: number
  selectedRuleIds: string[]
  difficulty: "easy" | "medium" | "hard"
  participants: Participant[]
  daysLeft: number
}

interface AppState {
  screen: Screen
  rules: Rule[]
  goals: Goal[]
  streak: number
  totalXP: number
  level: number
  levelTitle: string
  xpToNextLevel: number
  xpProgress: number
  currentWeight: number
  targetWeight: number
  startWeight: number
  logs: DayLog[]
  challenges: Challenge[]
  activeChallenge: Challenge | null
  showXPModal: boolean
  lastXPEarned: number
  showLevelUpModal: boolean
  newLevel: number
  username: string
  avatar: string

  setScreen: (screen: Screen) => void
  createRule: (rule: Omit<Rule, "id">) => void
  updateRule: (id: string, updates: Partial<Rule>) => void
  deleteRule: (id: string) => void
  toggleRuleActive: (id: string) => void
  createGoal: (goal: Omit<Goal, "id" | "isUnlocked">) => void
  deleteGoal: (id: string) => void
  checkGoalUnlocks: () => void
  setShowXPModal: (show: boolean) => void
  setShowLevelUpModal: (show: boolean) => void
  submitLog: (completions: Record<string, boolean | number>) => void
  createChallenge: (challenge: Omit<Challenge, "id" | "participants" | "daysLeft">) => void
  setActiveChallenge: (challenge: Challenge | null) => void
  updateWeight: (weight: number) => void
}

const LEVEL_TITLES: Record<number, string> = {
  1: "Rookie",
  2: "Beginner",
  3: "Fat Burner",
  4: "Committed",
  5: "Warrior",
  6: "Champion",
  7: "Legend",
  8: "Master",
  9: "Unstoppable",
  10: "Elite",
}

const XP_PER_LEVEL = 300

const defaultRules: Rule[] = [
  { id: "sleep", name: "Sleep 8h", type: "numeric", targetValue: 8, xpReward: 20, icon: "moon", description: "Get 8 hours of quality sleep", isCustom: false, isActive: true },
  { id: "water", name: "Drink 3L water", type: "numeric", targetValue: 3, xpReward: 15, icon: "droplet", description: "Stay hydrated with 3 liters", isCustom: false, isActive: true },
  { id: "steps", name: "Walk 8000 steps", type: "numeric", targetValue: 8000, xpReward: 20, icon: "footprints", description: "Get moving with 8000 steps", isCustom: false, isActive: true },
  { id: "no-sugar", name: "No sugar", type: "boolean", xpReward: 15, icon: "candy-off", description: "Avoid added sugars", isCustom: false, isActive: true },
  { id: "no-alcohol", name: "No alcohol", type: "boolean", xpReward: 10, icon: "wine-off", description: "Skip the drinks", isCustom: false, isActive: false },
  { id: "screen-off", name: "PC off by 23:30", type: "time", targetTime: "23:30", xpReward: 15, icon: "monitor-off", description: "Turn off screens before 11:30 PM", isCustom: false, isActive: false },
  { id: "workout", name: "Workout 30min", type: "numeric", targetValue: 30, xpReward: 25, icon: "dumbbell", description: "Exercise for at least 30 minutes", isCustom: false, isActive: false },
  { id: "meditation", name: "Meditate 10min", type: "numeric", targetValue: 10, xpReward: 15, icon: "brain", description: "Practice mindfulness", isCustom: false, isActive: false },
  { id: "reading", name: "Read 20 pages", type: "numeric", targetValue: 20, xpReward: 15, icon: "book-open", description: "Feed your mind", isCustom: false, isActive: false },
  { id: "cold-shower", name: "Cold shower", type: "boolean", xpReward: 20, icon: "snowflake", description: "Build mental toughness", isCustom: false, isActive: false },
  { id: "no-junk", name: "No junk food", type: "boolean", xpReward: 15, icon: "utensils-crossed", description: "Eat clean today", isCustom: false, isActive: false },
  { id: "protein", name: "Hit protein goal", type: "boolean", xpReward: 15, icon: "egg", description: "Meet your daily protein target", isCustom: false, isActive: false },
]

const defaultGoals: Goal[] = [
  { id: "g1", title: "First Week Done", description: "Complete 7 days in a row", icon: "calendar-check", unlockType: "streak", unlockValue: 7, isUnlocked: false },
  { id: "g2", title: "XP Hunter", description: "Earn 500 total XP", icon: "zap", unlockType: "xp", unlockValue: 500, isUnlocked: true },
  { id: "g3", title: "Level 5 Warrior", description: "Reach level 5", icon: "shield", unlockType: "level", unlockValue: 5, isUnlocked: false },
  { id: "g4", title: "Consistency King", description: "14 day streak", icon: "crown", unlockType: "streak", unlockValue: 14, isUnlocked: false },
  { id: "g5", title: "XP Master", description: "Earn 2000 total XP", icon: "trophy", unlockType: "xp", unlockValue: 2000, isUnlocked: false },
  { id: "g6", title: "Elite Status", description: "Reach level 10", icon: "star", unlockType: "level", unlockValue: 10, isUnlocked: false },
]

const mockLogs: DayLog[] = [
  { date: "2024-01-08", ruleCompletions: { sleep: 8, water: 3, steps: 9200, "no-sugar": true, "no-alcohol": true }, xpEarned: 80 },
  { date: "2024-01-07", ruleCompletions: { sleep: 7, water: 2.5, steps: 7800, "no-sugar": false, "no-alcohol": true }, xpEarned: 45 },
  { date: "2024-01-06", ruleCompletions: { sleep: 8, water: 3, steps: 10100, "no-sugar": true, "no-alcohol": true }, xpEarned: 80 },
  { date: "2024-01-05", ruleCompletions: { sleep: 6, water: 2, steps: 5000, "no-sugar": false, "no-alcohol": false }, xpEarned: 0 },
  { date: "2024-01-04", ruleCompletions: { sleep: 8, water: 3.2, steps: 8500, "no-sugar": true, "no-alcohol": true }, xpEarned: 80 },
]

const mockChallenge: Challenge = {
  id: "1",
  name: "14 Day Soft Challenge",
  duration: 14,
  selectedRuleIds: ["sleep", "water", "steps", "no-sugar"],
  difficulty: "medium",
  daysLeft: 9,
  participants: [
    { id: "1", username: "You", avatar: "JD", xp: 540, streak: 5, rank: 1, isCurrentUser: true },
    { id: "2", username: "mikkel_dk", avatar: "MK", xp: 470, streak: 3, rank: 2 },
    { id: "3", username: "alex_fit", avatar: "AF", xp: 420, streak: 4, rank: 3 },
    { id: "4", username: "carlos99", avatar: "C9", xp: 310, streak: 2, rank: 4 },
    { id: "5", username: "tom_w", avatar: "TW", xp: 250, streak: 1, rank: 5 },
  ],
}

function generateId() {
  return Math.random().toString(36).substring(2, 10)
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      screen: "home",
      rules: defaultRules,
      goals: defaultGoals,
      streak: 5,
      totalXP: 540,
      level: 3,
      levelTitle: "Fat Burner",
      xpToNextLevel: 900,
      xpProgress: 540,
      currentWeight: 82,
      targetWeight: 74,
      startWeight: 84,
      logs: mockLogs,
      challenges: [mockChallenge],
      activeChallenge: mockChallenge,
      showXPModal: false,
      lastXPEarned: 0,
      showLevelUpModal: false,
      newLevel: 0,
      username: "JohnDoe",
      avatar: "JD",

      setScreen: (screen) => set({ screen }),

      createRule: (rule) => {
        const newRule: Rule = { ...rule, id: generateId() }
        set((state) => ({ rules: [...state.rules, newRule] }))
      },

      updateRule: (id, updates) => {
        set((state) => ({
          rules: state.rules.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }))
      },

      deleteRule: (id) => {
        set((state) => ({
          rules: state.rules.filter((r) => r.id !== id || !r.isCustom),
        }))
      },

      toggleRuleActive: (id) => {
        set((state) => ({
          rules: state.rules.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)),
        }))
      },

      createGoal: (goal) => {
        const newGoal: Goal = { ...goal, id: generateId(), isUnlocked: false }
        set((state) => ({ goals: [...state.goals, newGoal] }))
      },

      deleteGoal: (id) => {
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }))
      },

      checkGoalUnlocks: () => {
        const { goals, level, totalXP, streak } = get()
        const updatedGoals = goals.map((goal) => {
          if (goal.isUnlocked) return goal
          let shouldUnlock = false
          if (goal.unlockType === "level" && level >= goal.unlockValue) shouldUnlock = true
          if (goal.unlockType === "xp" && totalXP >= goal.unlockValue) shouldUnlock = true
          if (goal.unlockType === "streak" && streak >= goal.unlockValue) shouldUnlock = true
          return shouldUnlock ? { ...goal, isUnlocked: true } : goal
        })
        if (JSON.stringify(updatedGoals) !== JSON.stringify(goals)) {
          set({ goals: updatedGoals })
        }
      },

      setShowXPModal: (show) => set({ showXPModal: show }),
      setShowLevelUpModal: (show) => set({ showLevelUpModal: show }),

      submitLog: (completions) => {
        const { rules } = get()
        let xp = 0
        const activeRules = rules.filter((r) => r.isActive)

        for (const rule of activeRules) {
          const value = completions[rule.id]
          if (rule.type === "boolean" && value === true) {
            xp += rule.xpReward
          } else if (rule.type === "numeric" && typeof value === "number" && rule.targetValue && value >= rule.targetValue) {
            xp += rule.xpReward
          } else if (rule.type === "time" && value === true) {
            xp += rule.xpReward
          }
        }

        const newLog: DayLog = {
          date: new Date().toISOString().split("T")[0],
          ruleCompletions: completions,
          xpEarned: xp,
        }

        const newTotalXP = get().totalXP + xp
        const currentLevel = get().level
        const newLevel = Math.floor(newTotalXP / XP_PER_LEVEL) + 1
        const leveledUp = newLevel > currentLevel

        set((state) => ({
          logs: [newLog, ...state.logs],
          totalXP: newTotalXP,
          xpProgress: newTotalXP,
          xpToNextLevel: newLevel * XP_PER_LEVEL,
          streak: state.streak + 1,
          lastXPEarned: xp,
          showXPModal: true,
          level: newLevel,
          levelTitle: LEVEL_TITLES[newLevel] ?? LEVEL_TITLES[10],
          showLevelUpModal: leveledUp,
          newLevel: leveledUp ? newLevel : state.newLevel,
        }))

        setTimeout(() => get().checkGoalUnlocks(), 500)
      },

      createChallenge: (challenge) => {
        const newChallenge: Challenge = {
          ...challenge,
          id: generateId(),
          daysLeft: challenge.duration,
          participants: [
            { id: "1", username: get().username, avatar: get().avatar, xp: 0, streak: 0, rank: 1, isCurrentUser: true },
          ],
        }
        set((state) => ({
          challenges: [...state.challenges, newChallenge],
          activeChallenge: newChallenge,
        }))
      },

      setActiveChallenge: (challenge) => set({ activeChallenge: challenge }),

      updateWeight: (weight) => set({ currentWeight: weight }),
    }),
    {
      name: "lifecut-storage",
      partialize: (state) => ({
        rules: state.rules,
        goals: state.goals,
        streak: state.streak,
        totalXP: state.totalXP,
        level: state.level,
        levelTitle: state.levelTitle,
        xpToNextLevel: state.xpToNextLevel,
        xpProgress: state.xpProgress,
        currentWeight: state.currentWeight,
        targetWeight: state.targetWeight,
        startWeight: state.startWeight,
        logs: state.logs,
        challenges: state.challenges,
        username: state.username,
        avatar: state.avatar,
      }),
    }
  )
)
