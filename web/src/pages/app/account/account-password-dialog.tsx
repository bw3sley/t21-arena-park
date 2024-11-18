import { changePassword } from "@/api/change-password";

import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Control, Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { errorHandler } from "@/error-handler";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";

import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { toast } from "sonner";

const accountPasswordFormSchema = z.object({
    currentPassword: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    newPassword: z.string().min(6, 'A nova senha deve ter ao menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirmação de senha deve ter ao menos 6 caracteres'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não correspondem',
    path: ['confirmPassword'],
})

type AccountPasswordForm = z.infer<typeof accountPasswordFormSchema>;

interface AccountPasswordDialogProps {
    controller: (open: boolean) => void
}

export function AccountPasswordDialog({ controller }: AccountPasswordDialogProps) {
    const [isShowingCurrentPassword, setIsShowingCurrentPassword] = useState(false);
    const [isShowingNewPassword, setIsShowingNewPassword] = useState(false);
    const [isShowingConfirmPassword, setIsShowingConfirmPassword] = useState(false);

    const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm<AccountPasswordForm>({
        resolver: zodResolver(accountPasswordFormSchema),

        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    })

    const { mutateAsync: changePasswordFn } = useMutation({
        mutationFn: changePassword,

        onSuccess: () => {
            toast.success("Sua senha foi atualizada com sucesso!");

            controller(false);
        }
    })

    async function handlePasswordChange(data: AccountPasswordForm) {
        try {
            await changePasswordFn({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            })
        }

        catch (error) { errorHandler(error) }
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Alteração de senha</DialogTitle>
                <DialogDescription>Informe sua senha atual e a nova senha abaixo:</DialogDescription>
            </DialogHeader>

            <form method="POST" id="password-form" className="flex flex-col gap-4" onSubmit={handleSubmit(handlePasswordChange)}>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="currentPassword" className="text-sm text-slate-200">
                        Senha atual
                    </Label>

                    <Input>
                        <Control
                            type={isShowingCurrentPassword ? 'text' : 'password'}
                            className="text-sm"
                            autoComplete="off"
                            placeholder="Digite sua senha atual"
                            {...register('currentPassword')}
                        />

                        <span className="flex size-6 flex-shrink-0 items-center justify-center text-slate-500 group-focus-within:text-lime-400 [&>svg]:size-6">
                            <button type="button">
                                {isShowingCurrentPassword ? (
                                    <EyeOff
                                        className="size-5"
                                        strokeWidth={1.75}
                                        onClick={() => setIsShowingCurrentPassword(false)}
                                    />
                                ) : (
                                    <Eye
                                        className="size-5"
                                        strokeWidth={1.75}
                                        onClick={() => setIsShowingCurrentPassword(true)}
                                    />
                                )}
                            </button>
                        </span>
                    </Input>

                    {errors.currentPassword && (
                        <span className="text-sm font-medium text-red-500">
                            {errors.currentPassword.message}
                        </span>
                    )}
                </div>

                <Separator className="my-3" />

                <div className="flex flex-col gap-2">
                    <Label htmlFor="newPassword" className="text-sm text-slate-200">
                        Nova senha
                    </Label>

                    <Input>
                        <Control
                            id="newPassword"
                            type={isShowingNewPassword ? 'text' : 'password'}
                            className="text-sm"
                            autoComplete="new-password"
                            placeholder="Digite sua nova senha"
                            {...register('newPassword')}
                        />

                        <span className="flex size-6 flex-shrink-0 items-center justify-center text-slate-500 group-focus-within:text-lime-400 [&>svg]:size-6">
                            <button type="button">
                                {isShowingNewPassword ? (
                                    <EyeOff
                                        className="size-5"
                                        strokeWidth={1.75}
                                        onClick={() => setIsShowingNewPassword(false)}
                                    />
                                ) : (
                                    <Eye
                                        className="size-5"
                                        strokeWidth={1.75}
                                        onClick={() => setIsShowingNewPassword(true)}
                                    />
                                )}
                            </button>
                        </span>
                    </Input>

                    {errors.newPassword && (
                        <span className="text-sm font-medium text-red-500">
                            {errors.newPassword.message}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="confirmPassword" className="text-sm text-slate-200">
                        Confirmar nova senha
                    </Label>

                    <Input>
                        <Control
                            type={isShowingConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            className="text-sm"
                            autoComplete="off"
                            placeholder="Confirme sua nova senha"
                            {...register('confirmPassword')}
                        />

                        <span className="flex size-6 flex-shrink-0 items-center justify-center text-slate-500 group-focus-within:text-lime-400 [&>svg]:size-6">
                            <button type="button">
                                {isShowingConfirmPassword ? (
                                    <EyeOff
                                        className="size-5"
                                        strokeWidth={1.75}
                                        onClick={() => setIsShowingConfirmPassword(false)}
                                    />
                                ) : (
                                    <Eye
                                        className="size-5"
                                        strokeWidth={1.75}
                                        onClick={() => setIsShowingConfirmPassword(true)}
                                    />
                                )}
                            </button>
                        </span>
                    </Input>

                    {errors.confirmPassword && (
                        <span className="text-sm font-medium text-red-500">
                            {errors.confirmPassword.message}
                        </span>
                    )}
                </div>
            </form>

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary" className="rounded-md" size="sm">
                        Fechar
                    </Button>
                </DialogClose>

                <Button type="submit" form="password-form" disabled={isSubmitting} size="sm" variant="primary">
                    {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <span>Confirmar alteração</span>}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}