import * as React from "react";
import {cn} from "@/lib/utils";

const formatRUT = (rut: string): string => {
    const cleaned = rut.replace(/\D/g, "");

    let body = cleaned.slice(0, -1);
    const verifier = cleaned.slice(-1);

    body = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return body ? `${body}-${verifier}` : verifier;
};

const InputRut = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({className, type, ...props}, ref) => {
        const [value, setValue] = React.useState("");

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(formatRUT(e.target.value));
        };

        return (
            <input
                type={type}
                className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    className
                )}
                ref={ref}
                value={value}
                onChange={handleChange}
                {...props}
            />
        );
    }
);
InputRut.displayName = "InputRut";

export {InputRut};