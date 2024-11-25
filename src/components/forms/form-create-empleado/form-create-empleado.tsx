import React, {useEffect, useState} from 'react';
import {z} from "zod";
import {isValidRUT} from "@/utils/functions";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
    useCreateEmpleadosMutation,
    useGetDefaultsQuery,
    useGetUserByEmailQuery,
    useGetUserInfoQuery
} from "@/features/api";
import {CreateEmpleadoRequestBody, LookupDto} from "@/features/api/types";
import {Spinner} from "@/components/ui/spinner";
import {InputRut} from "@/components/ui/input-rut";
import {Alert} from "@/components/ui/alert";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {CircleCheckBig, CircleX, MessageSquareWarning} from "lucide-react"
import {toast} from "@/hooks/use-toast";

export const formCreateEmpleadoSchema = z.object({
    rut: z.string({required_error: "Ingresa un RUT"})
        .refine(value => isValidRUT(value), {message: "El RUT no es válido"}),
    firstName: z.string({required_error: "Ingresa un nombre"}).max(100),
    lastName: z.string({required_error: "Ingresa un apellido"}).max(100),
    email: z.string({required_error: "Ingresa un correo electrónico"}).email({message: "El correo electrónico no es válido"}),
    phoneNumber: z.string({required_error: "Ingresa un número de teléfono"})
        .regex(/^\d{9}$/, {message: "El número de teléfono debe contener solo 9 dígitos"}),
    address: z.string({required_error: "Ingresa una dirección"}).max(254),
    streetNumber: z.string({required_error: "Ingresa un número de calle"}).max(50),
    comunaId: z.string({required_error: "Selecciona una comuna"}),
    mutualidadId: z.string({required_error: "Selecciona una mutualidad"}),
    estamentoId: z.string({required_error: "Selecciona un estamento"}),
    establecimientoId: z.string({required_error: "Selecciona un establecimiento"}),
    rol: z.string({required_error: "Selecciona un rol"})
})

const FormCreateEmpleado = () => {
    const [filteredEstablecimientos, setFilteredEstablecimientos] = useState<LookupDto[]>([]);

    const {data, isLoading: isLoadingDefaults} = useGetDefaultsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        refetchOnFocus: true,
    });

    const {data: userInfo} = useGetUserInfoQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true
    });

    const {data: user} = useGetUserByEmailQuery(userInfo?.email ?? "", {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true
    })

    useEffect(() => {
        if (data) {
            if (user) {
                setFilteredEstablecimientos(data.establecimientos.filter(x => x.id === user.establecimientoId));
            } else {
                setFilteredEstablecimientos(data.establecimientos);
            }
        }else{
            setFilteredEstablecimientos([]);
        }
    }, [data, user]);

    const form = useForm<z.infer<typeof formCreateEmpleadoSchema>>({
        resolver: zodResolver(formCreateEmpleadoSchema),
        defaultValues: {
            rut: "",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            address: "",
            streetNumber: "",
            comunaId: "",
            mutualidadId: "",
            estamentoId: "",
            establecimientoId: "",
            rol: ""
        }
    });

    const {handleSubmit, control, getValues} = form;

    const [createEmpleado, {isLoading}] = useCreateEmpleadosMutation();

    const onSubmit = (values: z.infer<typeof formCreateEmpleadoSchema>) => {
        const empleado: CreateEmpleadoRequestBody = {
            rut: values.rut,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: Number(values.phoneNumber),
            address: values.address,
            streetNumber: values.streetNumber,
            comunaId: Number(values.comunaId),
            mutualidadId: Number(values.mutualidadId),
            estamentoId: Number(values.estamentoId),
            establecimientoId: Number(values.establecimientoId),
            imageUrl: "https://ui.shadcn.com/avatars/01.png",
            role: values.rol
        };

        createEmpleado(empleado)
            .unwrap()
            .then(() => {

                const currentValues = getValues(["mutualidadId", "estamentoId", "establecimientoId", "comunaId", "rol"])

                form.reset({
                    ...currentValues,
                    rut: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    phoneNumber: "",
                    address: "",
                    streetNumber: "",
                })

                toast({
                    title: "Registro éxitoso",
                    description: (
                        <Alert className="border border-green-600 bg-green-100">
                            <div className="flex start">
                                <p className="text-green-800 mr-2">
                                    Empleado registrado correctamente
                                </p> <CircleCheckBig size={20} className="text-green-800"/>
                            </div>
                        </Alert>
                    ),
                });
            })
            .catch((error) => {
                if (error.status === 400 && Number(error.data.detail) === 1000) {
                    toast({
                        title: "Ha ocurrido un error",
                        description: (
                            <Alert className="border border-red-600 bg-red-100">
                                <div className="flex start">
                                    <p className="text-red-800 mr-2">El usuario ya se encuentra registrado.
                                    </p> <CircleX size={20} className="text-red-800"/>
                                </div>
                            </Alert>
                        ),
                    });
                }
                if (error.status === 400 && Number(error.data.detail) === 1001) {
                    toast({
                        title: "Ha ocurrido un error",
                        description: (
                            <Alert className="border border-red-600 bg-red-100 w-full">
                                <div className="flex start">
                                    <CircleX size={20} className="text-red-800"/><p className="text-red-800 mr-2">El rol
                                    que se intenta asignar no existe.</p>
                                </div>
                            </Alert>
                        ),
                    });
                }
            });
    }


    const handleRenderForm = () => {
        if (data) {
            return (
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-row gap-4">
                            <div className="w-full">
                                <FormField
                                    control={control}
                                    name="rut"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>RUN</FormLabel>
                                            <FormMessage/>
                                            <FormControl>
                                                <InputRut
                                                    placeholder="RUN"
                                                    {...field}
                                                    className="w-full"
                                                    type="text"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Ingresa el RUN sin puntos ni guiones.
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full">
                                <FormField
                                    control={control}
                                    name="firstName"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Primer nombre" {...field} className="w-full"
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
                                            <FormLabel>Apellido</FormLabel>
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
                        <div className="flex flex-row gap-4">
                            <div className="w-full">
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
                            </div>
                            <div className="w-full">
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
                            </div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <div className="w-full">
                                <FormField
                                    control={control}
                                    name="address"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Dirección</FormLabel>
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
                                            <FormLabel>Númeración</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Número" {...field} className="w-full"
                                                       type="text"/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full">
                                <FormField
                                    control={form.control}
                                    name="comunaId"
                                    render={({field}) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Comuna</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona una comuna"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {data.comunas.map((comuna) => (
                                                        <SelectItem key={comuna.id} value={comuna.id.toString()}>
                                                            <span className="capitalize">{comuna.name}</span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <div className="w-full">
                                <FormField
                                    control={form.control}
                                    name="mutualidadId"
                                    render={({field}) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Mutualidad</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona una mutualidad"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {data.mutualidades.map((mutualidad) => (
                                                        <SelectItem key={mutualidad.id}
                                                                    value={mutualidad.id.toString()}>
                                                            {mutualidad.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <div className="w-full">
                                <FormField
                                    control={form.control}
                                    name="estamentoId"
                                    render={({field}) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Estamento</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona una estamento"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {data.estamentos.map((estamento) => (
                                                        <SelectItem key={estamento.id} value={estamento.id.toString()}>
                                                            {estamento.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full">
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
                                                    {filteredEstablecimientos.map((establecimiento) => (
                                                        <SelectItem key={establecimiento.id}
                                                                    value={establecimiento.id.toString()}>
                                                            {establecimiento.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                            <FormDescription className="flex gap-2">
                                                <span className="italic">El empleado quedará asociado a este establecimiento.</span>
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <div className="w-1/2">
                                <FormField
                                    control={form.control}
                                    name="rol"
                                    render={({field}) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Rol</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona un rol"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {data.roles.filter(x => x.name != "Administrator").map((rol) => (
                                                        <SelectItem key={rol.id}
                                                                    value={rol.id.toString()}>
                                                            {rol.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                            <FormDescription className="flex gap-2">
                                                <MessageSquareWarning className="text-amber-500"/>
                                                <span className="italic">El rol que se le asigne al
                                                empleado, serán los privilegios que
                                                tendrá en la plataforma.</span>
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </div>
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
            )
        }
    }

    const handleRenderIsLoading = () => {
        if (isLoading) {
            return (
                <Spinner size={40}/>
            )
        }
    }

    return (
        <>
            {isLoadingDefaults && !data ? handleRenderIsLoading() : handleRenderForm()}
        </>
    );
};

export default FormCreateEmpleado;