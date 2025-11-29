import {
  Zap,
  Castle,
  Palette,
  Ship,
  Mountain,
  Gem,
  Award,
} from "lucide-react";

export interface RegionSymbol {
  icon: React.ElementType;
  name: string;
  symbolName: string;
  color: string;
  bgGradient: string;
}

export const regionSymbols: Record<string, RegionSymbol> = {
  karabakh: {
    icon: Zap,
    name: "Karabakh",
    symbolName: "Golden Horse",
    color: "text-amber-500",
    bgGradient: "from-amber-500 to-orange-600",
  },
  nakhchivan: {
    icon: Castle,
    name: "Nakhchivan",
    symbolName: "Ancient Fortress",
    color: "text-stone-500",
    bgGradient: "from-stone-500 to-amber-700",
  },
  shaki: {
    icon: Ship,
    name: "Shaki",
    symbolName: "Silk Road Caravan",
    color: "text-yellow-500",
    bgGradient: "from-yellow-500 to-amber-600",
  },
  gabala: {
    icon: Mountain,
    name: "Gabala",
    symbolName: "Mountain Peak",
    color: "text-emerald-500",
    bgGradient: "from-emerald-500 to-teal-600",
  },
  ganja: {
    icon: Palette,
    name: "Ganja",
    symbolName: "Carpet Pattern",
    color: "text-rose-500",
    bgGradient: "from-rose-500 to-pink-600",
  },
  gobustan: {
    icon: Gem,
    name: "Gobustan",
    symbolName: "Petroglyphs",
    color: "text-stone-600",
    bgGradient: "from-stone-600 to-zinc-700",
  },
  general: {
    icon: Award,
    name: "General",
    symbolName: "Explorer",
    color: "text-primary",
    bgGradient: "from-primary to-secondary",
  },
};

export function getRegionSymbol(symbolKey: string | null | undefined): RegionSymbol {
  if (!symbolKey) return regionSymbols.general;
  const key = symbolKey.toLowerCase();
  return regionSymbols[key] || regionSymbols.general;
}
