import { Avatar, IconButton } from "@mui/material";
import { ChevronDown } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Nav from "../Navigation/nav";
import { getAccessToken, getRefreshToken } from "../../Helpers/Auth/tokens";

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
    breadcrumbs: ["Trading Accounts"],
    title: "Your Trading Accounts",
    subtitle: "Manage your accounts and view performance at a glance",
  },
};

export default function Main() {
  const { pathname } = useLocation();
  const pageMeta = pathname.startsWith("/trades/")
    ? {
        breadcrumbs: ["Trade History", "Trade Detail"],
        title: "Trade Detail",
        subtitle: "Detailed trade breakdown is in progress",
      }
    : (pageConfig[pathname] ?? pageConfig["/dashboard"]);

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

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
