import { Button } from "@/components/ui/button";

import { Control, Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";

import { Search, X } from "lucide-react";

import { Controller, useForm } from "react-hook-form";

import { useSearchParams } from "react-router-dom";

import { z } from "zod";

const searchFilterFormSchema = z.object({
    athleteName: z.string().optional(),
    gender: z.string().optional()
})

type SearchFilterForm = z.infer<typeof searchFilterFormSchema>;

export function AthleteTableFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    const athleteName = searchParams.get("athleteName");
    const gender = searchParams.get("gender");

    const { handleSubmit, control, register, reset, formState: { isSubmitting } } = useForm<SearchFilterForm>({
        resolver: zodResolver(searchFilterFormSchema),

        defaultValues: {
            athleteName: athleteName ?? "",
            gender: gender ?? "all"
        }
    })

    function handleFilter({ athleteName, gender }: SearchFilterForm) {
        setSearchParams((state) => {
            if (athleteName) {
                state.set("athleteName", athleteName);
            }

            else {
                state.delete("athleteName");
            }

            if (gender) {
                state.set("gender", gender);
            }

            else {
                state.delete("gender");
            }

            state.set("page", "1");

            return state;
        })
    }

    function handleClearFilters() {
        setSearchParams((state) => {
            state.delete("athleteName");
            state.delete("gender");

            state.set("page", "1");

            return state;
        })

        reset({ athleteName: "", gender: "all" });
    }

    return (
        <form method="GET" className="flex flex-col md:flex-row items-center gap-2 w-full" onSubmit={handleSubmit(handleFilter)}>
            <span className="text-sm font-semibold hidden md:inline-block">Filtros:</span>

            <div className="w-full md:w-fit">
                <Label htmlFor="athlete-name" className="sr-only">Nome do atleta</Label>

                <Input variant="filter">
                    <Control
                        id="athlete-name"
                        placeholder="Nome do atleta"

                        {...register("athleteName")}
                    />
                </Input>
            </div>

            <Controller
                name="gender"
                control={control}
                render={({ field: { name, onChange, value, disabled } }) => (
                    <Select
                        defaultValue="all"

                        onValueChange={onChange}

                        name={name}
                        value={value}
                        disabled={disabled}
                    >
                        <SelectTrigger className="h-8 lg:w-[180px]">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">Todos sexos</SelectItem>
                            <SelectItem value="male">Masculino</SelectItem>
                            <SelectItem value="female">Feminino</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            ></Controller>

            <div className="flex items-center justify-center gap-2 w-full md:w-fit">
                <Button type="submit" size="xs" variant="secondary" className="flex-1 md:w-fit" disabled={isSubmitting}>
                    <Search className="size-4 mr-2" />

                    Filtrar resultados
                </Button>

                <Button type="button" size="xs" variant="outline" className="flex-1 md:w-fit" onClick={handleClearFilters}>
                    <X className="size-4 mr-2" />

                    Remover filtros
                </Button>
            </div>
        </form>
    )
}