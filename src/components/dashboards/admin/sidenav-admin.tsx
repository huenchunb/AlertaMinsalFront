"use client";

import * as React from "react";
import {
  ClipboardList,
  Frame,
  Hospital,
  Map,
  PieChart,
  Siren,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/dashboards/admin//nav-main";
//import {NavProjects} from "@/components/dashboards/admin/nav-projects"
import { NavUser } from "@/components/dashboards/admin/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";

// This is sample data.
const data = {
  user: {
    name: "Administrador",
    email: "adminitrador@localhost.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Establecimientos",
      url: "#",
      icon: Hospital,
      isActive: true,
      items: [
        {
          title: "Ver listado",
          url: "/dashboard/establecimientos",
        },
        {
          title: "Crear",
          url: "/dashboard/establecimientos/crear",
        },
      ],
    },
    {
      title: "Empleados",
      url: "#",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "Ver listado",
          url: "/dashboard/empleados",
        },
        {
          title: "Crear",
          url: "/dashboard/empleados/crear",
        },
      ],
    },
    {
      title: "Agresiones",
      url: "/dashboard/agresiones",
      icon: ClipboardList,
      items: [
        {
          title: "Ver listado",
          url: "/dashboard/agresiones",
        },
        {
          title: "Reportar agresión",
          url: "/dashboard/agresiones/crear",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function SidenavAdmin({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { isAdministrator, isJefatura } = useAppSelector((state) => state.auth);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="bg-white" asChild>
              <Link href={"/dashboard"}>
                <Image
                  src="/img/logo-minsal.png"
                  alt="logo"
                  width={100}
                  height={70}
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {isAdministrator && <NavMain items={data.navMain} />}
        {isJefatura && <div>Menu de navegación jefatura</div>}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
