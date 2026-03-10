import { ArrowUpRight } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function AuthLayout({ children, footer, tab = "login" }) {
  const isLogin = tab === "login";

  return (
    <div className="min-h-screen bg-surface-base px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center">
        <section className="ui-card grid w-full max-w-4xl overflow-hidden lg:grid-cols-[1.05fr_1fr]">
          <aside className="hidden border-r border-border bg-surface-muted p-8 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-panel bg-brand-800 text-text-inverse">
                <ArrowUpRight size={20} />
              </div>
              <h1 className="text-page-title text-text-primary">TradeLog</h1>
              <p className="mt-2 max-w-sm text-body text-text-secondary">
                Track, review, and improve your trading performance with clean analytics built for serious traders.
              </p>
            </div>
            <p className="text-caption text-text-muted">Built for disciplined, data-driven trading decisions.</p>
          </aside>

          <main className="bg-surface-card p-5 sm:p-7 lg:p-8">
            <div className="mb-6 lg:hidden">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-panel bg-brand-800 text-text-inverse">
                <ArrowUpRight size={18} />
              </div>
              <h1 className="text-card-title">TradeLog</h1>
              <p className="mt-1 text-caption text-text-secondary">Your professional trading journal.</p>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-pill border border-border bg-surface-muted p-1">
              <NavLink
                to="/login"
                className={`rounded-pill px-3 py-2 text-center text-caption transition-colors ${
                  isLogin ? "bg-surface-card text-text-primary" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Log In
              </NavLink>
              <NavLink
                to="/register"
                className={`rounded-pill px-3 py-2 text-center text-caption transition-colors ${
                  isLogin ? "text-text-secondary hover:text-text-primary" : "bg-surface-card text-text-primary"
                }`}
              >
                Sign Up
              </NavLink>
            </div>

            {children}

            {footer && <p className="mt-5 text-center text-caption text-text-secondary">{footer}</p>}
          </main>
        </section>
      </div>
    </div>
  );
}
