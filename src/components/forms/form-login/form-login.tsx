"use client";

import React, {useState} from 'react';
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useLoginMutation} from "@/features/api";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {Spinner} from "@/components/ui/spinner";
import Cookies from "js-cookie";

export const formLoginSchema = z.object({
    email: z.string({required_error: "Ingresa un correo electrónico"}).email({message: "El correo electrónico no es válido"}),
    password: z.string({required_error: "Ingresa una contraseña"}).min(8, {
        message: "La contraseña debe tener 8 caracteres"
    }).max(20, {
        message: "La contraseña debe tener 20 caracteres máximo"
    })
})

const FormLogin = () => {
    const form = useForm<z.infer<typeof formLoginSchema>>({
        resolver: zodResolver(formLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const [invalidCredentials, setInvalidCredentials] = useState<boolean>(false);
    const {handleSubmit, control} = form;
    const router = useRouter();
    const [loginTrigger, {isLoading}] = useLoginMutation();

    const handleLogin = (values: z.infer<typeof formLoginSchema>) => {
        setInvalidCredentials(false);
        loginTrigger({email: values.email, password: values.password})
            .unwrap()
            .then((response) => {
                Cookies.set('accessToken', response.accessToken, {expires: 1, path: '/'}); // 'expires' en días
                setTimeout(() => {
                    router.push('/dashboard');
                }, 3000);
            })
            .catch((error) => {
                if (error && error.status === 401) {
                    setInvalidCredentials(true);
                }
            });
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col w-full gap-4">
                <FormField
                    control={control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Ingresa tu correo electrónico" {...field} className="w-full"
                                       type="text"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Ingresa tu contraseña" {...field} className="w-full"
                                       type="password"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                {invalidCredentials && (
                    <Alert variant="destructive">
                        <AlertTitle className="text-lg">Credenciales inválidas</AlertTitle>
                        <AlertDescription>Tu correo o contraseña son inválidos. Intenta nuevamente.</AlertDescription>
                    </Alert>
                )}
                {isLoading ? (
                    <div className="w-full flex justify-center">
                        <Spinner size={40}/>
                    </div>
                ) : (
                    <Button type="submit">Entrar</Button>
                )}
            </form>
        </Form>
    );
};

export default FormLogin;