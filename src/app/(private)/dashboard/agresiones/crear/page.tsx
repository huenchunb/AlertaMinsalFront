"use client";

import FormCreateAgresion from "@/components/forms/form-create-agresion/form-create-agresion";

const CrearAgresionPage = () => {
    return (
        <div className="px-8">
            <div>
                <h1 className="font-bold text-xl">Crear nueva agresión</h1>
                <p className="text-muted-foreground">Aquí puedes registrar una nueva agresión en el sistema</p>
            </div>
            <hr className="my-4"/>
            <FormCreateAgresion/>
        </div>
    );
}

export default CrearAgresionPage;