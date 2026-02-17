"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  UserPlus,
  Package,
  BarChart3,
  Users,
  Bell,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Quotes", href: "/admin/quotes", icon: FileText },
  { label: "Leads", href: "/admin/leads", icon: UserPlus },
  { label: "Orders", href: "/admin/orders", icon: Package },
  { label: "Marketing", href: "/admin/marketing", icon: BarChart3 },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const navContent = (
    <>
      <div className="px-5 py-6 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif"
            alt="Scenic Doors"
            width={140}
            height={38}
            className="h-8 w-auto brightness-0 invert"
          />
        </Link>
        <button
          onClick={() => setOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role badge */}
      <div className="px-5 mb-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/[0.08] border border-amber-500/15">
          <Shield className="w-3.5 h-3.5 text-amber-400/70" />
          <span className="text-[11px] font-medium text-amber-400/70 uppercase tracking-wider">Role: admin</span>
        </div>
      </div>

      <div className="px-4 mb-2">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-xl text-sm md:text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-amber-500/15 to-amber-500/5 text-amber-400 shadow-sm"
                  : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isActive ? "bg-amber-500/15" : "bg-white/[0.04]"
              }`}>
                <Icon className="w-[18px] h-[18px]" />
              </div>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mb-2">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-3 md:py-2.5 rounded-xl text-sm md:text-[13px] font-medium text-white/35 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
            <LogOut className="w-[18px] h-[18px]" />
          </div>
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a0f1a]/95 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 flex items-center gap-3 safe-area-top">
        <button
          onClick={() => setOpen(true)}
          className="p-2.5 -ml-1 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Image
          src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif"
          alt="Scenic Doors"
          width={120}
          height={32}
          className="h-7 w-auto brightness-0 invert"
        />
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-[272px] bg-[#0a0f1a] flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[272px] min-h-screen bg-[#0a0f1a] border-r border-white/[0.06] flex-col shrink-0">
        {navContent}
      </aside>
    </>
  );
}
