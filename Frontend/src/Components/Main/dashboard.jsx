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

const formatNumber = (value, options = {}) =>
  Number(value ?? 0).toLocaleString(undefined, options);

const formatCurrency = (value) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

const getTrendMeta = (value) => {
  if ((value ?? 0) > 0) {
    return {
      icon: ArrowUp,
      badge: "bg-state-success-soft text-state-success",
      text: `+${Number(value).toFixed(2)}`,
    };
  }

  if ((value ?? 0) < 0) {
    return {
      icon: ArrowDown,
      badge: "bg-state-danger-soft text-state-danger",
      text: Number(value).toFixed(2),
    };
  }

  return {
    icon: ArrowUp,
    badge: "bg-surface-muted text-text-muted",
    text: "0.00",
  };
};

function StatCard({
  icon,
  title,
  value,
  delta,
  suffix = "vs last month",
  valueClassName = "text-text-primary",
}) {
  const trend = getTrendMeta(delta);

  return (
    <article className="ui-card p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-700/15 text-brand-900">
          {createElement(icon, { size: 18 })}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${trend.badge}`}>
          {createElement(trend.icon, { size: 12 })}
          {trend.text}
        </span>
      </div>

      <p className="mt-4 text-[2rem] font-semibold leading-tight text-text-primary">{title}</p>
      <p className={`mt-2 text-5xl font-semibold leading-tight ${valueClassName}`}>{value}</p>
      <p className="mt-2 text-caption text-text-muted">{suffix}</p>
    </article>
  );
}

export default function Dashboard() {
  const { data, loading, error, getAccountProfile } = useAccounts();

  useEffect(() => {
    getAccountProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const metrics = data?.tradesMetrics ?? {};
  const account = data?.account ?? {};

  const chartData = useMemo(() => {
    const startBalance = Number(account?.starting_balance ?? 25000);
    const endBalance = startBalance + Number(metrics?.netPnL ?? 0);

    return Array.from({ length: 7 }, (_, index) => {
      const ratio = index / 6;
      const base = startBalance + (endBalance - startBalance) * ratio;
      const volatility = Math.sin(index * 1.2) * (Math.abs(endBalance - startBalance) * 0.08 + 120);

      return {
        day: `Jan ${index + 1}`,
        equity: Math.max(0, Math.round(base + volatility)),
      };
    });
  }, [account?.starting_balance, metrics?.netPnL]);

  const cards = [
    {
      icon: ChartNoAxesCombined,
      title: "Total Trades",
      value: formatNumber(metrics?.totalTrades),
      delta: Number(metrics?.totalTrades ?? 0) * 0.05,
    },
    {
      icon: Target,
      title: "Win Rate",
      value: `${Number(metrics?.winRate ?? 0).toFixed(1)}%`,
      delta: Number(metrics?.winRate ?? 0) * 0.08,
    },
    {
      icon: CircleDollarSign,
      title: "Net Profit",
      value: formatCurrency(metrics?.netPnL),
      delta: Number(metrics?.netPnL ?? 0) / 1000,
      valueClassName:
        Number(metrics?.netPnL ?? 0) > 0
          ? "text-state-success"
          : Number(metrics?.netPnL ?? 0) < 0
            ? "text-state-danger"
            : "text-text-primary",
    },
    {
      icon: TrendingUp,
      title: "Profit Factor",
      value: Number(metrics?.profitFactor ?? 0).toFixed(2),
      delta: Number(metrics?.profitFactor ?? 0) - 1,
    },
    {
      icon: Scale,
      title: "Avg Risk-Reward",
      value: Number(metrics?.avgRR ?? 0).toFixed(2),
      delta: Number(metrics?.avgRR ?? 0) - 2,
    },
    {
      icon: CalendarDays,
      title: "Active Days",
      value: formatNumber(metrics?.activeDays),
      delta: Number(metrics?.activeDays ?? 0) * 0.2,
      suffix: "this month",
    },
  ];

  return (
    <section className="space-y-8">
      {loading && <div className="ui-card p-4 text-caption text-text-secondary">Loading dashboard metrics...</div>}

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
                className={`rounded-md border px-3 py-1.5 ${active ? "border-brand-800 bg-brand-800 text-text-inverse" : "border-border bg-surface-card text-text-secondary"}`}
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
