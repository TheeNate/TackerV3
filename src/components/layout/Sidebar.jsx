// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 min-h-screen p-4">
      <nav className="space-y-2">
        <NavLink to="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-200">
          Dashboard
        </NavLink>
        <NavLink to="/ndt-entries" className="block px-3 py-2 rounded hover:bg-gray-200">
          NDT Entries
        </NavLink>
        <NavLink to="/rope-entries" className="block px-3 py-2 rounded hover:bg-gray-200">
          Rope Entries
        </NavLink>
        {/* add more links as needed */}
      </nav>
    </aside>
  );
}
