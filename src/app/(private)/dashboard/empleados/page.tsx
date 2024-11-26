"use client";

import React, {useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {DataTableEmployee} from "@/components/datatables/datatable-employee";
import {useGetEmpleadosQuery, useGetUserByEmailQuery, useGetUserInfoQuery} from "@/features/api";
import {GetEmpleadoQuery} from "@/features/api/types";
import {useAppSelector} from "@/store/hooks";

const EmpleadosPage = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 15;

    const {isAdministrator, isJefatura} = useAppSelector(state => state.auth)

    const {data: userInfo} = useGetUserInfoQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true
    });

    const {data: user, error: errorUser} = useGetUserByEmailQuery(userInfo?.email ?? "",
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true
        })

    const handleNextPage = () => {
        if (data && data.hasNextPage) {
            // Puedes usar 'hasMore' o cualquier lógica que determine si hay más páginas
            setPageNumber((prev) => prev + 1);
        }
    };


    const handlePreviousPage = () => {
        if (data && data.hasPreviousPage) {
            setPageNumber((prev) => prev - 1);
        }
    };


    const body: GetEmpleadoQuery = {
        pageSize: pageSize,
        pageNumber: pageNumber,
    }

    if (!errorUser && user && user.establecimientoId) {
        body.establecimientoId = user.establecimientoId;
    }

    const {data} = useGetEmpleadosQuery(
        body,
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true
        }
    );

    const handleRenderEstablishment = () => {
        return (
            <div className="p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Empleados</CardTitle>
                        <CardDescription>
                            {isAdministrator && (
                                <span>
                                    Aquí puedes visualizar el listado completo de los empleados de los
                            establecimientos de salud registrados en el sistema con facilidad,
                            además podrás ver información más detallada de cada uno.
                                </span>
                            )}
                            {isJefatura && (
                                <span>
                                    Aquí puedes visualizar el listado completo de los empleados del establecimiento {user?.establecimiento}
                                </span>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <Separator/>
                    <CardContent>
                        {data && (
                            <DataTableEmployee
                                data={data.items}
                                handlePrevious={handlePreviousPage}
                                handleNextPage={handleNextPage}
                                hasPreviousPage={data.hasPreviousPage}
                                hasNextPage={data.hasNextPage}
                                pageSize={pageSize}
                                totalCounts={data.totalCount}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    };

    return <>{handleRenderEstablishment()}</>;
};

export default EmpleadosPage;
