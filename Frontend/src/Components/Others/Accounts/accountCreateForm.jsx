const ACCOUNT_TYPES = ["Live", "Demo"];

export default function AccountCreateForm({
  form,
  formError,
  loading,
  onChange,
  onSubmit,
  onCancel,
  submitLabel = "Create Account",
  helperText = "You can always add more accounts later.",
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      {formError && (
        <p className="rounded-panel border border-state-danger-soft bg-state-danger-soft px-3 py-2 text-caption text-state-danger">
          {formError}
        </p>
      )}

      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-body font-medium text-text-secondary"
        >
          Account Name <span className="text-state-danger">*</span>
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="e.g., Main Trading Account, Demo Account"
          className="ui-input py-2.5 text-body"
          required
        />
      </div>

      <div>
        <label
          htmlFor="starting_balance"
          className="mb-1.5 block text-body font-medium text-text-secondary"
        >
          Starting Balance <span className="text-state-danger">*</span>
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-body text-text-secondary">
            $
          </span>
          <input
            id="starting_balance"
            name="starting_balance"
            type="number"
            min="0"
            step="0.01"
            value={form.starting_balance}
            onChange={onChange}
            placeholder="0.00"
            className="ui-input py-2.5 pl-8 text-body"
            required
          />
        </div>
      </div>

      <div>
        <p className="mb-1.5 block text-body font-medium text-text-secondary">
          Account Type (Optional)
        </p>
        <div className="space-y-2.5">
          {ACCOUNT_TYPES.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-3 text-lg text-text-primary"
            >
              <input
                type="radio"
                name="type"
                value={type}
                checked={form.type === type}
                onChange={onChange}
                className="h-5 w-5"
              />
              {type}
            </label>
          ))}
        </div>
        <p className="mt-1.5 text-caption text-text-muted">{helperText}</p>
      </div>

      <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-lg border border-border px-4 py-2 text-body font-medium text-text-secondary transition-colors hover:bg-surface-muted sm:w-auto"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="ui-btn-primary w-full px-5 py-2.5 text-body sm:w-auto"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
