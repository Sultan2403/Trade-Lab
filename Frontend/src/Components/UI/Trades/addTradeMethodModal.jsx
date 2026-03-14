import { createElement, useEffect, useRef } from "react";
import { FileText, Link2, Upload, X } from "lucide-react";

const METHOD_CARDS = [
  {
    value: "manual",
    label: "Manual Entry",
    description: "Add a single trade with all details.",
    icon: FileText,
    cta: "Continue",
    disabled: false,
  },
  {
    value: "broker",
    label: "Broker Integration",
    description: "Select your broker and we'll automatically sync your trades.",
    icon: Link2,
    cta: "Coming Soon",
    disabled: true,
  },
  {
    value: "csv",
    label: "CSV Import",
    description: "Upload multiple trades from a CSV file.",
    icon: Upload,
    cta: "Continue",
    disabled: false,
  },
];

export default function AddTradeMethodModal({ isOpen, onClose, onSelectMethod }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    containerRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-trade-method-title"
        tabIndex={-1}
        className="w-full max-w-3xl rounded-panel border border-border bg-surface-card shadow-lg outline-none"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 id="add-trade-method-title" className="text-xl font-semibold text-text-primary">
            How would you like to add trades?
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
            aria-label="Close add trade method dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-3">
          {METHOD_CARDS.map(({ value, label, description, icon, cta, disabled }) => (
            <div key={value} className="rounded-panel border border-border bg-surface-card p-4 text-center">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-md bg-brand-900/15 text-brand-900">
                {createElement(icon, { size: 18 })}
              </span>

              <h3 className="mt-4 text-xl font-semibold text-text-primary">{label}</h3>
              <p className="mt-2 min-h-20 text-body text-text-secondary">{description}</p>

              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelectMethod(value)}
                className={`mt-3 w-full rounded-md px-4 py-2.5 text-body font-medium transition-colors ${
                  disabled
                    ? "cursor-not-allowed border border-border bg-surface-muted text-text-muted"
                    : "bg-brand-700 text-text-inverse hover:bg-brand-700/90"
                }`}
                aria-label={`${label} ${disabled ? "coming soon" : "continue"}`}
              >
                {cta}
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-border px-6 py-4 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-body font-medium text-brand-900 hover:text-brand-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
