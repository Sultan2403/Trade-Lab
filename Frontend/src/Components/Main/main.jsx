import { Avatar, IconButton } from "@mui/material";
import { ChevronDown } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import Nav from "../Navigation/nav";

const pageConfig = {
  "/trades": {
    breadcrumbs: ["Trade History"],
    title: "Trade History",
    subtitle: "Review, search, and sort your trades",
  },
  "/add-trade": {
    breadcrumbs: ["Trade History", "Add Trade"],
    title: "Log New Trade",
    subtitle: "Capture trade details while they're fresh",
  },
  "/import-trades": {
    breadcrumbs: ["Trade History", "Import Trades"],
    title: "Import Trades from CSV",
    subtitle: "Upload your trading history and we'll handle the rest",
  },
  "/dashboard": {
    breadcrumbs: ["Dashboard"],
    title: "Dashboard",
    subtitle: "Your trading performance overview",
  },
  "/profile": {
    breadcrumbs: ["Profile"],
    title: "Profile",
    subtitle: "Manage your personal information and account settings",
  },
  "/settings": {
    breadcrumbs: ["Settings"],
    title: "Settings",
    subtitle: "Workspace settings are in progress",
  },
  "/analytics": {
    breadcrumbs: ["Analytics"],
    title: "Analytics",
    subtitle: "Performance analytics are in progress",
  },
  "/accounts": {
    breadcrumbs: ["Trading Accounts"],
    title: "Your Trading Accounts",
    subtitle: "Manage your accounts and view performance at a glance",
  },
  "/settings/account-management": {
    breadcrumbs: ["Settings"],
    title: "Settings",
    subtitle: "Manage your app preferences and account configuration",
  },
  "/settings/preferences": {
    breadcrumbs: ["Settings"],
    title: "Settings",
    subtitle: "Manage your app preferences and account configuration",
  },
  "/settings/trading": {
    breadcrumbs: ["Settings"],
    title: "Settings",
    subtitle: "Manage your app preferences and account configuration",
  },
  "/settings/display": {
    breadcrumbs: ["Settings"],
    title: "Settings",
    subtitle: "Manage your app preferences and account configuration",
  },
  "/settings/privacy": {
    breadcrumbs: ["Settings"],
    title: "Settings",
    subtitle: "Manage your app preferences and account configuration",
  },
  "/settings/notifications": {
    breadcrumbs: ["Settings"],
    title: "Settings",
    subtitle: "Manage your app preferences and account configuration",
  },
};

export function getPageConfig(path) {
  if (path.startsWith("/trades/") && path.endsWith("/edit")) {
    return {
      breadcrumbs: ["Trade History", "Trade Detail", "Edit"],
      title: "Edit Trade",
      subtitle: "Update trade information and notes",
    };
  }

  if (path.startsWith("/trades/")) {
    return {
      breadcrumbs: ["Trade History", "Trade Details"],
      title: "Trade Details",
      subtitle: "View your trade details",
    };
  }

  return pageConfig[path];
}

export default function Main() {
  const { pathname } = useLocation();
  const isTradeDetail = pathname.startsWith("/trades/");

  const pageMeta =
    pathname === "/settings"
      ? pageConfig["/settings/account-management"]
      : getPageConfig(pathname) || pageConfig["/dashboard"];

  // const accessToken = getAccessToken();
  // const refreshToken = getRefreshToken();

  // if (!accessToken || refreshToken)
  //   return <Navigate to={"/login"} replace={true} />;

  return (
    <div className="flex h-screen w-full bg-surface-base">
      <aside className="h-full w-[300px] shrink-0 overflow-y-auto">
        <Nav />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-border bg-surface-card px-8 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-3 text-caption text-text-muted">
                {pageMeta.breadcrumbs.map((item, index) => (
                  <span key={item} className="inline-flex items-center gap-3">
                    {index > 0 && <span>›</span>}
                    {item}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-semibold">{pageMeta.title}</h1>
              <p className="mt-1 text-body text-text-secondary">
                {pageMeta.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Avatar
                alt="Trader"
                src="https://i.pravatar.cc/80?img=12"
                sx={{ width: 42, height: 42 }}
              />
              <IconButton size="small" sx={{ color: "#6C737C" }}>
                <ChevronDown size={16} />
              </IconButton>
            </div>
          </div>
        </header>

        <main
          className={
            isTradeDetail
              ? "flex-1 overflow-y-auto"
              : "flex-1 overflow-y-auto p-8"
          }
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
