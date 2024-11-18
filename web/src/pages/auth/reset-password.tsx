import { resetPassword } from "@/api/reset-password";

import { Button } from "@/components/ui/button";
import { Control, Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { errorHandler } from "@/error-handler";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";

import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useEffect, useState } from "react";

import { Helmet } from "react-helmet-async";

import { useForm } from "react-hook-form";

import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { z } from "zod";

const resetPasswordFormSchema = z.object({
    password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordFormSchema>;

export function ResetPassword() {
    const [isShowingPassword, setIsShowingPassword] = useState(false);
    const [isShowingConfirmPassword, setIsShowingConfirmPassword] = useState(false);

    const [searchParams, _] = useSearchParams();

    const navigate = useNavigate();

    const {
        handleSubmit,
        register,
        watch,
        formState: { isSubmitting, errors },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordFormSchema),

        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    })

    useEffect(() => {
        const code = searchParams.get("code");

        if (!code) {
            return navigate("/");
        }
    }, [])

    const { mutateAsync: resetPasswordFn } = useMutation({
        mutationFn: resetPassword,

        onSuccess: () => {
            toast.success("Sua senha foi alterada com sucesso!", {
                onAutoClose: () => navigate("/")
            })
        }
    })

    async function handleResetPassword(data: ResetPasswordForm) {
        try {
            const code = searchParams.get("code");

            if (code) {
                await resetPasswordFn({ code, password: data.password });

                navigate("/home");
            }
        } catch (error) {
            errorHandler(error);
        }
    }

    const password = watch("password");
    const confirmPassword = watch("confirmPassword");

    const areInputsEmpty = password.length === 0 && confirmPassword.length === 0;

    return (
        <>
            <Helmet title="Recuperar senha" />

            <div className="h-[100dvh] overflow-auto p-20 max-[1100px]:h-auto max-[1100px]:min-h-[calc(100dvh-16px)] max-[1100px]:p-7">
                <div className="mb-12 mt-16 flex flex-col gap-3 max-md:mb-8 max-md:mt-12">
                    <h1 className="text-2xl font-bold dark:text-slate-200">
                        Redefina sua senha
                    </h1>
                </div>

                <form
                    method="POST"
                    className="flex flex-col gap-6"
                    onSubmit={handleSubmit(handleResetPassword)}
                >
                    <div className="flex flex-col gap-2 [&>label]:text-sm dark:[&>label]:text-slate-200">
                        <Label htmlFor="password">Senha</Label>

                        <Input>
                            <Control
                                id="password"
                                type={isShowingPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Deve ter no mínimo 6 caracteres"
                                {...register("password")}
                            />

                            <span className="flex size-6 flex-shrink-0 items-center justify-center text-slate-500 group-focus-within:text-lime-400 [&>svg]:size-6">
                                <button type="button">
                                    {isShowingPassword ? (
                                        <EyeOff
                                            strokeWidth={1.75}
                                            onClick={() => setIsShowingPassword(false)}
                                        />
                                    ) : (
                                        <Eye
                                            strokeWidth={1.75}
                                            onClick={() => setIsShowingPassword(true)}
                                        />
                                    )}
                                </button>
                            </span>
                        </Input>

                        {errors.password && (
                            <span className="text-sm font-medium text-red-500">
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 [&>label]:text-sm dark:[&>label]:text-slate-200">
                        <Label htmlFor="confirmPassword">Confirme sua senha</Label>

                        <Input>
                            <Control
                                id="confirmPassword"
                                type={isShowingConfirmPassword ? "text" : "password"}
                                placeholder="Deve ter no mínimo 6 caracteres"
                                {...register("confirmPassword")}
                            />

                            <span className="flex size-6 flex-shrink-0 items-center justify-center text-slate-500 group-focus-within:text-lime-400 [&>svg]:size-6">
                                <button type="button">
                                    {isShowingConfirmPassword ? (
                                        <EyeOff
                                            strokeWidth={1.75}
                                            onClick={() => setIsShowingConfirmPassword(false)}
                                        />
                                    ) : (
                                        <Eye
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

                    <Button type="submit" variant="primary" size="lg" disabled={isSubmitting || areInputsEmpty}>
                        {isSubmitting ? (
                            <Loader2 strokeWidth={3} className="animate-spin size-6" />
                        ) : (
                            <span className="text-base leading-6">Redefinir senha</span>
                        )}
                    </Button>
                </form>
            </div>
        </>
    );
}
