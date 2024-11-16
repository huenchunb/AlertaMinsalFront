"use client";

import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useGetDefaultsQuery} from "@/features/api";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import React, {useEffect} from "react";
import {EmpleadoDefaultDto, LookupDto} from "@/features/api/types";
import {Alert} from "@/components/ui/alert";
import {CalendarIcon, Info} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Calendar} from "@/components/ui/calendar";
import {format} from "date-fns";
import {es} from "date-fns/locale"
import {Checkbox} from "@/components/ui/checkbox";

export const formCreateAgresionSchema = z.object({
    fechaAgresion: z.date({required_error: "La fecha de la agresión es requerida"}),
    establecimientoId: z.string({message: "El establecimiento es requerido"}),
    empleadoId: z.string({message: "Seleccione un empleado"}),
    tipoAgresionId: z.string({required_error: "Selecciona un tipo de agresión"}),
    categoriasAgresionesId: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "Debes seleccionar al menos un tipo de agresión",
    })
});

const FormCreateAgresion = () => {
    const {data} = useGetDefaultsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        refetchOnFocus: true,
    });

    const [empleados, setEmpleados] = React.useState<EmpleadoDefaultDto[]>([]);
    const [categorias, setCategorias] = React.useState<LookupDto[]>([]);


    const form = useForm<z.infer<typeof formCreateAgresionSchema>>({
        resolver: zodResolver(formCreateAgresionSchema),
        defaultValues: {
            fechaAgresion: new Date(),
            establecimientoId: "0",
            empleadoId: "0",
            tipoAgresionId: "0",
            categoriasAgresionesId: []
        }
    });

    const {handleSubmit, watch, setValue} = form;

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
    }, [data, establecimientoId, tipoAgresionId]);


    const onSubmit = (values: z.infer<typeof formCreateAgresionSchema>) => {
        console.log(values);
    };

    return (
        <div className="mb-4">
            {data && (
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <FormField
                                control={form.control}
                                name="establecimientoId"
                                render={({field}) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Establecimiento de salud</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un establecimiento"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {data.establecimientos.map((establecimiento) => (
                                                    <SelectItem key={establecimiento.id}
                                                                value={establecimiento.id.toString()}>
                                                        ({establecimiento.id}) {establecimiento.name}
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
                                            control={form.control}
                                            name="empleadoId"
                                            render={({field}) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>Empleados del establecimiento</FormLabel>
                                                    <Select onValueChange={field.onChange}
                                                            defaultValue={field.value}>
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
                                                    control={form.control}
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
                                                    control={form.control}
                                                    name="tipoAgresionId"
                                                    render={({field}) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>Tipo de agresion</FormLabel>
                                                            <Select onValueChange={field.onChange}
                                                                    defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue
                                                                            placeholder="Selecciona un establecimiento"/>
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
                                                control={form.control}
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
                                                                control={form.control}
                                                                name="categoriasAgresionesId"
                                                                render={({field}) => (
                                                                    <FormItem
                                                                        key={item.id}
                                                                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value?.includes(item.id.toString())}
                                                                                onCheckedChange={(checked) => {
                                                                                    const newValue = checked
                                                                                        ? [...field.value, item.id.toString()]
                                                                                        : field.value.filter((value) => value !== item.id.toString());
                                                                                    field.onChange(newValue);
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
                    </form>
                </Form>
            )}
        </div>
    )
}

export default FormCreateAgresion;