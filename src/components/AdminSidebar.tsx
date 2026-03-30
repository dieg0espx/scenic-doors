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
  CircleUser,
  CalendarDays,
  Tag,
} from "lucide-react";

const baseNavItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Quotes", href: "/admin/quotes", icon: FileText },
  { label: "Leads", href: "/admin/leads", icon: UserPlus },
  { label: "Orders", href: "/admin/orders", icon: Package },
  { label: "Calendar", href: "/admin/calendar", icon: CalendarDays },
  { label: "Discounts", href: "/admin/discounts", icon: Tag, adminOnly: true },
  { label: "Marketing", href: "/admin/marketing", icon: BarChart3, adminOnly: true },
  { label: "Users", href: "/admin/users", icon: Users, adminOnly: true },
  { label: "Notifications", href: "/admin/notifications", icon: Bell, adminOnly: true },
  { label: "My Account", href: "/admin/account", icon: CircleUser, nonAdminOnly: true },
];

export default function AdminSidebar({
  currentUser,
}: {
  currentUser: { id: string; name: string; role: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isAdmin = currentUser.role === "admin";
  const navItems = baseNavItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.nonAdminOnly && isAdmin) return false;
    return true;
  });

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
      <div className="px-5 py-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/images/scenic-doors-dark-logo.avif"
            alt="Scenic Doors"
            width={140}
            height={38}
            className="h-7 w-auto brightness-0 invert"
          />
        </Link>
        <button
          onClick={() => setOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User info + role badge */}
      <div className="px-5 mb-2 flex items-center gap-2.5">
        <p className="text-sm font-medium text-white/70 truncate">{currentUser.name}</p>
        {isAdmin ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/[0.08] border border-amber-500/15">
            <Shield className="w-3 h-3 text-amber-400/70" />
            <span className="text-[10px] font-medium text-amber-400/70 uppercase tracking-wider">Admin</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-500/[0.08] border border-teal-500/15">
            <CircleUser className="w-3 h-3 text-teal-400/70" />
            <span className="text-[10px] font-medium text-teal-400/70 uppercase tracking-wider">Sales</span>
          </span>
        )}
      </div>

      <div className="px-4 mb-1">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <nav className="flex-1 px-3 py-1 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-amber-500/15 to-amber-500/5 text-amber-400"
                  : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-400" : ""}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mb-1">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="px-3 py-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] font-medium text-white/35 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[70] bg-[#0a0f1a] border-b border-white/[0.08] px-4 py-3 flex items-center gap-3 safe-area-top">
        <button
          onClick={() => setOpen(true)}
          className="p-2.5 -ml-1 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Image
          src="/images/scenic-doors-dark-logo.avif"
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
      <aside className="hidden md:flex w-[272px] h-screen bg-[#0a0f1a] border-r border-white/[0.06] flex-col shrink-0 sticky top-0">
        {navContent}
      </aside>
    </>
  );
}
