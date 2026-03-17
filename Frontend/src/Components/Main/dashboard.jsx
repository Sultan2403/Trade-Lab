import { createElement, useEffect, useState, useMemo } from "react";
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
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useAccounts from "../../Hooks/useAccounts";
import useAnalytics from "../../Hooks/useAnalytics";

// Helpers
const formatNumber = (value, options = {}) =>
  value != null ? Number(value).toLocaleString(undefined, options) : "N/A";

const formatCurrency = (value) => {
  if (value != null) {
    return `$${new Intl.NumberFormat(undefined, {
      style: "decimal", // <--- currency style
      currency: "USD",
      currencyDisplay: "symbol",
      maximumFractionDigits: 0,
    }).format(Number(value))}`;
  } else {
    return "N/A";
  }
};

const getSmartTrend = (rawValue, delta, type = "number") => {
  const val = Number(rawValue ?? 0);
  let d;

  // Only apply fallback delta for types that make sense
  if (delta != null) {
    d = delta;
  } else if (
    val > 0 &&
    ["number", "percent", "currency", "ratio"].includes(type)
  ) {
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

// Card Component
function StatCard({
  icon,
  title,
  value,
  delta,
  type = "number",
  suffix = "vs last month",
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

function EquityChart() {
  // Map labels to numeric values the API expects
  const timeframeMap = {
    "7D": 7,
    "1M": 30,
    "3M": 90,
    "6M": 180,
    "1Y": 365, // 0 could mean "all" depending on your API
  };

  const [activeTimeframe, setActiveTimeframe] = useState("7D");
  const { data, loading, error, getEquityCurve } = useAnalytics();

  // Fetch equity curve on timeframe change
  useEffect(() => {
    const tfNumber = timeframeMap[activeTimeframe];
    getEquityCurve({ timeframe: tfNumber });
  }, [activeTimeframe]);

  const chartData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((point) => ({
      day: new Date(point.date).toLocaleTimeString(), // or .toLocaleDateString() if you prefer
      Equity: point.equity,
    }));
  }, [data]);
  //   const chartData = useMemo(() => {
  //   if (!data?.data) return [];
  //   return data.data.map((point) => {
  //     const date = new Date(point.date);
  //     // If timeframe > 1 month, show month/day, else show day
  //     const formattedDate =
  //       activeTimeframe === "1Y"
  //         ? date.toLocaleDateString(undefined, { month: "short", year: "numeric" })
  //         : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  //     return {
  //       day: formattedDate,
  //       Equity: point.equity,
  //     };
  //   });
  // }, [data, activeTimeframe]);

  const timeframes = Object.keys(timeframeMap);

  return (
    <div className="ui-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Equity Curve</h2>
        <div className="flex gap-2 text-xs">
          {timeframes.map((tf) => (
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
        {loading && <span className="text-text-secondary">Loading chart…</span>}
        {error && (
          <span className="text-state-danger">Failed to load chart.</span>
        )}
        {!loading && !error && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 40, left: 0, bottom: 20 }}
            >
              {/* Define gradient */}
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#15616D" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#15616D" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Grid */}
              <CartesianGrid
                stroke="#E8ECEF"
                strokeDasharray="4 4"
                vertical={false}
              />

              {/* X Axis */}
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
              />

              {/* Y Axis */}
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickFormatter={(value) => `$${formatNumber(value)}`}
                width={80}
              />

              {/* Tooltip */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: "8px 12px",
                }}
                labelStyle={{ color: "#374151", fontWeight: 600 }}
                formatter={(value) => formatCurrency(value)}
              />

              {/* Gradient area below line */}
              <Line
                type="monotone"
                dataKey="Equity"
                stroke="#15616D"
                strokeWidth={3}
                dot={{ r: 3, fill: "#15616D" }}
                activeDot={{ r: 6, fill: "#15616D", strokeWidth: 2 }}
                fill="url(#equityGradient)"
                isAnimationActive={true}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        {!loading && !error && chartData.length === 0 && (
          <span className="text-text-secondary">
            No data available for this timeframe.
          </span>
        )}
      </div>
    </div>
  );
}
// Main Dashboard
export default function Dashboard() {
  const { data, loading, error, getAccountProfile } = useAccounts();

  useEffect(() => {
    getAccountProfile();
  }, []);

  const metrics = data?.tradesMetrics ?? {};
  const account = data?.account ?? {};

  // Mock chart data for equity curve
  const chartData = useMemo(() => {
    const startBalance = Number(account?.starting_balance ?? 25000);
    const endBalance = startBalance + Number(metrics?.netPnL?.value ?? 0);

    return Array.from({ length: 7 }, (_, index) => {
      const ratio = index / 6;
      const base = startBalance + (endBalance - startBalance) * ratio;
      const volatility =
        Math.sin(index * 1.2) *
        (Math.abs(endBalance - startBalance) * 0.08 + 120);
      return {
        day: `Jan ${index + 1}`,
        equity: Math.max(0, Math.round(base + volatility)),
      };
    });
  }, [account?.starting_balance, metrics?.netPnL?.value]);

  // Cards array
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
      value:
        metrics?.winRate?.value != null
          ? `${metrics.winRate.value.toFixed(1)}%`
          : "N/A",
      delta: metrics?.winRate?.value, // fallback numeric for delta
      type: "percent",
    },
    {
      icon: CircleDollarSign,
      title: "Net Profit",
      value:
        metrics?.netPnL?.value != null
          ? formatCurrency(metrics.netPnL.value)
          : "N/A",
      delta: metrics?.netPnL?.value, // fallback numeric for delta
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
        metrics?.profitFactor?.value != null
          ? Number(metrics.profitFactor.value).toFixed(2)
          : "N/A",
      delta: metrics?.profitFactor?.value,
      type: "ratio",
    },
    {
      icon: Scale,
      title: "Avg Risk-Reward",
      value:
        metrics?.avgRR?.value != null
          ? Number(metrics.avgRR.value).toFixed(2)
          : "N/A",
      delta: metrics?.avgRR?.value,
      type: metrics?.avgRR?.value != null ? "ratio" : "none", // no delta if null
    },
    {
      icon: CalendarDays,
      title: "Active Days",
      value: metrics?.activeDays?.value ?? metrics?.activeDays ?? "N/A",
      delta: null,
      type: "none", // no delta
      suffix: "this month",
    },
  ].filter(Boolean);

  return (
    <section className="space-y-8">
      {loading && (
        <div className="ui-card p-4 text-caption text-text-secondary">
          Loading dashboard metrics...
        </div>
      )}
      {error && (
        <div className="ui-card border-state-danger/40 p-4 text-caption text-state-danger">
          We couldn't load your dashboard metrics right now.
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <article className="ui-card p-6">
        <EquityChart />
      </article>
    </section>
  );
}
