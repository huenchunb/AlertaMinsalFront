"use client";

import React from 'react';
import TableEmpleados from "@/app/(private)/dashboard/empleados/table-empleados";
import BaseFormCreateEmpleado from "@/components/forms/form-create-empleado/base-form-create-empleado";

const EmpleadosPage = () => {
    return (
        <div className="px-8">
            <div className="mb-4">
                <h1 className="font-bold text-xl">Gestión de empleados hospitalarios</h1>
                <p className="text-muted-foreground">Aquí puedes visualizar el listado completo de empleados, crear
                    nuevos usuarios con facilidad y actualizar la información existente</p>
            </div>
            <div className="grid grid-cols-1">
                <div className="mb-4">
                    <BaseFormCreateEmpleado/>
                </div>
                <div>
                    <TableEmpleados/>
                </div>
            </div>
        </div>
    );
};

export default EmpleadosPage;
