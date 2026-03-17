import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateTradeCreate } from "../../../Validators/trade.validator";
import { createInitialTradeUIState, normalizeTrade } from "../../../Helpers/Trades/trades.helpers";
import TradeForm from "./tradeForm";
import useTrades from "../../../Hooks/useTrades";

export default function AddTrade() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(createInitialTradeUIState());
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, loading, error, createTrade } = useTrades();

  useEffect(() => {
    if (!isSubmitting || loading) return;

    if (data?.data?.success && !error) {
      navigate("/trades");
    }

    setIsSubmitting(false);
  }, [data, error, isSubmitting, loading, navigate]);

  const handleTagsChange = (e) => {
    const tags = e.target.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "Open" ? "Closed" : "Open",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedData = normalizeTrade(formData);
    const errors = validateTradeCreate(normalizedData);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    await createTrade(normalizedData);
  };

  const previewPnL = useMemo(() => {
    const entry = Number(formData.entry_price);
    const exit = Number(formData.exit_price);
    const size = Number(formData.size);

    if (Number.isNaN(entry) || Number.isNaN(exit) || Number.isNaN(size)) return "--";

    const pnl = (exit - entry) * size * (formData.direction === "Long" ? 1 : -1);
    return pnl.toFixed(2);
  }, [
    formData.exit_price,
    formData.direction,
    formData.entry_price,
    formData.size,
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
      onCancel={() => navigate(-1)}
    />
  );
}
