import { useEffect } from "react";
import useAccounts from "../../../Hooks/useAccounts";
import { useNavigate } from "react-router-dom";
import { getAccountId } from "../../../Helpers/Accounts/accounts.helper";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function AccountManagementSettings() {
  const {
    data: profileData,
    loading,
    error,
    getAccountProfile,
  } = useAccounts();
  const navigate = useNavigate();

  const account = profileData?.account;
  const metrics = profileData?.tradesMetrics;

  const currentAccountId = getAccountId();

  const formatCurrency = (value) =>
    Number(value ?? 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const growthPercent = (account) => {
    if (!account || account.starting_balance === 0) return 0;
    return (
      ((account.current_balance - account.starting_balance) /
        account.starting_balance) *
      100
    );
  };

  useEffect(() => {
    getAccountProfile();
  }, [currentAccountId]);

  if (loading) return <div className="p-6 text-sm">Loading account...</div>;
  if (error)
    return (
      <div className="p-6 text-sm text-state-danger">
        Failed to load account
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Active Account */}
      {account && (
        <section className="space-y-3">
          <p className="text-caption text-text-muted">
            Currently Active Account
          </p>

          <article className="rounded-panel border border-border p-6">
            <div className="flex items-start justify-between border-b border-border pb-5">
              <div>
                <h2 className="text-xl font-semibold">{account.name}</h2>
                <span className="mt-2 inline-flex rounded-md bg-state-success-soft px-2.5 py-0.5 text-sm font-medium text-state-success">
                  {account.type}
                </span>
              </div>

              <div className="text-right">
                <p className="text-3xl font-semibold">
                  ${formatCurrency(account.current_balance)}
                </p>

                {/* Growth */}
                <p
                  className={`mt-2 text-sm font-medium flex items-center justify-end gap-1 ${
                    growthPercent(account) >= 0
                      ? "text-state-success"
                      : "text-state-danger"
                  }`}
                >
                  {growthPercent(account) >= 0 ? (
                    <ArrowUp size={14} />
                  ) : (
                    <ArrowDown size={14} />
                  )}
                  {growthPercent(account).toFixed(2)}%
                </p>

                <p className="text-caption text-text-muted">
                  Starting: ${formatCurrency(account.starting_balance)}
                </p>
              </div>
            </div>

            {/* Metrics from backend */}
            <div className="mt-5 grid grid-cols-3 gap-6">
              <div>
                <p className="text-xl font-semibold">
                  {metrics?.totalTrades ?? "--"}
                </p>
                <p className="text-caption text-text-muted">Total Trades</p>
              </div>

              <div>
                <p className="text-xl font-semibold">
                  {metrics?.winRate != null
                    ? metrics.winRate.toFixed(2) + "%"
                    : "--"}
                </p>
                <p className="text-caption text-text-muted">Win Rate</p>
              </div>

              <div>
                <p className="text-xl font-semibold text-state-success">
                  {metrics?.netPnL != null
                    ? `$${formatCurrency(metrics.netPnL)}`
                    : "--"}
                </p>
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
            onClick={() => navigate("/accounts")}
            className="ui-btn-primary"
          >
            Manage Accounts →
          </button>
        </article>
      </section>
    </div>
  );
}
