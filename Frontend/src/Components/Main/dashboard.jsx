import { createElement, useEffect, useMemo } from "react";
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

// Helpers
const formatNumber = (value, options = {}) =>
  value != null ? Number(value).toLocaleString(undefined, options) : "N/A";

const formatCurrency = (value) =>
  value != null
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        currencyDisplay: "symbol",
        maximumFractionDigits: 0,
      }).format(Number(value))
    : "N/A";

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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-semibold">Equity Curve</h2>
          <div className="flex gap-2 text-xs">
            {[
              { label: "7D", active: true },
              { label: "1M" },
              { label: "3M" },
              { label: "6M" },
              { label: "1Y" },
              { label: "All" },
            ].map(({ label, active }) => (
              <button
                type="button"
                key={label}
                className={`rounded-md border px-3 py-1.5 ${
                  active
                    ? "border-brand-800 bg-brand-800 text-text-inverse"
                    : "border-border bg-surface-card text-text-secondary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#E8ECEF" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${formatNumber(value)}`}
                width={88}
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line
                type="monotone"
                dataKey="equity"
                stroke="#15616D"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
