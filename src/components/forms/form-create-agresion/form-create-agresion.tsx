"use client";

import {useFieldArray, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useCreateAgresionMutation, useGetDefaultsQuery} from "@/features/api";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import React, {useEffect} from "react";
import {
    AgresorCreateDto,
    CreateAgresionCommand,
    EmpleadoDefaultDto,
    LookupDto,
    TestigoCreateDto
} from "@/features/api/types";
import {Alert} from "@/components/ui/alert";
import {CalendarIcon, CircleCheckBig, CircleX, Info, Trash2, UserRoundPlus} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Calendar} from "@/components/ui/calendar";
import {format} from "date-fns";
import {es} from "date-fns/locale"
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {InputRut} from "@/components/ui/input-rut";
import {toast} from "@/hooks/use-toast";

export const formCreateAgresionSchema = z.object({
    fechaAgresion: z.date({required_error: "La fecha de la agresión es requerida"}),
    establecimientoId: z.number({required_error: "El establecimiento es requerido"})
        .int().min(1, {message: "Debes seleccionar un establecimiento"}),
    empleadoId: z.number({required_error: "El empleado es requerido"})
        .int().min(1, {message: "Debes seleccionar un empleado"}),
    tipoAgresionId: z.number({required_error: "El tipo de agresión es requerido"})
        .int().min(1, {message: "Debes seleccionar un tipo de agresión"}),
    categoriasAgresionesId: z.array(z.number())
        .refine((value) => value.length > 0, {
            message: "Debes seleccionar al menos una categoría del tipo de agresión",
        }),
    agresores: z.array(
        z.object({
            tipoAgresorId: z.number({required_error: "El tipo de agresor es requerido"})
                .int().min(1, {message: "Debes seleccionar un tipo de agresor"}),
            name: z.string({required_error: "Debes ingresar un nombre"}).min(1, "El nombre es requerido"),
            lastName: z.string({required_error: "Debes ingresar un apellido"}).min(1, "El apellido es requerido"),
            rut: z.string({required_error: "Debes ingresar un rut"}).min(1, "El RUT es requerido"),
            email: z.string({required_error: "Debes ingresar un correo electrónico"}).email("Correo inválido"),
            phoneNumber: z.string({required_error: "Debes ingresar un número de teléfono"}),
            address: z.string({required_error: "Debes ingresar una dirección"}),
            comunaId: z.number({required_error: "La comuna es requerida"})
                .int().min(1, {message: "Debes seleccionar una comuna"})
        })
    ).min(1, {message: "Debe haber al menos un agresor"}),
    testigos: z.array(
        z.object({
            name: z.string({required_error: "Debes ingresar un nombre"}).min(1, "El nombre es requerido"),
            lastName: z.string({required_error: "Debes ingresar un apellido"}).min(1, "El apellido es requerido"),
            rut: z.string({required_error: "Debes ingresar un rut"}).min(1, "El RUT es requerido"),
            email: z.string({required_error: "Debes ingresar un correo electrónico"}).email("Correo inválido"),
            address: z.string({required_error: "Debes ingresar una dirección"}),
        })
    ).min(1, {message: "Debe haber al menos un testigo"})
});

const FormCreateAgresion = () => {
    const {data} = useGetDefaultsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        refetchOnFocus: true,
    });

    const [createAgresion] = useCreateAgresionMutation();

    const [empleados, setEmpleados] = React.useState<EmpleadoDefaultDto[]>([]);
    const [categorias, setCategorias] = React.useState<LookupDto[]>([]);

    const form = useForm<z.infer<typeof formCreateAgresionSchema>>({
        resolver: zodResolver(formCreateAgresionSchema),
        defaultValues: {
            fechaAgresion: new Date(),
            establecimientoId: 0,
            empleadoId: 0,
            tipoAgresionId: 0,
            categoriasAgresionesId: [],
            agresores: [],
            testigos: []
        }
    });

    const {handleSubmit, watch, control, setValue, formState, reset} = form;
    const {errors} = formState

    const {fields, append, remove} = useFieldArray({
        control,
        name: "agresores",
    });

    const {fields: fieldsTestigos, append: appendTestigo, remove: removeTestigo} = useFieldArray({
        control,
        name: "testigos",
    });

    const establecimientoId = Number(watch("establecimientoId"));
    const tipoAgresionId = Number(watch("tipoAgresionId"));

    useEffect(() => {
        if (data && establecimientoId !== 0) {
            setEmpleados(data?.empleados.filter((empleado) => empleado.establecimientoId === establecimientoId) || []);
        }

        if (data && tipoAgresionId != 0) {
            setValue("categoriasAgresionesId", [])
            const categorias: LookupDto[] = data.tipoAgresionesCategorias.filter((categoria) => categoria.tipoAgresionId === tipoAgresionId).map((categoria) => ({
                id: categoria.id,
                name: categoria.name
            })) || []

            setCategorias(categorias);
        } else {
            setCategorias([]);
        }
    }, [data, establecimientoId, tipoAgresionId, setValue]);


    const onSubmit = async (data: z.infer<typeof formCreateAgresionSchema>) => {

        const agresores: AgresorCreateDto[] = data.agresores.map((item) => ({
            tipoAgresorId: item.tipoAgresorId,
            rut: item.rut,
            name: item.name,
            lastName: item.lastName,
            address: item.address,
            comunaId: item.comunaId
        }))

        const testigos: TestigoCreateDto[] = data.testigos.map((item) => ({
            rut: item.rut,
            name: item.name,
            lastName: item.lastName,
            email: item.email,
            address: item.address
        }));

        const createAgresionCommand: CreateAgresionCommand = {
            fechaAgresion: data.fechaAgresion.toISOString(),
            empleadoId: data.empleadoId,
            categoriasAgresionesId: data.categoriasAgresionesId,
            agresores,
            testigos
        }

        await createAgresion(createAgresionCommand)
            .unwrap()
            .then(() => {
                toast({
                    title: "Registro éxitoso",
                    description: (
                        <Alert className="border border-green-600 bg-green-100">
                            <div className="flex start">
                                <p className="text-green-800 mr-2">Se ha registrado la agresión correctamente,
                                    el afectado debe revisar y aprobar esta agresión para finalizar el proceso.
                                </p> <CircleCheckBig size={20} className="text-green-800"/>
                            </div>
                        </Alert>
                    ),
                });
                reset()
            })
            .catch(() => {
                toast({
                    title: "You submitted the following values:",
                    description: (
                        <Alert className="border border-red-600 bg-red-100">
                            <div className="flex start">
                                <p className="text-red-800 mr-2">Ocurrio un error al agregar el registro de agresión.
                                    Intente nuevamente.
                                </p> <CircleX size={20} className="text-red-800"/>
                            </div>
                        </Alert>
                    ),
                });
            })
    };

    return (
        <div className="mb-4">
            {data && (
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <FormField
                                control={control}
                                name="establecimientoId"
                                render={({field}) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Establecimiento de salud</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            defaultValue={field.value ? field.value.toString() : ""}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un establecimiento"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {data.establecimientos.map((establecimiento) => (
                                                    <SelectItem key={establecimiento.id}
                                                                value={establecimiento.id.toString()}>
                                                        {establecimiento.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                        <FormDescription className="flex gap-2">
                                            <span>Selecciona el establecimiento al cual pertenece el empleado agredido</span>
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            {establecimientoId != 0 && (
                                <>
                                    {empleados.length != 0 ? (
                                        <FormField
                                            control={control}
                                            name="empleadoId"
                                            render={({field}) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>Empleados del establecimiento</FormLabel>
                                                    <Select onValueChange={(value) => field.onChange(Number(value))}
                                                            defaultValue={field.value ? field.value.toString() : ""}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecciona un empleado"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {empleados.map((establecimiento) => (
                                                                <SelectItem key={establecimiento.id}
                                                                            value={establecimiento.id.toString()}>
                                                                    {establecimiento.fullName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                    <FormDescription className="flex gap-2">
                                                        <span>Selecciona el empleado que fue victima de una agresión</span>
                                                    </FormDescription>
                                                </FormItem>
                                            )}
                                        />
                                    ) : (
                                        <Alert className="flex items-center gap-1 border-red-500">
                                            <div>
                                                <Info size={20} className="text-red-500"/>
                                            </div>
                                            <p className="text-red-500">No hay empleados registrados para el
                                                establecimiento</p>
                                        </Alert>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="my-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información de la agresión</CardTitle>
                                    <CardDescription>Selecciona la fecha y los tipos de agresiones de los cuales ha sido
                                        víctima el afectado</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-4">
                                            <div>
                                                <FormField
                                                    control={control}
                                                    name="fechaAgresion"
                                                    render={({field}) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Fecha de la agresión</FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "w-[240px] pl-3 text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            {field.value ? (
                                                                                format(field.value, "PPP", {locale: es})
                                                                            ) : (
                                                                                <span>Selecciona una fecha</span>
                                                                            )}
                                                                            <CalendarIcon
                                                                                className="ml-auto h-4 w-4 opacity-50"/>
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={field.value}
                                                                        onSelect={field.onChange}
                                                                        disabled={(date) =>
                                                                            date > new Date() || date < new Date("1900-01-01")
                                                                        }
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormDescription>
                                                                Selecciona la fecha del día que ocurrió la agresión
                                                            </FormDescription>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div>
                                                <FormField
                                                    control={control}
                                                    name="tipoAgresionId"
                                                    render={({field}) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Tipo de agresion</FormLabel>
                                                            <Select
                                                                onValueChange={(value) => field.onChange(Number(value))}
                                                                defaultValue={field.value ? field.value.toString() : ""}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue
                                                                            placeholder="Selecciona un tipo de agresión"/>
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {data.tipoAgresiones.map((agresion) => (
                                                                        <SelectItem key={agresion.id}
                                                                                    value={agresion.id.toString()}>
                                                                            {agresion.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage/>
                                                            <FormDescription className="flex gap-2">
                                                                <span>Selecciona el tipo de agresión de la que ha sido víctima el afectado</span>
                                                            </FormDescription>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <FormField
                                                control={control}
                                                name="categoriasAgresionesId"
                                                render={() => (
                                                    <FormItem>
                                                        <div className="mb-4">
                                                            <FormLabel className="text-base">Categorías</FormLabel>
                                                            <FormDescription>
                                                                Selecciona uno o más tipos de agresión de los cuales fue
                                                                víctima el afectado
                                                            </FormDescription>
                                                        </div>
                                                        {categorias.map((item) => (
                                                            <FormField
                                                                key={item.id}
                                                                control={control}
                                                                name="categoriasAgresionesId"
                                                                render={() => (
                                                                    <FormItem
                                                                        key={item.id}
                                                                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={watch("categoriasAgresionesId").includes(item.id)} // Use watch to keep track of the field value
                                                                                onCheckedChange={(checked) => {
                                                                                    const currentValues = watch("categoriasAgresionesId"); // Watch the current values
                                                                                    const newValue = checked
                                                                                        ? [...currentValues, item.id] // Add the item if checked
                                                                                        : currentValues.filter((value) => value !== item.id); // Remove the item if unchecked
                                                                                    setValue("categoriasAgresionesId", newValue); // Set the updated values
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <div className="space-y-1 leading-none">
                                                                            <FormLabel>
                                                                                {item.name}
                                                                            </FormLabel>
                                                                        </div>
                                                                    </FormItem>
                                                                )}
                                                            />

                                                        ))}
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="my-4">
                            <Card>
                                <CardHeader className="pb-0">
                                    <CardTitle>Agresores</CardTitle>
                                    <CardDescription>Ingresa la información sobre el o los agresores involucrados en el
                                        incidente. Es importante ser preciso y detallado al completar está información,
                                        ya que facilitará un manejo adecuado de la denuncia, y en caso de ser necesario
                                        ayudará a las autoridades a tomar las medidas necesarias.</CardDescription>
                                    {errors.agresores && (
                                        <Alert variant="destructive" className="mt-2">
                                            {errors.agresores.message}
                                        </Alert>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {fields.map((field, index) => (
                                        <Card key={field.id} className="my-4">
                                            <CardHeader>
                                                <CardTitle>Agresor {index + 1}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex flex-col gap-2">
                                                <div>
                                                    <FormField
                                                        control={control}
                                                        name={`agresores.${index}.tipoAgresorId`}
                                                        render={({field}) => (
                                                            <FormItem className="w-full">
                                                                <FormLabel>Tipo de agresion</FormLabel>
                                                                <Select
                                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                                    defaultValue={field.value ? field.value.toString() : ""}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue
                                                                                placeholder="Selecciona un tipo de agresor"/>
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {data.tipoAgresores.map((agresor) => (
                                                                            <SelectItem key={agresor.id}
                                                                                        value={agresor.id.toString()}>
                                                                                {agresor.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage/>
                                                                <FormDescription className="flex gap-2">
                                                                    <span>Selecciona el tipo de agresor</span>
                                                                </FormDescription>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <FormField
                                                        control={control}
                                                        name={`agresores.${index}.rut`}
                                                        render={({field}) => (
                                                            <FormItem
                                                                className="w-full">
                                                                <FormLabel>RUT</FormLabel>
                                                                <FormControl>
                                                                    <InputRut
                                                                        placeholder="RUT del agresor"
                                                                        {...field}
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage/>
                                                                <FormDescription>
                                                                    Ingresa el RUT sin puntos ni guiones.
                                                                </FormDescription>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={control}
                                                        name={`agresores.${index}.name`}
                                                        render={({field}) => (
                                                            <FormItem
                                                                className="w-full">
                                                                <FormLabel>Nombre</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Nombre del agresor"
                                                                        {...field}
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={control}
                                                        name={`agresores.${index}.lastName`}
                                                        render={({field}) => (
                                                            <FormItem
                                                                className="w-full">
                                                                <FormLabel>Apellido</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Apellido del agresor"
                                                                        {...field}
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <FormField
                                                        control={control}
                                                        name={`agresores.${index}.email`}
                                                        render={({field}) => (
                                                            <FormItem
                                                                className="w-full">
                                                                <FormLabel>Email</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Email del agresor"
                                                                        {...field}
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={control}
                                                        name={`agresores.${index}.phoneNumber`}
                                                        render={({field}) => (
                                                            <FormItem
                                                                className="w-full">
                                                                <FormLabel>Teléfono</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Número de teléfono"
                                                                        {...field}
                                                                        className="w-full"
                                                                        type="text"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <FormField
                                                        control={control}
                                                        name={`agresores.${index}.address`}
                                                        render={({field}) => (
                                                            <FormItem
                                                                className="w-full">
                                                                <FormLabel>Dirección</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Dirección"
                                                                        {...field}
                                                                        className="w-full"
                                                                        type="text"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={control}
                                                        name={`agresores.${index}.comunaId`}
                                                        render={({field}) => (
                                                            <FormItem className="w-full">
                                                                <FormLabel>Comuna</FormLabel>
                                                                <Select
                                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                                    defaultValue={field.value ? field.value.toString() : ""}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue
                                                                                placeholder="Selecciona una comuna"/>
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {data.comunas.map((comuna) => (
                                                                            <SelectItem key={comuna.id}
                                                                                        value={comuna.id.toString()}>
                                                                                {comuna.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div>
                                                    <Button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        variant="destructive"
                                                        className="mt-4"
                                                    >
                                                        <span className="mr-1">Eliminar</span> <Trash2/>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            append({
                                                name: "",
                                                tipoAgresorId: 0,
                                                lastName: "",
                                                rut: "",
                                                email: "",
                                                phoneNumber: "",
                                                comunaId: 0,
                                                address: ""
                                            })
                                        }
                                        className="mt-4"
                                    >
                                        <span className="mr-1">Agregar nuevo agresor</span> <UserRoundPlus/>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="my-4">
                            <Card>
                                <CardHeader className="pb-0">
                                    <CardTitle>Testigos</CardTitle>
                                    <CardDescription>Ingresa la información sobre las personas que presenciaron el
                                        incidente. Es fundamental asegurar que la información es
                                        válida, ya que los testimonios pueden ser cruciales para respaldar la
                                        denuncia.</CardDescription>
                                    {errors.testigos && (
                                        <Alert variant="destructive" className="mt-2">
                                            {errors.testigos.message}
                                        </Alert>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {fieldsTestigos.map((field, index) => (
                                        <Card key={field.id} className="my-4">
                                            <CardHeader>
                                                <CardTitle>Testigo {index + 1}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex flex-col gap-2">
                                                <div className="flex justify-between gap-4">
                                                    <FormField
                                                        control={control}
                                                        name={`testigos.${index}.rut`}
                                                        render={({field}) => (
                                                            <FormItem
                                                                className="w-full">
                                                                <FormLabel>RUT</FormLabel>
                                                                <FormControl>
                                                                    <InputRut
                                                                        placeholder="RUT del testigo"
                                                                        {...field}
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage/>
                                                                <FormDescription>
                                                                    Ingresa el RUT sin puntos ni guiones.
                                                                </FormDescription>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={control}
                                                        name={`testigos.${index}.name`}
                                                        render={({field}) => (
                                                            <FormItem
                                                                className="w-full">
                                                                <FormLabel>Nombre</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Nombre del agresor"
                                                                        {...field}
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={control}
                                                        name={`testigos.${index}.lastName`}
                                                        render={({field}) => (
                                                            <FormItem
                                                                className="w-full">
                                                                <FormLabel>Apellido</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Apellido del testigo"
                                                                        {...field}
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <FormField
                                                        control={control}
                                                        name={`testigos.${index}.email`}
                                                        render={({field}) => (
                                                            <FormItem
                                                                className="w-full">
                                                                <FormLabel>Email</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Email del testigo"
                                                                        {...field}
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={control}
                                                        name={`testigos.${index}.address`}
                                                        render={({field}) => (
                                                            <FormItem
                                                                className="w-full">
                                                                <FormLabel>Dirección</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Dirección"
                                                                        {...field}
                                                                        className="w-full"
                                                                        type="text"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div>
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeTestigo(index)}
                                                        variant="destructive"
                                                        className="mt-4"
                                                    >
                                                        <span className="mr-1">Eliminar</span> <Trash2/>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            appendTestigo({
                                                name: "",
                                                lastName: "",
                                                rut: "",
                                                email: "",
                                                address: ""
                                            })
                                        }
                                        className="mt-4"
                                    >
                                        <span className="mr-1">Agregar nuevo testigo</span> <UserRoundPlus/>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                        <Button
                            type="submit">
                            Crear registro de agresión
                        </Button>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default FormCreateAgresion;