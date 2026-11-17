"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  ChevronsUpDown,
  CreditCard,
  FolderKanban,
  Flag,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Radio,
  Rocket,
  ScrollText,
  Settings,
  ShieldAlert,
  Users,
  Webhook,
  BarChart3,
  Orbit,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { currentUser, org } from "@/lib/data";
import { useStore } from "@/lib/store";
import { initials } from "@/lib/format";

const nav = [
  {
    label: "Build",
    items: [
      { title: "Home", href: "/", icon: LayoutDashboard },
      { title: "Apps", href: "/projects", icon: FolderKanban },
      { title: "Releases", href: "/deployments", icon: Rocket },
      { title: "Flags", href: "/flags", icon: Flag },
    ],
  },
  {
    label: "Run",
    items: [
      { title: "Uptime checks", href: "/monitors", icon: Activity },
      { title: "Incidents", href: "/incidents", icon: ShieldAlert, badgeKey: "incidents" as const },
      { title: "Log explorer", href: "/logs", icon: ScrollText },
      { title: "Billing usage", href: "/usage", icon: BarChart3 },
    ],
  },
  {
    label: "Manage",
    items: [
      { title: "People", href: "/team", icon: Users },
      { title: "Tokens", href: "/api-keys", icon: KeyRound },
      { title: "Webhooks", href: "/webhooks", icon: Webhook },
      { title: "Activity", href: "/audit-log", icon: Radio },
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useStore();
  const openIncidents = state.incidents.filter((i) => i.status !== "resolved").length;

  return (
    <Sidebar
      collapsible="icon"
      className="[--sidebar:#0b1220] [--sidebar-foreground:#cbd5e1] [--sidebar-accent:#1d2a44] [--sidebar-accent-foreground:#ffffff] [--sidebar-border:#1d2a44] [--sidebar-primary:#38bdf8]"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent" />}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Orbit className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{org.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{org.plan} plan</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" side="bottom" sideOffset={4}>
                <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Orbit /> Orbit Labs
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Orbit /> Orbit Labs — Staging
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Create organization</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {nav.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={item.title}
                        render={<Link href={item.href} />}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {"badgeKey" in item && openIncidents > 0 && (
                        <SidebarMenuBadge className="bg-destructive/10 text-destructive">{openIncidents}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Documentation" render={<a href="https://docs.orbit.dev" />}>
                  <BookOpen />
                  <span>Documentation</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Support" render={<a href="mailto:support@orbit.dev" />}>
                  <LifeBuoy />
                  <span>Support</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">{initials(currentUser.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{currentUser.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{currentUser.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" side="top" align="start" sideOffset={4}>
                <DropdownMenuLabel>{currentUser.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/settings" />}>
                  <Settings /> Account settings
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/settings?tab=billing" />}>
                  <CreditCard /> Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/login" />}>
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
