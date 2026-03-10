import { Outlet } from "react-router-dom";
import Nav from "../Navigation/nav";

export default function Main() {
  return (
    <div className="flex h-screen w-full bg-slate-50">
      <aside className="w-[20%] min-w-56 h-full overflow-y-auto">
        <Nav />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white p-4 shadow-sm">
          <h1 className="ml-2 text-2xl font-semibold text-slate-800">Trading Journal</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
