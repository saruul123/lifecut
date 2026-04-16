import {
  Moon, Droplet, Footprints, CandyOff, WineOff, MonitorOff, Dumbbell,
  Brain, BookOpen, Snowflake, UtensilsCrossed, Egg, Zap, Flame, Target,
  Heart, Clock, Coffee, Apple, Salad, Bike, Pill, Sun, Music, Pencil,
  Phone, Tv, Gamepad2, ShoppingBag, Cigarette, type LucideIcon
} from "lucide-react"

export const RULE_ICONS: Record<string, LucideIcon> = {
  "moon": Moon,
  "droplet": Droplet,
  "footprints": Footprints,
  "candy-off": CandyOff,
  "wine-off": WineOff,
  "monitor-off": MonitorOff,
  "dumbbell": Dumbbell,
  "brain": Brain,
  "book-open": BookOpen,
  "snowflake": Snowflake,
  "utensils-crossed": UtensilsCrossed,
  "egg": Egg,
  "zap": Zap,
  "flame": Flame,
  "target": Target,
  "heart": Heart,
  "clock": Clock,
  "coffee": Coffee,
  "apple": Apple,
  "salad": Salad,
  "bike": Bike,
  "pill": Pill,
  "sun": Sun,
  "music": Music,
  "pencil": Pencil,
  "phone": Phone,
  "tv": Tv,
  "gamepad": Gamepad2,
  "shopping-bag": ShoppingBag,
  "cigarette": Cigarette,
}

export const AVAILABLE_ICONS = Object.keys(RULE_ICONS)

export function getRuleIcon(iconKey: string): LucideIcon {
  return RULE_ICONS[iconKey] ?? Target
}
