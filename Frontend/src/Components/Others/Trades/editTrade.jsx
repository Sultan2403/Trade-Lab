import { useEffect, useMemo, useState } from "react";
import { Alert, CircularProgress, Paper } from "@mui/material";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import useTrades from "../../../Hooks/useTrades";

const formatTagInput = (tags) => (Array.isArray(tags) ? tags.join(", ") : "");

const splitTags = (value) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 10);

const getDateValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return dayjs(date).format("YYYY-MM-DD");
};

const getTimeValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return dayjs(date).format("HH:mm");
};

const mergeDateTime = (date, time, fallback) => {
  if (!date) return fallback;
  const timeValue = time || "00:00";
  return new Date(`${date}T${timeValue}:00`).toISOString();
};

export default function EditTrade() {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const {
    data,
    loading,
    error,
    getTrade,
    updateTrade,
    deleteTrade,
  } = useTrades();

  const [formData, setFormData] = useState(null);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    getTrade(tradeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeId]);

  useEffect(() => {
    const trade = data?.trade;
    if (!trade) return;

    setFormData({
      pair: trade.pair || "",
      direction: trade.direction || "Long",
      openedDate: getDateValue(trade.openedAt),
      openedTime: getTimeValue(trade.openedAt),
      entry_price: trade.entry_price ?? "",
      exit_price: trade.exit_price ?? "",
      stopLoss: trade.stopLoss ?? "",
      takeProfit: trade.takeProfit ?? "",
      size: trade.size ?? "",
      notes: trade.notes || "",
      tagsInput: formatTagInput(trade.tags),
    });
  }, [data?.trade]);

  const trade = data?.trade;
  const isCsvImport = trade?.metadata?.source === "csv-import";

  const preview = useMemo(() => {
    if (!formData) return null;

    const entry = Number(formData.entry_price);
    const exit = Number(formData.exit_price);
    const size = Number(formData.size);

    if ([entry, exit, size].some((v) => Number.isNaN(v))) {
      return { pnl: "--", percentage: "--", outcome: "--" };
    }

    const sign = formData.direction === "Short" ? -1 : 1;
    const pnl = (exit - entry) * size * sign;
    const percentage = entry ? (pnl / (entry * size)) * 100 : 0;

    return {
      pnl: `${pnl >= 0 ? "+" : ""}$${pnl.toFixed(2)}`,
      percentage: `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%`,
      outcome: pnl > 0 ? "Win" : pnl < 0 ? "Loss" : "Breakeven",
    };
  }, [formData]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!trade || !formData) return;

    const payload = isCsvImport
      ? {
          notes: formData.notes,
          tags: splitTags(formData.tagsInput),
        }
      : {
          pair: formData.pair,
          direction: formData.direction,
          openedAt: mergeDateTime(
            formData.openedDate,
            formData.openedTime,
            trade.openedAt,
          ),
          entry_price: Number(formData.entry_price),
          exit_price:
            formData.exit_price === "" ? null : Number(formData.exit_price),
          stopLoss: Number(formData.stopLoss),
          takeProfit: Number(formData.takeProfit),
          size: Number(formData.size),
          notes: formData.notes,
          tags: splitTags(formData.tagsInput),
        };

    const response = await updateTrade({ id: tradeId, payload });

    if (!response?.trade) {
      setSaveError(
        error?.response?.data?.message || "Unable to save trade changes.",
      );
      return;
    }

    navigate(`/trades/${tradeId}`);
  };

  const handleDelete = async () => {
    const response = await deleteTrade(tradeId);
    if (!response?.success) return;
    navigate("/trades");
  };

  if (loading && !trade) {
    return (
      <div className="flex h-full items-center justify-center">
        <CircularProgress size={24} />
      </div>
    );
  }

  if (error && !trade) {
    return <div className="p-8 text-state-danger">Unable to load trade.</div>;
  }

  if (!formData || !trade) return null;

  const readOnlyClass = isCsvImport
    ? "cursor-not-allowed bg-surface-muted text-text-muted"
    : "bg-white";

  return (
    <div className="mx-auto max-w-[980px] space-y-5 p-8">
      {(saveError || error) && (
        <Alert severity="error">{saveError || "Unable to save changes."}</Alert>
      )}

      {isCsvImport && (
        <Alert severity="info">
          This trade came from CSV import. Only Notes and Strategy Tags can be edited.
        </Alert>
      )}

      <div className="flex items-center justify-between border-b border-border pb-4">
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center gap-2 text-state-danger"
        >
          <Trash2 size={16} /> Delete Trade
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(`/trades/${tradeId}`)}
            className="rounded-md border border-brand-700 px-4 py-2 text-brand-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-4 py-2 text-white"
          >
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>

      <Paper className="ui-card rounded-panel p-5" elevation={0}>
        <h2 className="mb-4 text-body font-semibold">Basic Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-caption text-text-secondary">Instrument/Pair</label>
            <input className={`ui-input w-full ${readOnlyClass}`} value={formData.pair} onChange={handleChange("pair")} disabled={isCsvImport} />
          </div>
          <div>
            <label className="mb-2 block text-caption text-text-secondary">Direction</label>
            <select className={`ui-input w-full ${readOnlyClass}`} value={formData.direction} onChange={handleChange("direction")} disabled={isCsvImport}>
              <option value="Long">Long</option>
              <option value="Short">Short</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-caption text-text-secondary">Trade Date</label>
            <input type="date" className={`ui-input w-full ${readOnlyClass}`} value={formData.openedDate} onChange={handleChange("openedDate")} disabled={isCsvImport} />
          </div>
          <div>
            <label className="mb-2 block text-caption text-text-secondary">Entry Time</label>
            <input type="time" className={`ui-input w-full ${readOnlyClass}`} value={formData.openedTime} onChange={handleChange("openedTime")} disabled={isCsvImport} />
          </div>
        </div>
      </Paper>

      <Paper className="ui-card rounded-panel p-5" elevation={0}>
        <h2 className="mb-4 text-body font-semibold">Price Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["entry_price", "Entry Price"],
            ["exit_price", "Exit Price"],
            ["stopLoss", "Stop Loss"],
            ["takeProfit", "Take Profit"],
            ["size", "Position Size"],
          ].map(([name, label]) => (
            <div key={name} className={name === "size" ? "md:col-span-2" : ""}>
              <label className="mb-2 block text-caption text-text-secondary">{label}</label>
              <input
                type="number"
                className={`ui-input w-full ${readOnlyClass}`}
                value={formData[name]}
                onChange={handleChange(name)}
                disabled={isCsvImport}
              />
            </div>
          ))}
        </div>
      </Paper>

      <Paper className="rounded-panel border border-border bg-surface-muted p-5" elevation={0}>
        <h2 className="mb-3 text-body font-semibold">Calculated Preview</h2>
        <div className="grid grid-cols-3 gap-4">
          <div><p className="text-caption text-text-muted">P&L</p><p className="font-semibold">{preview?.pnl}</p></div>
          <div><p className="text-caption text-text-muted">Percentage</p><p className="font-semibold">{preview?.percentage}</p></div>
          <div><p className="text-caption text-text-muted">Outcome</p><p className="font-semibold">{preview?.outcome}</p></div>
        </div>
      </Paper>

      <Paper className="ui-card rounded-panel p-5" elevation={0}>
        <h2 className="mb-4 text-body font-semibold">Notes</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-caption text-text-secondary">Trade Notes</label>
            <textarea
              rows={4}
              maxLength={500}
              className="ui-input w-full"
              value={formData.notes}
              onChange={handleChange("notes")}
            />
            <p className="mt-1 text-right text-caption text-text-muted">{formData.notes.length}/500 characters</p>
          </div>
          <div>
            <label className="mb-2 block text-caption text-text-secondary">Tags (optional)</label>
            <input className="ui-input w-full" value={formData.tagsInput} onChange={handleChange("tagsInput")} />
          </div>
        </div>
      </Paper>

      <div className="flex items-center justify-between pb-8">
        <button type="button" onClick={() => navigate(`/trades/${tradeId}`)} className="inline-flex items-center gap-2 text-brand-700">
          <ArrowLeft size={16} /> Back to Trade Detail
        </button>
        <button type="button" onClick={handleDelete} className="inline-flex items-center gap-2 text-state-danger">
          <Trash2 size={16} /> Delete Trade
        </button>
      </div>
    </div>
  );
}
