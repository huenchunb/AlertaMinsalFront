import React, {useState} from 'react';
import {z} from "zod";
import {isValidRUT} from "@/utils/functions";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {api, useCreateEmpleadosMutation, useGetDefaultsQuery} from "@/features/api";
import {CreateEmpleadoRequestBody} from "@/features/api/types";
import {Spinner} from "@/components/ui/spinner";
import {InputRut} from "@/components/ui/input-rut";
import {Alert} from "@/components/ui/alert";
import {useAppDispatch} from "@/store/hooks";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {MessageSquareWarning} from "lucide-react"

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
    const dispatch = useAppDispatch();
    const [showErrors, setShowErrors] = useState<{
        errorCreatingUser: boolean,
        errorRoleNotFound: boolean,
        errorGetDefaults: boolean
    }>({errorCreatingUser: false, errorRoleNotFound: false, errorGetDefaults: false});

    const [showUserCreatedSuccess, setShowUserCreatedSuccess] = useState(false);

    const {data, isLoading: isLoadingDefaults} = useGetDefaultsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        refetchOnFocus: true,
    });

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

    const {handleSubmit, control} = form;

    const [createEmpleado, {isLoading}] = useCreateEmpleadosMutation();

    const onSubmit = (values: z.infer<typeof formCreateEmpleadoSchema>) => {
        setShowErrors({...showErrors, errorCreatingUser: false, errorRoleNotFound: false});
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
                setShowUserCreatedSuccess(true);
                dispatch(api.util.invalidateTags(['Empleados']));
            })
            .catch((error) => {
                if (error.status === 400 && Number(error.data.detail) === 1000) {
                    setShowErrors({...showErrors, errorCreatingUser: true})
                }
                if (error.status === 400 && Number(error.data.detail) === 1001) {
                    setShowErrors({...showErrors, errorRoleNotFound: true})
                }
            });
    }


    const handleRenderForm = () => {
        if (data) {
            return (
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={control}
                            name="rut"
                            render={({field}) => (
                                <FormItem>
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
                        <div className="flex flex-col gap-4">
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
                                                <span className="italic">El empleado quedará asociado a este establecimiento.</span>
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div>
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
                        {showErrors.errorCreatingUser && (
                            <Alert variant="destructive">
                                El empleado ya se encuentra registrado. Intenta con otro RUN o correo electrónico.
                            </Alert>
                        )}
                        {showErrors.errorRoleNotFound && (
                            <Alert variant="destructive">
                                Ocurrió un error al crear el usuario y asignar el rol. Si el problema persiste, contacta
                                al administrador.
                            </Alert>
                        )}
                        {showUserCreatedSuccess && (
                            <Alert>
                                Empleado registrado con éxito
                            </Alert>
                        )}
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