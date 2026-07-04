import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Search,
  FileText,
  ClipboardList,
  Settings,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/setup", icon: Settings, label: "Hesap Kurulum" },
  { to: "/products", icon: Package, label: "Ürünler" },
  { to: "/research", icon: Search, label: "Araştırma" },
  { to: "/content", icon: FileText, label: "İçerik Üret" },
  { to: "/orders", icon: ClipboardList, label: "Siparişler" },
];

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-dubai-navy text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-dubai-gold" />
            <div>
              <h1 className="font-bold text-sm leading-tight">Dubai E-Ticaret</h1>
              <p className="text-xs text-white/60">Amazon.ae & noon.com</p>
            </div>
          </div>
        </div>

        {/* Platform durumu */}
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Platformlar</p>
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-xs bg-amazon-orange/20 text-amazon-orange px-2 py-1 rounded">
              Amazon.ae
            </span>
            <span className="flex items-center gap-1 text-xs bg-noon-yellow/20 text-noon-yellow px-2 py-1 rounded">
              noon UAE
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Alt bilgi */}
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/40 text-center">
            Marketplace: A2VIGQ35RCS4UG
          </p>
        </div>
      </aside>

      {/* Ana içerik */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
