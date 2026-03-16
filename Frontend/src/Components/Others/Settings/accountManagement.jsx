const quickAccounts = [
  {
    name: "Main Trading Account",
    type: "Live",
    value: "$29,450",
    status: "success",
    active: true,
  },
  { name: "Demo Account", type: "Demo", value: "$50,000", status: "default" },
  { name: "Paper Trading", type: "Paper", value: "$9,245", status: "danger" },
];
import { useEffect } from "react";
import useAccounts from "../../../Hooks/useAccounts";

export default function AccountManagementSettings() {
  const { data, loading, error, getAllAccounts } = useAccounts();
  const valueToneClass = {
    success: "text-state-success",
    danger: "text-state-danger",
    default: "text-text-primary",
  };

  const formatCurrency = (value) =>
    Number(value ?? 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const getAccountStatus = (account) => {
    const diff = account.current_balance - account.starting_balance;

    if (diff > 0) return "success";
    if (diff < 0) return "danger";
    return "default";
  };

  const accounts = data?.accounts ?? [];

  const activeAccount = accounts[0]; // until backend gives active id

  const quickAccounts = accounts.map((account) => ({
    ...account,
    value: `$${formatCurrency(account.current_balance)}`,
    status: getAccountStatus(account),
  }));

  useEffect(() => {
    getAllAccounts();
  }, []);
  return (
    <div className="space-y-8">
      {/* Active Account */}
      <section className="space-y-3">
        <p className="text-caption text-text-muted">Currently Active Account</p>

        <article className="rounded-panel border border-border p-6">
          <div className="flex items-start justify-between border-b border-border pb-5">
            <div>
              <h2 className="text-xl font-semibold">Main Trading Account</h2>

              <span className="mt-2 inline-flex rounded-md bg-state-success-soft px-2.5 py-0.5 text-sm font-medium text-state-success">
                Live
              </span>
            </div>

            <div className="text-right">
              <p className="text-3xl font-semibold">$29,450</p>
              <p className="text-sm font-medium text-state-success">↑ +18.7%</p>
              <p className="text-caption text-text-muted">Starting: $25,000</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="mt-5 grid grid-cols-3 gap-6">
            <div>
              <p className="text-xl font-semibold">247</p>
              <p className="text-caption text-text-muted">Total Trades</p>
            </div>

            <div>
              <p className="text-xl font-semibold">68.4%</p>
              <p className="text-caption text-text-muted">Win Rate</p>
            </div>

            <div>
              <p className="text-xl font-semibold text-state-success">
                +$4,750
              </p>
              <p className="text-caption text-text-muted">Net P&L</p>
            </div>
          </div>

          <button className="ui-btn-secondary mt-6">Switch Account</button>
        </article>
      </section>

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

          <button className="ui-btn-primary">Manage Accounts →</button>
        </article>
      </section>

      {/* Quick Switch */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-card-title">Quick Switch</h3>

          <button className="text-sm text-brand-800 hover:text-brand-900">
            View All
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickAccounts.map((account) => (
            <article
              key={account.name}
              className={`rounded-panel border p-4 transition ${
                account.active
                  ? "border-brand-800 bg-surface-base"
                  : "border-border bg-surface-card hover:border-brand-600"
              }`}
            >
              <p className="text-body font-semibold">{account.name}</p>

              <p className="text-caption text-text-muted">{account.type}</p>

              <p
                className={`mt-2 text-2xl font-semibold ${valueToneClass[account.status]}`}
              >
                {account.value}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
