"use client"

import * as React from "react"
import {ClipboardList, Frame, Hospital, Map, PieChart, Siren, Users} from "lucide-react"

import {NavMain} from "@/components/dashboards/admin//nav-main"
//import {NavProjects} from "@/components/dashboards/admin/nav-projects"
import {NavUser} from "@/components/dashboards/admin/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link";

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
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
                    title: "Administrar",
                    url: "#",
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
                    title: "Administrar",
                    url: "/dashboard/empleados",
                },
            ],
        },
        {
            title: "Agresiones",
            url: "/dashboard/agresiones",
            icon: ClipboardList,
            items: [
                {
                    title: "Crear",
                    url: "/dashboard/agresiones/crear",
                },
            ],
        }
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
}

export function SidenavAdmin({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={"/dashboard"}>
                                <div
                                    className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Siren className="size-4"/>
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">ALERTA MINSAL</span>
                                    <span className="">v1.0.0</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
                {/*<NavProjects projects={data.projects}/>*/}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
