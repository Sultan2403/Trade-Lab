import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BarChart3 } from "lucide-react";

import useAccounts from "../../Hooks/useAccounts";
import { setAccountId } from "../../Helpers/Accounts/accounts.helper";

const ACCOUNT_TYPES = ["Live", "Demo"];

const TYPE_BADGE_STYLES = {
  Live: "bg-[#D8EDF1] text-[#115E6B]",
  Demo: "bg-[#F2E4C8] text-[#6E5A28]",
};

const formatCurrency = (amount) =>
  Number(amount ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getPerformanceData = (account) => {
  const starting = Number(account?.starting_balance ?? 0);
  const current = Number(account?.current_balance ?? 0);

  if (!starting) {
    return { text: "0.00%", tone: "text-text-muted", trendSymbol: "" };
  }

  const value = ((current - starting) / starting) * 100;
  const tone = value > 0 ? "text-state-success" : value < 0 ? "text-state-danger" : "text-text-muted";
  const trendSymbol = value > 0 ? "↑" : value < 0 ? "↓" : "";

  return {
    text: `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`,
    tone,
    trendSymbol,
  };
};

export default function Onboarding() {
  const { data, error, loading, getAllAccounts, createAccount } = useAccounts();

  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    starting_balance: "",
    type: "",
  });
  const [formError, setFormError] = useState("");

  const accounts = data?.accounts ?? [];
  const hasAccounts = accounts.length > 0;
  const activeAccountId = selectedAccountId || accounts[0]?.id || "";

  useEffect(() => {
    getAllAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backendError = useMemo(
    () => error?.response?.data?.validation?.body?.message || error?.response?.data?.message || "",
    [error],
  );

  const handleSelectAndContinue = () => {
    if (!activeAccountId) return;

    setAccountId(activeAccountId);
    window.location.href = "/dashboard";
  };

  const handleCreateFormChange = (event) => {
    const { name, value } = event.target;

    setCreateForm((prev) => ({ ...prev, [name]: value }));
    if (formError) {
      setFormError("");
    }
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();

    const trimmedName = createForm.name.trim();
    const parsedBalance = Number(createForm.starting_balance);

    if (trimmedName.length < 3) {
      setFormError("Account name must be at least 3 characters.");
      return;
    }

    if (Number.isNaN(parsedBalance) || parsedBalance < 0) {
      setFormError("Starting balance must be zero or greater.");
      return;
    }

    const payload = {
      name: trimmedName,
      starting_balance: parsedBalance,
      ...(createForm.type ? { type: createForm.type } : {}),
    };

    const response = await createAccount(payload);

    if (response?.success && response?.account?.id) {
      setAccountId(response.account.id);
      window.location.href = "/dashboard";
    }
  };

  const showSelector = hasAccounts && !showCreateForm;

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-base px-4 py-8 sm:px-6 sm:py-10">
      <div className="w-full max-w-[500px] rounded-panel border border-border bg-surface-card p-5 sm:p-6">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-900 text-text-inverse">
            <ArrowUpRight size={20} />
          </span>
          <h1 className="text-3xl font-semibold">
            {showSelector ? "Select a Trading Account" : "Welcome to TradeLog"}
          </h1>
          <p className="mt-2 text-body text-text-secondary">
            {showSelector
              ? "Choose an account to continue to your dashboard"
              : "Let's set up your first trading account to get started"}
          </p>
        </div>

        {(backendError || formError) && (
          <p className="mb-4 rounded-panel border border-state-danger-soft bg-state-danger-soft px-3 py-2 text-caption text-state-danger">
            {formError || backendError}
          </p>
        )}

        {loading && !data ? (
          <div className="py-8 text-center text-body text-text-secondary">Loading your accounts...</div>
        ) : showSelector ? (
          <div>
            <div className="space-y-3">
              {accounts.map((account) => {
                const isSelected = activeAccountId === account.id;
                const typeStyle = TYPE_BADGE_STYLES[account.type] || "bg-surface-muted text-text-secondary";
                const performance = getPerformanceData(account);

                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => setSelectedAccountId(account.id)}
                    className={`w-full rounded-panel border p-4 text-left transition-colors ${
                      isSelected ? "border-brand-700 bg-brand-700/5" : "border-border hover:border-brand-700/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`mt-1 h-5 w-5 rounded-full border ${
                            isSelected ? "border-brand-700 bg-brand-700" : "border-border bg-surface-card"
                          }`}
                        />
                        <div>
                          <p className="text-[22px] font-semibold leading-tight">{account.name}</p>
                          <p className="mt-2 text-[42px] font-semibold leading-none">${formatCurrency(account.current_balance)}</p>
                          <div className="mt-1 flex items-center gap-3 text-caption">
                            <span className={performance.tone}>
                              {performance.text} {performance.trendSymbol}
                            </span>
                            <span className="text-text-muted">Performance</span>
                          </div>
                        </div>
                      </div>

                      {account.type && (
                        <span className={`rounded-md px-3 py-1 text-caption ${typeStyle}`}>{account.type}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleSelectAndContinue}
              disabled={!activeAccountId}
              className="ui-btn-primary mt-5 w-full py-2.5 text-body"
            >
              Continue to Dashboard
            </button>

            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="mt-3 w-full text-center text-body font-medium text-brand-800 transition-colors hover:text-brand-900"
            >
              Create New Account
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <p className="text-center text-body text-text-muted">Step 1 of 1 - Getting Started</p>
            <div className="h-2 rounded-full bg-surface-muted">
              <div className="h-full w-full rounded-full bg-brand-800" />
            </div>

            <div>
              <label htmlFor="name" className="mb-1.5 block text-caption font-medium text-text-secondary">
                Account Name <span className="text-state-danger">*</span>
              </label>
              <input
                id="name"
                name="name"
                value={createForm.name}
                onChange={handleCreateFormChange}
                placeholder="e.g., Main Trading Account, Demo Account"
                className="ui-input py-2.5 text-caption"
              />
              <p className="mt-1 text-caption text-text-muted">Choose a name that helps you quickly identify this account.</p>
            </div>

            <div>
              <label
                htmlFor="starting_balance"
                className="mb-1.5 block text-caption font-medium text-text-secondary"
              >
                Starting Balance <span className="text-state-danger">*</span>
              </label>
              <input
                id="starting_balance"
                name="starting_balance"
                type="number"
                min="0"
                step="0.01"
                value={createForm.starting_balance}
                onChange={handleCreateFormChange}
                placeholder="0.00"
                className="ui-input py-2.5 text-caption"
              />
              <p className="mt-1 text-caption text-text-muted">
                We use this as your baseline, so your account growth reflects performance over time.
              </p>
            </div>

            <div>
              <p className="mb-2 block text-caption font-medium text-text-secondary">Account Type (Optional)</p>
              <div className="space-y-2">
                {ACCOUNT_TYPES.map((type) => (
                  <label key={type} className="flex cursor-pointer items-center gap-2 text-body text-text-primary">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={createForm.type === type}
                      onChange={handleCreateFormChange}
                      className="h-4 w-4"
                    />
                    {type}
                  </label>
                ))}
              </div>
              <p className="mt-1 text-caption text-text-muted">You can change this later.</p>
            </div>

            <button type="submit" disabled={loading} className="ui-btn-primary w-full py-2.5 text-body">
              {loading ? "Creating Account..." : "Create Account & Continue"}
            </button>

            {hasAccounts && (
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="w-full text-center text-body font-medium text-brand-800 transition-colors hover:text-brand-900"
              >
                Back to Account Selection
              </button>
            )}
          </form>
        )}

        <div className="mt-8 flex flex-col items-center text-center text-text-muted">
          <span className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-200/30 text-brand-900">
            <BarChart3 size={20} />
          </span>
          <p className="text-body">
            {showSelector ? "Your trading dashboard awaits" : "Your trading journey starts here"}
          </p>
        </div>
      </div>
    </div>
  );
}
