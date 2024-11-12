"use client";

import {ColumnDef} from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import {EmpleadoDto} from "@/features/api/types";

export const columns: ColumnDef<EmpleadoDto>[] = [
    {
        accessorKey: "rutNormalized",
        header: "RUN",
    },
    {
        accessorKey: "email",
        header: "Correo electrónico",
    },
    {
        accessorKey: "establecimiento",
        header: "Establecimiento",
    },
    {
        id: "actions",
        header: () => {
            return <div className="sr-only">Acciones</div>
        },
        cell: ({row}) => {
            const employment: EmpleadoDto = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(employment.rutNormalized as string)}
                        >
                            Copiar RUN
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>Ver empleado</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]