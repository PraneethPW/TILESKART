import { LogOut, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useStore } from "../store";

const navItems = [
  { label: "Marketplace", to: "/marketplace" },
  { label: "AI Studio", to: "/ai-studio" },
  { label: "Dashboard", to: "/dashboard" }
];

export function Layout() {
  const { user, cart, setUser } = useStore();
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-stone-950">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/25 bg-stone-950/82 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-black tracking-tight">
            <span className="grid size-10 place-items-center rounded bg-amber-400 text-stone-950 shadow-[0_0_30px_rgba(251,191,36,.55)]">TK</span>
            <span className="text-xl">TilesKart</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-white/80 md:flex">
            {navItems.map((item) => (
              <NavLink className={({ isActive }) => (isActive ? "text-amber-300" : "hover:text-white")} key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="icon-button md:hidden" onClick={() => setMobileNav((value) => !value)} aria-label="Open menu">
              {mobileNav ? <X size={19} /> : <Menu size={19} />}
            </button>
            <Link className="icon-button relative" to="/cart" aria-label="Open cart">
              <ShoppingBag size={19} />
              {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </Link>
            {user ? (
              <button className="nav-pill" onClick={() => setUser(null)}>
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <Link className="nav-pill" to="/login">
                <UserRound size={16} />
                Login
              </Link>
            )}
          </div>
        </div>

        {mobileNav && (
          <div className="grid gap-3 border-t border-white/10 px-4 py-4 text-sm font-semibold md:hidden">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setMobileNav(false)}>
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <Outlet />
    </div>
  );
}
