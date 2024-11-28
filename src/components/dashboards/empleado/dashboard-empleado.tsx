import React from 'react';
import Link from "next/link";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import useGetUserInfo from "@/components/hooks/get-user-info";
import useGetEmpleadoHook from "@/components/hooks/get-empleado";
import {useGetAggressionsQuery} from "@/features/api";
import {AggressionDto, GetAggressionsQuery} from "@/features/api/types";
import ChartEmployeDonut, {ChartDataEmployeeDonut} from "@/components/charts/chart-employe-donut";
import {Alert} from "@/components/ui/alert";
import {MessageSquareWarning} from "lucide-react"
import Image from "next/image";

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
            <div className="flex flex-col gap-2 w-full">
                {user && (
                    <Card className="rounded-xl shadow-sm">
                        <CardHeader className="pb-0">
                            <CardTitle className="xl:text-2xl">
                                Bienvenida {" "}
                                <span className="capitalize">{user.fullName}</span>
                            </CardTitle>
                            <CardDescription className="mb-4 text-xs xl:text-base">
                                Aquí podrás revisar y gestionar todas las agresiones de las cuales has sido víctima
                                y podrás
                                aceptar o rechazar estas agresiones si no estas de acuerdo con la información
                                ingresada.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col xl:flex-row justify-between p-4 gap-2">
                            <div className="flex flex-col w-full h-max order-2">
                                <Alert
                                    className="bg-primary border border-amber-800 text-white font-bold flex gap-2 items-center">
                                    <div>
                                        <MessageSquareWarning size={20}/>
                                    </div>
                                    <span className="text-xs xl:text-base">
                                                Tienes {approvedAggressions.length} registros de
                                                agresiones pendientes de aprobación. {" "}
                                        <Link href={"/dashboard/agresiones"} className="underline">Revisar registros aquí</Link>
                                            </span>
                                </Alert>
                                <div className="mt-2 xl:p-6">
                                    <h1 className="text-xl xl:text-2xl uppercase font-black">¡Alza la Voz, Protege tu
                                        Trabajo!️</h1>
                                    <section className="mt-2">
                                        <h2 className="text-sm xl:text-xl uppercase font-bold">Tu Seguridad
                                            Importa</h2>
                                        <p className="text-xs xl:text-base text-justify">
                                            Cada día, cientos de profesionales de la salud enfrentan agresiones en su
                                            lugar de trabajo. Estas situaciones no solo afectan tu bienestar físico y
                                            emocional, sino que también ponen en riesgo la calidad de atención que
                                            brindas.
                                            ¡Es momento de actuar! Tu reporte puede marcar la diferencia para construir
                                            un entorno más seguro.
                                        </p>
                                    </section>
                                    <section className="mt-2 mb-2">
                                        <h2 className="text-sm xl:text-xl uppercase font-bold">Haz la Diferencia
                                            Hoy</h2>
                                        <p className="text-xs xl:text-base text-justify">
                                            ¡No estás solo! Cada denuncia fortalece el sistema de salud y promueve un
                                            espacio laboral seguro para todos.
                                            No permitas que el miedo silencie tu voz. Denuncia cualquier agresión y
                                            ayuda a construir un entorno laboral donde todos puedan desempeñar su labor
                                            con tranquilidad.
                                        </p>
                                        <p className="text-xs xl:text-base text-justify mt-1 italic">
                                            Recuerda: al reportar, estás protegiendo no solo tu seguridad, sino también
                                            la de tus colegas y pacientes.
                                        </p>
                                    </section>
                                </div>
                            </div>
                            <div className="flex order-1 mb-2">
                                <ChartEmployeDonut data={chartData}/>
                            </div>
                        </CardContent>
                    </Card>
                )}
                <Card
                    className="border-none shadow-none p-4">
                    <CardContent className="flex flex-col xl:grid xl:grid-cols-2 items-center gap-4 p-0">
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardEmpleado;