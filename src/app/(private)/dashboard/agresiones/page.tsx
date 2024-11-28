"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {api, useApproveAggressionMutation, useGetAggressionsQuery} from "@/features/api";
import {Separator} from "@radix-ui/react-separator";
import React, {useState} from "react";
import {CircleCheckBig, CircleX, Users} from "lucide-react";
import {Collapsible, CollapsibleContent} from "@/components/ui/collapsible";
import {Button} from "@/components/ui/button";
import {ApproveAggressionCommand, GetAggressionsQuery} from "@/features/api/types";
import useGetUserInfo from "@/components/hooks/get-user-info";
import useGetEmpleadoHook from "@/components/hooks/get-empleado";
import useGetUserRoleHook from "@/components/hooks/get-user-role";
import AggressionCard from "@/components/dashboards/cards/aggression-card";
import {toast} from "@/hooks/use-toast";
import {Alert} from "@/components/ui/alert";
import {useAppDispatch} from "@/store/hooks";

const AgresionesPage = () => {
    const dispatch = useAppDispatch();
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 15;

    const [loadingId, setLoadingId] = useState<number | null>(null); // Trackea el ID del botón en carga

    const {roles} = useGetUserRoleHook();

    const {userInfo} = useGetUserInfo();

    const email = userInfo && userInfo.email;

    const {user, errorUser} = useGetEmpleadoHook({email});

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

    const body: GetAggressionsQuery = {
        pageSize: pageSize,
        pageNumber: pageNumber,
    }

    if (!errorUser && user && user.establecimientoId && roles && roles.includes("Jefatura")) {
        body.establecimientoId = user.establecimientoId;
    }

    if (!errorUser && user && user.id && roles && roles.includes("Empleado")) {
        body.empleadoId = user.id;
    }

    const {data} = useGetAggressionsQuery(
        body,
        {
            refetchOnFocus: true,
            refetchOnReconnect: true,
            refetchOnMountOrArgChange: true,
            pollingInterval: 0
        }
    );

    const [approveAggression] = useApproveAggressionMutation();

    const handleApproveAggression = async (id: number) => {
        setLoadingId(id);
        const approveAggressionCommand: ApproveAggressionCommand = {
            id
        }
        await approveAggression(approveAggressionCommand)
            .unwrap()
            .then(() => {
                dispatch(api.util.invalidateTags(["Aggressions"]));
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
            .finally(() => setLoadingId(null));
    }

    return (
        <>
            {(roles || userInfo || user || data) && (
                <div className="px-4 w-full max-w-screen scroll-auto h-screen">
                    <Card className="rounded-3xl shadow-sm border-0 mb-4">
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
                                        <Card key={aggression.agresionId} className="shadow-sm p-2 mb-2">
                                            <Collapsible>
                                                <AggressionCard
                                                    isAdministrator={!!(roles && roles.includes("Administrator"))}
                                                    isEmpleado={!!(roles && roles.includes("Empleado"))}
                                                    aggression={aggression}
                                                    handleApproveAggression={handleApproveAggression}
                                                    isLoading={loadingId === aggression.agresionId}
                                                />
                                                <CollapsibleContent>
                                                    <Card className="rounded-none p-4 mb-2 shadow-sm">
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
                                                                <Users size={20}/><h1
                                                                className="font-bold">Agresores</h1>
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
                                                    <Card className="rounded-none p-4 mb-2 shadow-sm">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex gap-2">
                                                                <Users size={20}/><h1
                                                                className="font-bold">Testigos</h1>
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
                                                                            <span
                                                                                className="font-bold">Nombre completo</span>
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
            )}
        </>

    );
};

export default AgresionesPage;
