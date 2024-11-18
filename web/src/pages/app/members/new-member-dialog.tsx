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

import { Control, Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { MultiSelect } from "@/components/ui/multi-select";

import { errorHandler } from "@/error-handler";

import { formatPhone } from "@/utils/formatters/format-phone";

import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { Controller, useForm } from "react-hook-form";

import { z } from "zod";

import { areas } from "./member-areas";

import { useMutation } from "@tanstack/react-query";

import { createAccount } from "@/api/create-account";

import { toast } from "sonner";

import { queryClient } from "@/lib/react-query";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const newMemberDialogFormSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("E-mail inválido"),
    phone: z.string().nullable(),
    role: z.enum(["ADMIN", "MEMBER", "none"]).refine(value => value !== "none", { message: "Selecione um tipo de usuário" }),
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
    ).min(1, "Selecione pelo menos uma área")
})

// type NewMemberDialogForm = z.infer<typeof newMemberDialogFormSchema>;

type NewMemberDialogForm = {
    name: string;
    email: string;
    phone: string | null;
    role: "ADMIN" | "MEMBER" | "none";
    areas: ("UNSPECIFIED" | "PSYCHOLOGY" | "PHYSIOTHERAPY" | "NUTRITION" | "NURSING" | "PSYCHOPEDAGOGY" | "PHYSICAL_EDUCATION")[];
}

interface NewMemberDialogProps {
    controller: (open: boolean) => void
}

export function NewMemberDialog({ controller }: NewMemberDialogProps) {
    const [keepOpen, setKeepOpen] = useState(false);

    const { handleSubmit, register, control, reset, formState: { errors, isSubmitting } } = useForm<NewMemberDialogForm>({
        resolver: zodResolver(newMemberDialogFormSchema),

        defaultValues: {
            name: "",
            email: "",
            phone: "",
            role: "none",
            areas: []
        }
    })

    const { mutateAsync: createAccountFn } = useMutation({
        mutationFn: createAccount,

        onSuccess: () => {
            toast.success("Voluntário cadastrado com sucesso!");

            queryClient.invalidateQueries({
                queryKey: ["members"]
            })

            reset();

            if (!keepOpen) {
                controller(false);
            }
        }
    })

    async function handleNewMember(data: NewMemberDialogForm) {
        try {
            await createAccountFn({
                name: data.name,
                email: data.email,
                phone: data.phone,
                role: data.role,
                areas: data.areas
            })
        }

        catch (error) { errorHandler(error) }
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Cadastro do voluntário</DialogTitle>
                <DialogDescription>Cadastre as informações do voluntário para integrá-lo ao acompanhamento dos atletas.</DialogDescription>
            </DialogHeader>

            <form method="POST" id="new-member-form" className="flex flex-col gap-4" onSubmit={handleSubmit(handleNewMember)}>
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
                    />

                    {errors.role && (
                        <span className="text-sm font-medium text-red-500">
                            {errors.role.message}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="areas" className="text-sm text-slate-200">
                        Área
                    </Label>

                    <Controller
                        name="areas"
                        control={control}
                        render={({ field: { onChange, name, value, disabled } }) => (
                            <MultiSelect
                                defaultValue={value}
                                onValueChange={onChange}
                                options={areas}
                                maxCount={2}
                                name={name}
                                disabled={disabled}
                                className="bg-slate-900 hover:bg-slate-900/80 min-h-12"
                                placeholder="Selecione uma área"
                            />
                        )}
                    />

                    {errors.areas && (
                        <span className="text-sm font-medium text-red-500">
                            {errors.areas.message}
                        </span>
                    )}
                </div>
            </form>

            <DialogFooter>
                <div className="flex mr-auto items-center gap-2">
                    <Switch id="keep-open" checked={keepOpen} onCheckedChange={setKeepOpen} />

                    <Label htmlFor="keep-open">Criar mais</Label>
                </div>

                <div className="flex items-center gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" className="rounded-md" size="sm">
                            Fechar
                        </Button>
                    </DialogClose>

                    <Button type="submit" form="new-member-form" disabled={isSubmitting} size="sm" variant="primary">
                        {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <span>Cadastrar</span>}
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    )
}