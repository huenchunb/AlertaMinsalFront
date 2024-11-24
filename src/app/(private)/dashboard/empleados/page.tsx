"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DataTableEmployee } from "@/components/datatables/datatable-employee";
import { useGetEmpleadosQuery } from "@/features/api";

const EmpleadosPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 15;

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

  const { data } = useGetEmpleadosQuery(
    { pageNumber, pageSize },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const handleRenderEstablishment = () => {
    return (
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Empleados</CardTitle>
            <CardDescription>
              Aquí puedes visualizar el listado completo de los empleados de los
              establecimientos de salud registrados en el sistema con facilidad,
              además podrás ver información más detallada de cada uno.
            </CardDescription>
          </CardHeader>
          <Separator />
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
