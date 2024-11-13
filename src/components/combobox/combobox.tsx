import React from 'react';
import {FormControl, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Control, useController} from "react-hook-form";
import {LookupDto} from "@/features/api/types";

export interface SelectItems {
    label: string,
    value: number
}

interface ComboBoxProps {
    control: Control<never>;
    name: never;
    label: string;
    data: LookupDto[]
}

const ComboBox: React.FC<ComboBoxProps> = ({control, name, label, data}) => {
    const {field, fieldState} = useController({name, control});

    return (
        <FormItem className="flex flex-col w-full">
            <FormLabel>{label}</FormLabel>
            <Popover>
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                            )}
                        >
                            {field.value
                                ? data.find((item) => item.id === field.value)?.name
                                : "Selecciona"}
                            <ChevronsUpDown className="opacity-50"/>
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Buscar..." className="h-9"/>
                        <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                                {data.map((item) => (
                                    <CommandItem
                                        value={item.name}
                                        key={item.id}
                                        onSelect={() => field.onChange(item.id)}
                                    >
                                        {item.name}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                item.id === field.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
    );
};

export default ComboBox;