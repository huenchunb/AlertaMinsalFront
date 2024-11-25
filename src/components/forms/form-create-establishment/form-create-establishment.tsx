"use client";

import React, {useEffect, useState} from 'react';
import {z} from "zod";
import {api, useCreateEstablecimientoMutation, useGetDefaultsQuery} from "@/features/api";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Button} from "@/components/ui/button";
import {CreateEstablishmentCommand, LookupDto} from "@/features/api/types";
import {useAppDispatch} from "@/store/hooks";
import {toast} from "@/hooks/use-toast";
import {Alert} from "@/components/ui/alert";
import {CircleCheckBig, CircleX} from "lucide-react";

const formCreateEstablishmentSchema = z.object({
    code: z.preprocess(
        (value) => (value === "" ? undefined : Number(value)),
        z.number({required_error: "El código del establecimiento es requerido"}).int()
    ),
    name: z.string({required_error: "El campo nombre es requerido"}),
    tipoEstablecimientoId: z.preprocess(
        (value) => (value === "" ? undefined : Number(value)),
        z.number({required_error: "El tipo de establecimiento es requerido"}).int()
    ),
    nivelEstablecimientoId: z.preprocess(
        (value) => (value === "" ? undefined : Number(value)),
        z.number({required_error: "El nivel del establecimiento es requerido"}).int()
    ),
    address: z.string({required_error: "El campo nombre es requerido"}),
    streetNumber: z.string({required_error: "El campo númeración es requerido"}),
    phoneNumber: z.preprocess(
        (value) => (value === "" ? undefined : Number(value)),
        z.number({required_error: "El número de teléfono es requerido"}).int()
    ),
    urgency: z.string({required_error: "Selecciona si tiene urgencia"}),
    tipoUrgenciaEstablecimientoId: z.preprocess(
        (value) => (value === "" ? undefined : Number(value)),
        z.number({required_error: "El tipo de urgencia es requerido"}).int()
    ),
    latitude: z.preprocess(
        (value) => (value === "" ? undefined : Number(value)),
        z.number({required_error: "Las coordenadas de latitud es requerida"})
    ),
    longitude: z.preprocess(
        (value) => (value === "" ? undefined : Number(value)),
        z.number({required_error: "Las coordenadas de longitud es requerida"})
    ),
    complejidadEstablecimientoId: z.preprocess(
        (value) => (value === "" ? undefined : Number(value)),
        z.number({required_error: "La complejidad es requerida"}).int()
    ),
    tipoAtencionEstablecimientoId: z.preprocess(
        (value) => (value === "" ? undefined : Number(value)),
        z.number({required_error: "El tipo de atención es requerido"}).int()
    ),
    comunaId: z.preprocess(
        (value) => (value === "" ? undefined : Number(value)),
        z.number({required_error: "La comuna es requerida"}).int()
    )
})

const FormCreateEstablishment = () => {
    const dispatch = useAppDispatch();

    const {data} = useGetDefaultsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        refetchOnFocus: true,
    });

    const [createEstablecimiento] = useCreateEstablecimientoMutation();

    const form = useForm<z.infer<typeof formCreateEstablishmentSchema>>({
        resolver: zodResolver(formCreateEstablishmentSchema),
        defaultValues: {
            urgency: "false",
            tipoUrgenciaEstablecimientoId: 1,
            code: "",
            name: undefined,
            tipoEstablecimientoId: 1,
            nivelEstablecimientoId: 1,
            address: "",
            streetNumber: "",
            phoneNumber: 1,
            longitude: 1,
            latitude: 1,
            complejidadEstablecimientoId: 1,
            tipoAtencionEstablecimientoId: 1,
            comunaId: 1
        }
    })

    const [filteredTipoUrgencia, setFilteredTipoUrgencia] = useState<LookupDto[]>([]);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        getValues
    } = form;

    const urgency = watch("urgency")

    const onSubmit = async (values: z.infer<typeof formCreateEstablishmentSchema>) => {
        const command: CreateEstablishmentCommand = {
            code: values.code,
            name: values.name,
            tipoEstablecimientoId: values.tipoEstablecimientoId,
            nivelEstablecimientoId: values.nivelEstablecimientoId,
            address: values.address,
            streetNumber: values.streetNumber,
            phoneNumber: values.phoneNumber,
            urgency: values.urgency === "true",
            tipoUrgenciaEstablecimientoId: values.tipoUrgenciaEstablecimientoId,
            longitude: values.longitude,
            latitude: values.latitude,
            complejidadEstablecimientoId: values.complejidadEstablecimientoId,
            tipoAtencionEstablecimientoId: values.tipoAtencionEstablecimientoId,
            comunaId: values.comunaId
        }

        await createEstablecimiento(command).unwrap()
            .then(()=> {
                toast({
                    title: "Registro éxitoso",
                    description: (
                        <Alert className="border border-green-600 bg-green-100">
                            <div className="flex start">
                                <p className="text-green-800 mr-2">
                                    Se ha creado el establecimiento con éxito.
                                </p>{" "}
                                <CircleCheckBig size={20} className="text-green-800" />
                            </div>
                        </Alert>
                    ),
                });

                const currentValues = getValues(["comunaId",
                    "tipoEstablecimientoId",
                    "nivelEstablecimientoId",
                    "urgency",
                    "tipoUrgenciaEstablecimientoId",
                    "complejidadEstablecimientoId",
                    "tipoAtencionEstablecimientoId"])

                reset({
                    ...currentValues,
                    code: "",
                    name: undefined,
                    address: "",
                    streetNumber: "",
                    phoneNumber: "",
                    longitude: "",
                    latitude: "",
                })

            })
            .catch(()=> {
                toast({
                    description: (
                        <Alert className="border border-red-600 bg-red-100">
                            <div className="flex start">
                                <p className="text-red-800 mr-2">
                                    Ocurrio un error al agregar el establecimiento. Intente
                                    nuevamente.
                                </p>{" "}
                                <CircleX size={20} className="text-red-800" />
                            </div>
                        </Alert>
                    ),
                });
            })
            .finally(()=> {
                dispatch(api.util.invalidateTags(["Establecimientos"]))
            })

    }


    useEffect(() => {
        const urgenciaBool = urgency === "true";

        if (data) {
            if (data.tipoUrgenciaEstablecimiento.length != 0 && !urgenciaBool) {
                setFilteredTipoUrgencia(data.tipoUrgenciaEstablecimiento.filter(x => x.id === 1))
                setValue("tipoUrgenciaEstablecimientoId", 1)
            } else if (data.tipoUrgenciaEstablecimiento.length != 0 && urgenciaBool) {
                setFilteredTipoUrgencia(data.tipoUrgenciaEstablecimiento)
            } else {
                setFilteredTipoUrgencia([])
            }
        }
    }, [data, setValue, urgency])


    return (
        <div className="mb-4">
            {data && (
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                        <FormField
                            control={control}
                            name="code"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Código</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Ingresa el código del establecimiento"
                                            {...field}
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            className="w-full text-xs"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="name"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Ingresa el nombre completo del establecimiento"
                                            {...field}
                                            className="w-full text-xs"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="address"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Ingresa la dirección"
                                            {...field}
                                            className="w-full text-xs"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="streetNumber"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Númeración</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Ingresa el número"
                                            {...field}
                                            className="w-full text-xs"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="comunaId"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Comuna</FormLabel>
                                    <Select
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                        defaultValue={
                                            field.value ? field.value.toString() : ""
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una comuna"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {data.comunas.map((comuna) => (
                                                <SelectItem
                                                    key={comuna.id}
                                                    value={comuna.id.toString()}
                                                >
                                                    {comuna.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="latitude"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Latitud</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Ingresa las coordenadas de latitude"
                                            {...field}
                                            className="w-full text-xs"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="longitude"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Longitud</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Ingresa las coordenadas de longitud"
                                            {...field}
                                            className="w-full text-xs"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="phoneNumber"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Teléfono</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Ingresa el número de teléfono"
                                            {...field}
                                            className="w-full text-xs"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {data.tipoEstablecimiento && data.tipoEstablecimiento.length != 0 && (
                            <FormField
                                control={control}
                                name="tipoEstablecimientoId"
                                render={({field}) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Tipo de establecimiento</FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(Number(value))
                                            }
                                            defaultValue={
                                                field.value ? field.value.toString() : ""
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un tipo de establecimiento"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {data.tipoEstablecimiento.map((tipo) => (
                                                    <SelectItem
                                                        key={tipo.id}
                                                        value={tipo.id.toString()}
                                                    >
                                                        {tipo.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormField
                            control={control}
                            name="nivelEstablecimientoId"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Nivel</FormLabel>
                                    <Select
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                        defaultValue={
                                            field.value ? field.value.toString() : ""
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un nivel de establecimiento"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {data.nivelEstablecimiento.map((nivel) => (
                                                <SelectItem
                                                    key={nivel.id}
                                                    value={nivel.id.toString()}
                                                >
                                                    {nivel.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="urgency"
                            render={({field}) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>¿Tiene urgencia?</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={String(field.value)}
                                            className="flex gap-2"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="true"/>
                                                </FormControl>
                                                <FormLabel className="font-normal">Sí</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="false"/>
                                                </FormControl>
                                                <FormLabel className="font-normal">No</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {urgency === "true" && (
                            <FormField
                                control={control}
                                name="tipoUrgenciaEstablecimientoId"
                                render={({field}) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Tipo urgencia</FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(Number(value))
                                            }
                                            defaultValue={
                                                field.value ? field.value.toString() : ""
                                            }
                                            disabled={!(urgency === "true")}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un tipo de urgencia"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {filteredTipoUrgencia.map((urgencia) => (
                                                    <SelectItem
                                                        key={urgencia.id}
                                                        value={urgencia.id.toString()}
                                                    >
                                                        {urgencia.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormField
                            control={control}
                            name="complejidadEstablecimientoId"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Complejidad</FormLabel>
                                    <Select
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                        defaultValue={
                                            field.value ? field.value.toString() : ""
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una complejidad"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {data.complejidadesEstablecimiento.map((complejidad) => (
                                                <SelectItem
                                                    key={complejidad.id}
                                                    value={complejidad.id.toString()}
                                                >
                                                    {complejidad.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="tipoAtencionEstablecimientoId"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Tipo atención</FormLabel>
                                    <Select
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                        defaultValue={
                                            field.value ? field.value.toString() : ""
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un tipo de atención"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {data.tipoAtencionEstablecimiento.map((tipoAtencion) => (
                                                <SelectItem
                                                    key={tipoAtencion.id}
                                                    value={tipoAtencion.id.toString()}
                                                >
                                                    {tipoAtencion.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Crear</Button>
                    </form>
                </Form>
            )}
        </div>
    );
};

export default FormCreateEstablishment;