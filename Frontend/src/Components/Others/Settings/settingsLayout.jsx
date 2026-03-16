import { NavLink, Outlet } from "react-router-dom";

export default function SettingsLayout() {
  const settingsTabs = [
    { label: "Account Management", to: "/settings/account-management" },
    { label: "Preferences", to: "/settings/preferences" },
    { label: "Trading", to: "/settings/trading" },
    { label: "Display", to: "/settings/display" },
    { label: "Data & Privacy", to: "/settings/privacy" },
    { label: "Notifications", to: "/settings/notifications" },
  ];

const tabClassName = ({ isActive }) =>
  `inline-flex items-center border-b-2 px-1 py-3 text-[0.95rem] transition-colors ${
    isActive
      ? "border-brand-800 text-brand-800"
      : "border-transparent text-text-muted hover:text-text-primary"
  }`;

  return (
    <section className="rounded-panel border border-border bg-surface-card overflow-hidden">
      <div className="border-b border-border">
        <div className="overflow-x-auto px-6">
          <nav
            className="flex items-center gap-6 whitespace-nowrap"
            aria-label="Settings sections"
          >
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
      </div>

      <div className="p-6">
        <Outlet />
      </div>
    </section>
  );
}
