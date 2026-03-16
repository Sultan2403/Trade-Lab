import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Main from "./Components/Main/main";
import Login from "./Components/Auth/login";
import Register from "./Components/Auth/register";
import AddTrade from "./Components/Others/Trades/addTrade";
import TradesHistory from "./Components/Others/Trades/tradesHistory";
import TradeDetailPlaceholder from "./Components/Others/Trades/tradeDetailPlaceholder";
import ImportTrades from "./Components/Others/Trades/importTrades";
import Onboarding from "./Components/Onboarding/onboarding";
import AccountsPage from "./Components/Others/Accounts/accounts";
import SettingsLayout from "./Components/Others/Settings/settingsLayout";
import AccountManagementSettings from "./Components/Others/Settings/accountManagement";
import SettingsPlaceholder from "./Components/Others/Settings/settingsPlaceholder";
import { getAccountId } from "./Helpers/Accounts/accounts.helper";

const PlaceholderPage = ({ title }) => (
  <div className="rounded-panel border border-border bg-surface-card p-8 text-body text-text-secondary">
    {title} page UI is coming soon.
  </div>
);

function App() {
  const accountId = getAccountId();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/onboarding"
          element={accountId ? <Navigate to="/dashboard" replace /> : <Onboarding />}
        />

        <Route element={accountId ? <Main /> : <Navigate to="/onboarding" replace />}>
          <Route path="/add-trade" element={<AddTrade />} />
          <Route path="/import-trades" element={<ImportTrades />} />
          <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
          <Route path="/trades" element={<TradesHistory />} />
          <Route path="/trades/:tradeId" element={<TradeDetailPlaceholder />} />
          <Route path="/analytics" element={<PlaceholderPage title="Analytics" />} />

          <Route path="/settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="account-management" replace />} />
            <Route path="account-management" element={<AccountManagementSettings />} />
            <Route path="preferences" element={<SettingsPlaceholder title="Preferences" />} />
            <Route path="trading" element={<SettingsPlaceholder title="Trading" />} />
            <Route path="display" element={<SettingsPlaceholder title="Display" />} />
            <Route path="privacy" element={<SettingsPlaceholder title="Data & Privacy" />} />
            <Route path="notifications" element={<SettingsPlaceholder title="Notifications" />} />
          </Route>

          <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
          <Route path="/profile/accounts" element={<AccountsPage title="Profile" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
