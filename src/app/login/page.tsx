"use client"

import React from 'react';
import {useLoginMutation} from "@/features/api";
import {useRouter} from 'next/navigation';

const LoginPage = () => {
    const router = useRouter();
    const [loginTrigger] = useLoginMutation();

    const handleLogin = async () => {
        try {
            await loginTrigger({email: "administrator@localhost", password: "Administrator1!"})
                .unwrap()
                .then(() => router.push("/dashboard"))
                .catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error('Error', error);
        }
    }

    return (
        <div>
            <button onClick={handleLogin}>Iniciar sesión</button>
        </div>
    );
};

export default LoginPage;