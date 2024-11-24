"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {api, useApproveAggressionMutation, useGetAggressionsQuery} from "@/features/api";
import {Separator} from "@radix-ui/react-separator";
import React, {useState} from "react";
import {ChevronsUpDown, CircleCheckBig, CircleX, FileText, Users} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Button} from "@/components/ui/button";
import {ApproveAggressionCommand} from "@/features/api/types";
import {toast} from "@/hooks/use-toast";
import {Alert} from "@/components/ui/alert";
import {useAppDispatch} from "@/store/hooks";

const AgresionesPage = () => {
    const dispatch = useAppDispatch();
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 15;

    const handleNextPage = () => {
        if (data && data.hasNextPage) {
            setPageNumber((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (data && data.hasPreviousPage) {
            setPageNumber((prev) => prev - 1);
        }
    };

    const {data} = useGetAggressionsQuery(
        {pageNumber, pageSize},
        {
            refetchOnFocus: true,
            refetchOnReconnect: true,
            refetchOnMountOrArgChange: true,
        }
    );

    const [approveAggression] = useApproveAggressionMutation();

    const handleApproveAggression = async (id: number) => {
        const approveAggressionCommand: ApproveAggressionCommand = {
            id
        }
        await approveAggression(approveAggressionCommand)
            .unwrap()
            .then(() => {
                toast({
                    description: (
                        <Alert className="border border-green-600 bg-green-100 w-full">
                            <div className="flex start">
                                <CircleCheckBig size={20} className="text-green-800"/>
                                <p className="text-green-800 ml-2">
                                    El incidente se ha aprobado éxitosamente
                                </p>
                            </div>
                        </Alert>
                    ),
                });
            })
            .catch(() => {
                toast({
                    title: "Ha ocurrido un error",
                    description: (
                        <Alert className="border border-red-600 bg-red-100">
                            <div className="flex start">
                                <p className="text-red-800 mr-2">No se pudo aprobar el incidente. Intente nuevamente, si
                                    el problema persiste contacté al administrador.
                                </p> <CircleX size={20} className="text-red-800"/>
                            </div>
                        </Alert>
                    ),
                });
            })
            .finally(() => {
                dispatch(api.util.invalidateTags(['Aggressions']))
            })
    }

    return (
        <div className="px-4">
            <Card className="rounded-3xl shadow-sm border-0 p-4">
                <CardHeader>
                    <CardTitle>Agresiones</CardTitle>
                    <CardDescription>
                        Aquí puedes visualizar el listado completo de las agresiones
                        registradas en el sistema con facilidad, además podrás ver
                        información más detallada de cada una.
                    </CardDescription>
                </CardHeader>
                <Separator/>
                <CardContent>
                    {data && (
                        <>
                            {data.items.length != 0 && data.items.map(aggression => (
                                <Card key={aggression.agresionId} className="shadow-none border p-2 mb-2">
                                    <Collapsible>
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex w-5/6 justify-between items-center">
                                                <div className="flex items-center gap-2 w-2/5">
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
                                                {aggression.estadoAgresion == "Ingresada" ? (
                                                    <div className="flex items-center w-1/4 gap-2 ">
                                                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                                        <p className="text-gray-400">Pendiente de aprobación</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center w-1/4 gap-2 ">
                                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                        <p className="text-gray-400">Aprobada</p>
                                                    </div>
                                                )}
                                                <div className="flex flex-col justify-center w-1/5">
                                                    <p className="text-xs text-gray-400">Fecha del incidente</p>
                                                    <p className="text-sm capitalize">{aggression.fechaAgresionNormalizada}</p>
                                                </div>
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
                                            </div>
                                            <div className="flex grow items-center">
                                                <Button
                                                    onClick={() => handleApproveAggression(aggression.agresionId)}
                                                    disabled={aggression.estadoAgresion === "Aprobada"}
                                                >
                                                    Aprobar
                                                </Button>
                                            </div>
                                            <div className="p-4">
                                                <CollapsibleTrigger asChild>
                                                    <Button variant="secondary" size="sm">
                                                        <ChevronsUpDown className="h-4 w-4"/>
                                                        <span className="sr-only">Ver detalle</span>
                                                    </Button>
                                                </CollapsibleTrigger>
                                            </div>
                                        </div>
                                        <CollapsibleContent>
                                            <Card className="shadow-none rounded-none p-4 mb-2 shadow-sm">
                                                {aggression.categoriasAgresion.length != 0 && (
                                                    <div className="flex gap-4 mb-2">
                                                        {aggression.categoriasAgresion.map((categoria) => (
                                                            <div key={categoria}
                                                                 className="rounded-full px-2 text-sm  bg-primary text-background">{categoria}</div>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex gap-2">
                                                        <Users size={20}/><h1 className="font-bold">Agresores</h1>
                                                    </div>
                                                    {aggression.agresores.length != 0 ? aggression.agresores.map((agresor, index) => (
                                                        <Card key={agresor.id}
                                                              className="flex-col gap-4 shadow-sm rounded-none">
                                                            <h2 className="font-bold text-sm p-2">Agresor {index + 1}</h2>
                                                            <hr/>
                                                            <div className="flex gap-2 p-2">
                                                                <div className="flex gap-2 text-sm"><span
                                                                    className="font-bold">Rut:</span>
                                                                    <span>{agresor.rutNormalized ?? "Sin información"}</span>
                                                                </div>

                                                                <div className="flex gap-2 text-sm"><span
                                                                    className="font-bold">Nombre</span>
                                                                    <span>{agresor.name ?? "Sin información"}</span>
                                                                </div>
                                                                <div className="flex gap-2 text-sm"><span
                                                                    className="font-bold">Dirección:</span>
                                                                    <span>{agresor.direccion ?? "Sin información"}</span>
                                                                </div>

                                                                <div className="flex gap-2 text-sm"><span
                                                                    className="font-bold">Comuna:</span>
                                                                    <span>{agresor.comuna ?? "Sin información"}</span>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    )) : (<p className="text-sm">
                                                        No hay testigos registrados en este incidente
                                                    </p>)}
                                                </div>
                                            </Card>
                                            <Card className="shadow-none rounded-none p-4 mb-2 shadow-sm">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex gap-2">
                                                        <Users size={20}/><h1 className="font-bold">Testigos</h1>
                                                    </div>
                                                    {aggression.testigos.length != 0 ? aggression.testigos.map((testigo, index) => (
                                                        <Card key={testigo.id}
                                                              className="flex-col gap-4 shadow-sm rounded-none">
                                                            <h2 className="font-bold text-sm p-2">Agresor {index + 1}</h2>
                                                            <hr/>
                                                            <div className="flex gap-2 p-2">
                                                                <div className="flex gap-2 text-sm">
                                                                    <span className="font-bold">Rut:</span>
                                                                    <span>{testigo.rutNormalized ?? "Sin información"}</span>
                                                                </div>

                                                                <div className="flex gap-2 text-sm">
                                                                    <span className="font-bold">Nombre completo</span>
                                                                    <span>{testigo.fullName ?? "Sin información"}</span>
                                                                </div>
                                                                <div className="flex gap-2 text-sm">
                                                                    <span
                                                                        className="font-bold">Correo electrónico:</span>
                                                                    <span>{testigo.email ?? "Sin información"}</span>
                                                                </div>

                                                                <div className="flex gap-2 text-sm">
                                                                    <span className="font-bold">Teléfono:</span>
                                                                    <span>{testigo.phoneNumber ?? "Sin información"}</span>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    )) : (<p className="text-sm">
                                                        No hay testigos registrados en este incidente
                                                    </p>)}
                                                </div>
                                            </Card>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </Card>
                            ))}
                            <div className="flex gap-4 justify-end">
                                <Button
                                    onClick={() => handlePreviousPage()}
                                    disabled={!data.hasPreviousPage}
                                    variant="secondary">Anterior</Button>
                                <Button
                                    onClick={() => handleNextPage()}
                                    disabled={!data.hasNextPage}
                                    variant="secondary">Siguiente</Button>
                            </div>
                        </>
                    )}

                </CardContent>
            </Card>
        </div>
    );
};

export default AgresionesPage;
