"use client";

import React, { useEffect, useRef } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import { AgresionGeoLocationDto } from "@/features/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital } from "lucide-react";

interface MapProps {
  data: AgresionGeoLocationDto[] | undefined;
}

export const Map: React.FC<MapProps> = ({ data }) => {
  const isInitialized = useRef(false);
  useEffect(() => {
    isInitialized.current = true;
    return () => {
      isInitialized.current = false;
    };
  }, []);
  if (!isInitialized) return null;

  const getColor = (quantity: number) => {
    return quantity >= 20
      ? "red"
      : quantity < 20 && quantity >= 10
      ? "#FF0000"
      : quantity > 5
      ? "#FFD000"
      : "#65A653";
  };

  const getRadius = (quantity: number) => {
    return quantity >= 20
      ? 50
      : quantity < 20 && quantity >= 10
      ? 40
      : quantity > 5
      ? 30
      : 20;
  };

  return (
    <MapContainer
      center={[-33.4829435561465, -70.6551455415621]}
      zoom={11}
      className="w-full h-full rounded"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {data &&
        data.map((location) => (
          <CircleMarker
            key={location.id}
            center={[location.longitude, location.latitude]}
            pathOptions={{
              color: `${getColor(
                location.totalAgresionesFisicas +
                  location.totalAgresionesVerbales
              )}`,
            }}
            radius={getRadius(
              location.totalAgresionesFisicas + location.totalAgresionesVerbales
            )}
          >
            <Popup>
              <Card className="p-2">
                <CardHeader className="p-2">
                  <CardTitle className="p-0 flex items-center">
                    <Hospital size={20} />
                    <span className="ml-2">{location.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="flex flex-col">
                    <div className="flex justify-between">
                      <span>Arma de fuego</span>
                      <span className="font-bold">
                        {location.agresionConArmaFuego}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Arma blanca</span>
                      <span className="font-bold">
                        {location.agresionesConArmaBlanca}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Objeto contundente</span>
                      <span className="font-bold">
                        {location.agresionesConObjetoContundente}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Agresiones sexuales</span>
                      <span className="font-bold">
                        {location.agresionesSexualesTocaciones}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Empujones o combos</span>
                      <span className="font-bold">
                        {location.agresionesEmpujonesCombos}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daño contra infraestructura</span>
                      <span className="font-bold">
                        {location.agresionesInfraestructura}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Otras agresiones físicas</span>
                      <span className="font-bold">
                        {location.agresionesOtro}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lenguaje con connotación sexual</span>
                      <span className="font-bold">
                        {location.agresionesSexualesLenguaje}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amenazas u hostigamiento</span>
                      <span className="font-bold">
                        {location.agresionesAmenazas}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insultos o garabatos</span>
                      <span className="font-bold">
                        {location.agresionesInsultos}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Burlas o descalificaciones</span>
                      <span className="font-bold">
                        {location.agresionesBurlas}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Calumnias por redes sociales</span>
                      <span className="font-bold">
                        {location.agresionesRedesSociales}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Otro agresión verbal</span>
                      <span className="font-bold">
                        {location.agresionesOtroVerbal}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Popup>
          </CircleMarker>
        ))}
    </MapContainer>
  );
};
