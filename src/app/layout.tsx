"use client"

import localFont from "next/font/local";
import "./globals.css";
import {ReactNode} from "react";
import {Provider} from "react-redux";
import {store} from "@/store";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <Provider store={store}>
            <html lang="es">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
            {children}
            </body>
            </html>
        </Provider>
    );
}
