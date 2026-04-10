import { useLang } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Sparkles,
  Code2,
  Users,
  Gift,
  ArrowLeft,
  Flame,
  BookOpen,
  Github,
  Bug,
} from "lucide-react";

export const GITHUB_REPO = "https://github.com/EricTron-FR/PokeCounter.app";
export const GITHUB_ISSUES = `${GITHUB_REPO}/issues/new`;

interface Props {
  onBack: () => void;
}

export function AboutPage({ onBack }: Props) {
  const { t } = useLang();

  const facts = [
    {
      icon: <Flame className="h-4 w-4" />,
      title: t("factAlphaTitle"),
      body: t("factAlphaBody"),
      color: "text-accent border-accent/50",
    },
    {
      icon: <Code2 className="h-4 w-4" />,
      title: t("factOssTitle"),
      body: t("factOssBody"),
      color: "text-emerald-600 border-emerald-500/50",
    },
    {
      icon: <Gift className="h-4 w-4" />,
      title: t("factFreeTitle"),
      body: t("factFreeBody"),
      color: "text-primary border-primary/50",
    },
    {
      icon: <Users className="h-4 w-4" />,
      title: t("factCommunityTitle"),
      body: t("factCommunityBody"),
      color: "text-sky-600 border-sky-500/50",
    },
  ];

  return (
    <main className="container py-8 max-w-3xl">
      <Button variant="outline" size="sm" onClick={onBack} className="mb-6">
        <ArrowLeft className="h-3 w-3" />
        {t("backToApp")}
      </Button>

      {/* Alpha banner */}
      <div className="rounded-sm border-2 border-accent/60 bg-accent/10 p-4 mb-6 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <div>
          <div className="font-pixel text-[10px] uppercase tracking-wider text-accent text-shadow-pixel">
            {t("alphaBadge")}
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            {t("alphaMessage")}
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-3">
          <span className="inline-block h-3 w-3 bg-primary rotate-45" aria-hidden />
          <h1 className="font-pixel text-2xl sm:text-3xl text-foreground">
            {t("aboutTitle")}
          </h1>
        </div>
        <p className="text-[10px] font-pixel uppercase tracking-wider text-muted-foreground mt-3">
          {t("aboutSubtitle")}
        </p>
      </div>

      {/* Why */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Heart className="h-4 w-4" />
            {t("whyTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed font-mono">
            {t("whyBody")}
          </p>
        </CardContent>
      </Card>

      {/* Key facts */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {facts.map((f) => (
          <div
            key={f.title}
            className={`rounded-sm border-2 ${f.color} bg-card/60 p-3`}
          >
            <div className={`flex items-center gap-2 ${f.color.split(" ")[0]}`}>
              {f.icon}
              <span className="font-pixel text-[9px] uppercase tracking-wider text-shadow-pixel">
                {f.title}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 font-mono">
              {f.body}
            </p>
          </div>
        ))}
      </div>

      {/* Credits */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <BookOpen className="h-4 w-4" />
            {t("creditsTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground leading-relaxed font-mono">
            {t("creditsBody")}
          </p>
        </CardContent>
      </Card>

      {/* Contribute */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-600">
            <Heart className="h-4 w-4" />
            {t("contributeTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed font-mono">
            {t("contributeBody")}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-3 w-3" />
                {t("viewSource")}
              </a>
            </Button>
            <Button asChild size="sm">
              <a
                href={GITHUB_ISSUES}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Bug className="h-3 w-3" />
                {t("reportBug")}
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
