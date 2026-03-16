import { useEffect, useMemo } from "react";
import {
  ArrowLeft,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useTrades from "../../../Hooks/useTrades";

const formatCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatSignedCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  const amount = Number(value);
  return `${amount >= 0 ? "+" : "-"}${formatCurrency(Math.abs(amount))}`;
};

const formatDate = (value, options) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString(undefined, options);
};

const calculatePnl = (trade) => {
  if (!trade) return null;
  if (trade.pnl !== undefined && trade.pnl !== null && !Number.isNaN(Number(trade.pnl))) return Number(trade.pnl);
  if (trade.exit_price === null || trade.exit_price === undefined) return null;
  const sign = trade.direction === "Short" ? -1 : 1;
  return (Number(trade.exit_price) - Number(trade.entry_price)) * Number(trade.size) * sign;
};

const calculateRMultiple = (trade, pnl) => {
  if (!trade) return null;
  if (trade.rMultiple !== undefined && trade.rMultiple !== null) return Number(trade.rMultiple);
  if (trade.riskToReward !== undefined && trade.riskToReward !== null) return Number(trade.riskToReward);

  const riskPerUnit = Math.abs(Number(trade.entry_price) - Number(trade.stopLoss));
  const riskAmount = riskPerUnit * Number(trade.size);
  if (!riskAmount || Number.isNaN(riskAmount) || pnl === null || Number.isNaN(pnl)) return null;
  return pnl / riskAmount;
};

export default function TradeDetailPlaceholder() {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const { data, loading, getTrade } = useTrades();

  useEffect(() => {
    getTrade(tradeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeId]);

  const trade = data?.trade;

  const viewModel = useMemo(() => {
    const pnl = calculatePnl(trade);
    const rMultiple = calculateRMultiple(trade, pnl);
    const isLong = (trade?.direction ?? "Long") === "Long";
    const isProfit = (pnl ?? 0) >= 0;

    return {
      symbol: trade?.pair ?? "AAPL",
      direction: trade?.direction ?? "Long",
      isLong,
      positionSize: trade?.size ? `${trade.size} shares` : "--",
      entryPrice: formatCurrency(trade?.entry_price),
      exitPrice: formatCurrency(trade?.exit_price),
      stopLoss: formatCurrency(trade?.stopLoss),
      takeProfit: formatCurrency(trade?.takeProfit),
      pnl,
      pnlText: formatSignedCurrency(pnl),
      pnlColor: isProfit ? "text-state-success" : "text-state-danger",
      pnlBg: isProfit ? "bg-green-100 text-state-success" : "bg-red-100 text-state-danger",
      pnlPct:
        trade?.entry_price && trade?.exit_price
          ? `${(((Number(trade.exit_price) - Number(trade.entry_price)) / Number(trade.entry_price)) * 100).toFixed(2)}%`
          : "--",
      rMultiple,
      outcome: pnl === null ? "Open" : pnl > 0 ? "Win" : pnl < 0 ? "Loss" : "Breakeven",
      outcomeBg:
        pnl === null
          ? "bg-surface-muted text-text-secondary"
          : pnl > 0
            ? "bg-green-100 text-state-success"
            : pnl < 0
              ? "bg-red-100 text-state-danger"
              : "bg-surface-muted text-text-secondary",
      note:
        trade?.notes ??
        "Strong bullish momentum after earnings announcement. Entry was based on breakout above $188 resistance level with good volume confirmation. Price action showed immediate strength and reached target within 2 hours. Risk management was effective with tight stop loss at previous support. This trade validated the breakout strategy and confirms the importance of volume analysis in entry decisions.",
      closedDate: formatDate(trade?.closedAt ?? trade?.openedAt, {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      closedTime: formatDate(trade?.closedAt ?? trade?.openedAt, {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      }),
      openedDate: formatDate(trade?.openedAt, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      openedTime: formatDate(trade?.openedAt, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      }),
      closedTimeFull: formatDate(trade?.closedAt, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      }),
      tradeDate: formatDate(trade?.openedAt ?? trade?.closedAt, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
  }, [trade]);

  return (
    <div className="min-h-full bg-[#fdfcfb]">
      <div className="border-b border-border px-8 py-6">
        <div className="mb-4 flex items-center gap-3 text-[28px] text-text-secondary">
          <span className="text-brand-800">Trade History</span>
          <span>›</span>
          <span>Trade Detail</span>
        </div>
        <h1 className="text-[48px] font-semibold leading-tight text-text-primary">Trade #{tradeId}</h1>
        <p className="mt-1 text-[28px] text-text-secondary">
          {loading ? "Loading trade details..." : `${viewModel.symbol} ${viewModel.direction} Position`}
        </p>
      </div>

      <div className="flex items-center justify-between border-b border-border px-8 py-4 text-brand-800">
        <button className="inline-flex items-center gap-2 text-body" onClick={() => navigate("/trades") }>
          <ArrowLeft size={18} />
          Back to Trade History
        </button>
        <div className="flex items-center gap-4 text-body">
          <button className="inline-flex items-center gap-2"><ChevronLeft size={18} />Previous Trade</button>
          <button className="inline-flex items-center gap-2">Next Trade<ChevronRight size={18} /></button>
          <div className="mx-2 h-5 w-px bg-border" />
          <button className="inline-flex items-center gap-2 rounded border border-brand-800 px-4 py-2">
            <Edit size={16} />Edit Trade
          </button>
          <button className="inline-flex items-center gap-2 text-state-danger">
            <Trash2 size={16} />Delete Trade
          </button>
        </div>
      </div>

      <div className="space-y-6 p-8">
        <section className="rounded-lg border border-border bg-white p-6">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <span className={`text-5xl font-semibold ${viewModel.pnlColor}`}>{viewModel.pnlText}</span>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-semibold">{viewModel.symbol}</span>
                <div className="inline-flex items-center gap-1">
                  <ArrowUp size={14} className={viewModel.isLong ? "text-state-success" : "rotate-180 text-state-danger"} />
                  <span className={`rounded px-2 py-1 text-sm ${viewModel.isLong ? "bg-green-100 text-state-success" : "bg-red-100 text-state-danger"}`}>
                    {viewModel.direction}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right text-text-secondary">
              <div className="text-2xl">{viewModel.closedDate}</div>
              <div>{viewModel.closedTime}</div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-6 text-body">
            {[
              ["Entry Price", viewModel.entryPrice],
              ["Exit Price", viewModel.exitPrice],
              ["Position Size", viewModel.positionSize],
              ["Stop Loss", viewModel.stopLoss],
              ["Take Profit", viewModel.takeProfit],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-text-muted">{label}</p>
                <p className="font-medium text-text-primary">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-white p-6">
          <h2 className="mb-4 text-card-title">Performance Analysis</h2>
          <div className="grid grid-cols-3 gap-4">
            {["Profit/Loss", "R-Multiple", "Outcome", "Trade Duration", "Slippage", "Commission"].map((label, index) => (
              <div key={label} className="rounded-lg border border-[#eef1f2] bg-[#fdfcfb] p-4">
                <p className="text-text-muted">{label}</p>
                {index === 0 && (
                  <>
                    <p className={`mt-2 text-3xl font-semibold ${viewModel.pnlColor}`}>{viewModel.pnlText}</p>
                    <p className={`mt-2 ${viewModel.pnlColor}`}>{viewModel.pnlPct}</p>
                  </>
                )}
                {index === 1 && (
                  <>
                    <p className="mt-2 text-3xl font-semibold">{viewModel.rMultiple ? viewModel.rMultiple.toFixed(1) : "--"}</p>
                    <p className="mt-2 text-state-success">Good Risk/Reward</p>
                  </>
                )}
                {index === 2 && (
                  <>
                    <div className="mt-2"><span className={`rounded px-2 py-1 text-sm ${viewModel.outcomeBg}`}>{viewModel.outcome}</span></div>
                    <p className="mt-2 text-text-secondary">Target Reached</p>
                  </>
                )}
                {index === 3 && <p className="mt-2 text-3xl font-medium">2h 15m</p>}
                {index === 4 && <p className="mt-2 text-3xl font-medium">$0.05</p>}
                {index === 5 && <p className="mt-2 text-3xl font-medium">$2.00</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-white p-6">
          <h2 className="mb-4 text-card-title">Trade Details</h2>
          <div className="grid grid-cols-2 gap-6 text-body">
            <div className="space-y-4">
              {["Instrument/Pair", "Direction", "Entry Price", "Exit Price", "Position Size"].map((label) => (
                <div key={label} className="flex justify-between">
                  <span className="text-text-muted">{label}</span>
                  <span className="font-medium">
                    {label === "Instrument/Pair" && viewModel.symbol}
                    {label === "Direction" && (
                      <span className="inline-flex items-center gap-2"><ArrowUp size={12} className={viewModel.isLong ? "text-state-success" : "rotate-180 text-state-danger"} />{viewModel.direction}</span>
                    )}
                    {label === "Entry Price" && viewModel.entryPrice}
                    {label === "Exit Price" && viewModel.exitPrice}
                    {label === "Position Size" && viewModel.positionSize}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {["Stop Loss", "Take Profit", "Trade Date", "Entry Time", "Exit Time"].map((label) => (
                <div key={label} className="flex justify-between">
                  <span className="text-text-muted">{label}</span>
                  <span className="font-medium">
                    {label === "Stop Loss" && viewModel.stopLoss}
                    {label === "Take Profit" && viewModel.takeProfit}
                    {label === "Trade Date" && viewModel.tradeDate}
                    {label === "Entry Time" && viewModel.openedTime}
                    {label === "Exit Time" && viewModel.closedTimeFull}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-card-title">Trade Notes</h2>
            <button className="inline-flex items-center gap-2 text-brand-800"><Edit size={16} />Edit Notes</button>
          </div>
          <div className="rounded-lg border border-[#eef1f2] bg-[#fdfcfb] p-4 text-body text-text-secondary">
            {viewModel.note}
          </div>
        </section>
      </div>
    </div>
  );
}
