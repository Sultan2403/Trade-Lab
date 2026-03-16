import { useEffect } from "react";
import { ArrowLeft, ArrowUp, ArrowDown, Edit, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useTrades from "../../../Hooks/useTrades";

const formatCurrency = (value) =>
  value != null
    ? `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "--";

const TradeDetail = () => {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, getTrade } = useTrades();

  useEffect(() => {
    getTrade(tradeId);
  }, [tradeId]);

  if (loading) return <div className="p-6 text-sm">Loading trade...</div>;
  if (error || !data?.trade)
    return (
      <div className="p-6 text-sm text-state-danger">Failed to load trade.</div>
    );

  const trade = data.trade;
  const isProfit = trade.pnl >= 0;
  const directionUp = trade.direction === "Long";

  return (
    <div className="min-h-full p-8 space-y-6 bg-[#fdfcfb]">
      {/* Header */}
      <div className="flex flex-col gap-4">
        {/* Trade Name */}
        <div>
          <span className="text-xl font-semibold">
            {trade.pair} {trade.direction} Position
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          {/* Left: Back */}
          <button
            className="flex items-center gap-1 text-brand-700 text-sm font-medium hover:underline transition-colors"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} /> Back to Trade History
          </button>

          {/* Right: Edit / Delete */}
          <div className="flex gap-2">
            {/* Edit Trade */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-brand-700 text-brand-700 hover:bg-brand-700/10 text-sm font-medium transition-colors">
              <Edit size={14} /> Edit Trade
            </button>

            {/* Delete Trade */}
            <button className="flex items-center gap-1 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors">
              <Trash2 size={14} /> Delete Trade
            </button>
          </div>
        </div>
      </div>

      <section className="bg-surface-card border border-border rounded-panel p-6 flex flex-col gap-6">
        {/* Overview Header */}
        <h4 className="text-card-title mb-4">Overview</h4>

        {/* Top Row: Overview */}
        <div className="flex flex-row justify-between items-center w-full">
          {/* Pair */}
          <div className="flex flex-col items-start">
            <span className="text-text-muted text-sm font-medium">Pair</span>
            <span className="text-2xl md:text-3xl font-bold text-text-primary">
              {trade.pair}
            </span>
          </div>

          {/* P&L */}
          <div className="flex flex-col items-center">
            <span className="text-text-muted text-sm font-medium">P/L</span>
            <span
              className={`text-xl md:text-2xl font-semibold ${isProfit ? "text-state-success" : "text-state-danger"}`}
            >
              {isProfit ? "+" : "-"}
              {formatCurrency(Math.abs(trade.pnl))}
            </span>
          </div>

          {/* Direction */}
          <div className="flex flex-col items-end">
            <span className="text-text-muted text-sm font-medium">
              Direction
            </span>
            <div
              className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-sm font-medium ${
                directionUp
                  ? "bg-success-soft text-state-success"
                  : "bg-danger-soft text-state-danger"
              }`}
            >
              {directionUp ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              {trade.direction}
            </div>
          </div>
        </div>
        <hr/>

        {/* Bottom Metrics (unchanged) */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 w-full text-text-primary text-sm">
          <div className="flex flex-col">
            <span className="text-text-muted">Entry Price</span>
            <span className="font-medium">
              {formatCurrency(trade.entry_price)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted">Exit Price</span>
            <span className="font-medium">
              {formatCurrency(trade.exit_price)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted">Position Size</span>
            <span className="font-medium">{trade.size} lots</span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted">Stop Loss</span>
            <span className="font-medium">
              {formatCurrency(trade.stopLoss)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted">Take Profit</span>
            <span className="font-medium">
              {formatCurrency(trade.takeProfit)}
            </span>
          </div>
          <div className="flex flex-col text-right text-text-secondary">
            <span>{new Date(trade.openedAt).toLocaleDateString()}</span>
            <span>
              {new Date(trade.openedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Performance Analysis */}
      <section className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-card-title mb-4">Performance Analysis</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-text-primary text-sm">
          <div className="flex flex-col">
            <span className="text-text-muted">Profit/Loss</span>
            <span
              className={`font-medium ${isProfit ? "text-state-success" : "text-state-danger"}`}
            >
              {isProfit ? "+" : "-"}
              {formatCurrency(Math.abs(trade.pnl))}
            </span>
            <span className="text-text-muted text-xs">
              {trade.pnlPercent?.toFixed(2)}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted">R-Multiple</span>
            <span className="font-medium">{trade.rMultiple}</span>
            <span className="text-text-success text-xs">Good Risk/Reward</span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted">Outcome</span>
            <span className="font-medium text-state-success">
              {trade.pnl >= 0 ? "Win" : "Loss"}
            </span>
            <span className="text-text-muted text-xs">Target Reached</span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted">Trade Duration</span>
            <span className="font-medium">{trade.duration}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted">Slippage</span>
            <span className="font-medium">
              {formatCurrency(trade.slippage)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted">Commission</span>
            <span className="font-medium">
              {formatCurrency(trade.commission)}
            </span>
          </div>
        </div>
      </section>

      {/* Trade Details */}
      <section className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-card-title mb-4">Trade Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-text-primary text-sm">
          {[
            ["Instrument/Pair", trade.pair],
            ["Direction", trade.direction],
            ["Entry Price", formatCurrency(trade.entry_price)],
            ["Exit Price", formatCurrency(trade.exit_price)],
            ["Position Size", `${trade.size} shares`],
            ["Stop Loss", formatCurrency(trade.stopLoss)],
            ["Take Profit", formatCurrency(trade.takeProfit)],
            ["Trade Date", new Date(trade.openedAt).toLocaleDateString()],
            [
              "Entry Time",
              new Date(trade.openedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              }),
            ],
            [
              "Exit Time",
              new Date(trade.closedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              }),
            ],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-text-muted">{label}</span>
              <span className="font-medium">{value ?? "--"}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trade Notes */}
      <section className="bg-white border border-border rounded-lg p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-card-title">Trade Notes</h2>
          <button className="text-brand-800 inline-flex items-center gap-2">
            <Edit size={16} /> Edit Notes
          </button>
        </div>
        <div className="bg-[#fdfcfb] border border-[#eef1f2] p-4 rounded text-text-secondary text-sm">
          {trade.notes ?? "No notes for this trade."}
        </div>
      </section>
    </div>
  );
};

export default TradeDetail;
