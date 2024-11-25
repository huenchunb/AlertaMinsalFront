"use client";

import FormCreateAgresion from "@/components/forms/form-create-agresion/form-create-agresion";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";

const CrearAgresionPage = () => {

    return (
        <Card className="mx-8">
            <CardHeader>
                <CardTitle>Registrar nuevo incidente de agresión</CardTitle>
                <CardDescription>
                    Completa el formulario a continuación para reportar un incidente.
                    Selecciona el establecimiento, empleado que fue victima de la
                    agresión, la fecha y tipo de agresión, subcategoría, la información
                    del agresor y, si aplica, la información de los testigos. Esto nos
                    ayudará a centralizar y gestionar los datos de forma eficiente.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormCreateAgresion/>
            </CardContent>
        </Card>
    );
};

export default CrearAgresionPage;
