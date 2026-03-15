import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BarChart3 } from "lucide-react";

import useAccounts from "../../Hooks/useAccounts";
import { setAccountId } from "../../Helpers/Accounts/accounts.helper";

const ACCOUNT_TYPES = ["Live", "Demo", "Paper"];

const TYPE_BADGE_STYLES = {
  Live: "bg-[#D8EDF1] text-[#115E6B]",
  Demo: "bg-[#F2E4C8] text-[#6E5A28]",
  Paper: "bg-[#DDEEE7] text-[#257A55]",
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
  const tone =
    value > 0
      ? "text-state-success"
      : value < 0
        ? "text-state-danger"
        : "text-text-muted";
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
    () =>
      error?.response?.data?.validation?.body?.message ||
      error?.response?.data?.message ||
      "",
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
    <div className="flex min-h-screen items-center justify-center bg-surface-base px-4 py-5 sm:px-6 sm:py-8">
      <div className="w-full max-w-[520px] rounded-2xl border border-border bg-surface-card px-6 py-7 sm:px-8 sm:py-8">
        <div className="mb-7 flex flex-col items-center text-center">
          <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-900 text-text-inverse">
            <ArrowUpRight size={24} />
          </span>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-[44px]">
            {showSelector ? "Select a Trading Account" : "Welcome to TradeLog"}
          </h1>
          <p className="mt-2 text-lg text-text-secondary sm:text-[30px]">
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
          <div className="py-6 text-center text-body text-text-secondary">
            Loading your accounts...
          </div>
        ) : showSelector ? (
          <div className="space-y-3.5">
            {accounts.map((account) => {
              const isSelected = activeAccountId === account.id;
              const typeStyle =
                TYPE_BADGE_STYLES[account.type] ||
                "bg-surface-muted text-text-secondary";
              const performance = getPerformanceData(account);

              return (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => setSelectedAccountId(account.id)}
                  className={`w-full rounded-xl border px-4 py-4 text-left transition-colors ${
                    isSelected
                      ? "border-brand-700 bg-brand-700/5"
                      : "border-border hover:border-brand-700/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-brand-700"
                            : "border-border bg-surface-card"
                        }`}
                      >
                        {isSelected && (
                          <span className="h-2.5 w-2.5 rounded-full bg-brand-700" />
                        )}
                      </span>
                      <div>
                        <p className="text-[31px] font-semibold leading-tight sm:text-[33px]">
                          {account.name}
                        </p>
                        <p className="mt-2.5 text-[44px] font-semibold leading-none sm:text-[46px]">
                          ${formatCurrency(account.current_balance)}
                        </p>
                        <span className={`mt-2 block text-[24px] ${performance.tone}`}>
                          {performance.text} {performance.trendSymbol} •{" "}
                          {account.trades_count || 0} trades
                        </span>
                      </div>
                    </div>

                    {account.type && (
                      <span
                        className={`rounded-md px-3 py-1 text-[18px] ${typeStyle}`}
                      >
                        {account.type}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleSelectAndContinue}
              disabled={!activeAccountId}
              className="ui-btn-primary mt-4 w-full py-2.5 text-xl"
            >
              Continue to Dashboard
            </button>

            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="mt-2.5 w-full text-center text-xl font-medium text-brand-800 transition-colors hover:text-brand-900"
            >
              Create New Account
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreateAccount} className="space-y-3.5">
            <p className="text-center text-lg text-text-muted">
              Step 1 of 1 - Getting Started
            </p>
            <div className="h-2.5 rounded-full bg-surface-muted">
              <div className="h-full w-full rounded-full bg-brand-800" />
            </div>

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
                value={createForm.name}
                onChange={handleCreateFormChange}
                placeholder="e.g., Main Trading Account, Demo Account"
                className="ui-input py-2.5 text-body"
              />
              <p className="mt-1.5 text-caption text-text-muted">
                Choose a name that helps you identify this account
              </p>
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
                  value={createForm.starting_balance}
                  onChange={handleCreateFormChange}
                  placeholder="0.00"
                  className="ui-input py-2.5 pl-8 text-body"
                />
              </div>
              <p className="mt-1.5 text-caption text-text-muted">
                Enter your initial account balance
              </p>
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
                      checked={createForm.type === type}
                      onChange={handleCreateFormChange}
                      className="h-5 w-5"
                    />
                    {type === "Paper" ? "Paper Trading" : type}
                  </label>
                ))}
              </div>
              <p className="mt-1.5 text-caption text-text-muted">
                You can change this later
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="ui-btn-primary mt-1.5 w-full py-2.5 text-xl"
            >
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
          <span className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-200/30 text-brand-900">
            <BarChart3 size={24} />
          </span>
          <p className="text-body">
            {showSelector
              ? "Your trading dashboard awaits"
              : "Your trading journey starts here"}
          </p>
        </div>
      </div>
    </div>
  );
}
