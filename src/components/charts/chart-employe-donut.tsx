"use client";

import React from "react";
import {Cell, Pie, PieChart} from "recharts"; // Importamos `Cell` para colores dinámicos
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart";

export interface ChartDataEmployeeDonut {
    type: string;
    quantity: number;
}

export interface ChartEmployeeDonutProps {
    data: ChartDataEmployeeDonut[];
}

const chartConfig: ChartConfig = {
    quantity: {
        label: "Agresiones",
    },
    Física: {
        label: "Física",
        color: "hsl(var(--chart-1))", // Color asignado para el tipo "Física"
    },
    Verbal: {
        label: "Verbal",
        color: "hsl(var(--chart-2))", // Color asignado para el tipo "Verbal"
    },
};

const ChartEmployeDonut = ({data}: ChartEmployeeDonutProps) => {
    return (
        <Card className="flex flex-col shadow-sm">
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-md xl:text-xl">Tus agresiones</CardTitle>
                <CardDescription className="text-sm">Gráfico para tus últimas agresiones por tipo</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel/>}
                        />
                        <Pie
                            data={data}
                            dataKey="quantity"
                            nameKey="type" // Corregido para que coincida con el campo "type"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                        >
                            {data.map((entry) => (
                                <Cell
                                    key={entry.type}
                                    fill={chartConfig[entry.type]?.color || "#ccc"} // Usa el color definido o un fallback
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-gray-500 italic text-xs">
                    Este gráfico solo toma cómo máximo las últimas 100 agresiones registradas
                </div>
            </CardFooter>
        </Card>
    );
};

export default ChartEmployeDonut;