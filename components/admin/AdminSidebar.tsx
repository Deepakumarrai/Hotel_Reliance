"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck2,
  BedDouble,
  CircleDollarSign,
  CalendarDays,
  Users,
  CreditCard,
  UtensilsCrossed,
  PartyPopper,
  Sparkles,
  Globe,
  UserCog,
  Bell,
  BarChart3,
  ShieldCheck,
  Settings,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Hotel,
} from "lucide-react";
import { useToast } from "./ToastContext";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  submenu?: { title: string; href: string }[];
}

export function AdminSidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(() => {
    if (pathname.includes("/admin/bookings")) return "Reservations";
    if (pathname.includes("/admin/rooms")) return "Rooms & Suites";
    if (pathname.includes("/admin/pricing")) return "Pricing & Rates";
    if (pathname.includes("/admin/restaurant")) return "Restaurant";
    if (pathname.includes("/admin/banquet")) return "Banquets & Events";
    if (pathname.includes("/admin/content")) return "Website CMS";
    return null;
  });

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      title: "Reservations",
      href: "/admin/bookings",
      icon: <CalendarCheck2 className="w-4 h-4" />,
      submenu: [
        { title: "All Bookings", href: "/admin/bookings" },
        { title: "Today's Arrivals", href: "/admin/bookings?filter=arrivals" },
        { title: "Today's Departures", href: "/admin/bookings?filter=departures" },
      ],
    },
    {
      title: "Rooms & Inventory",
      href: "/admin/rooms",
      icon: <BedDouble className="w-4 h-4" />,
      submenu: [
        { title: "Physical Rooms (101-412)", href: "/admin/rooms" },
        { title: "Room Categories", href: "/admin/rooms/types" },
      ],
    },
    {
      title: "Pricing & Rates",
      href: "/admin/pricing",
      icon: <CircleDollarSign className="w-4 h-4" />,
      submenu: [
        { title: "Tariff Configurator", href: "/admin/pricing" },
        { title: "Seasonal & Peak Surge", href: "/admin/pricing/seasonal" },
      ],
    },
    {
      title: "Availability Calendar",
      href: "/admin/availability",
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      title: "Customers & CRM",
      href: "/admin/customers",
      icon: <Users className="w-4 h-4" />,
    },
    {
      title: "Payments & Refunds",
      href: "/admin/payments",
      icon: <CreditCard className="w-4 h-4" />,
      submenu: [
        { title: "Transactions Ledger", href: "/admin/payments" },
        { title: "Refund Processing", href: "/admin/refunds" },
      ],
    },
    {
      title: "Restaurant",
      href: "/admin/restaurant",
      icon: <UtensilsCrossed className="w-4 h-4" />,
      submenu: [
        { title: "Kwality Menu & Prices", href: "/admin/restaurant" },
        { title: "Table Enquiries", href: "/admin/restaurant/enquiries" },
      ],
    },
    {
      title: "Banquets & Events",
      href: "/admin/banquet",
      icon: <PartyPopper className="w-4 h-4" />,
      submenu: [
        { title: "Venues & Lawns", href: "/admin/banquet" },
        { title: "Quotation Pipeline", href: "/admin/banquet/enquiries" },
      ],
    },
    {
      title: "Offers & Coupons",
      href: "/admin/offers",
      icon: <Sparkles className="w-4 h-4" />,
      submenu: [
        { title: "Promotions", href: "/admin/offers" },
        { title: "Promo Coupons", href: "/admin/coupons" },
      ],
    },
    {
      title: "Website CMS",
      href: "/admin/content",
      icon: <Globe className="w-4 h-4" />,
      submenu: [
        { title: "Overview", href: "/admin/content" },
        { title: "Homepage Hero", href: "/admin/content/home" },
        { title: "About Section", href: "/admin/content/about" },
        { title: "Facilities", href: "/admin/content/facilities" },
        { title: "Photo Gallery", href: "/admin/content/gallery" },
        { title: "Local Places", href: "/admin/content/places" },
      ],
    },
    {
      title: "Staff Management",
      href: "/admin/staff",
      icon: <UserCog className="w-4 h-4" />,
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
      icon: <Bell className="w-4 h-4" />,
    },
    {
      title: "Reports & Analytics",
      href: "/admin/reports",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      title: "Security & Audit",
      href: "/admin/security",
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      title: "Hotel Settings",
      href: "/admin/settings",
      icon: <Settings className="w-4 h-4" />,
    },
    {
      title: "Admin Profile",
      href: "/admin/profile",
      icon: <User className="w-4 h-4" />,
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      showToast("Signed out successfully", "info");
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu((prev) => (prev === title ? null : title));
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#0B1423] text-white select-none border-r border-[#1B2A42]">
      {/* Hotel Crest & Brand Header */}
      <div className="p-5 border-b border-[#1B2A42] flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#9E712E] to-[#C4984F] flex items-center justify-center text-white shadow-md border border-[#D8B875]/40">
            <Hotel className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif tracking-wider text-base font-bold text-[#D8B875] uppercase">
              Hotel Reliance
            </div>
            <div className="text-[9px] uppercase tracking-widest text-[#E9DFD2]/60 font-medium">
              Admin Control Panel
            </div>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-white/70 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Scrollable Area */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.submenu && item.submenu.some((sub) => pathname === sub.href));
          const isSubmenuOpen = openSubmenu === item.title;

          return (
            <div key={item.title} className="space-y-1">
              {item.submenu ? (
                <button
                  onClick={() => toggleSubmenu(item.title)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs tracking-wide font-medium transition-all ${
                    isActive
                      ? "bg-[#111E31] text-[#D8B875] border-l-2 border-[#C4984F] shadow-sm font-semibold"
                      : "text-[#E9DFD2]/80 hover:bg-[#111E31]/70 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isActive ? "text-[#C4984F]" : "text-[#D8B875]/70"}>
                      {item.icon}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  {isSubmenuOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-white/50" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-md text-xs tracking-wide font-medium transition-all ${
                    pathname === item.href
                      ? "bg-[#111E31] text-[#D8B875] border-l-2 border-[#C4984F] shadow-sm font-semibold"
                      : "text-[#E9DFD2]/80 hover:bg-[#111E31]/70 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={pathname === item.href ? "text-[#C4984F]" : "text-[#D8B875]/70"}>
                      {item.icon}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] bg-[#9E712E] text-white rounded font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}

              {/* Submenu Dropdown */}
              {item.submenu && isSubmenuOpen && (
                <div className="pl-9 pr-2 py-1 space-y-1 border-l border-[#1B2A42] ml-4 my-1">
                  {item.submenu.map((sub) => {
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.title}
                        href={sub.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-2.5 py-1.5 rounded text-[11px] font-medium transition-colors ${
                          isSubActive
                            ? "text-[#C4984F] font-bold bg-[#1B2A42]/60"
                            : "text-[#E9DFD2]/60 hover:text-white hover:bg-[#111E31]"
                        }`}
                      >
                        {sub.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Footer & Sign Out */}
      <div className="p-4 border-t border-[#1B2A42] bg-[#070D17]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1B2A42] border border-[#C4984F]/40 flex items-center justify-center text-[#D8B875] font-serif font-bold text-xs">
              VR
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">Vikramaditya Roy</div>
              <div className="text-[9px] text-[#C4984F] tracking-widest uppercase">Super Admin</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-white/60 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 flex-shrink-0 z-30 shadow-xl">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
