import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="h-full border-r border-slate-200 bg-white p-4">
      <h2 className="mb-6 text-lg font-semibold text-slate-800">Trade Lab</h2>
      <ul className="space-y-2 text-slate-600">
        <li>
          <NavLink
            to="/dashboard"
            className="block rounded-md px-3 py-2 hover:bg-slate-100"
          >
            Dashboard
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
