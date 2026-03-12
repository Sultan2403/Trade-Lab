import { Box, Paper, Switch } from "@mui/material";
import UIInput from "../../UI/Common/input";
import {
  Calendar,
  ChevronDown,
  Minus,
  MoveDown,
  MoveUp,
  Save,
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
import { Tooltip } from "@mui/material";

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
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-[1120px] space-y-6 pb-10"
        style={{ pointerEvents: loading ? "none" : "auto" }}
      >
        {" "}
        <div className="sticky top-0 z-10 mb-6 flex items-center justify-between border-b border-border bg-white py-4">
          <h1 className="text-xl font-semibold">Add Trade</h1>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-body font-medium text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="ui-btn-primary inline-flex items-center gap-2 py-2 text-body disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Trade
                </>
              )}
            </button>

            {error && (
              <p className="mt-3 text-sm text-red-600">
                {error?.response?.data?.validation?.body?.message ||
                  error?.response?.data?.message}
              </p>
            )}
          </div>
        </div>
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
              <UIInput
                name="pair"
                value={formData.pair}
                onChange={handleChange}
                placeholder="EUR/USD, GBP/USD, AAPL..."
                error={fieldErrors?.pair}
                helperText={fieldErrors?.pair}
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
            <div className="space-y-2">
              <label className="block text-body font-medium text-text-secondary">
                Opened At
              </label>

              <div className="grid grid-cols-2 gap-2">
                <DatePicker
                  value={formData.openedAt ? dayjs(formData.openedAt) : null}
                  onChange={(newDate) =>
                    setFormData((prev) => ({
                      ...prev,
                      openedAt: newDate,
                    }))
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />

                <TimePicker
                  value={
                    formData.timeOpened ? dayjs(formData.timeOpened) : null
                  }
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
            </div>

            {/* Closed At */}
            <div className="space-y-2">
              <label className="block text-body font-medium text-text-secondary">
                Closed At
              </label>

              <Tooltip
                title={!isClosed ? "Only editable if trade is Closed" : ""}
              >
                <div
                  className={`grid grid-cols-2 gap-2 ${
                    !isClosed ? "pointer-events-none opacity-50" : ""
                  }`}
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
                      textField: {
                        size: "small",
                        fullWidth: true,
                      },
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
          <h2 className="mb-5 flex items-center gap-2 text-card-title font-semibold">
            <DollarSign size={18} /> Price Information
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

                <UIInput
                  type="number"
                  name={name}
                  step="0.00001"
                  value={formData[name] ?? ""}
                  onChange={handleChange}
                  placeholder="0.00000"
                  startIcon="$"
                  disabled={name === "closedPrice" && !isClosed}
                  error={Boolean(fieldErrors?.[name])}
                  helperText={fieldErrors?.[name] || ""}
                  inputProps={{ inputMode: "decimal" }}
                />
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
                <UIInput
                  type="number"
                  name="riskPercent"
                  step="0.01"
                  value={formData.riskPercent}
                  onChange={handleChange}
                  placeholder="1.00"
                  endIcon="%"
                />
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
              <p
                className={`text-body-lg font-semibold ${
                  previewPnL > 0
                    ? "text-green-600"
                    : previewPnL < 0
                      ? "text-red-600"
                      : ""
                }`}
              >
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
          <h2 className="mb-5 flex items-center gap-2 text-card-title font-semibold">
            <FileText size={18} /> Notes & Tags
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-body font-medium text-text-secondary">
                Trade Notes
              </label>
              <UIInput
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                placeholder="Write a note about your trade..."
                rows={5}
                inputProps={{ maxLength: 500 }}
                helperText={`${formData.notes.length}/500 characters`}
              />
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
      </form>
    </LocalizationProvider>
  );
}
