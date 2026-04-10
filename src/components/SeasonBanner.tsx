import { useMemo } from "react";
import { getCurrentSeason, seasonStatus } from "@/lib/seasons";
import { useLang } from "@/lib/i18n";
import { Calendar, Clock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function SeasonBanner() {
  const { t } = useLang();
  const season = useMemo(() => getCurrentSeason(), []);
  const status = useMemo(
    () => (season ? seasonStatus(season) : null),
    [season],
  );

  if (!season || !status) return null;

  const stateLabel =
    status.state === "active"
      ? t("seasonActive")
      : status.state === "upcoming"
        ? t("seasonUpcoming")
        : t("seasonEnded");

  const stateColor =
    status.state === "active"
      ? "border-border bg-primary text-primary-foreground"
      : status.state === "upcoming"
        ? "border-border bg-foreground text-background"
        : "border-border bg-muted text-muted-foreground";

  return (
    <div className="border-4 border-border bg-card p-4 shadow-brutal">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        {/* Left: title + name */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="border-4 border-border bg-primary p-2 shrink-0">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-pixel text-[9px] uppercase tracking-wider text-muted-foreground">
                {t("currentSeason")}
              </span>
              <span
                className={cn(
                  "font-pixel text-[8px] uppercase tracking-wider px-1.5 py-0.5 border-2",
                  stateColor,
                )}
              >
                {stateLabel}
              </span>
            </div>
            <h2 className="font-pixel text-xs sm:text-lg leading-relaxed mt-2 text-foreground text-shadow-pixel break-words">
              {season.name}
            </h2>
          </div>
        </div>

        {/* Right: countdown + format */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 border-4 border-border bg-primary font-pixel text-[10px] uppercase tracking-wider text-primary-foreground">
            <Calendar className="h-3 w-3" />
            {season.format.toUpperCase()}
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-1 border-4 border-border bg-background font-pixel text-[10px] uppercase tracking-wider text-foreground">
            <Clock className="h-3 w-3" />
            {status.state === "active" && t("daysLeft", { n: status.daysLeft ?? 0 })}
            {status.state === "upcoming" && t("startsIn", { n: status.daysIn ?? 0 })}
            {status.state === "ended" && t("seasonEnded")}
          </div>
        </div>
      </div>

      {/* Progress bar (only when active) */}
      {status.state === "active" && status.daysIn != null && status.daysLeft != null && (
        <div className="mt-3">
          <div className="h-2 w-full border-2 border-border bg-background overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{
                width: `${Math.min(100, (status.daysIn / (status.daysIn + status.daysLeft)) * 100)}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-[8px] font-mono text-muted-foreground mt-1">
            <span>{season.startDate}</span>
            <span>{season.endDate}</span>
          </div>
        </div>
      )}

      {/* Rules collapse */}
      <details className="mt-3 group">
        <summary className="cursor-pointer text-[9px] font-pixel uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors select-none">
          {t("rules")} ({season.rules.length})
        </summary>
        <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
          {season.rules.map((r) => (
            <li
              key={r}
              className="text-[10px] font-mono text-muted-foreground flex items-start gap-1.5"
            >
              <span className="text-primary mt-0.5">▸</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
