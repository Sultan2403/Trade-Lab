import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Main from "./Components/Main/main";
import Login from "./Components/Auth/login";
import Register from "./Components/Auth/register";
import AddTrade from "./Components/Others/Trades/addTrade";
import TradesHistory from "./Components/Others/Trades/tradesHistory";
import TradeDetailPlaceholder from "./Components/Others/Trades/tradeDetailPlaceholder";

const PlaceholderPage = ({ title }) => (
  <div className="rounded-panel border border-border bg-surface-card p-8 text-body text-text-secondary">
    {title} page UI is coming soon.
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Main />}>
          <Route path="/add-trade" element={<AddTrade />} />
          <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
          <Route path="/trades" element={<TradesHistory />} />
          <Route path="/trades/:tradeId" element={<TradeDetailPlaceholder />} />
          <Route path="/analytics" element={<PlaceholderPage title="Analytics" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
          <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
