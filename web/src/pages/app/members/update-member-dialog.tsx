import { Button } from "@/components/ui/button";

import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import { Input, Control } from "@/components/ui/input";

import { MultiSelect } from "@/components/ui/multi-select";

import { Label } from "@/components/ui/label";

import { formatPhone } from "@/utils/formatters/format-phone";

import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { Controller, useForm } from "react-hook-form";

import { z } from "zod";

import { errorHandler } from "@/error-handler";

import { useMutation } from "@tanstack/react-query";

import { updateMember } from "@/api/update-member";

import { areas as areaOptions } from "./member-areas";

import { toast } from "sonner";

import { queryClient } from "@/lib/react-query";

const updateMemberDialogFormSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("E-mail inválido"),
    phone: z.string().nullable(),
    role: z.enum(["ADMIN", "MEMBER"]),
    areas: z.array(
        z.enum([
            "UNSPECIFIED",
            "PSYCHOLOGY",
            "PHYSIOTHERAPY",
            "NUTRITION",
            "NURSING",
            "PSYCHOPEDAGOGY",
            "PHYSICAL_EDUCATION"
        ])
    )
})

type UpdateMemberDialogForm = z.infer<typeof updateMemberDialogFormSchema>;

interface UpdateMemberDialogProps {
    controller: (open: boolean) => void,

    member: {
        id: string,
        name: string,
        email: string,
        role: "ADMIN" | "MEMBER",
        phone: string | null,
        areas: ("UNSPECIFIED" | "PSYCHOLOGY" | "PHYSIOTHERAPY" | "NUTRITION" | "NURSING" | "PSYCHOPEDAGOGY" | "PHYSICAL_EDUCATION")[]
    }
}

export function UpdateMemberDialog({ controller, member }: UpdateMemberDialogProps) {
    const { handleSubmit, register, control, formState: { errors, isSubmitting } } = useForm<UpdateMemberDialogForm>({
        resolver: zodResolver(updateMemberDialogFormSchema),

        values: {
            name: member.name,
            email: member.email,
            phone: member.phone,
            role: member.role,
            areas: member.areas
        }
    })

    const { mutateAsync: updateMemberFn } = useMutation({
        mutationFn: updateMember,

        onSuccess: () => {
            toast.success("Voluntário atualizado com sucesso!");

            queryClient.invalidateQueries({
                queryKey: ["members"]
            })

            controller(false);
        }
    })

    async function handleMemberEdition(data: UpdateMemberDialogForm) {
        try {
            await updateMemberFn({
                name: data.name,
                email: data.email,
                phone: data.phone,
                role: data.role,
                areas: data.areas,

                memberId: member.id
            })
        }

        catch (error) { errorHandler(error) }
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edição do voluntário</DialogTitle>
                <DialogDescription>Atualize os dados do voluntário para garantir um suporte eficaz e atualizado.</DialogDescription>
            </DialogHeader>

            <form method="POST" id="update-member-form" className="flex flex-col gap-4" onSubmit={handleSubmit(handleMemberEdition)}>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="name" className="text-sm text-slate-200">
                        Nome
                    </Label>

                    <Input>
                        <Control
                            placeholder="Nome do voluntário"
                            type="text"
                            id="name"
                            className="text-sm"
                            autoComplete="off"
                            {...register("name")}
                        />
                    </Input>

                    {errors.name && (
                        <span className="text-sm font-medium text-red-500">
                            {errors.name.message}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="email" className="text-sm text-slate-200">
                        E-mail
                    </Label>

                    <Input>
                        <Control
                            id="email"
                            placeholder="E-mail do voluntário"
                            type="email"
                            className="text-sm"
                            autoComplete="off"
                            {...register("email")}
                        />
                    </Input>

                    {errors.email && (
                        <span className="text-sm font-medium text-red-500">
                            {errors.email.message}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="phone" className="text-sm text-slate-200">
                        Telefone (opcional)
                    </Label>

                    <Input>
                        <Control
                            placeholder="(99) 99999-9999"
                            type="phone"
                            className="text-sm"
                            autoComplete="off"
                            id="phone"

                            onInput={(event) => (event.currentTarget.value = formatPhone(event.currentTarget.value))}

                            {...register("phone")}
                        />
                    </Input>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="role" className="text-sm text-slate-200">Tipo de voluntário</Label>

                    <Controller
                        name="role"
                        control={control}
                        render={({ field: { onChange, name, value, disabled } }) => (
                            <Select
                                defaultValue="none"
                                onValueChange={onChange}
                                value={value}
                                disabled={disabled}
                                name={name}
                            >
                                <SelectTrigger className="h-12 w-full bg-slate-900 text-sm">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="none" disabled>
                                        Selecione uma opção
                                    </SelectItem>

                                    <SelectItem value="MEMBER">Voluntário</SelectItem>
                                    <SelectItem value="ADMIN">Administrador</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    >

                    </Controller>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="areas" className="text-sm text-slate-200">
                        Área
                    </Label>

                    <Controller
                        name="areas"
                        control={control}
                        render={({ field: { onChange } }) => (
                            <MultiSelect
                                defaultValue={member.areas.includes("UNSPECIFIED") && member.areas.length === 1 ? [] : member.areas}
                                onValueChange={onChange}
                                options={areaOptions}
                                maxCount={2}
                                className="bg-slate-900 hover:bg-slate-900/80 min-h-12"
                            />
                        )}
                    />
                </div>
            </form>

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary" className="rounded-md" size="sm">
                        Fechar
                    </Button>
                </DialogClose>

                <Button type="submit" form="update-member-form" disabled={isSubmitting} size="sm" variant="primary">
                    {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <span>Atualizar</span>}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}