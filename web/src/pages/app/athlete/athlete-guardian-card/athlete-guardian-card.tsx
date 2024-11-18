import { updateGuardian } from "@/api/update-guardian";

import { Button } from "@/components/ui/button";

import { Input, Control } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

import { errorHandler } from "@/error-handler";
import { queryClient } from "@/lib/react-query";

import { formatCpf } from "@/utils/formatters/format-cpf";
import { formatRg } from "@/utils/formatters/format-rg";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";

import { ShieldCheck, Loader2 } from "lucide-react";

import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import { z } from "zod";

const athleteGuardianFormSchema = z.object({
    name: z.string().nullable(),
    email: z.string().nullable(),
    relationshipDegree: z.string().nullable(),
    gender: z.enum(["MALE", "FEMALE", "none"]),
    rg: z.string().nullable(),
    cpf: z.string().nullable()
})

type AthleteGuardianForm = z.infer<typeof athleteGuardianFormSchema>;

export interface GuardianCardProps {
    guardian: {
        name: string | null,
        email: string | null,
        relationshipDegree: string | null,
        gender: "MALE" | "FEMALE",
        cpf: string | null,
        rg: string | null
    } | null,

    athleteId: string
}
 
export function AthleteGuardianCard({ athleteId, guardian }: GuardianCardProps) {
    const { handleSubmit, register, control, formState: { isSubmitting } } = useForm<AthleteGuardianForm>({
        resolver: zodResolver(athleteGuardianFormSchema),

        values: {
            name: guardian?.name ?? null,
            email: guardian?.email ?? null,
            cpf: guardian?.cpf ?? null,
            gender: guardian?.gender ?? "none",
            relationshipDegree: guardian?.relationshipDegree ?? null,
            rg: guardian?.rg ?? null 
        }
    })

    const { mutateAsync: updateGuardianFn } = useMutation({
        mutationFn: updateGuardian,

        onSuccess: () => {
            toast.success("Responsável do atualizado com sucesso!");

            queryClient.invalidateQueries({
                queryKey: ["athletes", athleteId]
            })
        }
    })

    async function handleGuardian(data: AthleteGuardianForm) {
        try {
            if (data) {
                await updateGuardianFn({
                    athleteId,
    
                    name: data.name,
                    email: data.email,
                    cpf: data.cpf,
                    gender: data.gender === "none" ? null : data.gender,
                    relationshipDegree: data.relationshipDegree,
                    rg: data.rg
                })
            }
        }

        catch (error) { errorHandler(error); }
    }

    return (
        <div className="flex flex-col bg-slate-800 border border-slate-700 rounded p-6 relative gap-6">
            <div className="flex items-start gap-4">
                <div className="size-14 flex items-center border-slate-700 justify-center border rounded-full flex-shrink-0">
                    <ShieldCheck className="size-7 text-slate-400" />
                </div>

                <div className="space-y-1">
                    <h2 className="font-bold text-xl">Responsável</h2>

                    <p className="text-slate-400 text-md text-justify">
                        Aqui você pode cadastrar ou atualizar os dados do
                        responsável pelo atleta. Essas informações são importantes
                        para manter contato e gerenciar a comunicação com o
                        responsável de forma eficiente.
                    </p>
                </div>
            </div>

            <form
                method="POST"
                onSubmit={handleSubmit(handleGuardian)}
                className="flex flex-col gap-6"
            >
                <div className="grid lg:grid-cols-[1fr_1fr] gap-4 lg:gap-y-6 lg:gap-x-6">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name" className="text-sm text-slate-200">
                            Nome
                        </Label>

                        <Input>
                            <Control
                                placeholder="Nome do responsável"
                                type="text"
                                autoComplete="off"
                                id="name"

                                {...register("name")}
                            />
                        </Input>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="text-sm text-slate-200">
                            Email
                        </Label>

                        <Input>
                            <Control
                                placeholder="Email do responsável"
                                type="text"
                                autoComplete="off"
                                id="email"

                                {...register("email")}
                            />
                        </Input>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="rg" className="text-sm text-slate-200">
                            RG
                        </Label>

                        <Input>
                            <Control
                                placeholder="99.999.999-9"
                                type="text"
                                autoComplete="off"
                                maxLength={13}
                                id="rg"
                                onInput={(event) => (event.currentTarget.value = formatRg(event.currentTarget.value))}

                                {...register("rg")}
                            />
                        </Input>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="cpf" className="text-sm text-slate-200">
                            CPF
                        </Label>

                        <Input>
                            <Control
                                placeholder="999.999.999-99"
                                type="text"
                                autoComplete="off"
                                maxLength={14}
                                id="cpf"
                                onInput={(event) => (event.currentTarget.value = formatCpf(event.currentTarget.value))}

                                {...register("cpf")}
                            />
                        </Input>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="relationshipDegree"
                            className="text-sm text-slate-200"
                        >
                            Grau de parentesco
                        </Label>

                        <Input>
                            <Control
                                placeholder="Grau de paretesco do responsável"
                                type="text"
                                autoComplete="off"
                                id="relationshipDegree"

                                {...register("relationshipDegree")}
                            />
                        </Input>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label
                            htmlFor="gender"
                            className="text-sm text-slate-200"
                        >
                            Gênero
                        </Label>

                        <Controller
                            name="gender"
                            control={control}
                            render={({
                                field: { name, onChange, value, disabled },
                            }) => (
                                <Select
                                    defaultValue="none"
                                    name={name}
                                    onValueChange={onChange}
                                    value={value}
                                    disabled={disabled}
                                >
                                    <SelectTrigger className="text-base h-12 w-full bg-slate-900">
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="none">
                                            Selecione uma opção
                                        </SelectItem>

                                        <SelectItem value="MALE">Masculino</SelectItem>
                                        <SelectItem value="FEMALE">Feminino</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        ></Controller>
                    </div>
                </div>

                <div className="self-end">
                    <Button
                        type="submit"
                        size="md"
                        variant="primary"
                        className="self-end"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 strokeWidth={3} className="animate-spin size-5" /> : <span>Salvar</span>}
                    </Button>
                </div>
            </form>
        </div>
    )
}