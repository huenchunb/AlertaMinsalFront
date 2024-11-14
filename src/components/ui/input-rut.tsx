import * as React from "react";
import { cn } from "@/lib/utils";

const formatRut = (rut: string): string => {
    const cleanRut = rut.replace(/[^0-9kK]/g, ""); // Elimina caracteres no válidos
    const dv = cleanRut.slice(-1).toUpperCase(); // Obtiene el dígito verificador
    let rutBody = cleanRut.slice(0, -1);

    // Agrega puntos cada tres dígitos
    rutBody = rutBody.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${rutBody}-${dv}`;
};

interface InputRutProps extends React.ComponentProps<"input"> {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
}

const InputRut: React.FC<InputRutProps> = React.forwardRef(
    ({ onChange, value, className, ...props }, ref) => {
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const formattedValue = formatRut(e.target.value);
            onChange({ ...e, target: { ...e.target, value: formattedValue } }); // Actualiza el valor formateado
        };

        return (
            <input
                {...props}
                ref={ref}
                className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    className
                )}
                value={value}
                onChange={handleInputChange}
            />
        );
    }
);

InputRut.displayName = "InputRut";

export { InputRut };
