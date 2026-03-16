import { useEffect, useMemo } from "react";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowDown, ArrowUp, MoveLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useTrades from "../../../Hooks/useTrades";

const formatCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";

  return Number(value).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatNumber = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
};

const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "--";

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

function DetailRow({ label, value, valueClassName = "" }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={600} className={valueClassName} textAlign="right">
        {value}
      </Typography>
    </div>
  );
}

export default function TradeDetailPlaceholder() {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, getTrade } = useTrades();

  useEffect(() => {
    if (!tradeId) return;
    getTrade(tradeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeId]);

  const trade = data?.trade;

  const pnlColorClass = useMemo(() => {
    if (trade?.pnl === null || trade?.pnl === undefined || Number.isNaN(Number(trade?.pnl))) {
      return "text-text-primary";
    }

    return Number(trade.pnl) >= 0 ? "text-[#067647]" : "text-[#B42318]";
  }, [trade?.pnl]);

  return (
    <Paper className="rounded-panel border border-border bg-surface-card p-8" elevation={0}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={700}>
              Trade Detail
            </Typography>
            <Typography color="text.secondary">Trade ID: {tradeId}</Typography>
          </Stack>

          <Button startIcon={<MoveLeft size={16} />} variant="outlined" onClick={() => navigate("/trades")}>
            Back to Trade History
          </Button>
        </Stack>

        {loading ? (
          <Stack alignItems="center" py={8}>
            <CircularProgress size={28} />
          </Stack>
        ) : null}

        {!loading && error ? (
          <Alert severity="error">Unable to load this trade right now. Please try again.</Alert>
        ) : null}

        {!loading && !error && !trade ? (
          <Alert severity="warning">Trade details were not found.</Alert>
        ) : null}

        {!loading && !error && trade ? (
          <Stack spacing={3}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                {trade.pair}
              </Typography>
              <Chip
                size="small"
                label={trade.status ?? "--"}
                color={trade.status === "Closed" ? "default" : "primary"}
                variant={trade.status === "Open" ? "filled" : "outlined"}
              />
              <Chip
                size="small"
                icon={trade.direction === "Long" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                label={trade.direction ?? "--"}
                color={trade.direction === "Long" ? "success" : "error"}
                variant="outlined"
              />
            </Stack>

            <Divider />

            <div className="grid gap-3 md:grid-cols-2">
              <DetailRow label="Entry Price" value={formatCurrency(trade.entry_price)} />
              <DetailRow label="Exit Price" value={formatCurrency(trade.exit_price)} />
              <DetailRow label="Stop Loss" value={formatCurrency(trade.stopLoss)} />
              <DetailRow label="Take Profit" value={formatCurrency(trade.takeProfit)} />
              <DetailRow label="Position Size" value={formatNumber(trade.size)} />
              <DetailRow label="Risk %" value={trade.riskPercent ? `${formatNumber(trade.riskPercent)}%` : "--"} />
              <DetailRow label="Risk to Reward" value={formatNumber(trade.riskToReward)} />
              <DetailRow label="P&L" value={formatCurrency(trade.pnl)} valueClassName={pnlColorClass} />
              <DetailRow label="Opened At" value={formatDateTime(trade.openedAt)} />
              <DetailRow label="Closed At" value={formatDateTime(trade.closedAt)} />
              <DetailRow label="Commission" value={formatCurrency(trade.metadata?.commission)} />
              <DetailRow label="Swap" value={formatCurrency(trade.metadata?.swap)} />
            </div>

            <DetailRow label="Source" value={trade.metadata?.source ?? "--"} />

            <div className="rounded-lg border border-border px-4 py-3">
              <Typography color="text.secondary" mb={1}>
                Notes
              </Typography>
              <Typography>{trade.notes || "No notes for this trade."}</Typography>
            </div>
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
}
