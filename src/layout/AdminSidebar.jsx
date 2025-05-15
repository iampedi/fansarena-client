"use client";

import * as React from "react";
import {
  BarChart2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Cog,
  FolderKanban,
  GalleryVerticalEnd,
  Home,
  ListTodo,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import { useLocation, NavLink, Link } from "react-router-dom";

// Navigation items with icons and submenu items
const navigationItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Clubs",
    url: "/admin/clubs",
    icon: FolderKanban,
  },
  {
    title: "Settings",
    icon: ListTodo,
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

  const toggleSubmenu = (title) => {
    setExpandedMenu(expandedMenu === title ? null : title);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Company Name</span>
            <span className="text-sidebar-foreground/70 text-xs">
              Admin Panel
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <React.Fragment key={item.title}>
                  {/* Regular menu item */}
                  {!item.submenu && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={currentPath.startsWith(item.url)}
                      >
                        <NavLink to={item.url}>
                          <item.icon className="size-4" />
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
                            expandedMenu === item.title &&
                              "bg-sidebar-accent text-sidebar-accent-foreground",
                          )}
                        >
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          {expandedMenu === item.title ? (
                            <ChevronDown className="ml-auto size-4" />
                          ) : (
                            <ChevronRight className="ml-auto size-4" />
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {expandedMenu === item.title && (
                        <div className="py-1 pl-8">
                          {item.submenu.map((subItem) => (
                            <SidebarMenuItem key={subItem.title}>
                              <SidebarMenuButton
                                asChild
                                isActive={currentPath.startsWith(subItem.url)}
                              >
                                <Link to={subItem.url} className="py-1.5">
                                  <span>{subItem.title}</span>
                                </Link>
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
