"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { AgresionesCountByCategories } from "@/features/api/types";

interface ChartAggressionByCategoryProps {
  data: AgresionesCountByCategories[];
}

const chartConfig = {
  totalAgresiones: {
    label: "Categorías",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

const ChartAggressionByCategory = ({
  data,
}: ChartAggressionByCategoryProps) => {
  return (
    <Card className="rounded-3xl shadow-sm border-0 h-full mb-4">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Resumen de agresiones por categoría</CardTitle>
          <CardDescription>
            Mostrando la cantidad de agresiones ocurridas por categoría
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <BarChart accessibilityLayer data={data} layout="vertical">
            <CartesianGrid />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              hide
            />
            <XAxis dataKey="totalAgresiones" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="totalAgresiones"
              layout="vertical"
              fill="var(--color-totalAgresiones)"
              radius={4}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartAggressionByCategory;
