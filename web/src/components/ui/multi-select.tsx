import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
    CheckIcon,
    ChevronDown,
    WandSparkles,
    X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva(
    "m-1 transition ease-in-out delay-150 duration-300",
    {
        variants: {
            variant: {
                default:
                    "border-slate-700 text-slate-200 bg-slate-900 hover:bg-slate-800/80",
                secondary:
                    "border-slate-700 bg-slate-600 text-slate-300 hover:bg-slate-600/80",
                destructive:
                    "border-transparent bg-red-500 text-red-800 hover:bg-red-500/80",
                inverted: "inverted",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
    /**
     * An array of option objects to be displayed in the multi-select component.
     * Each option object has a label, value, and an optional icon.
     */
    options: {
        /** The text to display for the option. */
        label: string;
        /** The unique value associated with the option. */
        value: string;
        /** Optional icon component to display alongside the option. */
        icon?: React.ComponentType<{ className?: string }>;
    }[];

    /**
     * Callback function triggered when the selected values change.
     * Receives an array of the new selected values.
     */
    onValueChange: (value: string[]) => void;

    /** The default selected values when the component mounts. */
    defaultValue?: string[];

    /**
     * Placeholder text to be displayed when no values are selected.
     * Optional, defaults to "Select options".
     */
    placeholder?: string;

    /**
     * Animation duration in seconds for the visual effects (e.g., bouncing badges).
     * Optional, defaults to 0 (no animation).
     */
    animation?: number;

    /**
     * Maximum number of items to display. Extra selected items will be summarized.
     * Optional, defaults to 3.
     */
    maxCount?: number;

    /**
     * The modality of the popover. When set to true, interaction with outside elements
     * will be disabled and only popover content will be visible to screen readers.
     * Optional, defaults to false.
     */
    modalPopover?: boolean;

    /**
     * If true, renders the multi-select component as a child of another component.
     * Optional, defaults to false.
     */
    asChild?: boolean;

    /**
     * Additional class names to apply custom styles to the multi-select component.
     * Optional, can be used to add custom styles.
     */
    className?: string;
}

export const MultiSelect = React.forwardRef<
    HTMLButtonElement,
    MultiSelectProps
>(
    (
        {
            options,
            onValueChange,
            variant,
            defaultValue = [],
            placeholder = "Selecione uma opção",
            animation = 0,
            maxCount = 3,
            modalPopover = false,
            asChild = false,
            className,
            ...props
        },
        ref
    ) => {
        const [selectedValues, setSelectedValues] =
            React.useState<string[]>(defaultValue);
        const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
        const [isAnimating, setIsAnimating] = React.useState(false);

        const handleInputKeyDown = (
            event: React.KeyboardEvent<HTMLInputElement>
        ) => {
            if (event.key === "Enter") {
                setIsPopoverOpen(true);
            } else if (event.key === "Backspace" && !event.currentTarget.value) {
                const newSelectedValues = [...selectedValues];
                newSelectedValues.pop();
                setSelectedValues(newSelectedValues);
                onValueChange(newSelectedValues);
            }
        };

        const toggleOption = (option: string) => {
            const newSelectedValues = selectedValues.includes(option)
                ? selectedValues.filter((value) => value !== option)
                : [...selectedValues, option];
            setSelectedValues(newSelectedValues);
            onValueChange(newSelectedValues);
        };

        const handleClear = () => {
            setSelectedValues([]);
            onValueChange([]);
        };

        const handleTogglePopover = () => {
            setIsPopoverOpen((prev) => !prev);
        };

        const clearExtraOptions = () => {
            const newSelectedValues = selectedValues.slice(0, maxCount);
            setSelectedValues(newSelectedValues);
            onValueChange(newSelectedValues);
        };

        const toggleAll = () => {
            if (selectedValues.length === options.length) {
                handleClear();
            } else {
                const allValues = options.map((option) => option.value);
                setSelectedValues(allValues);
                onValueChange(allValues);
            }
        };

        return (
            <Popover
                open={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
                modal={modalPopover}
            >
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        {...props}
                        onClick={handleTogglePopover}
                        className={cn(
                            "flex w-full hover:bg-slate-800 p-1 rounded-md border border-slate-700 bg-slate-800 min-h-10 h-auto items-center justify-between",
                            className
                        )}
                    >
                        {selectedValues.length > 0 ? (
                            <div className="flex justify-between items-center w-full">
                                <div className="flex flex-wrap items-center">
                                    {selectedValues.slice(0, maxCount).map((value) => {
                                        const option = options.find((o) => o.value === value);
                                        const IconComponent = option?.icon;
                                        return (
                                            <Badge
                                                key={value}
                                                className={cn(
                                                    isAnimating ? "animate-bounce" : "",
                                                    multiSelectVariants({ variant })
                                                )}
                                                style={{ animationDuration: `${animation}s` }}
                                            >
                                                {IconComponent && (
                                                    <IconComponent className="h-4 w-4 mr-2" />
                                                )}
                                                
                                                {option?.label}

                                                <X
                                                    className="ml-2 size-3 cursor-pointer"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        toggleOption(value);
                                                    }}
                                                />
                                            </Badge>
                                        );
                                    })}

                                    {selectedValues.length > maxCount && (
                                        <Badge
                                            className={cn(
                                                "bg-transparent text-slate-200 border-slate-800 hover:bg-transparent",
                                                isAnimating ? "animate-bounce" : "",
                                                multiSelectVariants({ variant })
                                            )}
                                            style={{ animationDuration: `${animation}s` }}
                                        >
                                            {`+ ${selectedValues.length - maxCount} itens`}

                                            <X
                                                className="ml-2 size-3 cursor-pointer"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    clearExtraOptions();
                                                }}
                                            />
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <X
                                        className="h-4 mx-2 cursor-pointer text-slate-400"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleClear();
                                        }}
                                    />

                                    <Separator
                                        orientation="vertical"
                                        className="flex min-h-6 h-full"
                                    />

                                    <ChevronDown className="h-4 mx-2 cursor-pointer text-slate-400" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between w-full mx-auto">
                                <span className="text-sm font-normal text-slate-200 mx-3">
                                    {placeholder}
                                </span>
                                
                                <ChevronDown className="h-4 cursor-pointer text-slate-400 mx-2" />
                            </div>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    sideOffset={8}
                    onEscapeKeyDown={() => setIsPopoverOpen(false)}
                >
                    <Command>
                        <CommandInput
                            placeholder="Procurar..."
                            onKeyDown={handleInputKeyDown}
                        />
                        <CommandList>
                            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

                            <CommandGroup>
                                <CommandItem
                                    key="all"
                                    onSelect={toggleAll}
                                    className="cursor-pointer"
                                >
                                    <div
                                        className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-slate-400",
                                            selectedValues.length === options.length
                                                ? "bg-slate-800 text-slate-200"
                                                : "opacity-50 [&_svg]:invisible"
                                        )}
                                    >
                                        <CheckIcon className="h-4 w-4" />
                                    </div>

                                    <span>(Selecionar todos)</span>
                                </CommandItem>

                                {options.map((option) => {
                                    const isSelected = selectedValues.includes(option.value);
                                    
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() => toggleOption(option.value)}
                                            className="cursor-pointer"
                                        >
                                            <div
                                                className={cn(
                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-slate-400",
                                                    isSelected
                                                        ? "bg-lime-600 border-lime-600 text-lime-50"
                                                        : "opacity-50 [&_svg]:invisible"
                                                )}
                                            >
                                                <CheckIcon className="h-4 w-4" />
                                            </div>

                                            {option.icon && (
                                                <option.icon className="mr-2 h-4 w-4 text-slate-200" />
                                            )}
                                            
                                            <span>{option.label}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>

                            <CommandSeparator />
                            
                            <CommandGroup>
                                <div className="flex items-center justify-between">
                                    {selectedValues.length > 0 && (
                                        <>
                                            <CommandItem
                                                onSelect={handleClear}
                                                className="flex-1 text-slate-400 justify-center cursor-pointer"
                                            >
                                                Limpar
                                            </CommandItem>

                                            <Separator
                                                orientation="vertical"
                                                className="flex min-h-6 h-full"
                                            />
                                        </>
                                    )}
                                    
                                    <CommandItem
                                        onSelect={() => setIsPopoverOpen(false)}
                                        className="flex-1 text-slate-400 justify-center cursor-pointer max-w-full"
                                    >
                                        Fechar
                                    </CommandItem>
                                </div>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
                
                {animation > 0 && selectedValues.length > 0 && (
                    <WandSparkles
                        className={cn(
                            "cursor-pointer my-2 text-slate-200 bg-slate-800 size-3",
                            isAnimating ? "" : "text-slate-400"
                        )}
                        onClick={() => setIsAnimating(!isAnimating)}
                    />
                )}
            </Popover>
        );
    }
);

MultiSelect.displayName = "MultiSelect";