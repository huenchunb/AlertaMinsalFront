"use client";

import React from 'react';
import {ChevronsUpDown, FileText} from "lucide-react";
import {Button} from "@/components/ui/button";
import {CollapsibleTrigger} from "@/components/ui/collapsible";
import {AggressionDto} from "@/features/api/types";
import {Spinner} from "@/components/ui/spinner";

interface AggressionCardProps {
    isAdministrator: boolean;
    isEmpleado: boolean;
    aggression: AggressionDto;
    handleApproveAggression: (id: number, estado:number) => Promise<void>;
    isLoading: boolean;
}

const AggressionCard = ({
                            isAdministrator,
                            isEmpleado,
                            aggression,
                            handleApproveAggression,
                            isLoading
                        }: AggressionCardProps) => {

    return (
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
            <div className="flex flex-col xl:flex-row w-full xl:w-5/6 justify-between items-center">
                <div className="flex items-center justify-center xl:justify-start  gap-2 w-full xl:w-2/5">
                    <FileText className="p-2 border rounded" size={33}/>
                    <div>
                        <h1 className="font-bold capitalize">{aggression.empleado.fullName}</h1>
                        <p className="text-gray-500 text-xs">
                                                            <span className="capitalize">
                                                                Agresión {aggression.tipoAgresion}
                                                            </span>
                        </p>
                    </div>
                </div>
                {aggression.estadoAgresion === "Ingresada" && (
                    <div className="flex w-full justify-center xl:justify-start items-center xl:w-1/4 gap-2 p-4">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <p className="text-gray-400">Pendiente de aprobación</p>
                    </div>
                )}
                {aggression.estadoAgresion === "Aprobada" && (
                    <div className="flex w-full justify-center xl:justify-start items-center xl:w-1/4 gap-2 p-4">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <p className="text-gray-400">Aprobada</p>
                    </div>
                )}
                {aggression.estadoAgresion === "Rechazada" && (
                    <div className="flex w-full justify-center xl:justify-start items-center xl:w-1/4 gap-2 p-4">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <p className="text-gray-400">Rechazada</p>
                    </div>
                )}
                <div className="flex flex-col items-center w-full xl:w-1/5">
                    <p className="text-xs text-gray-400">Fecha del incidente</p>
                    <p className="text-sm capitalize">{aggression.fechaAgresionNormalizada}</p>
                </div>
                {isAdministrator && (
                    <>
                        <div className="flex flex-col justify-center w-1/5">
                            <p className="text-xs text-gray-400">Creado por </p>
                            <p className="text-xs text-gray-400">{aggression.creadoPor}</p>
                            <p className="text-sm capitalize">{aggression.fechaCreacionNormalizada}</p>
                        </div>
                        <div className="flex flex-col justify-center w-1/5">
                            <p className="text-xs text-gray-400">Última actualización por</p>
                            <p className="text-xs text-gray-400">{aggression.actualizadoPor}</p>
                            <p className="text-sm capitalize">{aggression.fechaActualizacionNormalizada}</p>
                        </div>
                    </>
                )}
            </div>
            {(isAdministrator || isEmpleado) && (
                <div className="flex grow gap-2 items-center">
                    <Button
                        onClick={() => handleApproveAggression(aggression.agresionId, 2)}
                        disabled={aggression.estadoAgresion === "Rechazada" || aggression.estadoAgresion === "Aprobada"}
                    >
                        {isLoading ? <Spinner size={20}/> : "Aprobar"}
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => handleApproveAggression(aggression.agresionId, 3)}
                        disabled={aggression.estadoAgresion === "Rechazada" || aggression.estadoAgresion === "Aprobada"}
                    >
                        {isLoading ? <Spinner size={20}/> : "Rechazar"}
                    </Button>
                </div>
            )}
            <div className="p-4">
                <CollapsibleTrigger asChild>
                    <Button variant="secondary" size="sm">
                        <ChevronsUpDown className="h-4 w-4"/>
                        <span className="sr-only">Ver detalle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
        </div>
    );
};

export default AggressionCard;