import { createElement, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ChartNoAxesCombined,
  CircleDollarSign,
  Scale,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useAccounts from "../../../Hooks/useAccounts";
import useAnalytics from "../../../Hooks/useAnalytics";

const formatNumber = (value, options = {}) =>
  value != null ? Number(value).toLocaleString(undefined, options) : "N/A";

const formatCurrency = (value) => {
  if (value == null) return "N/A";

  return `$${new Intl.NumberFormat(undefined, {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(Number(value))}`;
};

const getSmartTrend = (rawValue, delta, type = "number") => {
  const val = Number(rawValue ?? 0);
  let d;

  if (delta != null) {
    d = delta;
  } else if (val > 0 && ["number", "percent", "currency", "ratio"].includes(type)) {
    d = type === "percent" ? val : 100;
  } else {
    d = 0;
  }

  if (d > 0) {
    return {
      icon: ArrowUp,
      badge: "bg-state-success-soft text-state-success",
      text: type === "percent" ? `+${d.toFixed(0)}%` : `+${d.toFixed(2)}`,
    };
  }

  if (d < 0) {
    return {
      icon: ArrowDown,
      badge: "bg-state-danger-soft text-state-danger",
      text: type === "percent" ? `${d.toFixed(0)}%` : `${d.toFixed(2)}`,
    };
  }

  return {
    icon: ArrowUp,
    badge: "bg-surface-muted text-text-muted",
    text: type === "percent" ? "0%" : "0.00",
  };
};

function StatCard({
  icon,
  title,
  value,
  delta,
  type = "number",
  suffix = "vs last period",
  valueClassName = "text-text-primary",
}) {
  const trend = getSmartTrend(value, delta, type);

  return (
    <article className="ui-card p-4">
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-700/15 text-brand-900">
          {createElement(icon, { size: 22 })}
        </span>
        {type !== "none" && (
          <span
            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${trend.badge}`}
          >
            {createElement(trend.icon, { size: 14 })}
            {trend.text}
          </span>
        )}
      </div>
      <p className="mt-3 text-md font-semibold text-text-secondary">{title}</p>
      <p className={`mt-1 text-2xl font-semibold ${valueClassName}`}>{value}</p>
      <p className="mt-1 text-xs text-text-muted">{suffix}</p>
    </article>
  );
}

function AnalyticsCardSkeleton() {
  return (
    <div className="ui-card p-4 animate-pulse bg-surface-card h-32">
      <div className="h-6 bg-gray-200 rounded mb-2 w-3/4" />
      <div className="h-10 bg-gray-200 rounded w-full" />
    </div>
  );
}

function AccountGrowthChart() {
  const timeframeMap = {
    "7D": 7,
    "1M": 30,
    "3M": 90,
    "6M": 180,
    "1Y": 365,
  };

  const [activeTimeframe, setActiveTimeframe] = useState("1M");
  const { data, loading, error, getEquityCurve } = useAnalytics();

  useEffect(() => {
    getEquityCurve({ timeframe: timeframeMap[activeTimeframe] });
  }, [activeTimeframe]);

  const chartData = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((point) => {
      const date = new Date(point.date);
      return {
        day:
          activeTimeframe === "1Y"
            ? date.toLocaleDateString(undefined, {
                month: "short",
                year: "numeric",
              })
            : date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              }),
        equity: Number(point.equity ?? 0),
      };
    });
  }, [data, activeTimeframe]);

  return (
    <article className="ui-card p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-text-primary">Account Growth</h2>
        <div className="flex gap-2 text-xs">
          {Object.keys(timeframeMap).map((tf) => (
            <button
              key={tf}
              type="button"
              disabled={loading}
              className={`rounded-md border px-3 py-1.5 ${
                activeTimeframe === tf
                  ? "border-brand-800 bg-brand-800 text-text-inverse"
                  : "border-border bg-surface-card text-text-secondary"
              }`}
              onClick={() => setActiveTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[360px] flex items-center justify-center">
        {loading && <div className="h-full w-full animate-pulse rounded bg-surface-muted" />}

        {!loading && error && (
          <span className="text-state-danger">Failed to load account growth.</span>
        )}

        {!loading && !error && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 28, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="equityGradientAnalytics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#15616D" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#15616D" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#E8ECEF" vertical={false} strokeDasharray="4 4" />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickFormatter={(value) => `$${formatNumber(value)}`}
                width={80}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: "8px 12px",
                }}
                labelStyle={{ color: "#374151", fontWeight: 600 }}
                formatter={(value) => formatCurrency(value)}
              />

              <Area
                type="monotone"
                dataKey="equity"
                stroke="none"
                fill="url(#equityGradientAnalytics)"
                isAnimationActive
                animationDuration={700}
              />

              <Line
                type="monotone"
                dataKey="equity"
                stroke="#15616D"
                strokeWidth={3}
                dot={{ r: 3, fill: "#15616D" }}
                activeDot={{ r: 6, fill: "#15616D", strokeWidth: 2 }}
                isAnimationActive
                animationDuration={700}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {!loading && !error && chartData.length === 0 && (
          <span className="text-text-secondary">No account growth data available.</span>
        )}
      </div>
    </article>
  );
}

function ChartPlaceholder({ title, subtitle }) {
  return (
    <article className="ui-card p-6 min-h-[260px]">
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>
      <div className="mt-6 h-40 rounded-md border border-dashed border-border bg-surface-base" />
    </article>
  );
}

export default function AnalyticsPage() {
  const { data, loading, error, getAccountProfile } = useAccounts();

  useEffect(() => {
    getAccountProfile();
  }, []);

  const metrics = data?.tradesMetrics ?? {};

  const cards = [
    {
      icon: ChartNoAxesCombined,
      title: "Total Trades",
      value: metrics?.totalTrades?.value ?? "N/A",
      delta: metrics?.totalTrades?.delta,
      type: "number",
    },
    {
      icon: Target,
      title: "Win Rate",
      value: metrics?.winRate?.value != null ? `${Number(metrics.winRate.value).toFixed(1)}%` : "N/A",
      delta: metrics?.winRate?.delta,
      type: "percent",
    },
    {
      icon: CircleDollarSign,
      title: "Net Profit",
      value: metrics?.netPnL?.value != null ? formatCurrency(metrics.netPnL.value) : "N/A",
      delta: metrics?.netPnL?.delta,
      type: "currency",
      valueClassName:
        Number(metrics?.netPnL?.value ?? 0) > 0
          ? "text-state-success"
          : Number(metrics?.netPnL?.value ?? 0) < 0
            ? "text-state-danger"
            : "text-text-primary",
    },
    {
      icon: TrendingUp,
      title: "Profit Factor",
      value:
        metrics?.profitFactor?.value != null ? Number(metrics.profitFactor.value).toFixed(2) : "N/A",
      delta: metrics?.profitFactor?.delta,
      type: metrics?.profitFactor?.value != null ? "ratio" : "none",
    },
    {
      icon: Scale,
      title: "Avg R-Multiple",
      value: metrics?.avgRR?.value != null ? Number(metrics.avgRR.value).toFixed(2) : "N/A",
      delta: metrics?.avgRR?.delta,
      type: metrics?.avgRR?.value != null ? "ratio" : "none",
    },
    {
      icon: CalendarDays,
      title: "Active Days",
      value: metrics?.activeDays?.value ?? "N/A",
      delta: null,
      type: "none",
      suffix: "in selected period",
    },
    {
      icon: TrendingUp,
      title: "Largest Win",
      value:
        metrics?.largestWin?.value != null ? formatCurrency(metrics.largestWin.value) : "N/A",
      delta: null,
      type: "none",
      valueClassName: "text-state-success",
    },
    {
      icon: ArrowDown,
      title: "Largest Loss",
      value:
        metrics?.largestLoss?.value != null ? formatCurrency(metrics.largestLoss.value) : "N/A",
      delta: null,
      type: "none",
      valueClassName: "text-state-danger",
    },
  ];

  return (
    <section className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {loading && Array.from({ length: cards.length }).map((_, i) => <AnalyticsCardSkeleton key={i} />)}

        {!loading && !error && cards.map((card) => <StatCard key={card.title} {...card} />)}
      </div>

      {!loading && error && (
        <div className="ui-card border-state-danger/40 p-4 text-caption text-state-danger">
          Failed to load analytics metrics.
        </div>
      )}

      <AccountGrowthChart />

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartPlaceholder
          title="Trade Outcomes"
          subtitle="Wire your endpoint payload to this chart when it is ready."
        />
        <ChartPlaceholder
          title="Monthly Performance"
          subtitle="UI is ready for server-fed buckets and P&L values."
        />
        <ChartPlaceholder
          title="Performance by Instrument"
          subtitle="Table/series container prepared for instrument breakdown data."
        />
        <ChartPlaceholder
          title="P&L Distribution"
          subtitle="Histogram shell prepared for distribution bins from backend."
        />
      </div>
    </section>
  );
}
