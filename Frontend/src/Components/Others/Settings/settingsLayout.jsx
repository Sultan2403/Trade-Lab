import { NavLink, Outlet } from "react-router-dom";

const settingsTabs = [
  { label: "Account Management", to: "/settings/account-management" },
  { label: "Preferences", to: "/settings/preferences" },
  { label: "Trading", to: "/settings/trading" },
  { label: "Display", to: "/settings/display" },
  { label: "Data & Privacy", to: "/settings/privacy" },
  { label: "Notifications", to: "/settings/notifications" },
];

const tabClassName = ({ isActive }) =>
  `inline-flex items-center border-b-2 px-1 py-4 text-[1.05rem] transition-colors ${
    isActive
      ? "border-brand-800 text-brand-800"
      : "border-transparent text-text-muted hover:text-text-primary"
  }`;

export default function SettingsLayout() {
  return (
    <section className="rounded-panel border border-border bg-surface-card">
      <div className="overflow-x-auto border-b border-border px-8">
        <nav className="flex min-w-max items-center gap-10" aria-label="Settings sections">
          {settingsTabs.map(({ label, to }) => (
            <NavLink key={to} to={to} className={tabClassName} end>
              {label}
            </NavLink>
          ))}
          <span className="rounded-md bg-state-info px-3 py-1 text-sm font-medium text-brand-900">
            Coming Soon
          </span>
        </nav>
      </div>

      <div className="p-8">
        <Outlet />
      </div>
    </section>
  );
}
