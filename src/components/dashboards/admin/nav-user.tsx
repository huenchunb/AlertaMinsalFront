"use client";

import {LogOut, MenuIcon} from "lucide-react";

import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,} from "@/components/ui/sidebar";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";
import {useGetUserInfoQuery} from "@/features/api";
import {useAppSelector} from "@/store/hooks";

export function NavUser() {
    const {data} = useGetUserInfoQuery();
    const {roles} = useAppSelector(state => state.auth)
    const {isMobile} = useSidebar();
    const router = useRouter();
    const handleClick = async () => {
        Cookies.remove('accessToken', {path: '/'});
        router.push("/login");
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            {data && (
                                <>
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarFallback
                                            className="rounded-lg uppercase">{data.email.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{roles[0]}</span>
                                        <span className="truncate text-xs">{data.email}</span>
                                    </div>
                                </>
                            )}
                            <MenuIcon className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuItem onClick={handleClick}>
                            <LogOut/>
                            Cerrar sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
