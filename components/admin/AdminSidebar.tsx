"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck2,
  BedDouble,
  CircleDollarSign,
  Calendar,
  PartyPopper,
  Users,
  User,
  CreditCard,
  Tag,
  ImageIcon,
  Settings,
  BarChart3,
  Bell,
  LogOut,
  ChevronDown,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";
import { useToast } from "./ToastContext";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  hasChevron?: boolean;
  submenu?: { title: string; href: string }[];
}

interface NavSection {
  sectionTitle: string;
  items: NavItem[];
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
  const [adminUser, setAdminUser] = useState<{
    name: string;
    username: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (d?.user) setAdminUser(d.user);
      })
      .catch(() => {});
  }, []);

  const initials = adminUser?.name
    ? adminUser.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "VR";

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(() => {
    if (pathname.includes("/admin/rooms") || pathname.includes("/admin/availability")) return "Rooms & Inventory";
    if (pathname.includes("/admin/pricing")) return "Pricing & Rates";
    if (pathname.includes("/admin/customers")) return "Customers & CRM";
    if (pathname.includes("/admin/payments") || pathname.includes("/admin/refunds")) return "Payments & Refunds";
    return null;
  });

  const navSections: NavSection[] = [
    {
      sectionTitle: "MAIN",
      items: [
        {
          title: "Dashboard",
          href: "/admin/dashboard",
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
        {
          title: "Reservations",
          href: "/admin/bookings",
          icon: <CalendarCheck2 className="w-4 h-4" />,
        },
      ],
    },
    {
      sectionTitle: "HOTEL MANAGEMENT",
      items: [
        {
          title: "Rooms & Inventory",
          href: "/admin/rooms",
          icon: <BedDouble className="w-4 h-4" />,
          hasChevron: true,
          submenu: [
            { title: "Physical Rooms (101-412)", href: "/admin/rooms" },
            { title: "Room Categories", href: "/admin/rooms/types" },
          ],
        },
        {
          title: "Pricing & Rates",
          href: "/admin/pricing",
          icon: <CircleDollarSign className="w-4 h-4" />,
          hasChevron: true,
          submenu: [
            { title: "Base & Weekend Rates", href: "/admin/pricing" },
            { title: "Seasonal & Peak Surge", href: "/admin/pricing/seasonal" },
          ],
        },
        {
          title: "Availability Calendar",
          href: "/admin/availability",
          icon: <Calendar className="w-4 h-4" />,
        },
        {
          title: "Banquets & Events",
          href: "/admin/banquet",
          icon: <PartyPopper className="w-4 h-4" />,
        },
        {
          title: "Staff Management",
          href: "/admin/staff",
          icon: <Users className="w-4 h-4" />,
        },
      ],
    },
    {
      sectionTitle: "CUSTOMER",
      items: [
        {
          title: "Customers & CRM",
          href: "/admin/customers",
          icon: <User className="w-4 h-4" />,
          hasChevron: true,
        },
        {
          title: "Payments & Refunds",
          href: "/admin/payments",
          icon: <CreditCard className="w-4 h-4" />,
          hasChevron: true,
          submenu: [
            { title: "Transactions Ledger", href: "/admin/payments" },
            { title: "Refund Processing", href: "/admin/refunds" },
          ],
        },
        {
          title: "Offers & Coupons",
          href: "/admin/offers",
          icon: <Tag className="w-4 h-4" />,
        },
      ],
    },
    {
      sectionTitle: "CONTENT",
      items: [
        {
          title: "Gallery & Media",
          href: "/admin/content/gallery",
          icon: <ImageIcon className="w-4 h-4" />,
        },
        {
          title: "Hotel Settings",
          href: "/admin/settings",
          icon: <Settings className="w-4 h-4" />,
        },
      ],
    },
    {
      sectionTitle: "BUSINESS",
      items: [
        {
          title: "Reports & Analytics",
          href: "/admin/reports",
          icon: <BarChart3 className="w-4 h-4" />,
        },
        {
          title: "Notifications",
          href: "/admin/notifications",
          icon: <Bell className="w-4 h-4" />,
        },
      ],
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
    <div className="flex flex-col h-full bg-[#0A1118] text-[#D1D5DB] select-none border-r border-[#15202B]">
      {/* Brand Crest Header */}
      <div className="pt-6 pb-5 px-5 text-center relative border-b border-[#15202B]/60">
        <Link href="/admin/dashboard" className="block group">
          <div className="font-serif tracking-[0.22em] text-[15px] font-bold text-[#D8B875] uppercase group-hover:text-white transition-colors">
            Hotel Reliance
          </div>
          <div className="text-[9px] uppercase tracking-[0.28em] text-[#C4984F]/80 font-medium mt-1">
            Control Center
          </div>
          <div className="flex items-center justify-center space-x-2 mt-3 text-[#C4984F]/50">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#C4984F]/50" />
            <span className="text-[8px]">◇</span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#C4984F]/50" />
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Scrollable Area with Section Titles */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 custom-scrollbar">
        {navSections.map((section) => (
          <div key={section.sectionTitle} className="space-y-1">
            <div className="px-3 pt-1 pb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#C4984F]/70">
              {section.sectionTitle}
            </div>
            {section.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.submenu && item.submenu.some((sub) => pathname === sub.href));
              const isSubmenuOpen = openSubmenu === item.title;

              return (
                <div key={item.title} className="space-y-0.5">
                  {item.submenu ? (
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#182635] text-[#D8B875] font-semibold shadow-xs"
                          : "text-[#9CA3AF] hover:bg-[#121E2B] hover:text-[#E5E7EB]"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={isActive ? "text-[#D8B875]" : "text-[#9CA3AF]"}>
                          {item.icon}
                        </span>
                        <span className="text-[12px]">{item.title}</span>
                      </div>
                      {isSubmenuOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-white/40" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? "bg-[#182635] text-[#D8B875] font-semibold shadow-xs"
                          : "text-[#9CA3AF] hover:bg-[#121E2B] hover:text-[#E5E7EB]"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={isActive ? "text-[#D8B875]" : "text-[#9CA3AF]"}>
                          {item.icon}
                        </span>
                        <span className="text-[12px]">{item.title}</span>
                      </div>
                      {item.hasChevron && (
                        <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                      )}
                    </Link>
                  )}

                  {/* Submenu Dropdown */}
                  {item.submenu && isSubmenuOpen && (
                    <div className="pl-9 pr-2 py-1 space-y-1 border-l border-[#1F2D3D] ml-4 my-1">
                      {item.submenu.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-2.5 py-1.5 rounded text-[11px] font-medium transition-colors ${
                              isSubActive
                                ? "text-[#D8B875] font-bold bg-[#182635]"
                                : "text-[#9CA3AF] hover:text-white hover:bg-[#121E2B]"
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
          </div>
        ))}
      </nav>

      {/* User Footer Profile Card */}
      <div className="p-3.5 border-t border-[#15202B] bg-[#070D14]">
        <div className="flex items-center justify-between">
          <Link href="/admin/profile" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-[#8C6527] border border-[#D8B875]/40 flex items-center justify-center text-white font-serif font-bold text-xs shadow-inner">
              {initials}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">{adminUser?.name || "Vikramaditya Roy (GM)"}</div>
              <div className="text-[9px] text-[#C4984F] tracking-widest uppercase font-bold">{adminUser?.role || "SUPER ADMIN"}</div>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="flex items-center space-x-1 p-1.5 text-white/50 hover:text-rose-400 hover:bg-rose-950/30 rounded-md transition-colors text-[11px] cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[10px]">Logout</span>
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
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
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
