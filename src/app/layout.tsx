"use client";

import localFont from "next/font/local";
import "./globals.css";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { persistor, store } from "@/store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "@/components/ui/toaster";
import "leaflet/dist/leaflet.css";

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
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            {children}
            <Toaster />
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
