"use client";

import {useGetEstablecimientosQuery} from "@/features/api";
import {DataTableEstablishment} from "@/components/datatables/datatable-establishment";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import React, {useState} from "react";
import {Separator} from "@/components/ui/separator";

const EstablecimientoPage = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, _] = useState(15);

    const handleNextPage = () => {
        if (data && data.hasNextPage) { // Puedes usar 'hasMore' o cualquier lógica que determine si hay más páginas
            setPageNumber((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (data && data.hasPreviousPage) {
            setPageNumber((prev) => prev - 1);
        }
    };

    const {data} = useGetEstablecimientosQuery({pageNumber, pageSize}, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true
    });


    const handleRenderEstablishment = () => {
        return (
            <div className="p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Establecimientos de salud</CardTitle>
                        <CardDescription>Aquí puedes visualizar el listado completo de establecimientos de salud
                            registrados en el sistema con facilidad, además podrás ver información más detallada de cada
                            establecimiento.
                        </CardDescription>
                    </CardHeader>
                    <Separator/>
                    <CardContent>
                        {data && (
                            <DataTableEstablishment
                                data={data.items}
                                handlePrevious={handlePreviousPage}
                                handleNextPage={handleNextPage}
                                hasPreviousPage={data.hasPreviousPage}
                                hasNextPage={data.hasNextPage}
                                pageSize={pageSize}
                                totalCounts={data.totalCount}/>
                        )}
                    </CardContent>
                </Card>
            </div>
        )

    }

    return (
        <>
            {handleRenderEstablishment()}
        </>
    );
};

export default EstablecimientoPage;