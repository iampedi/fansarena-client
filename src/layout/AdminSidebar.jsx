"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import { useLocation, NavLink } from "react-router-dom";
import { SoccerBallIcon } from "@phosphor-icons/react";
import {
  ActivityIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CookieIcon,
  Gamepad2Icon,
  TrophyIcon,
} from "lucide-react";

// Navigation items with icons and submenu items
const navigationItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: ActivityIcon,
  },
  {
    title: "Clubs",
    url: "/admin/clubs",
    icon: Gamepad2Icon,
  },
  {
    title: "Competitions",
    url: "/admin/competitions",
    icon: TrophyIcon,
  },
  {
    title: "Settings",
    icon: CookieIcon,
    submenu: [
      { title: "Countries", url: "/admin/countries" },
      { title: "Cities", url: "/admin/cities" },
    ],
  },
];

export function AdminSidebar(props) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine initial open submenu (if current path matches any submenu)
  const [expandedMenu, setExpandedMenu] = React.useState(() => {
    const match = navigationItems.find((item) =>
      item.submenu?.some((sub) => currentPath.startsWith(sub.url)),
    );
    return match?.title || null;
  });

  // Sync expandedMenu with current path (handles browser Back/Forward and direct link)
  React.useEffect(() => {
    const match = navigationItems.find((item) =>
      item.submenu?.some((sub) => currentPath.startsWith(sub.url)),
    );
    setExpandedMenu(match?.title || null);
  }, [currentPath]);

  const toggleSubmenu = (title) => {
    setExpandedMenu(expandedMenu === title ? null : title);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-3">
        <div className="flex h-16 items-center gap-4 px-2">
          <div className="flex size-14">
            <img src="/images/fa-logo.svg" />
          </div>
          <div>
            <span className="text-lg font-bold uppercase">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <React.Fragment key={item.title}>
                  {/* Regular menu item */}
                  {!item.submenu && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className={cn("gap-3 py-6 text-base")}
                        isActive={currentPath.startsWith(item.url)}
                      >
                        <NavLink to={item.url}>
                          <item.icon style={{ width: 22, height: 22 }} />

                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  {/* Menu item with submenu */}
                  {item.submenu && (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => toggleSubmenu(item.title)}
                          className={cn(
                            "cursor-pointer gap-3 py-6 text-base",
                            expandedMenu === item.title &&
                              "bg-sidebar-accent text-sidebar-accent-foreground",
                          )}
                        >
                          <item.icon style={{ width: 22, height: 22 }} />
                          <span>{item.title}</span>
                          {expandedMenu === item.title ? (
                            <ChevronUpIcon
                              className="ml-auto"
                              style={{ width: 18, height: 18 }}
                            />
                          ) : (
                            <ChevronDownIcon
                              className="ml-auto"
                              style={{ width: 18, height: 18 }}
                            />
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {expandedMenu === item.title && (
                        <div className="pl-8">
                          {item.submenu.map((subItem) => (
                            <SidebarMenuItem key={subItem.url}>
                              <SidebarMenuButton
                                asChild
                                isActive={currentPath.startsWith(subItem.url)}
                                className={cn("py-5 text-base")}
                              >
                                <NavLink
                                  to={subItem.url}
                                  className="py-1.5"
                                  // استایل اکتیو اضافه کن اگر خواستی
                                >
                                  <span>{subItem.title}</span>
                                </NavLink>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </React.Fragment>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
