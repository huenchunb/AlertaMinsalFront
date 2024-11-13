import React, {useState} from 'react';
import {z} from "zod";
import {isValidRUT} from "@/utils/functions";
import {Form, FormControl, FormDescription, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Combobox from "@/components/combobox/combobox";
import {api, useCreateEmpleadosMutation, useGetDefaultsQuery} from "@/features/api";
import {CreateEmpleadoRequestBody} from "@/features/api/types";
import {Spinner} from "@/components/ui/spinner";
import {InputRut} from "@/components/ui/input-rut";
import {Alert} from "@/components/ui/alert";
import {useAppDispatch} from "@/store/hooks";

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
    comunaId: z.number({required_error: "Selecciona una comuna"}),
    mutualidadId: z.number({required_error: "Selecciona una mutualidad"}),
    estamentoId: z.number({required_error: "Selecciona un estamento"}),
    establecimientoId: z.number({required_error: "Selecciona un establecimiento"}),
})

const FormCreateEmpleado = () => {
    const dispatch = useAppDispatch();
    const [showErrors, setShowErrors] = useState<{
        errorCreatingUser: boolean,
        errorGetDefaults: boolean
    }>({errorCreatingUser: false, errorGetDefaults: false});

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
            comunaId: 0,
            mutualidadId: 0,
            estamentoId: 0,
            establecimientoId: 0
        }
    });

    const {handleSubmit, control} = form;

    const [createEmpleado, {isLoading, error}] = useCreateEmpleadosMutation();

    const onSubmit = (values: z.infer<typeof formCreateEmpleadoSchema>) => {
        const empleado: CreateEmpleadoRequestBody = {
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

        createEmpleado(empleado)
            .unwrap()
            .then(() => {
                setShowUserCreatedSuccess(true);
                dispatch(api.util.invalidateTags(['Empleados']));
            })
            .catch((error) => {
                if (error.status === 400) {
                    setShowErrors({...showErrors, errorCreatingUser: true})
                }
            });
    }

    console.log(error)

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
                                        <InputRut placeholder="RUN" {...field} className="w-full"
                                                  type="text"/>
                                    </FormControl>
                                    <FormDescription>
                                        Ingresa el RUN sin puntos ni guiones, el sistema lo formateará automáticamente.
                                        👏
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
                            <Combobox control={control as never} name={"comunaId" as never} label={"Comuna"}
                                      data={data.comunas}/>
                            <Combobox control={control as never} name={"establecimientoId" as never}
                                      label={"Establecimiento"}
                                      data={data.establecimientos}/>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Combobox control={control as never} name={"estamentoId" as never} label={"Estamento"}
                                      data={data.estamentos}/>
                            <Combobox control={control as never} name={"mutualidadId" as never} label={"Mutualidad"}
                                      data={data.mutualidades}/>
                        </div>
                        {showErrors.errorCreatingUser && (
                            <Alert variant="destructive">
                                El empleado ya se encuentra registrado. Intenta con otro RUN o correo electrónico.
                            </Alert>
                        )}
                        {showUserCreatedSuccess && (
                            <Alert >
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