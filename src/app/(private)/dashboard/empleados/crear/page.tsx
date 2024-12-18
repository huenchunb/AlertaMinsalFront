"use client";

import React from 'react';
import FormCreateEmpleado from "@/components/forms/form-create-empleado/form-create-empleado";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";

const CrearEmpleadoPage = () => {
    return (
        <Card className="mx-8">
            <CardHeader>
                <CardTitle>Crear nuevo empleado</CardTitle>
                <CardDescription>Aquí puedes registrar un nuevo empleado, asignarle un establecimiento y un rol en la plataforma</CardDescription>
            </CardHeader>
            <Separator/>
            <CardContent className="mt-4">
                <FormCreateEmpleado/>
            </CardContent>
        </Card>
    );
};

export default CrearEmpleadoPage;