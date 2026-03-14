import { createElement, useEffect, useRef } from "react";

export default function AddTradeMethodModal({ isOpen, onClose, onSelectMethod, options = [] }) {
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
        className="w-full max-w-xl rounded-panel border border-border bg-surface-card p-6 shadow-lg outline-none"
      >
        <div className="mb-5">
          <h2 id="add-trade-method-title" className="text-2xl font-semibold text-text-primary">
            How would you like to add your trades?
          </h2>
          <p className="mt-2 text-body text-text-secondary">
            Choose a method to continue.
          </p>
        </div>

        <div className="space-y-3">
          {options.map(({ value, label, description, icon }) => (
            <button
              key={value}
              type="button"
              className="flex w-full items-center gap-3 rounded-md border border-border bg-surface-card px-4 py-4 text-left transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
              onClick={() => onSelectMethod(value)}
              aria-label={label}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-900/10 text-brand-900">
                {createElement(icon, { size: 18 })}
              </span>

              <span className="space-y-0.5">
                <span className="block text-body-lg font-semibold text-text-primary">{label}</span>
                <span className="block text-body text-text-secondary">{description}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-pill border border-border px-4 py-2 text-body font-medium text-text-secondary transition-colors hover:bg-surface-muted"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
