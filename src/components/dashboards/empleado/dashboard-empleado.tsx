import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import useGetUserInfo from "@/components/hooks/get-user-info";
import useGetEmpleadoHook from "@/components/hooks/get-empleado";
import {useGetAggressionsQuery} from "@/features/api";
import {AggressionDto, GetAggressionsQuery} from "@/features/api/types";
import ChartEmployeDonut, {ChartDataEmployeeDonut} from "@/components/charts/chart-employe-donut";
import {Alert} from "@/components/ui/alert";
import {MessageSquareWarning} from "lucide-react"

const DashboardEmpleado = () => {
    const {userInfo} = useGetUserInfo()

    const email = userInfo && userInfo.email;

    const {user} = useGetEmpleadoHook({email})

    const body: GetAggressionsQuery = {
        pageSize: 100,
        pageNumber: 1,
    }

    if (user && user.id) {
        body.empleadoId = user.id
    }

    const {data: aggressions} = useGetAggressionsQuery(body, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    })

    const approvedAggressions = aggressions ? aggressions.items.filter(x => x.estadoAgresion === "Ingresada") : [];

    const transformToChartData = (aggressions: AggressionDto[]): ChartDataEmployeeDonut[] => {
        // Usamos reduce para contar las agresiones por tipo
        const counts = aggressions.reduce((acc, aggression) => {
            debugger;
            const tipoAgresion = aggression.tipoAgresion || "Desconocido"; // Usamos un valor por defecto si tipoAgresion es undefined
            acc[tipoAgresion] = (acc[tipoAgresion] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Convertimos el objeto resultante en un arreglo con el formato requerido
        return Object.entries(counts).map(([type, quantity]) => ({type, quantity}));
    };

    const chartData: ChartDataEmployeeDonut[] = transformToChartData(aggressions ? aggressions.items : []);

    return (
        <div className="flex flex-col gap-2 mx-2">
            <div className="flex gap-2">
                <div className="flex flex-col gap-2 w-full">
                    {user && (
                        <Card className="bg-white rounded-xl shadow-sm">
                            <CardHeader>
                                <Card className="flex gap-6 w-full border-none shadow-none rounded-none p-4">
                                    <Link href={""}>
                                        <Image src={"/img/info/web.png"} alt={"web"} width={660} height={220}/>
                                    </Link>
                                    <Link href={""}>
                                        <Image src={"/img/info/guias-alimentarias.png"} alt={"web"} width={660}
                                               height={220}/>
                                    </Link>
                                    <Link href={""}>
                                        <Image src={"/img/info/cuidados-paliativos.png"} alt={"web"} width={660}
                                               height={220}/>
                                    </Link>
                                    <Link href={""}>
                                        <Image src={"/img/info/campana-verano.png"} alt={"web"} width={660}
                                               height={220}/>
                                    </Link>
                                    <Link href={""}>
                                        <Image src={"/img/info/campana-sanitaria.png"} alt={"web"} width={660}
                                               height={220}/>
                                    </Link>
                                </Card>
                            </CardHeader>
                            <CardContent>
                                <CardTitle>
                                    Bienvenida {" "}
                                    <span className="capitalize">{user.fullName}</span>
                                </CardTitle>
                                <CardDescription className="mb-4">
                                    Aquí podrás revisar y gestionar todas las agresiones de las cuales has sido víctima
                                    y podrás
                                    aceptar o rechazar estas agresiones si no estas de acuerdo con la información
                                    ingresada.
                                </CardDescription>
                                <div className="flex">
                                    <div className="flex w-full h-max">
                                        <Alert
                                            className="bg-primary border border-amber-800 text-white font-bold flex gap-2 items-center">
                                            <div>
                                                <MessageSquareWarning size={20}/>
                                            </div>
                                            <span>
                                                Tienes {approvedAggressions.length} registros de
                                                agresiones pendientes de aprobación. {" "}
                                                <Link href={"/dashboard/agresiones"} className="underline">Revisar registros aquí</Link>
                                            </span>
                                        </Alert>
                                    </div>
                                    <div className="flex">
                                        <ChartEmployeDonut data={chartData}/>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardEmpleado;