import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";

export default function SidebarItem({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: LucideIcon; // Lucide icon component
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium 
        transition-colors select-none
        ${isActive
          ? "bg-blue-600 text-white shadow-sm"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}
        `
      }
    >
      {Icon && <Icon size={18} />}
      {label}
    </NavLink>
  );
}
