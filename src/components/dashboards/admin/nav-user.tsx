"use client";

import {LogOut, MenuIcon} from "lucide-react";

import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,} from "@/components/ui/sidebar";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";
import {useGetUserByEmailQuery, useGetUserInfoQuery} from "@/features/api";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {setLogout} from "@/features/auth/slice";

export function NavUser() {
    const dispatch = useAppDispatch();
    const {data} = useGetUserInfoQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true
    });
    const {roles} = useAppSelector(state => state.auth)
    const {isMobile} = useSidebar();
    const router = useRouter();
    const {data: dataUser} = useGetUserByEmailQuery(data?.email ?? "", {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true
    })

    const handleClick = async () => {
        Cookies.remove('accessToken', {path: '/'});
        dispatch(setLogout())
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
                                            className="rounded-lg uppercase">{dataUser ? dataUser.fullName.substring(0, 2) : data.email.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span
                                            className="truncate font-semibold capitalize">{dataUser ? dataUser.fullName : roles[0]}</span>
                                        <span className="truncate text-xs lowercase">{data.email}</span>
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
