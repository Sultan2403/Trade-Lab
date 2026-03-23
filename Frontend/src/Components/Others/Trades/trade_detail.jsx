import { useEffect } from "react";
import { ArrowLeft, ArrowUp, ArrowDown, Edit, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useTrades from "../../../Hooks/useTrades";
import {
  getRMultipleLabel,
  getRMultipleColor,
} from "../../../Helpers/Calculations/calculations";

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
            <ArrowLeft size={16} /> Back to Previous Page
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
            <span className="text-text-muted text-sm font-medium">
              Instrument/Pair
            </span>
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
        <hr />

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
      <section className="bg-surface-card border border-border rounded-panel p-6 flex flex-col gap-4">
        {/* Section Header */}
        <h2 className="text-card-title">Performance Analysis</h2>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-text-primary text-sm">
          {/* Profit/Loss */}
          <div className="flex flex-col">
            <span className="text-text-muted text-base font-medium">
              Profit/Loss
            </span>
            <span
              className={`font-semibold text-lg ${isProfit ? "text-state-success" : "text-state-danger"}`}
            >
              {isProfit ? "+" : "-"}
              {formatCurrency(Math.abs(trade.pnl))}
            </span>
            {trade.pnlPercent != null && (
              <span className="text-text-muted text-xs mt-1">
                {trade.pnlPercent.toFixed(2)}%
              </span>
            )}
          </div>

          {/* R-Multiple */}
          <div className="flex flex-col">
            <span className="text-text-muted text-base font-medium">
              R-Multiple
            </span>

            <span
              className={`font-semibold text-lg ${getRMultipleColor(trade.riskToReward)}`}
            >
              {trade.riskToReward ?? "--"}
            </span>
            <span className="text-xs mt-1">
              {getRMultipleLabel(trade.riskToReward)}
            </span>
          </div>

          {/* Outcome */}
          <div className="flex flex-col">
            <span className="text-text-muted text-base font-medium">
              Outcome
            </span>
            <span
              className={`font-semibold text-lg ${trade.pnl >= 0 ? "text-state-success" : "text-state-danger"}`}
            >
              {trade.pnl > 0 ? "Win" : trade.pnl === 0 ? "Breakeven" : "Loss"}
            </span>
          </div>

          {/* Trade Duration */}
          <div className="flex flex-col">
            <span className="text-text-muted text-base font-medium">
              Trade Duration
            </span>
            <span className="font-semibold text-lg">
              {trade.duration || "--"}
            </span>
          </div>

          {/* Slippage */}
          <div className="flex flex-col">
            <span className="text-text-muted text-base font-medium">
              Slippage
            </span>
            <span className="font-semibold text-lg">
              {formatCurrency(trade.slippage)}
            </span>
          </div>

          {/* Commission */}
          <div className="flex flex-col">
            <span className="text-text-muted text-base font-medium">
              Commission
            </span>
            <span className="font-semibold text-lg">
              {formatCurrency(trade.commission)}
            </span>
          </div>
        </div>
      </section>

      {/* Trade Details */}
      <section className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-card-title mb-4">Trade Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-text-primary">
          {/* Pair & Direction */}
          <div className="flex flex-col">
            <span className="text-text-muted font-medium mb-1">
              Instrument/Pair
            </span>
            <span className="font-semibold text-lg">{trade.pair}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted font-medium mb-1">Direction</span>
            <div className="inline-flex items-center gap-1">
              {trade.direction === "Long" ? (
                <ArrowUp size={14} className="text-state-success" />
              ) : (
                <ArrowDown size={14} className="text-state-danger" />
              )}
              <span className="font-semibold">{trade.direction}</span>
            </div>
          </div>

          {/* Prices */}
          <div className="flex flex-col">
            <span className="text-text-muted font-medium mb-1">
              Entry Price
            </span>
            <span className="font-medium">
              {formatCurrency(trade.entry_price)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted font-medium mb-1">Exit Price</span>
            <span className="font-medium">
              {trade.exit_price ? formatCurrency(trade.exit_price) : "--"}
            </span>
          </div>

          {/* Position & Stops */}
          <div className="flex flex-col">
            <span className="text-text-muted font-medium mb-1">
              Position Size
            </span>
            <span className="font-medium">{trade.size} lots</span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted font-medium mb-1">Stop Loss</span>
            <span className="font-medium">
              {trade.stopLoss ? formatCurrency(trade.stopLoss) : "--"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted font-medium mb-1">
              Take Profit
            </span>
            <span className="font-medium">
              {trade.takeProfit ? formatCurrency(trade.takeProfit) : "--"}
            </span>
          </div>

          {/* Entry / Exit Dates & Times */}
          <div className="flex flex-col">
            <span className="text-text-muted font-medium mb-1">Entry Date</span>
            <span className="font-medium">
              {new Date(trade.openedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted font-medium mb-1">Entry Time</span>
            <span className="font-medium">
              {new Date(trade.openedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              })}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted font-medium mb-1">Exit Date</span>
            <span className="font-medium">
              {trade.closedAt
                ? new Date(trade.closedAt).toLocaleDateString()
                : "--"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-text-muted font-medium mb-1">Exit Time</span>
            <span className="font-medium">
              {trade.closedAt
                ? new Date(trade.closedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZoneName: "short",
                  })
                : "--"}
            </span>
          </div>

          {/* Duration */}
          <div className="flex flex-col">
            <span className="text-text-muted font-medium mb-1">Duration</span>
            <span className="font-medium">
              {trade.closedAt && trade.openedAt
                ? `${Math.floor((new Date(trade.closedAt) - new Date(trade.openedAt)) / 1000)} sec`
                : "--"}
            </span>
          </div>
        </div>
      </section>

      {/* Trade Notes */}
      <section className="bg-white border border-border rounded-lg p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-card-title">Trade Notes</h2>
          <button
            disabled={!trade?.notes}
            className={`inline-flex items-center gap-2 font-medium transition-colors ${
              trade?.notes
                ? "text-brand-800 hover:text-brand-700 cursor-pointer"
                : "text-text-muted cursor-not-allowed opacity-50"
            }`}
          >
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
