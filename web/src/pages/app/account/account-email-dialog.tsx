import { changeEmail } from "@/api/change-email";

import { Button } from "@/components/ui/button";

import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose
} from "@/components/ui/dialog";

import { Control, Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { errorHandler } from "@/error-handler";
import { queryClient } from "@/lib/react-query";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";

import { Eye, EyeOff, Loader2, Mail } from "lucide-react";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { toast } from "sonner";

import { z } from "zod";

interface AccountEmailDialogProps {
    email: string,

    controller: (open: boolean) => void
}

const accountEmailDialogFormSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Senha deve ter ao menos 6 caracteres")
})

type AccountEmailDialogForm = z.infer<typeof accountEmailDialogFormSchema>;

export function AccountEmailDialog({ controller, email }: AccountEmailDialogProps) {
    const [isShowingPassword, setIsShowingPassword] = useState(false);

    const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm<AccountEmailDialogForm>({
        resolver: zodResolver(accountEmailDialogFormSchema),

        values: {
            email: "",
            password: ""
        }
    })

    const { mutateAsync: changeEmailFn } = useMutation({
        mutationFn: changeEmail,

        onSuccess: () => {
            toast.success("E-mail atualizado com sucesso!");

            queryClient.invalidateQueries({
                queryKey: ["profile"]
            })

            controller(false);
        }
    })

    async function handleEmailChange(data: AccountEmailDialogForm) {
        try {
            await changeEmailFn({ email: data.email, password: data.password });
        }

        catch (error) { errorHandler(error) }
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Alteração de e-mail</DialogTitle>
                <DialogDescription>Por motivos de segurança, nossa equipe pede a sua senha para confirmar a alteração.</DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-2">
                <Mail className="size-4 text-lime-300" />

                <span className="text-slate-300">{email}</span>
            </div>

            <form method="POST" id="email-form" className="flex flex-col gap-4" onSubmit={handleSubmit(handleEmailChange)}>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="email" className="text-sm text-slate-200">
                        Novo e-mail
                    </Label>

                    <Input>
                        <Control
                            type="email"
                            id="email"
                            placeholder="Para qual e-mail você gostaria de alterar?"
                            className="text-sm"
                            autoComplete="off"

                            {...register('email')}
                        />
                    </Input>

                    {errors.email && (
                        <span className="text-sm font-medium text-red-500">
                            {errors.email.message}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="password" className="text-sm text-slate-200">
                        Senha
                    </Label>

                    <Input>
                        <Control
                            type={isShowingPassword ? 'text' : 'password'}
                            className="text-sm"
                            id="password"
                            autoComplete="new-password"
                            placeholder="Digite sua senha para confirmar"
                            {...register('password')}
                        />

                        <span className="flex size-6 flex-shrink-0 items-center justify-center text-slate-500 group-focus-within:text-lime-400 [&>svg]:size-6">
                            <button type="button">
                                {isShowingPassword ? (
                                    <EyeOff
                                        className="size-5"
                                        strokeWidth={1.75}
                                        onClick={() => setIsShowingPassword(false)}
                                    />
                                ) : (
                                    <Eye
                                        className="size-5"
                                        strokeWidth={1.75}
                                        onClick={() => setIsShowingPassword(true)}
                                    />
                                )}
                            </button>
                        </span>
                    </Input>
                </div>
            </form>

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary" className="rounded-md" size="sm">
                        Fechar
                    </Button>
                </DialogClose>

                <Button type="submit" form="email-form" disabled={isSubmitting} size="sm" variant="primary">
                    {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <span>Confirmar alteração</span>}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}