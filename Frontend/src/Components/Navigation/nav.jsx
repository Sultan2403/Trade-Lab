import { createElement, useMemo, useState } from "react";
import { ArrowUpRight, BarChart3, History, LayoutGrid, LogOut, Plus, Settings, UserRound } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import AddTradeMethodModal from "../UI/Trades/addTradeMethodModal";

const primaryLinks = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutGrid },
  { label: "Trade History", to: "/trades", icon: History },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
];

const accountLinks = [
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "Profile", to: "/profile", icon: UserRound },
];

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-md px-3 py-2 text-[15px] transition-colors ${
    isActive
      ? "bg-surface-muted text-text-primary"
      : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
  }`;

export default function Nav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);

  const addTradeButtonClass = useMemo(() => {
    const isActive = pathname === "/add-trade" || pathname === "/import-trades";

    return `flex w-full items-center justify-center gap-2 rounded-md px-3 py-3 text-[24px] font-medium transition-colors ${
      isActive
        ? "bg-brand-700 text-text-inverse"
        : "bg-brand-700/65 text-text-inverse hover:bg-brand-700"
    }`;
  }, [pathname]);

  const handleMethodSelect = (method) => {
    if (method === "broker") return;

    setIsMethodModalOpen(false);

    if (method === "manual") {
      navigate("/add-trade");
      return;
    }

    navigate("/import-trades");
  };

  return (
    <>
      <nav className="flex h-full flex-col border-r border-border bg-surface-card">
        <div className="flex items-center gap-3 border-b border-border px-6 py-7">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-900 text-text-inverse">
            <ArrowUpRight size={18} />
          </span>
          <h2 className="text-xl font-semibold">TradeLog</h2>
        </div>

        <ul className="space-y-1 px-3 py-5">
          {primaryLinks.map(({ label, to, icon }) => (
            <li key={label}>
              <NavLink to={to} className={navLinkClass}>
                {createElement(icon, { size: 17 })}
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="px-3">
          <button
            type="button"
            onClick={() => setIsMethodModalOpen(true)}
            className={addTradeButtonClass}
            aria-haspopup="dialog"
            aria-label="Add a trade"
          >
            <Plus size={18} />
            Add Trade
          </button>
        </div>

        <div className="mt-auto border-t border-border px-3 py-5">
          <ul className="space-y-1">
            {accountLinks.map(({ label, to, icon }) => (
              <li key={label}>
                <NavLink to={to} className={navLinkClass}>
                  {createElement(icon, { size: 17 })}
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-[15px] text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
              >
                <LogOut size={17} />
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <AddTradeMethodModal
        isOpen={isMethodModalOpen}
        onClose={() => setIsMethodModalOpen(false)}
        onSelectMethod={handleMethodSelect}
      />
    </>
  );
}
