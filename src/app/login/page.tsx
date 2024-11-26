"use client";

import React from "react";
import Image from "next/image";
import FormLogin from "@/components/forms/form-login/form-login";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

const LoginPage = () => {
    return (
        <main className="grid grid-cols-1 xl:grid-cols-2 h-screen w-full">
            <div className="w-full h-full bg-black flex flex-col xl:justify-end p-4 relative">
                <Image
                    src="/img/bg-login.jpg"
                    alt="Background"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    priority
                    className="z-0"
                />
                <div className="flex justify-end xl:items-end">
                    <Image src="/img/color-minsal.png" alt={"logo minsal"} width={120} height={80}
                           className="z-20 hidden md:flex"/>
                </div>
            </div>
            <div className="bg-white h-full flex justify-center items-center p-4">
                <div className="xl:w-1/2">
                    <Card className="border-none shadow-none p-0 w-full">
                        <CardHeader className="flex flex-col items-center">
                            <Image src={"/img/logo-minsal.png"} alt={"logo"} width={200} height={80} className="mr-4"/>
                            <CardTitle className="font-bold text-xl text-center">Iniciar sesión</CardTitle>
                            <CardDescription className="text-gray-400 p-0">
                                Ingresa tu correo electrónico para acceder
                            </CardDescription>
                        </CardHeader>
                        <FormLogin/>
                    </Card>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
