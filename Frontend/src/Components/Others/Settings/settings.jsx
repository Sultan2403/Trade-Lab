import { Alert, CircularProgress } from "@mui/material";
import { ArrowLeft, Bell, ChevronDown, Monitor, Settings2, Shield, SlidersHorizontal } from "lucide-react";
import { createElement, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import useAccounts from "../../../Hooks/useAccounts";
import { getAccountId, setAccountId } from "../../../Helpers/Accounts/accounts.helper";

const sideNavItems = [
  { id: "account-management", label: "Account Management", icon: Settings2, active: true },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { id: "trading-preferences", label: "Trading Preferences", icon: ChevronDown },
  { id: "display-interface", label: "Display & Interface", icon: Monitor },
  { id: "data-privacy", label: "Data & Privacy", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell, badge: "Coming Soon" },
];

const formatCurrency = (value) =>
  Number(value ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getAccountLabel = (account) => `${account.name} ($${formatCurrency(account.current_balance)})`;

export default function SettingsPage() {
  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
    getAccountProfile,
  } = useAccounts();
  const { data: accountsData, loading: accountsLoading, getAllAccounts } = useAccounts();

  const [pendingAccountId, setPendingAccountId] = useState(getAccountId());

  useEffect(() => {
    getAccountProfile();
    getAllAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeAccount = profileData?.account;
  const accounts = useMemo(() => accountsData?.accounts ?? [], [accountsData]);

  useEffect(() => {
    if (activeAccount?.id) {
      setPendingAccountId(activeAccount.id);
    }
  }, [activeAccount?.id]);

  const switchableAccounts = useMemo(() => {
    if (accounts.length === 0) {
      return activeAccount ? [activeAccount] : [];
    }

    const hasActive = accounts.some((account) => account.id === activeAccount?.id);
    return hasActive || !activeAccount ? accounts : [activeAccount, ...accounts];
  }, [accounts, activeAccount]);

  const handleSwitchAccount = async () => {
    if (!pendingAccountId || pendingAccountId === activeAccount?.id) return;

    setAccountId(pendingAccountId);
    await getAccountProfile();
    await getAllAccounts();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="h-fit rounded-panel border border-border bg-surface-card p-4">
        <div className="mb-5 border-b border-border pb-4">
          <h2 className="text-2xl font-semibold text-text-primary">TradeLog</h2>
          <Link
            to="/dashboard"
            className="mt-4 inline-flex items-center gap-2 text-body font-medium text-brand-800 transition-colors hover:text-brand-900"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>
        </div>

        <ul className="space-y-1">
          {sideNavItems.map(({ id, label, icon, active, badge }) => (
            <li key={id}>
              <button
                type="button"
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-body transition-colors ${
                  active
                    ? "bg-brand-900 text-text-inverse"
                    : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                }`}
                disabled={!active}
              >
                <span className="flex items-center gap-2">
                  {createElement(icon, { size: 15 })}
                  {label}
                </span>
                {badge && (
                  <span className="rounded bg-[#DBEFF2] px-2 py-0.5 text-caption font-medium text-brand-900">
                    {badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="space-y-8">
        <div>
          <h2 className="text-3xl font-semibold text-text-primary">Account Management</h2>
          <p className="mt-1 text-body text-text-secondary">
            Manage your trading accounts and switch between them
          </p>
        </div>

        {profileError && (
          <Alert severity="error">Unable to load account information. Please refresh.</Alert>
        )}

        {profileLoading && !activeAccount ? (
          <div className="flex justify-center rounded-panel border border-border bg-surface-card py-12">
            <CircularProgress size={28} />
          </div>
        ) : (
          <div className="rounded-panel border border-border bg-surface-card p-6">
            <h3 className="text-xl font-semibold text-text-primary">Currently Active Account</h3>

            {activeAccount ? (
              <>
                <div className="mt-4 flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
                  <div className="space-y-2">
                    <h4 className="text-3xl font-semibold text-text-primary">{activeAccount.name}</h4>
                    <span className="inline-flex rounded-md bg-[#DBEFF2] px-2.5 py-1 text-caption font-medium text-brand-900">
                      {activeAccount.type || "Live"} Account
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-4xl font-semibold text-text-primary">
                      ${formatCurrency(activeAccount.current_balance)}
                    </p>
                    {/* TODO(analytics): Render growth percentage when backend adds account growth metrics. */}
                    {/* <p className="mt-1 text-body font-medium text-state-success">+15.2%</p> */}
                    <p className="mt-1 text-body text-text-muted">-- Growth</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="text-center">
                    {/* TODO(analytics): Render total trades after backend supports account analytics payload. */}
                    {/* <p className="text-2xl font-semibold text-text-primary">247</p> */}
                    <p className="text-2xl font-semibold text-text-primary">--</p>
                    <p className="text-body text-text-secondary">Total Trades</p>
                  </div>

                  <div className="text-center">
                    {/* TODO(analytics): Render win rate after backend supports account analytics payload. */}
                    {/* <p className="text-2xl font-semibold text-text-primary">68.4%</p> */}
                    <p className="text-2xl font-semibold text-text-primary">--</p>
                    <p className="text-body text-text-secondary">Win Rate</p>
                  </div>

                  <div className="text-center">
                    {/* TODO(analytics): Render net P&L after backend supports account analytics payload. */}
                    {/* <p className="text-2xl font-semibold text-state-success">+$24,750</p> */}
                    <p className="text-2xl font-semibold text-text-primary">--</p>
                    <p className="text-body text-text-secondary">Net P&amp;L</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <label htmlFor="switch-account" className="text-body font-medium text-text-primary">
                    Switch Active Account
                  </label>
                  <select
                    id="switch-account"
                    value={pendingAccountId || ""}
                    onChange={(event) => setPendingAccountId(event.target.value)}
                    className="w-full rounded-md border border-border bg-surface-base px-3 py-2 text-body text-text-primary outline-none transition focus:border-brand-700"
                    disabled={accountsLoading || switchableAccounts.length === 0}
                  >
                    {switchableAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {getAccountLabel(account)}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleSwitchAccount}
                    className="w-full rounded-md bg-brand-900 px-4 py-2.5 text-body font-medium text-text-inverse transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!pendingAccountId || pendingAccountId === activeAccount.id}
                  >
                    Switch Account
                  </button>
                </div>
              </>
            ) : (
              <p className="mt-4 text-body text-text-secondary">No active account found.</p>
            )}
          </div>
        )}

        <div className="rounded-panel border border-border bg-surface-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-text-primary">Manage All Accounts</h3>
              <p className="mt-1 text-body text-text-secondary">
                Add new accounts, edit account details, and manage your portfolio
              </p>
            </div>

            <Link
              to="/profile/accounts"
              className="inline-flex items-center rounded-md bg-brand-900 px-5 py-2.5 text-body font-medium text-text-inverse transition hover:bg-brand-700"
            >
              Manage Accounts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
