import React from 'react';
import {columns} from "@/app/(private)/dashboard/empleados/columns";
import {DataTable} from "@/app/(private)/dashboard/empleados/data-table";
import {useGetEmpleadosHook} from "@/app/(private)/dashboard/empleados/hooks/get-empleados";

const TableEmpleados = () => {
    const {data} = useGetEmpleadosHook();

    return (
        <>
            {data && (
                <DataTable columns={columns} data={data.items}/>
            )}
        </>
    );
};

export default TableEmpleados;