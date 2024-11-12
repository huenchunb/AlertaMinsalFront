import React from 'react';
import {z} from "zod";
import {isValidRUT} from "@/utils/functions";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Combobox, {SelectItems} from "@/components/combobox/combobox";
import {useCreateEmpleadosMutation} from "@/features/api";
import {CreateEmpleadoRequestBody} from "@/features/api/types";
import {Spinner} from "@/components/ui/spinner";

export const formCreateEmpleadoSchema = z.object({
    rut: z.string({required_error: "Ingresa un RUT"})
        .refine(value => isValidRUT(value), {message: "El RUT no es válido"}),
    firstName: z.string({required_error: "Ingresa un nombre"}).max(100),
    lastName: z.string({required_error: "Ingresa un apellido"}).max(100),
    email: z.string({required_error: "Ingresa un correo electrónico"}).email({message: "El correo electrónico no es válido"}),
    phoneNumber: z.string({required_error: "Ingresa un número de teléfono"})
        .min(9, {message: "El número de teléfono no es válido"})
        .max(9, {message: "El número de teléfono no es válido"}),
    address: z.string({required_error: "Ingresa una dirección"}).max(254),
    streetNumber: z.string({required_error: "Ingresa un número de calle"}).max(50),
    comunaId: z.number({required_error: "Selecciona una comuna"}),
    mutualidadId: z.number({required_error: "Selecciona una mutualidad"}),
    estamentoId: z.number({required_error: "Selecciona un estamento"}),
    establecimientoId: z.number({required_error: "Selecciona un establecimiento"}),
})

const mutualidades: SelectItems[] = [
    {label: "Instituto de Seguridad del Trabajo (IST)", value: 1},
    {label: "Asociación Chilena de Seguridad (ACHS)", value: 2},
    {label: "Mutual de Seguridad CChC (MUSEG)", value: 3},
    {label: "Instituto de Seguridad Laboral (ISL)", value: 4}
];

const comunas: SelectItems[] = [
    {label: "Providencia", value: 72}
];

const establecimientos: SelectItems[] = [
    {label: "Hospital del Salvador de Santiago", value: 112100}
];

const estamentos: SelectItems[] = [
    {label: "Cargos profesionales", value: 3},
    {label: "Cargos no profesionales (técnicos, administrativos y auxiliares)", value: 4},
    {label: "Cargos directivos", value: 5},
    {label: "Jefes superiores de servicio", value: 6}
];


const FormCreateEmpleado = () => {
    const form = useForm<z.infer<typeof formCreateEmpleadoSchema>>({
        resolver: zodResolver(formCreateEmpleadoSchema),
        defaultValues: {
            rut: undefined,
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            phoneNumber: undefined,
            address: undefined,
            streetNumber: undefined,
            comunaId: undefined,
            mutualidadId: undefined,
            estamentoId: undefined,
            establecimientoId: undefined
        }
    });

    const {handleSubmit, control} = form;

    const [createEmpleado, {isLoading}] = useCreateEmpleadosMutation();

    const onSubmit = (values: z.infer<typeof formCreateEmpleadoSchema>) => {
        const empleado : CreateEmpleadoRequestBody = {
            rut: values.rut,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: Number(values.phoneNumber),
            address: values.address,
            streetNumber: values.streetNumber,
            comunaId: values.comunaId,
            mutualidadId: values.mutualidadId,
            estamentoId: values.estamentoId,
            establecimientoId: values.establecimientoId,
            imageUrl: "https://ui.shadcn.com/avatars/01.png"
        };

        createEmpleado(empleado);
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                    control={control}
                    name="rut"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="RUN" {...field} className="w-full"
                                       type="text"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="flex flex-row gap-4">
                    <div className="w-full">
                        <FormField
                            control={control}
                            name="firstName"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Nombres" {...field} className="w-full"
                                               type="text"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-full">
                        <FormField
                            control={control}
                            name="lastName"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Apellido Paterno" {...field} className="w-full"
                                               type="text"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <FormField
                    control={control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Correo electrónico" {...field} className="w-full"
                                       type="email"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="phoneNumber"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Teléfono" {...field} className="w-full"
                                       type="text"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="flex flex-row gap-4">
                    <div className="w-full">
                        <FormField
                            control={control}
                            name="address"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Dirección" {...field}
                                               className="w-full"
                                               type="text"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-full">
                        <FormField
                            control={control}
                            name="streetNumber"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Número" {...field} className="w-full"
                                               type="text"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <Combobox control={control as never} name={"comunaId" as never} label={"Comuna"} data={comunas}/>
                    <Combobox control={control as never} name={"establecimientoId" as never} label={"Establecimiento"}
                              data={establecimientos}/>
                </div>
                <div className="flex flex-col gap-4">
                    <Combobox control={control as never} name={"estamentoId" as never} label={"Estamento"}
                              data={estamentos}/>
                    <Combobox control={control as never} name={"mutualidadId" as never} label={"Mutualidad"}
                              data={mutualidades}/>
                </div>
                {isLoading ? (
                    <div className="w-full flex justify-center">
                        <Spinner size={40}/>
                    </div>
                ) : (
                    <Button type="submit" className="w-full">Crear</Button>
                )}

            </form>
        </Form>
    );
};

export default FormCreateEmpleado;