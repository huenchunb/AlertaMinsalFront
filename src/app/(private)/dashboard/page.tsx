"use client";

import React from "react";
import { useDashboardHook } from "@/components/hooks/get-roles";
import { Map } from "@/components/dashboards/maps/Map";
import ChartAggressionTypeByDate from "@/components/charts/chart-aggression-type-by-date";
import ChartAggressionByCategory from "@/components/charts/chart-aggression-by-category";
import { useAppSelector } from "@/store/hooks";

const DashboardPage = () => {
  const { dataGeoLocation, dataByCategories, dataByDate } = useDashboardHook();
  const { isAdministrator, isJefatura } = useAppSelector((state) => state.auth);

  return (
    <>
      {isAdministrator && (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            {dataByCategories && (
              <ChartAggressionByCategory data={dataByCategories} />
            )}
            {dataByDate && <ChartAggressionTypeByDate chartData={dataByDate} />}
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min z-0">
            <Map data={dataGeoLocation} />
          </div>
        </div>
      )}
      {isJefatura && (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            Pendiente dashboard jefatura
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min z-0"></div>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
