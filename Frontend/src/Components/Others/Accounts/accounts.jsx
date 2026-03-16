import { useEffect, useMemo, useState } from "react";
import { Alert, CircularProgress, Dialog } from "@mui/material";
import { MoreHorizontal, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAccounts from "../../../Hooks/useAccounts";
import {
  getAccountId,
  setAccountId,
} from "../../../Helpers/Accounts/accounts.helper";
import AccountCreateForm from "../../Accounts/accountCreateForm";

const TYPE_BADGE_STYLES = {
  Live: "bg-[#CFF2DE] text-[#0B8A4A]",
  Demo: "bg-[#F7E7C7] text-[#9A6B1C]",
};

const formatWholeCurrency = (value) =>
  Number(value ?? 0).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

const getPerformanceData = (account) => {
  const starting = Number(account?.starting_balance ?? 0);
  const current = Number(account?.current_balance ?? 0);

  if (!starting) {
    return { text: "0.0%", tone: "text-text-muted", sign: "" };
  }

  const value = ((current - starting) / starting) * 100;
  return {
    text: `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`,
    tone:
      value > 0
        ? "text-state-success"
        : value < 0
          ? "text-state-danger"
          : "text-text-muted",
    sign: value > 0 ? "↑" : value < 0 ? "↓" : "",
  };
};

const getActiveAccount = (accounts) => {
  const storedAccountId = getAccountId();

  return (
    accounts.find((account) => account?.is_active) ||
    accounts.find((account) => account?.id === storedAccountId) ||
    accounts[0] ||
    null
  );
};

function AccountCard({ account, isSelected, onSelect }) {
  const navigate = useNavigate();

  const typeStyle =
    TYPE_BADGE_STYLES[account?.type] || "bg-surface-muted text-text-secondary";

  const performance = getPerformanceData(account);
  const net =
    Number(account?.current_balance ?? 0) -
    Number(account?.starting_balance ?? 0);

  const netColor =
    net > 0
      ? "text-state-success"
      : net < 0
        ? "text-state-danger"
        : "text-text-primary";

  const balanceColor =
    account.current_balance > account.starting_balance
      ? "text-state-success"
      : account.current_balance < account.starting_balance
        ? "text-state-danger"
        : "text-text-primary";

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border bg-surface-card p-6 transition-all ${
        isSelected
          ? "border-brand-800 shadow-[0_0_0_1px_rgba(15,102,111,0.35)]"
          : "border-border hover:border-brand-700/35"
      }`}
    >
      {/* Header */}{" "}
      <div className="flex items-start justify-between">
        {" "}
        <div className="space-y-2">
          {" "}
          <div className="flex items-center gap-2 flex-wrap">
            {" "}
            <h3 className="text-xl font-semibold text-text-primary">
              {account.name}{" "}
            </h3>
            {isSelected && (
              <span className="rounded-md bg-[#D8E9EF] px-2 py-0.5 text-xs font-medium text-brand-900">
                Active
              </span>
            )}
          </div>
          {account.type && (
            <span
              className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${typeStyle}`}
            >
              {account.type}
            </span>
          )}
        </div>
        <button
          type="button"
          className="rounded-md border border-border p-2 text-text-secondary hover:bg-surface-muted"
          aria-label={`More options for ${account.name}`}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
      {/* Balances */}
      <div className="mt-6 space-y-3">
        <div>
          <p className="text-sm text-text-secondary">Starting Balance</p>
          <p className="text-xl font-semibold text-text-primary">
            ${formatWholeCurrency(account.starting_balance)}
          </p>
        </div>

        <div>
          <p className="text-sm text-text-secondary">Current Balance</p>
          <p className={`text-4xl font-semibold ${balanceColor}`}>
            {" "}
            ${formatWholeCurrency(account.current_balance)}
          </p>
        </div>

        <p className={`text-sm font-medium ${performance.tone}`}>
          {performance.sign} {performance.text}{" "}
          <span className="text-text-secondary">Growth</span>
        </p>
      </div>
      {/* Stats */}
      <div className="mt-7 grid grid-cols-3 rounded-xl bg-surface-muted px-4 py-5 text-center">
        <div className="flex min-w-0 flex-col items-center justify-center border-r border-border px-2">
          <p className="truncate text-xl font-semibold text-text-primary">--</p>
          <p className="text-xs text-text-secondary">Total Trades</p>
        </div>

        <div className="flex min-w-0 flex-col items-center justify-center border-r border-border px-2">
          <p className="truncate text-xl font-semibold text-text-primary">--</p>
          <p className="text-xs text-text-secondary">Win Rate</p>
        </div>

        <div className="flex min-w-0 flex-col items-center justify-center px-2">
          <p className={`truncate text-xl font-semibold ${netColor}`}>
            {net > 0 ? "+" : ""}${formatWholeCurrency(net)}
          </p>
          <p className="text-xs text-text-secondary">Net P&amp;L</p>
        </div>
      </div>
      {/* Actions */}
      <div className="mt-6 flex items-center gap-4">
        {isSelected && (
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition ${
              isSelected
                ? "border-brand-800 bg-brand-800 text-text-inverse hover:bg-brand-900"
                : "border-brand-700 text-brand-800 hover:bg-brand-700/10"
            }`}
          >
            View Dashboard
          </button>
        )}

        {!isSelected && (
          <button
            type="button"
            onClick={onSelect}
            className="w-full rounded-lg border border-brand-700 px-4 py-2.5 text-sm font-medium text-brand-800 transition-colors hover:bg-brand-700/10"
          >
            Switch to Account
          </button>
        )}
      </div>
    </article>
  );
}

function CreateAccountTile({ onClick, compact = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-full w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface-card p-8 text-center transition-colors hover:border-brand-700/50 hover:bg-brand-700/5 ${compact ? "min-h-[260px]" : "min-h-[280px]"}`}
    >
      <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-brand-800">
        <Plus size={26} />
      </span>
      <h3 className="text-3xl font-semibold text-text-primary">
        Create New Account
      </h3>
      <p className="mt-2 max-w-xs text-body text-text-secondary">
        Set up a new trading account to track your trades separately.
      </p>
      <span className="mt-5 rounded-lg bg-brand-800 px-5 py-2 text-body font-semibold text-text-inverse">
        Get Started
      </span>
    </button>
  );
}

export default function AccountsPage() {
  const { data, loading, error, getAllAccounts, createAccount } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState(getAccountId());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    starting_balance: "",
    type: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    getAllAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accounts = useMemo(() => data?.accounts ?? [], [data?.accounts]);

  const activeAccount = useMemo(() => {
    const preselected = accounts.find(
      (account) => account.id === selectedAccountId,
    );
    if (preselected) return preselected;

    return getActiveAccount(accounts);
  }, [accounts, selectedAccountId]);

  const handleCreateFormChange = (event) => {
    const { name, value } = event.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
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
      setSelectedAccountId(response.account.id);
      setCreateForm({ name: "", starting_balance: "", type: "" });
      setShowCreateModal(false);
      await getAllAccounts();
    }
  };

  const orderedAccounts = useMemo(() => {
    if (!accounts.length) return [];

    const active =
      accounts.find((a) => a.id === selectedAccountId) ||
      accounts.find((a) => a.is_active) ||
      accounts[0];

    if (!active) return accounts;

    return [active, ...accounts.filter((a) => a.id !== active.id)];
  }, [accounts, selectedAccountId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-800 px-5 py-2.5 text-lg font-medium text-text-inverse transition-colors hover:bg-brand-900"
        >
          <Plus size={18} />
          Create New Account
        </button>
      </div>

      {error && (
        <Alert severity="error">
          Unable to load your accounts right now. Please try again.
        </Alert>
      )}

      {loading && !data ? (
        <div className="flex justify-center rounded-panel border border-border bg-surface-card py-16">
          <CircularProgress size={28} />
        </div>
      ) : accounts.length === 0 ? (
        <CreateAccountTile onClick={() => setShowCreateModal(true)} compact />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {orderedAccounts.map((account, index) => (
            <AccountCard
              key={account.id}
              account={account}
              isSelected={index === 0}
              onSelect={() => {
                setAccountId(account.id);
                setSelectedAccountId(account.id);
              }}
            />
          ))}

          {/* <CreateAccountTile onClick={() => setShowCreateModal(true)} /> */}
        </div>
      )}

      <Dialog
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <div className="p-6 sm:p-8">
          <h2 className="text-3xl font-semibold text-text-primary">
            Create New Account
          </h2>

          <p className="mt-2 text-body text-text-secondary">
            Add another account to separate strategies and track performance
            clearly.
          </p>

          <div className="mt-5">
            <AccountCreateForm
              form={createForm}
              formError={formError}
              loading={loading}
              onChange={handleCreateFormChange}
              onSubmit={handleCreateAccount}
              onCancel={() => setShowCreateModal(false)}
              submitLabel="Create Account"
              helperText="Choose Live or Demo based on your strategy"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
