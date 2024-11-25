"use client";

import * as React from "react";
import {
  ClipboardList,
  Frame,
  Hospital,
  Map,
  PieChart,
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

const dataJefatura = {
    navMain: [
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
        <SidebarMenu className="text-center">
          <Link href={"/dashboard"} className="flex justify-center">
            <Image
              src="/img/logo-minsal.png"
              alt="logo"
              width={160}
              height={60}
            />
          </Link>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {isAdministrator && <NavMain items={data.navMain} />}
        {isJefatura && <NavMain items={dataJefatura.navMain} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
