const quickAccounts = [
  { name: "Main Trading Account", type: "Live", value: "$29,450", status: "success", active: true },
  { name: "Demo Account", type: "Demo", value: "$50,000", status: "default" },
  { name: "Paper Trading", type: "Paper", value: "$9,245", status: "danger" },
];

const valueToneClass = {
  success: "text-state-success",
  danger: "text-state-danger",
  default: "text-text-primary",
};

export default function AccountManagementSettings() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-caption text-text-muted">Currently Active Account</p>
        <article className="rounded-panel border border-border p-6">
          <div className="flex flex-wrap items-start justify-between gap-5 border-b border-border pb-6">
            <div>
              <h2 className="text-[2rem] font-semibold tracking-tightest">Main Trading Account</h2>
              <span className="mt-3 inline-flex rounded-md bg-state-success-soft px-3 py-1 text-sm font-medium text-state-success">
                Live
              </span>
            </div>

            <div className="text-right">
              <p className="text-5xl font-semibold tracking-tightest">$29,450</p>
              <p className="mt-2 text-body font-medium text-state-success">↑ +18.7%</p>
              <p className="mt-1 text-caption text-text-muted">Starting: $25,000</p>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 pt-6">
            <div className="grid min-w-[300px] flex-1 grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-semibold">247</p>
                <p className="text-caption text-text-muted">Total Trades</p>
              </div>
              <div>
                <p className="text-3xl font-semibold">68.4%</p>
                <p className="text-caption text-text-muted">Win Rate</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-4xl font-semibold text-state-success">+$4,750</p>
              <p className="text-caption text-text-muted">Net P&L</p>
              <button type="button" className="ui-btn-secondary mt-4">
                Switch Account
              </button>
            </div>
          </div>
        </article>
      </section>

      <section className="space-y-3">
        <h3 className="text-card-title">All Your Accounts</h3>
        <article className="flex flex-wrap items-center justify-between gap-5 rounded-panel border border-border p-6">
          <div>
            <p className="text-body text-text-secondary">Create, edit, and manage all your trading accounts</p>
            <p className="mt-1 text-caption text-text-muted">
              Configure account settings, view performance history, and organize your trading portfolios
            </p>
          </div>
          <button type="button" className="ui-btn-primary">
            Manage All Accounts →
          </button>
        </article>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-card-title">Quick Switch</h3>
          <button type="button" className="text-body text-brand-800 hover:text-brand-900">
            View All
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {quickAccounts.map((account) => (
            <article
              key={account.name}
              className={`rounded-panel border p-5 ${
                account.active ? "border-brand-800 bg-surface-base" : "border-border bg-surface-card"
              }`}
            >
              <p className="text-body-lg font-semibold text-text-primary">{account.name}</p>
              <p className="text-caption text-text-muted">{account.type}</p>
              <p className={`mt-3 text-4xl font-semibold tracking-tightest ${valueToneClass[account.status]}`}>
                {account.value}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
