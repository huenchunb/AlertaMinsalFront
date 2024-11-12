"use client";

import React from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react"
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import FormCreateEmpleado from "@/components/forms/form-create-empleado/form-create-empleado";


const BaseFormCreateEmpleado = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-1/12 float-right"><Plus/></Button>
            </DialogTrigger>
            <DialogContent className="p-8">
                <DialogHeader>
                    <DialogTitle>Crear empleado</DialogTitle>
                    <DialogDescription>
                        Completa los campos para agregar un nuevo profesional al sistema
                    </DialogDescription>
                </DialogHeader>
                <DialogBody>
                    <FormCreateEmpleado />
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};

export default BaseFormCreateEmpleado;