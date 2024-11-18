import { Button } from "@/components/ui/button";

import { Control, Input } from "@/components/ui/input";

import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";

import { Label } from "@/components/ui/label";

import { zodResolver } from "@hookform/resolvers/zod";

import { Search, X } from "lucide-react";

import { Controller, useForm } from "react-hook-form";

import { useSearchParams } from "react-router-dom";

import { z } from "zod";

const searchFilterFormSchema = z.object({
    memberName: z.string().optional(),
    role: z.string().optional()
})

type SearchFilterForm = z.infer<typeof searchFilterFormSchema>;

export function MemberTableFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    const memberName = searchParams.get("memberName");
    const role = searchParams.get("role");

    const { handleSubmit, control, register, reset, formState: { isSubmitting } } = useForm<SearchFilterForm>({
        resolver: zodResolver(searchFilterFormSchema),

        defaultValues: {
            memberName: memberName ?? "",
            role: role ?? "all"
        }
    })

    function handleFilter({ memberName, role }: SearchFilterForm) {
        setSearchParams((state) => {
            if (memberName) {
                state.set("memberName", memberName);
            }

            else {
                state.delete("memberName");
            }

            if (role) {
                state.set("role", role);
            }

            else {
                state.delete("role");
            }

            state.set("page", "1");

            return state;
        })
    }

    function handleClearFilters() {
        setSearchParams((state) => {
            state.delete("memberName");
            state.delete("role");

            state.set("page", "1");

            return state;
        })

        reset({ memberName: "", role: "all" });
    }

    return (
        <form method="GET" className="flex flex-col md:flex-row items-center gap-2 w-full" onSubmit={handleSubmit(handleFilter)}>
            <span className="text-sm font-semibold hidden md:inline-block">Filtros:</span>

            <div className="w-full md:w-fit">
                <Label htmlFor="memberName" className="sr-only">Nome do atleta</Label>

                <Input variant="filter">
                    <Control
                        id="memberName"
                        placeholder="Nome do voluntário"

                        {...register("memberName")}
                    />
                </Input>
            </div>

            <Controller
                name="role"
                control={control}
                render={({ field: { name, onChange, value, disabled } }) => (
                    <Select
                        defaultValue="all"

                        onValueChange={onChange}

                        name={name}
                        value={value}
                        disabled={disabled}
                    >
                        <SelectTrigger className="h-8 lg:w-[280px]">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">Todos os tipos de usuário</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="volunteer">Voluntário</SelectItem>
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