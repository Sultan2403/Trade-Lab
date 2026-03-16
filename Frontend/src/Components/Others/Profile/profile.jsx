import { createElement } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import getUserData from "../../../Helpers/Utils/jwt.util";

const disabledInputClass =
  "w-full rounded-md border border-border bg-surface-card px-3 py-2 text-[15px] text-text-muted";

const upcomingBadge = (
  <span className="rounded-md bg-[#D9EEF2] px-2 py-1 text-xs font-medium text-brand-900">
    Coming soon
  </span>
);

const SectionCard = ({
  title,
  subtitle,
  children,
  comingSoon = false,
  dimmed = false,
}) => (
  <section className={`ui-card p-6 ${dimmed ? "opacity-75" : ""}`}>
    <div className="mb-5 flex items-center gap-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      {comingSoon ? upcomingBadge : null}
    </div>
    {subtitle ? (
      <p className="mb-5 text-[15px] text-text-secondary">{subtitle}</p>
    ) : null}
    {children}
  </section>
);

const ActionBtn = ({ children, disabled = false, danger = false }) => (
  <button
    type="button"
    disabled={disabled}
    className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
      disabled
        ? "cursor-not-allowed border-border text-text-muted"
        : danger
          ? "border-state-danger text-state-danger hover:bg-state-danger/10"
          : "border-brand-800 text-brand-900 hover:bg-brand-900/10"
    }`}
  >
    {children}
  </button>
);


function TimezoneSelector() {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div>
      <label className="mb-2 block text-sm text-text-primary">
        Timezone
      </label>

      <button
        type="button"
        className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-[15px] text-text-primary hover:border-border-strong"
      >
        <span>{userTimeZone}</span>
        <ChevronDown size={16} className="text-text-muted" />
      </button>

      <p className="mt-1 text-xs text-text-muted">
        Affects trade timestamps and date displays.
      </p>
    </div>
  );
}

export default function ProfilePage() {
  const { username, email } = getUserData();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <SectionCard title="Personal information">
        <div className="mb-6 flex items-start gap-6">
          <div className="text-center">
            <img
              src="https://i.pravatar.cc/160?img=12"
              alt="profile"
              className="h-24 w-24 rounded-full border border-border object-cover"
            />
            <button
              type="button"
              className="mt-2 text-sm text-brand-900 hover:text-brand-800"
            >
              Remove photo
            </button>
            <p className="mt-1 text-xs text-text-muted">JPG, PNG up to 5MB</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-text-primary">
              Username *
            </label>
            <input
              className="ui-input py-2.5 text-[15px]"
              defaultValue={username}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-text-primary">
              Email address *
            </label>
            <div className="flex gap-3">
              <input
                className="ui-input py-2.5 text-[15px]"
                defaultValue={email}
              />
              <ActionBtn>Change Email</ActionBtn>
            </div>
            <p className="mt-1 text-xs text-text-muted">
              Used for login and notifications.
            </p>
          </div>
          </div>

  <TimezoneSelector/>

        <div className="mt-7 flex gap-3">
          <button type="button" className="ui-btn-primary py-2 text-sm">
            Save changes
          </button>
          <ActionBtn>Cancel</ActionBtn>
        </div>
      </SectionCard>

      <SectionCard title="Security" subtitle="Protect your account." comingSoon>
        <div className="space-y-5 opacity-60">
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <h3 className="font-medium">Password</h3>
              <p className="text-sm text-text-muted">••••••••••</p>
            </div>
            <ActionBtn disabled>Change password</ActionBtn>
          </div>
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <h3 className="font-medium">Two-Factor Authentication (2FA)</h3>
              <p className="text-sm text-text-muted">Not enabled</p>
            </div>
            <ActionBtn disabled>Enable 2FA</ActionBtn>
          </div>
          <ActionBtn disabled danger>
            Sign Out All Other Devices
          </ActionBtn>
        </div>
      </SectionCard>

      <SectionCard title="Subscription & billing" comingSoon dimmed>
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            You are currently on the Free plan.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              [Check, "Unlimited trades", true],
              [Check, "Basic analytics", true],
              [X, "Advanced analytics", false],
              [X, "AI-powered insights", false],
            ].map(([icon, label, included]) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                {createElement(icon, {
                  size: 14,
                  className: included
                    ? "text-state-success"
                    : "text-state-danger",
                })}
                <span
                  className={included ? "text-text-primary" : "text-text-muted"}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          <ActionBtn disabled>Upgrade to Pro</ActionBtn>
        </div>
      </SectionCard>

      <SectionCard
        title="Trading profile"
        subtitle="Help us personalize your experience."
        comingSoon
        dimmed
      >
        <div className="grid gap-4">
          <div>
            <label className="mb-2 block text-sm">Years of experience</label>
            <input
              className={disabledInputClass}
              value="Select experience level"
              disabled
              readOnly
            />
          </div>
          <div>
            <label className="mb-2 block text-sm">Trading goals</label>
            <textarea
              className="h-24 w-full resize-none rounded-md border border-border px-3 py-2 text-[15px] text-text-muted"
              disabled
              value="Achieve consistent returns, improve risk management, and reduce emotional decisions."
              readOnly
            />
          </div>
          <ActionBtn disabled>Save changes</ActionBtn>
        </div>
      </SectionCard>

      <SectionCard
        title="Connected services"
        subtitle="Manage broker and API integrations."
        comingSoon
        dimmed
      >
        <div className="space-y-3">
          {["Interactive Brokers", "TD Ameritrade", "MetaTrader 5"].map(
            (name) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-md border border-border p-3"
              >
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-text-muted">Not connected</p>
                </div>
                <ActionBtn disabled>Connect</ActionBtn>
              </div>
            ),
          )}
        </div>
      </SectionCard>
    </div>
  );
}
