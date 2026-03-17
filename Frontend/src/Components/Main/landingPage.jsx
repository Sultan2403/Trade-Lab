import {
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  CheckCircle2,
  FileText,
  HelpCircle,
  History,
  Layers,
  Plus,
  RefreshCw,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Upload,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const featureCards = [
  {
    icon: Zap,
    title: "Log Trades in Seconds",
    description:
      "Streamlined form with only essential fields. Keyboard-friendly. No friction.",
  },
  {
    icon: History,
    title: "Never Lose a Trade",
    description:
      "Searchable, filterable history with instant access to every position and your notes.",
  },
  {
    icon: BarChart3,
    title: "Know Your Edge",
    description:
      "Win rate, profit factor, equity curves, and performance breakdowns—calculated automatically.",
  },
  {
    icon: Brain,
    title: "Spot What's Working",
    description:
      "See performance by instrument, time of day, and strategy. Understand your behavioral patterns.",
  },
  {
    icon: Layers,
    title: "Separate Your Strategies",
    description:
      "Manage multiple accounts—live, demo, or different strategies—all in one place.",
  },
  {
    icon: Upload,
    title: "Import Historical Data",
    description:
      "Bulk upload past trades from CSV files. Start with a complete history.",
  },
];

const steps = [
  {
    icon: Plus,
    title: "Record Your Trade",
    description:
      "Enter instrument, direction, prices, and position size. Add optional notes for context.",
    image:
      "https://static.paraflowcontent.com/public/resource/image/e82201f7-ffb6-4a84-a53f-b8c6d9f93c6c.jpeg",
  },
  {
    icon: History,
    title: "Browse Your History",
    description:
      "Filter by date, instrument, or outcome. Click any trade for detailed review.",
    image:
      "https://static.paraflowcontent.com/public/resource/image/c9008b3d-fcf2-4135-9a26-4cefade235ba.jpeg",
  },
  {
    icon: TrendingUp,
    title: "Understand Performance",
    description:
      "View metrics, charts, and insights. Identify patterns. Improve systematically.",
    image:
      "https://static.paraflowcontent.com/public/resource/image/2bc08723-8714-4fed-b0e1-cd317e129ed9.jpeg",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-[#fdfcfb] text-text-primary">
      <header className="sticky top-0 z-50 border-b border-[#e0e3e5] bg-[#fdfcfb]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-brand-800 text-white">
              <TrendingUp size={16} />
            </div>
            <span className="text-lg font-semibold">TradeLog</span>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-text-secondary md:flex">
            <a href="#features" className="hover:text-brand-800">Features</a>
            <a href="#how-it-works" className="hover:text-brand-800">How It Works</a>
            <a href="#pricing" className="hover:text-brand-800">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden text-sm text-brand-800 hover:text-brand-900 sm:block">Sign In</Link>
            <Link to="/register" className="rounded bg-brand-800 px-4 py-2 text-sm text-white hover:bg-brand-900">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="px-4 py-20 md:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
            <div>
              <h1 className="mb-6 max-w-xl text-[2.6rem] font-semibold leading-tight md:text-headline">
                Transform Trading Activity Into Performance Insights
              </h1>
              <p className="mb-8 max-w-xl text-lg text-text-secondary">
                Professional-grade trade journaling and analytics for retail traders who want to improve through data, not guesswork.
              </p>

              <div className="mb-10 space-y-3 text-text-primary">
                {[
                  "Log trades in seconds",
                  "Instant performance analytics",
                  "Identify patterns that matter",
                ].map((line) => (
                  <div key={line} className="flex items-center gap-3">
                    <Zap size={16} className="text-state-success" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>

              <div className="mb-8 flex flex-wrap items-center gap-4">
                <Link to="/register" className="rounded bg-brand-800 px-6 py-3 text-white hover:bg-brand-900">
                  Start Journaling Free
                </Link>
                <a href="#how-it-works" className="inline-flex items-center gap-2 text-brand-800 hover:text-brand-900">
                  See How It Works <ArrowRight size={16} />
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-sm text-text-muted">
                <span>No credit card required</span>
                <span>Free forever</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck size={14} /> Secure &amp; private</span>
              </div>
            </div>

            <div className="rounded-lg border border-[#e0e3e5] bg-white p-1 shadow-xl lg:rotate-2">
              <img
                src="https://static.paraflowcontent.com/public/resource/image/981416ea-1a68-4b33-8ade-772f64d38276.jpeg"
                alt="TradeLog dashboard preview"
                className="h-full w-full rounded object-cover"
              />
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-20 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
            <div>
              <h2 className="mb-8 text-3xl font-semibold">Stop Repeating The Same Mistakes</h2>
              <div className="space-y-5">
                {[
                  [TrendingDown, "Abandoned spreadsheets", "Complex tracking gets abandoned when you need it most"],
                  [HelpCircle, "Unclear performance attribution", "Can't tell what's working or why you're losing money"],
                  [RefreshCw, "Repeated behavioral errors", "Same mistakes keep costing you profits"],
                  [FileText, "Broker statements lack context", "Raw data without the story behind each decision"],
                ].map(([Icon, title, description]) => (
                  <div key={title} className="flex gap-4">
                    <Icon size={18} className="mt-1 text-state-danger" />
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="text-text-secondary">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-8 text-3xl font-semibold">Start Learning From Your Data</h2>
              <div className="space-y-5">
                {[
                  "Every trade documented",
                  "Instant pattern recognition",
                  "Clear performance metrics",
                  "Build systematic edge",
                ].map((item) => (
                  <div key={item} className="flex gap-4">
                    <CheckCircle2 size={18} className="mt-1 text-state-success" />
                    <div>
                      <h3 className="font-semibold">{item}</h3>
                      <p className="text-text-secondary">Simple, fast logging keeps you consistent</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-12 text-center text-3xl font-semibold">Everything You Need To Trade Better</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featureCards.map(({ icon: Icon, title, description }) => (
                <article key={title} className="rounded-lg border border-[#e0e3e5] bg-white p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-[#d9eef2] text-brand-800">
                    <Icon size={20} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                  <p className="text-text-secondary">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-white px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-14 text-center text-3xl font-semibold">From Trade to Insight in Minutes</h2>
            <div className="grid gap-10 lg:grid-cols-3">
              {steps.map(({ icon: Icon, title, description, image }, index) => (
                <article key={title} className="text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-800 text-white">{index + 1}</div>
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded bg-[#d9eef2] text-brand-800">
                    <Icon size={22} />
                  </div>
                  <h3 className="mb-2 font-semibold">{title}</h3>
                  <p className="mb-4 text-text-secondary">{description}</p>
                  <img src={image} alt={title} className="mx-auto h-28 w-48 rounded border border-[#e0e3e5] object-cover" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-2 text-center text-3xl font-semibold">See Your Performance With Clarity</h2>
            <p className="mb-8 text-center text-lg text-text-secondary">Institutional-grade analytics without the complexity</p>
            <img
              src="https://static.paraflowcontent.com/public/resource/image/08baea7f-079a-467b-b3a3-abc97b15ca06.jpeg"
              alt="TradeLog performance analytics"
              className="w-full rounded-lg border border-[#e0e3e5] bg-white"
            />

            <div className="mt-8 flex flex-wrap justify-center gap-8 text-text-secondary">
              {[
                "Every metric calculated automatically",
                "Honest data, no sugarcoating",
                "Fast performance even with thousands of trades",
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-state-success" />{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-white px-4 py-20 md:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-semibold">Start Free, Upgrade When You're Ready</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-lg border-2 border-brand-800 bg-white p-8">
                <span className="mb-5 inline-block rounded bg-brand-800 px-4 py-1 text-sm font-semibold text-white">Free Forever</span>
                <h3 className="mb-6 text-3xl font-semibold">Get Started</h3>
                <ul className="mb-7 space-y-3 text-text-primary">
                  {["Unlimited trades", "All core analytics", "1 trading account", "CSV import", "Data export"].map((item) => (
                    <li key={item} className="flex items-center gap-3"><Check size={16} className="text-state-success" />{item}</li>
                  ))}
                </ul>
                <Link to="/register" className="block rounded bg-brand-800 px-6 py-3 text-center text-white hover:bg-brand-900">
                  Get Started Free
                </Link>
              </div>

              <div className="rounded-lg border border-[#e0e3e5] bg-[#f5f9fa] p-8 opacity-70">
                <span className="mb-5 inline-block rounded bg-text-muted px-4 py-1 text-sm font-semibold text-white">Coming Soon</span>
                <h3 className="mb-6 text-3xl font-semibold">Pro</h3>
                <ul className="mb-7 space-y-3 text-text-muted">
                  {["Multiple accounts", "Broker integrations", "Advanced analytics", "AI-powered insights"].map((item) => (
                    <li key={item} className="flex items-center gap-3"><Check size={16} />{item}</li>
                  ))}
                </ul>
                <p className="text-center text-lg text-text-muted">Pricing TBD</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-brand-800 px-4 py-20 text-white md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-semibold">Ready to Stop Guessing and Start Learning?</h2>
            <p className="mb-10 text-lg text-white/80">Join traders who are building their edge through data.</p>
            <Link to="/register" className="rounded bg-white px-8 py-4 font-semibold text-brand-800 hover:bg-surface-base">
              Start Journaling Free
            </Link>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-white/80">
              <span>No credit card required</span><span>•</span><span>Free forever</span><span>•</span><span>2 minute setup</span>
            </div>
          </div>
        </section>

        <footer className="border-t border-[#e0e3e5] bg-[#fdfcfb] px-4 py-12 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 grid gap-10 md:grid-cols-4">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-brand-800 text-white">
                    <TrendingUp size={16} />
                  </div>
                  <span className="font-semibold">TradeLog</span>
                </div>
                <p className="text-text-muted">Performance through clarity</p>
              </div>
              {[
                ["Product", ["Features", "How It Works", "Pricing", "Roadmap"]],
                ["Company", ["About", "Contact", "Blog", "Support"]],
                ["Legal", ["Privacy Policy", "Terms of Service", "Cookie Policy"]],
              ].map(([title, items]) => (
                <div key={title}>
                  <h4 className="mb-3 font-semibold">{title}</h4>
                  <div className="space-y-2 text-text-muted">
                    {items.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="border-t border-[#e0e3e5] pt-8 text-center text-sm text-text-muted">© 2025 TradeLog. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
