import { useEffect } from "react";
import useAccounts from "../../../Hooks/useAccounts";
import { useNavigate } from "react-router-dom";
import { getAccountId } from "../../../Helpers/Accounts/accounts.helper";

export default function AccountManagementSettings() {
  const { data, loading, error, getAllAccounts } = useAccounts();
  const navigate = useNavigate();

  const formatCurrency = (value) =>
    Number(value ?? 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const accounts = data?.accounts ?? [];
  const currentAccountId = getAccountId();

  const activeAccount =
    accounts.find((acc) => acc.id === currentAccountId) || accounts[0];

  useEffect(() => {
    getAllAccounts();
  }, [currentAccountId]);

  if (loading) return <div className="p-6 text-sm">Loading accounts...</div>;

  if (error)
    return (
      <div className="p-6 text-sm text-state-danger">
        Failed to load accounts
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Active Account */}
      {activeAccount && (
        <section className="space-y-3">
          <p className="text-caption text-text-muted">
            Currently Active Account
          </p>

          <article className="rounded-panel border border-border p-6">
            <div className="flex items-start justify-between border-b border-border pb-5">
              <div>
                <h2 className="text-xl font-semibold">{activeAccount.name}</h2>

                <span className="mt-2 inline-flex rounded-md bg-state-success-soft px-2.5 py-0.5 text-sm font-medium text-state-success">
                  {activeAccount.type}
                </span>
              </div>

              <div className="text-right">
                <p className="text-3xl font-semibold">
                  ${formatCurrency(activeAccount.current_balance)}
                </p>

                <p className="text-caption text-text-muted">
                  Starting: ${formatCurrency(activeAccount.starting_balance)}
                </p>
              </div>
            </div>

            {/* Metrics placeholder */}
            <div className="mt-5 grid grid-cols-3 gap-6">
              <div>
                <p className="text-xl font-semibold">--</p>
                <p className="text-caption text-text-muted">Total Trades</p>
              </div>

              <div>
                <p className="text-xl font-semibold">--</p>
                <p className="text-caption text-text-muted">Win Rate</p>
              </div>

              <div>
                <p className="text-xl font-semibold">--</p>
                <p className="text-caption text-text-muted">Net P&L</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="ui-btn-secondary mt-6"
            >
              View Dashboard
            </button>
          </article>
        </section>
      )}

      {/* Manage Accounts */}
      <section className="space-y-3">
        <h3 className="text-card-title">Manage Accounts</h3>

        <article className="flex items-center justify-between rounded-panel border border-border p-6">
          <div>
            <p className="text-body text-text-secondary">
              Create, edit, and manage your trading accounts
            </p>

            <p className="text-caption text-text-muted">
              Configure account settings and review performance history
            </p>
          </div>

          <button
            onClick={() => navigate("/profile/accounts")}
            className="ui-btn-primary"
          >
            Manage Accounts →
          </button>
        </article>
      </section>

      {/* ------------------------------------------------ */}
      {/* QUICK SWITCH DISABLED FOR NOW                   */}
      {/* ------------------------------------------------ */}

      {/*
      const getAccountStatus = (account) => {
        const diff = account.current_balance - account.starting_balance;
        if (diff > 0) return "success";
        if (diff < 0) return "danger";
        return "default";
      };

      const valueToneClass = {
        success: "text-state-success",
        danger: "text-state-danger",
        default: "text-text-primary",
      };

      const quickAccounts = accounts.map((account, i) => ({
        ...account,
        active: i === 0,
        value: `$${formatCurrency(account.current_balance)}`,
        status: getAccountStatus(account),
      }));

      {quickAccounts.length > 1 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-card-title">Quick Switch</h3>

            <button
              onClick={() => navigate("/profile/accounts")}
              className="text-sm text-brand-800 hover:text-brand-900"
            >
              View All
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickAccounts.map((account) => (
              <article
                key={account.id}
                onClick={() => {
                  setAccountId(account.id);
                  window.location.reload();
                }}
                className={`cursor-pointer rounded-panel border p-4 transition hover:shadow-sm ${
                  account.active
                    ? "border-brand-800 bg-surface-base"
                    : "border-border bg-surface-card hover:border-brand-600"
                }`}
              >
                <p className="text-body font-semibold">{account.name}</p>

                <p className="text-caption text-text-muted">{account.type}</p>

                <p
                  className={`mt-2 text-2xl font-semibold ${
                    valueToneClass[account.status]
                  }`}
                >
                  {account.value}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
      */}
    </div>
  );
}
