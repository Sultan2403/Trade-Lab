import { Box, Paper, Switch } from "@mui/material";
import {
  Calendar,
  ChevronDown,
  Minus,
  MoveDown,
  MoveUp,
  Save,
  CheckCircle,
  XCircle,
} from "lucide-react";
import dayjs from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Tooltip } from "@mui/material";

export default function TradeForm({
  formData,
  handleChange,
  handleStatusToggle,
  handleSubmit,
  handleTagsChange,
  previewPnL,
  isClosed,
  setFormData
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-[1120px] space-y-6 pb-10"
      >
        {/* --- Basic Info --- */}
        <Paper className="ui-card rounded-panel p-6">
          <h2 className="mb-5 text-card-title font-semibold">
            Basic Information
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {/* Instrument / Pair */}
            <div className="space-y-2">
              <label className="text-body font-medium text-text-secondary">
                Instrument / Pair
              </label>

              <input
                name="pair"
                value={formData.pair}
                onChange={handleChange}
                placeholder="EUR/USD, GBP/USD, AAPL..."
                className="ui-input text-caption"
              />
            </div>

            {/* Direction */}
            <div>
              <label className="mb-2 block text-body font-medium text-text-secondary">
                Trade Direction
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, direction: "Long" }))
                  }
                  className={`flex items-center justify-center gap-2 rounded-pill border px-3 py-3 font-medium ${
                    formData.direction === "Long"
                      ? "border-state-success bg-state-success text-white"
                      : "border-border bg-white text-text-secondary"
                  }`}
                >
                  <MoveUp size={16} /> Long
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, direction: "Short" }))
                  }
                  className={`flex items-center justify-center gap-2 rounded-pill border px-3 py-3 font-medium ${
                    formData.direction === "Short"
                      ? "border-state-danger bg-state-danger text-white"
                      : "border-state-danger bg-white text-state-danger"
                  }`}
                >
                  <MoveDown size={16} /> Short
                </button>
              </div>
            </div>

            {/* Status Toggle */}
            <div className="flex flex-col justify-start">
              <label className="mb-2 block text-body font-medium text-text-secondary">
                Trade Status
              </label>
              <div className="flex items-center gap-2">
                {formData.status === "Closed" ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <XCircle size={20} className="text-red-600" />
                )}
                <Switch
                  checked={formData.status === "Closed"}
                  onChange={handleStatusToggle}
                  color="success"
                />
                <span className="font-medium">{formData.status}</span>
              </div>
            </div>
          </div>
        </Paper>
        {/* // --- Timing Section --- */}
        <Paper className="ui-card rounded-panel p-6">
          <h2 className="mb-5 text-card-title font-semibold flex items-center gap-2">
            <Calendar size={18} /> Trade Timing
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {/* Opened At */}
            <div>
              <label className="mb-2 block text-body font-medium text-text-secondary">
                Opened At
              </label>
              <DatePicker
                label="Date"
                value={formData.openedAt ? dayjs(formData.openedAt) : null}
                onChange={(newDate) =>
                  setFormData((prev) => ({
                    ...prev,
                    openedAt: newDate,
                  }))
                }
                slotProps={{
                  textField: { size: "small", fullWidth: true },
                }}
              />

              <TimePicker
                label="Time"
                value={formData.timeOpened ? dayjs(formData.timeOpened) : null}
                onChange={(newTime) =>
                  setFormData((prev) => ({
                    ...prev,
                    timeOpened: newTime,
                  }))
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    className: "mt-2",
                  },
                }}
              />
            </div>

            {/* Closed At */}
            <div>
              <label className="mb-2 block text-body font-medium text-text-secondary">
                Closed At
              </label>
              <Tooltip
                title={!isClosed ? "Only editable if trade is Closed" : ""}
              >
                <div
                  className={`pointer-events-${isClosed ? "auto" : "none"} opacity-${isClosed ? "100" : "50"}`}
                >
                  <DatePicker
                    value={formData.closedAt ? dayjs(formData.closedAt) : null}
                    onChange={(newDate) =>
                      setFormData((prev) => ({
                        ...prev,
                        closedAt: newDate,
                      }))
                    }
                    disabled={!isClosed}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />

                  <TimePicker
                    value={
                      formData.timeClosed ? dayjs(formData.timeClosed) : null
                    }
                    onChange={(newTime) =>
                      setFormData((prev) => ({
                        ...prev,
                        timeClosed: newTime,
                      }))
                    }
                    disabled={!isClosed}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        className: "mt-2",
                      },
                    }}
                  />
                </div>
              </Tooltip>
            </div>
          </div>
        </Paper>
        {/* --- Price Info --- */}
        <Paper className="ui-card rounded-panel p-6">
          <h2 className="mb-5 text-card-title font-semibold">
            Price Information
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              ["entryPrice", "Entry Price"],
              ["closedPrice", "Exit Price"],
              ["stopLoss", "Stop Loss"],
              ["takeProfit", "Take Profit"],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="mb-2 block text-body font-medium text-text-secondary">
                  {label}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-caption text-text-muted">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.00001"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="ui-input pl-9 text-caption"
                    disabled={name === "closedPrice" && !isClosed} // exit price only editable if Closed
                  />
                </div>
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="mb-2 block text-body font-medium text-text-secondary">
                Position Size
              </label>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <input
                  type="number"
                  step="0.01"
                  name="positionSize"
                  value={formData.positionSize}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="ui-input text-caption"
                />
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-pill border border-border px-4 text-body text-text-secondary"
                >
                  {formData.positionUnit} <ChevronDown size={15} />
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-body font-medium text-text-secondary">
                Risk Percent
              </label>
              <div className="relative max-w-sm">
                <input
                  type="number"
                  step="0.01"
                  name="riskPercent"
                  value={formData.riskPercent}
                  onChange={handleChange}
                  placeholder="1.00"
                  className="ui-input pr-8 text-caption"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-caption text-text-muted">
                  %
                </span>
              </div>
            </div>
          </div>
        </Paper>
        {/* --- Trade Preview --- */}
        <Paper className="rounded-panel border border-border bg-surface-muted px-6 py-5">
          <h2 className="mb-3 text-card-title font-semibold">Trade Preview</h2>
          <Box className="grid grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-caption text-text-muted">P&L</p>
              <p className="text-body-lg font-semibold">
                {previewPnL === "--" ? "--" : `$${previewPnL}`}
              </p>
            </div>
            <div>
              <p className="text-caption text-text-muted">Percentage</p>
              <p className="text-body-lg font-semibold">--</p>
            </div>
            <div>
              <p className="text-caption text-text-muted">R-Multiple</p>
              <p className="text-body-lg font-semibold">--</p>
            </div>
            <div>
              <p className="text-caption text-text-muted">Outcome</p>
              <span className="inline-flex rounded-md border border-border bg-white px-2 py-1 text-text-muted">
                <Minus size={14} />
              </span>
            </div>
          </Box>
        </Paper>
        {/* --- Notes & Tags --- */}
        <Paper className="ui-card rounded-panel p-6">
          <h2 className="mb-5 text-card-title font-semibold">Notes & Tags</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-body font-medium text-text-secondary">
                Trade Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                maxLength={500}
                rows={5}
                placeholder="Describe your setup, execution, or lessons learned..."
                className="ui-input resize-none text-caption"
              />
              <div className="mt-2 flex items-center justify-between text-caption text-text-muted">
                <span>{formData.notes.length} / 500 characters</span>
                <span>Ctrl+Enter to save</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-body font-medium text-text-secondary">
                Strategy Tags (Optional)
              </label>
              <input
                name="tags"
                value={formData.tagsInput}
                onChange={(e) => {
                  handleTagsChange(e);
                  setFormData((prev) => ({
                    ...prev,
                    tagsInput: e.target.value,
                  }));
                }}
                placeholder="e.g. breakout, swing-trade, scalping..."
                className="ui-input text-caption"
              />
              <p className="mt-2 text-caption text-text-muted">
                Separate tags with commas
              </p>
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
        {/* --- Footer --- */}
        <div className="flex items-center justify-between border-t border-border pt-6">
          <button
            type="button"
            className="text-body font-medium text-brand-800 hover:text-brand-900"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button type="button" className="ui-btn-secondary py-2 text-body">
              Save & Add Another
            </button>
            <button
              type="submit"
              className="ui-btn-primary inline-flex items-center gap-2 py-2 text-body"
            >
              <Save size={16} /> Save Trade
            </button>
          </div>
        </div>
      </form>
    </LocalizationProvider>
  );
}
