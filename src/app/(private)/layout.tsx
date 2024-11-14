"use client";

import React, {ReactNode} from "react";
import {SidenavAdmin} from "@/components/dashboards/admin/sidenav-admin";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {useAppSelector} from "@/store/hooks";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {usePathname} from "next/navigation";

export default function LayoutDashboard({
                                            children,
                                        }: Readonly<{
    children: ReactNode;
}>) {
    const {isAdministrator} = useAppSelector((state) => state.auth);
    const pathname = usePathname();

    // Divide el pathname en segmentos
    const segments = pathname.split("/").filter(Boolean);

    return (
        <SidebarProvider>
            {isAdministrator && <SidenavAdmin/>}
            <SidebarInset>
                <header
                    className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator orientation="vertical" className="mr-2 h-4"/>
                        <Breadcrumb>
                            <BreadcrumbList>
                                {segments.map((segment, index) => {
                                    const href = `/${segments.slice(0, index + 1).join("/")}`;
                                    const isLast = index === segments.length - 1;

                                    return (
                                        <React.Fragment key={href}>
                                            <BreadcrumbItem>
                                                {!isLast ? (
                                                    <BreadcrumbLink href={href}>
                                                        {segment.charAt(0).toUpperCase() + segment.slice(1)}
                                                    </BreadcrumbLink>
                                                ) : (
                                                    <span>
                                                        {segment.charAt(0).toUpperCase() + segment.slice(1)}
                                                    </span>
                                                )}
                                            </BreadcrumbItem>
                                            {!isLast && <BreadcrumbSeparator/>}
                                        </React.Fragment>
                                    );
                                })}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
