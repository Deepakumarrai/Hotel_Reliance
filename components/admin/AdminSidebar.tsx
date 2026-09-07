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

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(() => {
    if (pathname.includes("/admin/rooms") || pathname.includes("/admin/availability")) return "Rooms & Inventory";
    if (pathname.includes("/admin/pricing")) return "Pricing & Rates";
    if (pathname.includes("/admin/banquet")) return "Banquets & Events";
    if (pathname.includes("/admin/customers")) return "Customers & CRM";
    if (pathname.includes("/admin/payments") || pathname.includes("/admin/refunds")) return "Payments & Refunds";
    return "Rooms & Inventory";
  });

  useEffect(() => {
    if (pathname.includes("/admin/rooms") || pathname.includes("/admin/availability")) setOpenSubmenu("Rooms & Inventory");
    else if (pathname.includes("/admin/pricing")) setOpenSubmenu("Pricing & Rates");
    else if (pathname.includes("/admin/banquet")) setOpenSubmenu("Banquets & Events");
    else if (pathname.includes("/admin/customers")) setOpenSubmenu("Customers & CRM");
    else if (pathname.includes("/admin/payments") || pathname.includes("/admin/refunds")) setOpenSubmenu("Payments & Refunds");
  }, [pathname]);

  const navSections: NavSection[] = [
    {
      sectionTitle: "MAIN",
      items: [
        {
          title: "Dashboard",
          href: "/admin/dashboard",
          icon: <LayoutDashboard className="w-[18px] h-[18px] text-[#D8B77A]" />,
        },
        {
          title: "Reservations",
          href: "/admin/bookings",
          icon: <CalendarCheck2 className="w-[18px] h-[18px] text-[#D8B77A]" />,
          hasChevron: true,
        },
      ],
    },
    {
      sectionTitle: "HOTEL MANAGEMENT",
      items: [
        {
          title: "Rooms & Inventory",
          href: "/admin/rooms",
          icon: <BedDouble className="w-[18px] h-[18px] text-[#D8B77A]" />,
          hasChevron: true,
          submenu: [
            { title: "Room Categories", href: "/admin/rooms/types" },
            { title: "Physical Rooms (101-412)", href: "/admin/rooms" },
            { title: "Availability Calendar", href: "/admin/availability" },
          ],
        },
        {
          title: "Pricing & Rates",
          href: "/admin/pricing",
          icon: <CircleDollarSign className="w-[18px] h-[18px] text-[#D8B77A]" />,
          hasChevron: true,
          submenu: [
            { title: "Base & Weekend Rates", href: "/admin/pricing" },
            { title: "Seasonal & Peak Surge", href: "/admin/pricing/seasonal" },
          ],
        },
        {
          title: "Banquets & Events",
          href: "/admin/banquet",
          icon: <PartyPopper className="w-[18px] h-[18px] text-[#D8B77A]" />,
          hasChevron: true,
          submenu: [
            { title: "Venues & Event Management", href: "/admin/banquet" },
            { title: "Event Inquiries", href: "/admin/banquet/enquiries" },
            { title: "Event Calendar", href: "/admin/banquet/calendar" },
          ],
        },
        {
          title: "Staff Management",
          href: "/admin/staff",
          icon: <Users className="w-[18px] h-[18px] text-[#D8B77A]" />,
        },
      ],
    },
    {
      sectionTitle: "CUSTOMER",
      items: [
        {
          title: "Customers & CRM",
          href: "/admin/customers",
          icon: <User className="w-[18px] h-[18px] text-[#D8B77A]" />,
          hasChevron: true,
        },
        {
          title: "Payments & Refunds",
          href: "/admin/payments",
          icon: <CreditCard className="w-[18px] h-[18px] text-[#D8B77A]" />,
          hasChevron: true,
          submenu: [
            { title: "Transactions Ledger", href: "/admin/payments" },
            { title: "Refund Processing", href: "/admin/refunds" },
          ],
        },
        {
          title: "Offers & Coupons",
          href: "/admin/offers",
          icon: <Tag className="w-[18px] h-[18px] text-[#D8B77A]" />,
          hasChevron: true,
        },
      ],
    },
    {
      sectionTitle: "CONTENT",
      items: [
        {
          title: "Gallery & Media",
          href: "/admin/content/gallery",
          icon: <ImageIcon className="w-[18px] h-[18px] text-[#D8B77A]" />,
        },
        {
          title: "Hotel Settings",
          href: "/admin/settings",
          icon: <Settings className="w-[18px] h-[18px] text-[#D8B77A]" />,
        },
      ],
    },
    {
      sectionTitle: "BUSINESS",
      items: [
        {
          title: "Reports & Analytics",
          href: "/admin/reports",
          icon: <BarChart3 className="w-[18px] h-[18px] text-[#D8B77A]" />,
        },
        {
          title: "Notifications",
          href: "/admin/notifications",
          icon: <Bell className="w-[18px] h-[18px] text-[#D8B77A]" />,
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
    <div className="flex flex-col h-full bg-[#0E1418] text-[#D1D5DB] select-none border-r border-[#1B252E]">
      {/* Brand Crest Header */}
      <div className="pt-6 pb-4 px-5 text-center relative border-b border-[#1B252E]/80">
        <Link href="/admin/dashboard" className="block group">
          <div className="font-serif tracking-[0.22em] text-[16px] font-bold text-[#E5BE76] uppercase group-hover:text-white transition-colors">
            HOTEL RELIANCE
          </div>
          <div className="text-[9.5px] uppercase tracking-[0.32em] text-[#B8893E] font-semibold mt-1">
            CONTROL CENTER
          </div>
          <div className="flex items-center justify-center space-x-2 mt-2.5 text-[#B8893E]">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#B8893E]/60" />
            <span className="text-[8px]">◇</span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#B8893E]/60" />
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
            <div className="px-3 pt-1 pb-1 text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#C69A55]">
              {section.sectionTitle}
            </div>
            {section.items.map((item) => {
              const isSectionActive =
                pathname === item.href ||
                (item.submenu && item.submenu.some((sub) => pathname === sub.href));
              const isSubmenuOpen = openSubmenu === item.title;

              return (
                <div key={item.title} className="space-y-0.5">
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isSectionActive
                            ? "bg-[#252822]/90 text-[#F5E6CC] font-semibold border-l-[3px] border-l-[#D8B77A] shadow-xs"
                            : "text-[#C4BCB1] hover:bg-[#161E26] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span>{item.icon}</span>
                          <span className="text-[12.5px] font-medium">{item.title}</span>
                        </div>
                        {isSubmenuOpen ? (
                          <ChevronDown className="w-3.5 h-3.5 text-[#D8B77A]" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-[#B8893E]/60" />
                        )}
                      </button>

                      {/* Submenu Dropdown Items with Connector Line */}
                      {isSubmenuOpen && (
                        <div className="relative pl-6 pr-1 py-1 space-y-1 mt-1">
                          {/* Vertical Connector Line */}
                          <div className="absolute left-4 top-1 bottom-1 w-[1px] bg-[#B8893E]/25" />

                          {item.submenu.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.title}
                                href={sub.href}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-3 py-1.5 rounded-lg text-[11.5px] transition-all relative ${
                                  isSubActive
                                    ? "bg-[#282721] text-[#E6C687] font-semibold border border-[#B8893E]/35 shadow-2xs"
                                    : "text-[#A89F91] hover:text-white hover:bg-[#161E26]"
                                }`}
                              >
                                {sub.title}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        pathname === item.href
                          ? "bg-[#252822]/90 text-[#F5E6CC] font-semibold border-l-[3px] border-l-[#D8B77A]"
                          : "text-[#C4BCB1] hover:bg-[#161E26] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span>{item.icon}</span>
                        <span className="text-[12.5px] font-medium">{item.title}</span>
                      </div>
                      {item.hasChevron && (
                        <ChevronRight className="w-3.5 h-3.5 text-[#B8893E]/60" />
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Footer Profile Card */}
      <div className="p-3.5 border-t border-[#1B252E] bg-[#0A0F13]">
        <div className="flex items-center justify-between">
          <Link href="/admin/profile" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
            <div className="w-8.5 h-8.5 rounded-full bg-[#A97A32] border border-[#D8B77A]/50 flex items-center justify-center text-white font-serif font-bold text-xs shadow-inner flex-shrink-0">
              VR
            </div>
            <div className="overflow-hidden">
              <div className="text-[12px] font-bold text-white truncate">Vikramaditya Roy (GM)</div>
              <div className="text-[9.5px] text-[#D8B77A] tracking-wider uppercase font-semibold">SUPER_ADMIN</div>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="flex items-center space-x-1.5 px-2 py-1 text-[#C69A55] hover:text-[#E5B869] hover:bg-white/5 rounded-md transition-colors text-[11px] font-medium cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left, Width ~280px) */}
      <aside className="hidden lg:block w-[280px] h-screen sticky top-0 flex-shrink-0 z-30 shadow-xl">
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
