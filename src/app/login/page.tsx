"use client";

import React from "react";
import Image from "next/image";
import FormLogin from "@/components/forms/form-login/form-login";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LoginPage = () => {
  return (
    <main className="flex justify-center items-center h-screen w-screen">
      <Card className="z-10 w-1/3">
        <CardHeader>
          <div className="flex flex-col items-center">
            <Image
              src={"/img/logo-minsal.png"}
              alt={"Alerta Minsal"}
              width={340}
              height={150}
              className="mb-2"
            />
            <CardTitle className="text-2xl">
              Plataforma de gestión de agresiones
            </CardTitle>
            <CardDescription className="italic">
              Cuidar a quienes nos cuidan asegura un futuro más humano
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <FormLogin />
        </CardContent>
      </Card>
    </main>
  );
};

export default LoginPage;
