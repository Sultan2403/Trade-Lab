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
  Plus,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";
import useAccounts from "../../../Hooks/useAccounts";
import useAnalytics from "../../../Hooks/useAnalytics";
import AddTradeMethodModal from "../../UI/Trades/addTradeMethodModal";

const COLORS = {
  profit: "#15616D",
  loss: "#DC2626",
  neutral: "#9CA3AF",
};

const formatNumber = (value, options = {}) =>
  value != null ? Number(value).toLocaleString(undefined, options) : "N/A";

const formatCurrency = (value) => {
  if (value == null) return "N/A";

  return `$${new Intl.NumberFormat(undefined, {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(Number(value))}`;
};


const getDisplayValue = (value, fallback = "N/A") => {
  if (value == null) return fallback;
  if (["string", "number"].includes(typeof value)) return value;
  return fallback;
};

const getTradeCount = (metrics = {}) => {
  const totalTrades = metrics?.totalTrades?.value ?? metrics?.totalTrades ?? 0;
  const parsed = Number(totalTrades);

  return Number.isFinite(parsed) ? parsed : 0;
};

function EmptyTradesState() {
  const navigate = useNavigate();
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);

  const handleMethodSelect = (method) => {
    if (method === "broker") return;

    setIsMethodModalOpen(false);

    if (method === "manual") {
      navigate("/add-trade");
      return;
    }

    navigate("/import-trades");
  };

  return (
    <>
      <article className="ui-card p-8 text-center">
        <p className="text-lg font-medium text-text-primary">
          You have no trades, add or import them to get started.
        </p>
        <button
          type="button"
          onClick={() => setIsMethodModalOpen(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-text-inverse hover:bg-brand-700/90"
          aria-haspopup="dialog"
          aria-label="Add a trade"
        >
          <Plus size={16} />
          Add Trade
        </button>
      </article>

      <AddTradeMethodModal
        isOpen={isMethodModalOpen}
        onClose={() => setIsMethodModalOpen(false)}
        onSelectMethod={handleMethodSelect}
      />
    </>
  );
}

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

const EMPTY_ANALYTICS_RESPONSE = {
  tradeOutcomes: { win: 0, loss: 0, breakEven: 0 },
  monthlyPerformance: [],
  performanceByInstrument: [],
  plDistribution: [],
  riskMultipleDistribution: [],
  winLossByDay: [],
  winLossByHour: [],
};

const normalizeTradeOutcomes = (tradeOutcomes = {}) => {
  return {
    win:
      Number(tradeOutcomes.win ?? 0) +
      Number(tradeOutcomes.Win ?? 0),

    loss:
      Number(tradeOutcomes.loss ?? 0) +
      Number(tradeOutcomes.Loss ?? 0),

    breakEven:
      Number(tradeOutcomes.breakEven ?? 0) +
      Number(tradeOutcomes.BreakEven ?? 0),
  };
};

const getAllMetricsPayload = (response) => {
  if (!response) return EMPTY_ANALYTICS_RESPONSE;

  if (response.data && typeof response.data === "object") {
    return response.data;
  }

  return response;
};

const mapPerformancePayload = (payload) => {
  const source = payload ?? EMPTY_ANALYTICS_RESPONSE;
  const normalizedOutcomes = normalizeTradeOutcomes(source.tradeOutcomes);

  return {
    tradeOutcomes: [
      { name: "Wins", value: normalizedOutcomes.win, color: "#15616D" },
      { name: "Losses", value: normalizedOutcomes.loss, color: "#DC2626" },
      { name: "Break Even", value: normalizedOutcomes.breakEven, color: "#9CA3AF" },
    ],
    monthlyPerformance: (source.monthlyPerformance ?? []).map((item) => ({
      month: new Date(`${item.month}-01`).toLocaleDateString(undefined, {
        month: "short",
        year: "2-digit",
      }),
      netPnL: Number(item.netPnL ?? 0),
    })),
    performanceByInstrument: (source.performanceByInstrument ?? []).map((item) => ({
      symbol: item.symbol,
      trades: Number(item.trades ?? 0),
      winRate: Number(item.winRate ?? 0),
      netPnL: Number(item.netPnL ?? 0),
      avgPnL: Number(item.avgPnL ?? 0),
    })),
    plDistribution: (source.plDistribution ?? []).map((item) => ({
      bin: item.bin,
      count: Number(item.count ?? 0),
      isNegative: item.bin.trim().startsWith("-"),
    })),
    riskMultipleDistribution: (source.riskMultipleDistribution ?? []).map((item) => ({
      bin: item.bin,
      count: Number(item.count ?? 0),
    })),
    winLossByDay: (source.winLossByDay ?? []).map((item) => ({
      day: item.day,
      win: Number(item.win ?? 0),
      loss: Number(item.loss ?? 0),
    })),
    winLossByHour: (source.winLossByHour ?? []).map((item) => ({
      hourLabel: `${item.hour}:00`,
      win: Number(item.win ?? 0),
      loss: Number(item.loss ?? 0),
    })),
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
  const safeValue = getDisplayValue(value);

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
      <p className={`mt-1 text-2xl font-semibold ${valueClassName}`}>{safeValue}</p>
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

function ChartPanelSkeleton() {
  return (
    <article className="ui-card p-6 animate-pulse">
      <div className="h-6 w-40 rounded bg-surface-muted" />
      <div className="mt-5 h-[300px] rounded bg-surface-muted" />
    </article>
  );
}

function ChartPanel({ title, loading, children }) {
  if (loading) return <ChartPanelSkeleton />;

  return (
    <article className="ui-card p-6">
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <div className="mt-5 h-[300px]">{children}</div>
    </article>
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

              <Tooltip formatter={(value) => formatCurrency(value)} />

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

export default function AnalyticsPage() {
  const { data, loading, error, getAccountProfile } = useAccounts();
  const {
    data: allMetricsResponse,
    loading: allMetricsLoading,
    error: allMetricsError,
    getAllMetrics,
  } = useAnalytics();

  useEffect(() => {
    getAccountProfile();
    getAllMetrics();
  }, []);

  const metrics = data?.tradesMetrics ?? {};
  const hasTrades = getTradeCount(metrics) > 0;
  const mapped = useMemo(
    () => mapPerformancePayload(getAllMetricsPayload(allMetricsResponse)),
    [allMetricsResponse],
  );

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
          ? `${Number(metrics.winRate.value).toFixed(1)}%`
          : "N/A",
      delta: metrics?.winRate?.delta,
      type: "percent",
    },
    {
      icon: CircleDollarSign,
      title: "Net Profit",
      value:
        metrics?.netPnL?.value != null ? formatCurrency(metrics.netPnL.value) : "N/A",
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
        metrics?.profitFactor?.value != null
          ? Number(metrics.profitFactor.value).toFixed(2)
          : "N/A",
      delta: metrics?.profitFactor?.delta,
      type: metrics?.profitFactor?.value != null ? "ratio" : "none",
    },
    {
      icon: Scale,
      title: "Avg R-Multiple",
      value:
        metrics?.avgRR?.value != null ? Number(metrics.avgRR.value).toFixed(2) : "N/A",
      delta: metrics?.avgRR?.delta,
      type: metrics?.avgRR?.value != null ? "ratio" : "none",
    },
    {
      icon: CalendarDays,
      title: "Active Days",
      value: getDisplayValue(metrics?.activeDays?.value ?? metrics?.activeDays),
      delta: null,
      type: "none",
      suffix: "in selected period",
    },
    {
      icon: TrendingUp,
      title: "Largest Win",
      value:
        metrics?.largestWin?.value != null
          ? formatCurrency(metrics.largestWin.value)
          : "N/A",
      delta: null,
      type: "none",
      valueClassName: "text-state-success",
    },
    {
      icon: ArrowDown,
      title: "Largest Loss",
      value:
        metrics?.largestLoss?.value != null
          ? formatCurrency(metrics.largestLoss.value)
          : "N/A",
      delta: null,
      type: "none",
      valueClassName: "text-state-danger",
    },
  ];

  return (
    <section className="space-y-8">
      {loading && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: cards.length }).map((_, i) => (
            <AnalyticsCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && !error && hasTrades && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="ui-card border-state-danger/40 p-4 text-caption text-state-danger">
          Failed to load analytics metrics.
        </div>
      )}

      {!hasTrades && !loading && !error && <EmptyTradesState />}

      {hasTrades && (
        <>
          <AccountGrowthChart />

          {allMetricsError && !allMetricsLoading && (
            <div className="ui-card border-state-danger/40 p-4 text-caption text-state-danger">
              Failed to load chart metrics.
            </div>
          )}

      <div className="grid gap-5 lg:grid-cols-2">
       <ChartPanel title="Trade Outcomes" loading={allMetricsLoading}>
  <ResponsiveContainer width="100%" height="100%">
    {mapped.tradeOutcomes.some(d => d.value > 0) ? (
      <PieChart>
        <Pie
          data={mapped.tradeOutcomes}
          dataKey="value"
          innerRadius={70}
          outerRadius={110}
          label={({ percent }) =>
            percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""
          }
          labelLine={false}
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {mapped.tradeOutcomes.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              opacity={
                activeIndex === null || activeIndex === index ? 1 : 0.4
              }
            />
          ))}
        </Pie>

        {/* CENTER TEXT */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-text-primary text-lg font-semibold"
        >
          {mapped.tradeOutcomes.reduce((acc, cur) => acc + cur.value, 0)}
        </text>
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-text-secondary text-xs"
        >
          Trades
        </text>

        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        />
        <Legend />
      </PieChart>
    ) : (
      <div className="flex h-full items-center justify-center text-text-secondary">
        No trade data yet
      </div>
    )}
  </ResponsiveContainer>
</ChartPanel>

        <ChartPanel title="Monthly Performance" loading={allMetricsLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mapped.monthlyPerformance}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${formatNumber(value)}`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="netPnL" fill="#15616D" />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        {allMetricsLoading ? (
          <ChartPanelSkeleton />
        ) : (
          <article className="ui-card p-6">
            <h3 className="text-lg font-semibold text-text-primary">
              Performance by Instrument
            </h3>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-text-secondary">
                    <th className="py-2 text-left">Symbol</th>
                    <th className="py-2 text-left">Trades</th>
                    <th className="py-2 text-left">Win Rate</th>
                    <th className="py-2 text-left">Net P&L</th>
                    <th className="py-2 text-left">Avg P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {mapped.performanceByInstrument.map((item) => (
                    <tr key={item.symbol} className="border-b border-border/60">
                      <td className="py-2 font-medium">{item.symbol}</td>
                      <td className="py-2">{item.trades}</td>
                      <td className="py-2">{item.winRate.toFixed(1)}%</td>
                      <td
                        className={`py-2 ${
                          item.netPnL >= 0
                            ? "text-state-success"
                            : "text-state-danger"
                        }`}
                      >
                        {formatCurrency(item.netPnL)}
                      </td>
                      <td
                        className={`py-2 ${
                          item.avgPnL >= 0
                            ? "text-state-success"
                            : "text-state-danger"
                        }`}
                      >
                        {formatCurrency(item.avgPnL)}
                      </td>
                    </tr>
                  ))}
                  {mapped.performanceByInstrument.length === 0 && (
                    <tr>
                      <td className="py-4 text-text-secondary" colSpan={5}>
                        No instrument data yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>
        )}

        <ChartPanel title="P&L Distribution" loading={allMetricsLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mapped.plDistribution}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="bin" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count">
                {mapped.plDistribution.map((item) => (
                  <Cell
                    key={item.bin}
                    fill={item.isNegative ? "#DC2626" : "#15616D"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="R-Multiple Distribution" loading={allMetricsLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mapped.riskMultipleDistribution}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="bin" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#15616D" />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Win/Loss by Day" loading={allMetricsLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mapped.winLossByDay}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="win" stackId="trades" fill="#15616D" />
              <Bar dataKey="loss" stackId="trades" fill="#DC2626" />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Win/Loss by Hour" loading={allMetricsLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mapped.winLossByHour}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="hourLabel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="win" stackId="trades" fill="#15616D" />
              <Bar dataKey="loss" stackId="trades" fill="#DC2626" />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
          </div>
        </>
      )}
    </section>
  );
}
