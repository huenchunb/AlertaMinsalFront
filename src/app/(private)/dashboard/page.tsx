"use client";

import React from "react";
import {useDashboardHook} from "@/components/hooks/get-roles";
import {Map} from "@/components/dashboards/maps/Map";
import ChartAggressionTypeByDate from "@/components/charts/chart-aggression-type-by-date";
import ChartAggressionByCategory from "@/components/charts/chart-aggression-by-category";
import {Card} from "@/components/ui/card";
import millify from "millify";
import {Spinner} from "@/components/ui/spinner";
import {useGetUserRoleHook} from "@/components/hooks/get-user-role";
import DashboardEmpleado from "@/components/dashboards/empleado/dashboard-empleado";
import DashboardJefatura from "@/components/dashboards/jefatura/dashboard-jefatura";

const DashboardPage = () => {
    const {
        dataGeoLocation,
        dataByCategories,
        dataByDate,
        dataAggressionSummary,
        isLoadingGeoLocation,
    } = useDashboardHook();

    const {isFetchingRoles, roles} = useGetUserRoleHook();

    return (
        <>
            {isFetchingRoles && (
                <div className="flex justify-center items-center w-full h-screen">
                    <Spinner></Spinner>
                </div>
            )}
            <div className="flex flex-col h-full">
                {!isFetchingRoles && roles && roles.includes("Administrator") && (
                    <>
                        {dataAggressionSummary && (
                            <div className="flex flex-col gap-4 mb-4 px-4 pt-0">
                                <div className="grid auto-rows-min gap-4 md:grid-cols-5 w-full">
                                    <Card className="rounded-3xl shadow-sm border-0 p-3 w-full">
                                        <div className="flex flex-col">
                                            <p className="text-xs font-bold text-gray-950">Agresiones pendientes</p>
                                            <p className="text-[10px] text-gray-800 italic">
                                                Pendientes de aprobación de la víctima
                                            </p>
                                            <h1 className="text-xl font-bold">
                                                {millify(dataAggressionSummary.attacksReported, {precision: 2})}
                                            </h1>
                                        </div>
                                    </Card>
                                    <Card className="rounded-3xl shadow-sm border-0 p-4 w-full">
                                        <div className="flex flex-col">
                                            <p className="text-xs font-bold text-gray-950">Agresiones aprobadas</p>
                                            <p className="text-[10px] text-gray-800 italic">
                                                Revisadas y aprobadas por la víctima
                                            </p>
                                            <h1 className="text-xl font-bold">
                                                {millify(dataAggressionSummary.approvedAttacks, {precision: 2})}
                                            </h1>
                                        </div>
                                    </Card>
                                    <Card className="rounded-3xl shadow-sm border-0 p-4 w-full">
                                        <div className="flex flex-col">
                                            <p className="text-xs font-bold text-gray-950">Agresiones rechazadas</p>
                                            <p className="text-[10px] text-gray-800 italic">
                                                Revisadas y rechazadas por la víctima
                                            </p>
                                            <h1 className="text-xl font-bold">
                                                {millify(dataAggressionSummary.declinedAttacks, {precision: 2})}
                                            </h1>
                                        </div>
                                    </Card>
                                    <Card className="rounded-3xl shadow-sm border-0 p-4">
                                        <div className="flex flex-col">
                                            <p className="text-xs text-gray-500">Establecimiento con más agresiones
                                                físicas</p>
                                            <p className="text-xs font-bold">
                                                {dataAggressionSummary.physicalEstablishment.name}
                                            </p>
                                            <h1 className="text-xl font-bold">
                                                {millify(dataAggressionSummary.physicalEstablishment.quantity, {precision: 2})}
                                            </h1>
                                        </div>
                                    </Card>
                                    <Card className="rounded-3xl shadow-sm border-0 p-4">
                                        <div className="flex flex-col">
                                            <p className="text-xs text-gray-500">Establecimiento con más agresiones
                                                verbales</p>
                                            <p className="text-xs font-bold">
                                                {dataAggressionSummary.verbalEstablishment.name}
                                            </p>
                                            <h1 className="text-xl font-bold">
                                                {millify(dataAggressionSummary.verbalEstablishment.quantity, {precision: 2})}
                                            </h1>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        )}
                        <div className="flex grow gap-4 px-4">
                            <div className="flex flex-col grow gap-4">
                                {dataByDate && <ChartAggressionTypeByDate chartData={dataByDate}/>}
                                {dataByCategories && <ChartAggressionByCategory data={dataByCategories}/>}
                            </div>
                            {!isLoadingGeoLocation && dataGeoLocation ? (
                                <Card
                                    className="p-4 flex min-h-[100vh] w-1/2 md:min-h-min z-0 mb-4 rounded-3xl shadow-sm border-0">
                                    <Map data={dataGeoLocation}/>
                                </Card>
                            ) : (
                                <Spinner size={40}/>
                            )}
                        </div>
                    </>
                )}
                {!isFetchingRoles && roles && roles.includes("Jefatura") && (
                    <DashboardJefatura/>
                )}
                {!isFetchingRoles && roles && roles.includes("Empleado") && (
                    <DashboardEmpleado/>
                )}
            </div>
        </>

    );
};

export default DashboardPage;
