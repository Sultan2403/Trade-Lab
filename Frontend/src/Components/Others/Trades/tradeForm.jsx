import { Box, Paper, Switch, Tooltip } from "@mui/material";
import UIInput from "../../UI/Common/input";
import {
  Calendar,
  ChevronDown,
  Minus,
  MoveDown,
  MoveUp,
  CheckCircle,
  XCircle,
  DollarSign,
  FileText,
} from "lucide-react";
import dayjs from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export default function TradeForm({
  formData,
  handleChange,
  handleStatusToggle,
  handleSubmit,
  handleTagsChange,
  previewPnL,
  isClosed,
  setFormData,
  fieldErrors,
  loading,
  error,
  onCancel,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-[980px] space-y-5 pb-10"
        style={{ pointerEvents: loading ? "none" : "auto" }}
      >
        {error && (
          <div className="rounded-panel border border-state-danger/30 bg-state-danger/10 px-4 py-3 text-caption text-state-danger">
            {error?.response?.data?.validation?.body?.message || error?.response?.data?.message}
          </div>
        )}

        <Paper className="ui-card rounded-panel p-5">
          <h2 className="mb-4 text-body font-semibold">Basic Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-caption font-medium text-text-secondary">Instrument / Pair</label>
              <UIInput
                name="pair"
                value={formData.pair}
                onChange={handleChange}
                placeholder="EUR/USD, GBP/USD, AAPL..."
                error={fieldErrors?.pair}
                helperText={fieldErrors?.pair}
              />
            </div>

            <div>
              <label className="mb-2 block text-caption font-medium text-text-secondary">Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, direction: "Long" }))}
                  className={`flex items-center justify-center gap-2 rounded-pill border px-3 py-2.5 text-body font-medium ${
                    formData.direction === "Long"
                      ? "border-state-success bg-state-success text-white"
                      : "border-border bg-white text-text-secondary"
                  }`}
                >
                  <MoveUp size={15} /> Long
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, direction: "Short" }))}
                  className={`flex items-center justify-center gap-2 rounded-pill border px-3 py-2.5 text-body font-medium ${
                    formData.direction === "Short"
                      ? "border-state-danger bg-state-danger text-white"
                      : "border-state-danger bg-white text-state-danger"
                  }`}
                >
                  <MoveDown size={15} /> Short
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-caption font-medium text-text-secondary">Trade Date</label>
              <DatePicker
                value={formData.openedAt ? dayjs(formData.openedAt) : null}
                onChange={(newDate) => setFormData((prev) => ({ ...prev, openedAt: newDate }))}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-caption font-medium text-text-secondary">Trade Time</label>
              <TimePicker
                value={formData.timeOpened ? dayjs(formData.timeOpened) : null}
                onChange={(newTime) => {
                  setFormData((prev) => ({
                    ...prev,
                    timeOpened: newTime,
                  }));
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-between rounded-md border border-border bg-surface-muted px-3 py-2.5">
              <div className="inline-flex items-center gap-2 text-caption text-text-secondary">
                {formData.status === "Closed" ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <XCircle size={16} className="text-red-600" />
                )}
                Trade Status: <span className="font-semibold text-text-primary">{formData.status}</span>
              </div>
              <Switch checked={formData.status === "Closed"} onChange={handleStatusToggle} color="success" />
            </div>
          </div>
        </Paper>

        <Paper className="ui-card rounded-panel p-5">
          <h2 className="mb-4 flex items-center gap-2 text-body font-semibold">
            <Calendar size={16} /> Close Timing
          </h2>
          <Tooltip title={!isClosed ? "Only editable if trade is Closed" : ""}>
            <div className={`grid gap-4 md:grid-cols-2 ${!isClosed ? "pointer-events-none opacity-50" : ""}`}>
              <div className="space-y-2">
                <label className="block text-caption font-medium text-text-secondary">Closed Date</label>
                <DatePicker
                  value={formData.closedAt ? dayjs(formData.closedAt) : null}
                  minDate={formData.openedAt}
                  onChange={(newDate) => setFormData((prev) => ({ ...prev, closedAt: newDate }))}
                  disabled={!isClosed}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-caption font-medium text-text-secondary">Closed Time</label>
                <TimePicker
                  value={formData.timeClosed ? dayjs(formData.timeClosed) : null}
                  onChange={(newTime) => setFormData((prev) => ({ ...prev, timeClosed: newTime }))}
                  disabled={!isClosed}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />
              </div>
            </div>
          </Tooltip>
        </Paper>

        <Paper className="ui-card rounded-panel p-5">
          <h2 className="mb-4 flex items-center gap-2 text-body font-semibold">
            <DollarSign size={16} /> Price Information
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["entry_price", "Entry Price"],
              ["exit_price", "Exit Price"],
              ["stopLoss", "Stop Loss"],
              ["takeProfit", "Take Profit"],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="mb-2 block text-caption font-medium text-text-secondary">{label}</label>
                <UIInput
                  type="number"
                  name={name}
                  step="0.00001"
                  value={formData[name] ?? ""}
                  onChange={handleChange}
                  placeholder="0.00000"
                  startIcon="$"
                  disabled={name === "exit_price" && !isClosed}
                  error={Boolean(fieldErrors?.[name])}
                  helperText={fieldErrors?.[name] || ""}
                  inputProps={{ inputMode: "decimal" }}
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="mb-2 block text-caption font-medium text-text-secondary">Position Size</label>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <input
                  type="number"
                  step="0.01"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="ui-input text-caption"
                />
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-pill border border-border px-4 text-caption text-text-secondary"
                >
                  {formData.positionUnit} <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </div>
        </Paper>

        <Paper className="rounded-panel border border-border bg-surface-muted px-5 py-4">
          <h2 className="mb-3 text-body font-semibold">Trade Preview</h2>
          <Box className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-caption text-text-muted">P&L</p>
              <p
                className={`text-body font-semibold ${
                  previewPnL > 0 ? "text-green-600" : previewPnL < 0 ? "text-red-600" : ""
                }`}
              >
                {previewPnL === "--" ? "--" : `$${previewPnL}`}
              </p>
            </div>
            <div>
              <p className="text-caption text-text-muted">Percentage</p>
              <p className="text-body font-semibold">--</p>
            </div>
            <div>
              <p className="text-caption text-text-muted">R-Multiple</p>
              <p className="text-body font-semibold">--</p>
            </div>
            <div>
              <p className="text-caption text-text-muted">Outcome</p>
              <span className="inline-flex rounded-md border border-border bg-white px-2 py-1 text-text-muted">
                <Minus size={14} />
              </span>
            </div>
          </Box>
        </Paper>

        <Paper className="ui-card rounded-panel p-5">
          <h2 className="mb-4 flex items-center gap-2 text-body font-semibold">
            <FileText size={16} /> Notes & Tags
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-caption font-medium text-text-secondary">Trade Notes</label>
              <UIInput
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                placeholder="Describe your setup, execution, or lessons learned..."
                rows={5}
                inputProps={{ maxLength: 500 }}
                error={fieldErrors.notes}
                helperText={fieldErrors.notes || `${formData.notes.length}/500 characters`}
              />
            </div>

            <div>
              <label className="mb-2 block text-caption font-medium text-text-secondary">Strategy Tags (Optional)</label>
              <UIInput
                name="tags"
                value={formData.tagsInput}
                onChange={(e) => {
                  handleTagsChange(e);
                  setFormData((prev) => ({
                    ...prev,
                    tagsInput: e.target.value,
                  }));
                }}
                error={fieldErrors.tags}
                helperText={fieldErrors.tags}
                placeholder="e.g. breakout, swing-trade, scalping..."
                className="ui-input text-caption"
              />
              <p className="mt-2 text-caption text-text-muted">Separate tags with commas</p>
              {!!formData.tags.length && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-pill bg-surface-muted px-3 py-1 text-caption text-text-secondary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Paper>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <button
            type="button"
            className="text-caption font-medium text-text-secondary hover:text-text-primary"
            onClick={onCancel}
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading} className="ui-btn-primary py-2 text-caption disabled:opacity-60">
              {loading ? "Saving..." : "Save Trade"}
            </button>
          </div>
        </div>
      </form>
    </LocalizationProvider>
  );
}
