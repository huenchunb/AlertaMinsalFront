"use client"

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import useGetUserInfo from "@/components/hooks/get-user-info";
import useGetEmpleadoHook from "@/components/hooks/get-empleado";
import {AggressionDto, GetAggressionsQuery} from "@/features/api/types";
import {useGetAggressionsQuery} from "@/features/api";
import ChartEmployeDonut, {ChartDataEmployeeDonut} from "@/components/charts/chart-employe-donut";
import {round} from "@floating-ui/utils";
import {MessageSquareWarning} from "lucide-react";
import Link from "next/link";
import {Alert} from "@/components/ui/alert";

const DashboardJefatura = () => {
    const {userInfo} = useGetUserInfo()

    const email = userInfo && userInfo.email;

    const {user} = useGetEmpleadoHook({email})

    const body: GetAggressionsQuery = {
        pageSize: 100,
        pageNumber: 1,
    }

    if (user && user.establecimientoId) {
        body.establecimientoId = user.establecimientoId
    }

    const {data: aggressions} = useGetAggressionsQuery(body, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    })

    const transformToChartData = (aggressions: AggressionDto[]): ChartDataEmployeeDonut[] => {
        // Usamos reduce para contar las agresiones por tipo
        const counts = aggressions.reduce((acc, aggression) => {
            const tipoAgresion = aggression.tipoAgresion || "Desconocido"; // Usamos un valor por defecto si tipoAgresion es undefined
            acc[tipoAgresion] = (acc[tipoAgresion] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Convertimos el objeto resultante en un arreglo con el formato requerido
        return Object.entries(counts).map(([type, quantity]) => ({type, quantity}));
    };

    const chartData: ChartDataEmployeeDonut[] = transformToChartData(aggressions ? aggressions.items : []);

    const [averageAggression, setAverageAggression] = useState<{
        name: string,
        quantity: number
    }[] | undefined>(undefined);

    const [quantityFisicas, setQuantityFisicas] = useState<number>(0);

    useEffect(() => {
        if (aggressions) {
            setAverageAggression([
                {
                    name: "Física",
                    quantity: aggressions.items.filter(x => x.tipoAgresion === "Física").length / aggressions.items.length
                },
                {
                    name: "Verbal",
                    quantity: aggressions.items.filter(x => x.tipoAgresion === "Verbal").length / aggressions.items.length
                }
            ]);

            setQuantityFisicas(aggressions.items.filter(x => x.tipoAgresion === "Física").length);
        }
    }, [aggressions]);

    return (
        <Card className="mx-2">
            <CardHeader>
                <CardTitle className="text-xl">Bienvenido {user ? user.fullName : ""}</CardTitle>
                <CardDescription className="text-sm text-justify">Aquí encontrarás una visión general de tu
                    establecimiento, incluyendo estadísticas clave y gráficos de las agresiones reportadas. Esta
                    herramienta está diseñada para facilitar la toma de decisiones informadas y fortalecer la seguridad
                    laboral en tu institución. ¡Explora los datos y toma el control de la seguridad de tu
                    equipo!</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col x:flex-row gap-2 px-4">
                <Alert
                    className="bg-primary border border-amber-800 text-white font-bold flex gap-2 items-center">
                    <div>
                        <MessageSquareWarning size={20}/>
                    </div>
                    <span className="text-xs xl:text-base">Tienes {quantityFisicas} registros de agresiones pendientes de aprobación de los empleados del establecimiento. {" "}<Link
                        href={"/dashboard/agresiones"} className="underline">Revisar registros aquí</Link></span>
                </Alert>
                <div className="flex gap-2 mb-2">
                    {aggressions && averageAggression && averageAggression.map(e => (
                        <Card key={e.name} className="shadow-sm p-0">
                            <CardHeader>
                                <CardTitle>Promedio de agresiones {e.name}</CardTitle>
                                <CardDescription className="hidden xl:block">Este el promedio de agresiones {e.name} en
                                    base al total de agresiones
                                    registradas</CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-center items-center">
                                <span className="text-xl font-bold">{round(e.quantity * 100) + "%"}</span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {chartData && <ChartEmployeDonut data={chartData}/>}
            </CardContent>
        </Card>
    );
};

export default DashboardJefatura;