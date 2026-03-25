import { createElement, useEffect, useMemo } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  CircleHelp,
  Flame,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  Trophy,
} from "lucide-react";
import useInsights from "../../../Hooks/useInsights";

const TIER_DETAILS = {
  1: {
    heading: "TIER 1",
    description: "Critical patterns affecting your performance",
  },
  2: {
    heading: "TIER 2",
    description: "Important behaviors to address",
  },
  3: {
    heading: "TIER 3",
    description: "Minor observations and positive trends",
  },
};

const STATUS_STYLES = {
  negative: {
    card: "bg-state-danger-soft/80 border-state-danger",
    icon: "text-state-danger",
    rail: "border-l-4 border-l-state-danger",
    title: "Needs attention",
  },
  positive: {
    card: "bg-state-success-soft/45 border-brand-700",
    icon: "text-brand-800",
    rail: "border-l-4 border-l-brand-800",
    title: "Positive signals",
  },
};

const NEGATIVE_KEYWORDS = [
  "high",
  "low",
  "loss",
  "without",
  "overtrading",
  "underperformance",
  "weak",
  "poor",
  "risk",
  "drawdown",
];

const POSITIVE_KEYWORDS = ["strong", "high probability", "profit", "winning", "consisten"];

const toneFromInsight = (insight) => {
  const text = `${insight?.title ?? ""} ${insight?.message ?? ""}`.toLowerCase();

  if (POSITIVE_KEYWORDS.some((keyword) => text.includes(keyword))) {
    return "positive";
  }

  if (NEGATIVE_KEYWORDS.some((keyword) => text.includes(keyword))) {
    return "negative";
  }

  return Number(insight?.tier) >= 3 ? "positive" : "negative";
};

const iconFromInsight = (insight, tone) => {
  const text = `${insight?.title ?? ""} ${insight?.message ?? ""}`.toLowerCase();

  if (tone === "positive") {
    if (text.includes("win") || text.includes("probability")) return Trophy;
    if (text.includes("profit")) return BadgeCheck;
    return Lightbulb;
  }

  if (text.includes("risk") || text.includes("drawdown")) return ShieldAlert;
  if (text.includes("overtrad") || text.includes("chasing")) return Flame;
  if (text.includes("low") || text.includes("weak")) return AlertTriangle;

  return CircleHelp;
};

const getScoreLabel = (score) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Solid";
  if (score >= 40) return "Needs Work";
  return "High Risk";
};

function InsightCard({ insight, tone }) {
  const Icon = iconFromInsight(insight, tone);
  const style = STATUS_STYLES[tone];

  return (
    <article
      className={`rounded-panel border p-5 transition-shadow hover:shadow-sm ${style.card} ${style.rail}`}
    >
      <div className="mb-4">
        <span className={`inline-flex rounded-md bg-surface-card p-2 ${style.icon}`}>
          {createElement(Icon, { size: 18 })}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-text-primary">{insight.title}</h3>
      <p className="mt-2 text-body text-text-secondary">{insight.message}</p>
    </article>
  );
}

function TierColumn({ title, insights, tone }) {
  const style = STATUS_STYLES[tone];

  return (
    <section>
      <h3 className={`mb-3 text-sm font-semibold uppercase tracking-wide ${style.icon}`}>
        {title}
      </h3>

      {insights.length === 0 ? (
        <article className="rounded-panel border border-dashed border-border bg-surface-card p-4 text-caption text-text-muted">
          No {tone === "positive" ? "positive" : "negative"} items in this tier.
        </article>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <InsightCard key={`${insight.title}-${index}`} insight={insight} tone={tone} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function InsightsPage() {
  const { data, loading, error, getInsights } = useInsights();

  useEffect(() => {
    getInsights();
  }, []);

  const payload = useMemo(() => data?.data?.data ?? data?.data ?? {}, [data]);
  const insights = Array.isArray(payload?.insights) ? payload.insights : [];
  const score = Number(payload?.traderScore?.overallScore ?? 0);
  const breakdown = payload?.traderScore?.breakdown ?? {};

  const sections = useMemo(() => {
    return [1, 2, 3].map((tier) => {
      const tierInsights = insights.filter((item) => Number(item.tier) === tier);
      const grouped = tierInsights.reduce(
        (acc, item) => {
          const tone = toneFromInsight(item);
          acc[tone].push(item);
          return acc;
        },
        { negative: [], positive: [] },
      );

      return {
        tier,
        details: TIER_DETAILS[tier],
        grouped,
      };
    });
  }, [insights]);

  if (loading) {
    return (
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="ui-card h-32 animate-pulse" />
          <div className="ui-card h-32 animate-pulse" />
          <div className="ui-card h-32 animate-pulse" />
        </div>
        <div className="ui-card h-72 animate-pulse" />
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-8">
        {sections.map(({ tier, details, grouped }) => (
          <article key={tier}>
            <h2 className="text-2xl font-semibold uppercase">{details.heading}</h2>
            <p className="mt-1 text-caption text-text-muted">{details.description}</p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <TierColumn title={STATUS_STYLES.negative.title} insights={grouped.negative} tone="negative" />
              <TierColumn title={STATUS_STYLES.positive.title} insights={grouped.positive} tone="positive" />
            </div>
          </article>
        ))}

        <article className="rounded-panel border border-brand-700 bg-sky-50 p-6">
          <div className="flex items-start gap-3">
            <span className="inline-flex rounded-md bg-white p-2 text-brand-800">
              <Sparkles size={18} />
            </span>
            <div>
              <h3 className="text-2xl font-semibold">Advanced AI Insights Coming Soon</h3>
              <p className="mt-2 text-body text-text-muted">
                Pattern recognition, predictive insights, and personalized recommendations are in development.
              </p>
            </div>
          </div>
        </article>

        {error && (
          <article className="rounded-panel border border-state-danger bg-state-danger-soft p-4 text-caption text-state-danger">
            Unable to refresh insights right now. Please try again shortly.
          </article>
        )}
      </div>

      <aside className="h-fit rounded-panel border border-border bg-surface-card p-6 lg:sticky lg:top-8">
        <h3 className="text-lg font-semibold">Trader Score</h3>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-5xl font-bold">{score}</span>
          <span className="pb-1 text-caption text-text-muted">/100</span>
        </div>
        <p className={`mt-2 text-lg font-semibold ${score >= 60 ? "text-brand-800" : "text-state-danger"}`}>
          {getScoreLabel(score)}
        </p>

        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-1 text-xs text-text-muted">
          {score >= 60 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {score >= 60 ? "Improving" : "Needs focus"}
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <h4 className="text-sm font-semibold text-text-muted">Breakdown</h4>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-text-secondary">Consistency</dt>
              <dd className="font-semibold">{breakdown.consistency ?? 0}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-text-secondary">Risk Management</dt>
              <dd className="font-semibold">{breakdown.riskManagement ?? 0}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-text-secondary">Performance</dt>
              <dd className="font-semibold">{breakdown.performance ?? 0}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-text-secondary">Behavior</dt>
              <dd className="font-semibold">{breakdown.behavior ?? 0}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </section>
  );
}
