import { useMemo, useState } from "react";
import { validateTradeCreate } from "../../../Validators/trade.validator";
import { createInitialTradeUIState, normalizeTrade } from "../../../Helpers/Trades/trades.helpers";
import TradeForm from "./tradeForm";
import useTrades from "../../../Hooks/useTrades";

export default function AddTrade() {
  const [formData, setFormData] = useState(createInitialTradeUIState());
  const [fieldErrors, setFieldErrors] = useState({});

  const { loading, error, createTrade } = useTrades();

  const handleTagsChange = (e) => {
    const tags = e.target.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    if (fieldErrors[name])
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "Open" ? "Closed" : "Open",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedData = normalizeTrade(formData)
    const errors = validateTradeCreate(normalizedData);


    if (Object.keys(errors).length > 0) return setFieldErrors(errors);

    setFieldErrors({});

    console.log("Sending to server...", normalizedData);

    // Normalize formdata first!
    createTrade(normalizedData);
  };

  const previewPnL = useMemo(() => {
    const entry = Number(formData.entryPrice);
    const exit = Number(formData.closedPrice);
    const size = Number(formData.positionSize);
    if (Number.isNaN(entry) || Number.isNaN(exit) || Number.isNaN(size))
      return "--";
    const pnl =
      (exit - entry) * size * (formData.direction === "Long" ? 1 : -1);
    return pnl.toFixed(2);
  }, [
    formData.closedPrice,
    formData.direction,
    formData.entryPrice,
    formData.positionSize,
  ]);

  const isClosed = formData.status === "Closed";

  return (
    <TradeForm
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleStatusToggle={handleStatusToggle}
      handleTagsChange={handleTagsChange}
      previewPnL={previewPnL}
      formData={formData}
      isClosed={isClosed}
      setFormData={setFormData}
      fieldErrors={fieldErrors}
      loading={loading}
      error={error}
    />
  );
}
