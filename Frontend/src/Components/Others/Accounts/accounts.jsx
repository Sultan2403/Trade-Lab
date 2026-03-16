import { useEffect, useMemo, useState } from "react";
import { Alert, CircularProgress } from "@mui/material";
import { MoreHorizontal } from "lucide-react";

import useAccounts from "../../../Hooks/useAccounts";
import {
  getAccountId,
  setAccountId,
} from "../../../Helpers/Accounts/accounts.helper";

const TYPE_BADGE_STYLES = {
  Live: "bg-[#D0F1D6] text-[#0B6623]",
  Demo: "bg-[#F2E4C8] text-[#6E5A28]",
};

const formatCurrency = (value) =>
  Number(value ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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
  const typeStyle =
    TYPE_BADGE_STYLES[account?.type] || "bg-surface-muted text-text-secondary";

  return (
    <article
      className={`rounded-panel border bg-surface-card p-6 transition-colors ${
        isSelected
          ? "border-brand-700 ring-1 ring-brand-700/20"
          : "border-border hover:border-brand-700/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-2xl font-semibold text-text-primary">
              {account.name}
            </h3>
            {isSelected && (
              <span className="rounded-md bg-[#DBEFF2] px-2.5 py-1 text-caption font-medium text-brand-900">
                Active
              </span>
            )}
          </div>

          {account.type && (
            <span
              className={`inline-flex rounded-md px-2.5 py-1 text-caption font-medium ${typeStyle}`}
            >
              {account.type}
            </span>
          )}
        </div>

        <button
          type="button"
          className="rounded-md border border-border p-2 text-text-secondary transition-colors hover:bg-surface-muted"
          aria-label={`More options for ${account.name}`}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="mt-5 grid gap-3 text-text-secondary">
        <div>
          <p className="text-body">Starting Balance</p>
          <p className="text-2xl font-semibold text-text-primary">
            ${formatCurrency(account.starting_balance)}
          </p>
        </div>

        <div>
          <p className="text-body">Current Balance</p>
          <p className="text-4xl font-semibold text-text-primary">
            ${formatCurrency(account.current_balance)}
          </p>
        </div>

        {/* TODO(analytics): Growth percentage will be wired once analytics values are returned by backend. */}
        {/* <p className="text-body text-state-success">+0.0% Growth</p> */}
        <p className="text-body text-text-muted">-- Growth</p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 rounded-panel bg-surface-muted p-4 text-center">
        <div className="space-y-1 border-r border-border">
          {/* TODO(analytics): Replace placeholder with account total trades. */}
          {/* <p className="text-3xl font-semibold text-text-primary">{account.total_trades}</p> */}
          <p className="text-3xl font-semibold text-text-primary">--</p>
          <p className="text-body text-text-secondary">Total Trades</p>
        </div>

        <div className="space-y-1 border-r border-border">
          {/* TODO(analytics): Replace placeholder with account win rate. */}
          {/* <p className="text-3xl font-semibold text-text-primary">{account.win_rate}%</p> */}
          <p className="text-3xl font-semibold text-text-primary">--</p>
          <p className="text-body text-text-secondary">Win Rate</p>
        </div>

        <div className="space-y-1">
          {/* TODO(analytics): Replace placeholder with account net P&L. */}
          {/* <p className="text-3xl font-semibold text-text-primary">$0.00</p> */}
          <p className="text-3xl font-semibold text-text-primary">--</p>
          <p className="text-body text-text-secondary">Net P&amp;L</p>
        </div>
      </div>

      {!isSelected && (
        <button
          type="button"
          onClick={onSelect}
          className="mt-5 text-lg font-medium text-brand-800 transition-colors hover:text-brand-900"
        >
          Switch to Account
        </button>
      )}
    </article>
  );
}

export default function AccountsPage() {
  const { data, loading, error, getAllAccounts } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState(getAccountId());

  useEffect(() => {
    getAllAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accounts = data?.accounts ?? [];

  const activeAccount = useMemo(() => {
    const preselected = accounts.find(
      (account) => account.id === selectedAccountId,
    );
    if (preselected) return preselected;

    return getActiveAccount(accounts);
  }, [accounts, selectedAccountId]);

  const remainingAccounts = useMemo(
    () => accounts.filter((account) => account.id !== activeAccount?.id),
    [accounts, activeAccount?.id],
  );

  return (
    <div className="space-y-6">
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
        <div className="rounded-panel border border-border bg-surface-card p-8 text-body text-text-secondary">
          No accounts found yet. Create your first account from onboarding.
        </div>
      ) : (
        <>
          {activeAccount && (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-text-primary">
                Selected Account
              </h2>
              <AccountCard account={activeAccount} isSelected />
            </section>
          )}

          {remainingAccounts.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-text-primary">
                Other Accounts
              </h2>
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {remainingAccounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    isSelected={false}
                    onSelect={() => {
                      setAccountId(account.id);
                      setSelectedAccountId(account.id);
                    }}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
