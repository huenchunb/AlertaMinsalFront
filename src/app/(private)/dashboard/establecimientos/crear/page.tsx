"use client";

import React from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import FormCreateEstablishment from "@/components/forms/form-create-establishment/form-create-establishment";

const CrearEstablishmentPage = () => {
    return (
        <Card className="mx-2 xl:mx-4 max-w-full">
            <CardHeader>
                <CardTitle>Registrar un nuevo establecimiento</CardTitle>
                <CardDescription className="text-sm">
                    Completa el formulario a continuación para incorporar un nuevo establecimiento de salud al sistema.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormCreateEstablishment/>
            </CardContent>
        </Card>
    );
};

export default CrearEstablishmentPage;
