import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getRegionSymbol } from "@/lib/regionSymbols";
import type { Achievement } from "@shared/schema";
import { Lock, Check } from "lucide-react";

const tierColors: Record<string, { bg: string; border: string; glow: string }> = {
  bronze: {
    bg: "from-amber-600/20 to-amber-800/20",
    border: "border-amber-600/50",
    glow: "shadow-amber-500/30",
  },
  silver: {
    bg: "from-slate-300/20 to-slate-500/20",
    border: "border-slate-400/50",
    glow: "shadow-slate-400/30",
  },
  gold: {
    bg: "from-yellow-400/20 to-yellow-600/20",
    border: "border-yellow-500/50",
    glow: "shadow-yellow-500/30",
  },
  platinum: {
    bg: "from-cyan-300/20 to-cyan-500/20",
    border: "border-cyan-400/50",
    glow: "shadow-cyan-400/30",
  },
};

interface AchievementBadgeProps {
  achievement: Achievement;
  earned?: boolean;
  progress?: number;
  earnedAt?: Date | null;
}

export function AchievementBadge({
  achievement,
  earned = false,
  progress = 0,
  earnedAt,
}: AchievementBadgeProps) {
  const tier = achievement.tier || "bronze";
  const colors = tierColors[tier] || tierColors.bronze;
  const regionSymbol = getRegionSymbol(achievement.symbol);
  const SymbolIcon = regionSymbol.icon;

  return (
    <Card
      className={`relative overflow-visible p-4 transition-all duration-300 ${
        earned
          ? `bg-gradient-to-br ${colors.bg} ${colors.border} shadow-lg ${colors.glow}`
          : "bg-muted/30 border-muted grayscale opacity-70"
      }`}
      data-testid={`badge-achievement-${achievement.id}`}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div
          className={`relative w-16 h-16 flex items-center justify-center rounded-xl ${
            earned
              ? `bg-gradient-to-br ${colors.bg} border-2 ${colors.border}`
              : "bg-muted/50 border border-muted"
          }`}
          data-testid={`badge-icon-${achievement.id}`}
        >
          <SymbolIcon
            className={`h-8 w-8 ${earned ? regionSymbol.color : "text-muted-foreground"}`}
          />
          {earned && (
            <div
              className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
              data-testid={`badge-earned-indicator-${achievement.id}`}
            >
              <Check className="h-3 w-3 text-white" />
            </div>
          )}
          {!earned && (
            <div
              className="absolute -top-1 -right-1 w-5 h-5 bg-muted-foreground/50 rounded-full flex items-center justify-center"
              data-testid={`badge-locked-indicator-${achievement.id}`}
            >
              <Lock className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h4
            className="font-semibold text-sm line-clamp-1"
            data-testid={`badge-name-${achievement.id}`}
          >
            {achievement.name}
          </h4>
          <p
            className="text-xs text-muted-foreground line-clamp-2"
            data-testid={`badge-description-${achievement.id}`}
          >
            {achievement.description}
          </p>
        </div>

        {!earned && progress > 0 && (
          <div className="w-full space-y-1" data-testid={`badge-progress-${achievement.id}`}>
            <Progress value={progress} className="h-1.5" />
            <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
          </div>
        )}

        {earned && earnedAt && (
          <span
            className="text-xs text-muted-foreground"
            data-testid={`badge-earned-date-${achievement.id}`}
          >
            Earned {new Date(earnedAt).toLocaleDateString()}
          </span>
        )}

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full capitalize ${
              earned ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}
            data-testid={`badge-tier-${achievement.id}`}
          >
            {tier}
          </span>
          <span
            className="text-xs text-muted-foreground"
            data-testid={`badge-level-${achievement.id}`}
          >
            Lvl {achievement.requiredLevel}+
          </span>
        </div>
      </div>
    </Card>
  );
}
