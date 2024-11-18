import { requestPasswordReset } from "@/api/request-password.recovery";

import { Button } from "@/components/ui/button";
import { Control, Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { errorHandler } from "@/error-handler";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";

import { ArrowLeft, Loader2 } from "lucide-react";

import { Helmet } from "react-helmet-async";

import { useForm } from "react-hook-form";

import { toast } from "sonner";

import { z } from "zod";

const requestPasswordResetFormSchema = z.object({
    email: z.string().email("E-mail inválido")
})

type RequestPasswordResetForm = z.infer<typeof requestPasswordResetFormSchema>;

export function RequestPasswordReset() {
    const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm<RequestPasswordResetForm>({
        resolver: zodResolver(requestPasswordResetFormSchema)
    })

    const { mutateAsync: requestPasswordResetFn } = useMutation({
        mutationFn: requestPasswordReset
    })

    async function handleRequestPasswordReset(data: RequestPasswordResetForm) {
        try {
            await requestPasswordResetFn({ email: data.email });
        
            toast.success("Enviamos um link de recuperação para seu e-mail.", {
                action: {
                    label: "Reenviar",
                    onClick: () => requestPasswordResetFn({ email: data.email })
                }
            })
        }

        catch (error) { errorHandler(error); }
    }

    return (
        <>
            <Helmet title="Recuperar senha" />

            <div className="h-[100dvh] overflow-auto p-20 max-[1100px]:h-auto max-[1100px]:min-h-[calc(100dvh-16px)] max-[1100px]:p-7">
                <div className="mb-12 mt-16 flex flex-col gap-3 max-md:mb-8 max-md:mt-12">
                    <h1 className="text-2xl font-bold dark:text-slate-200">
                        Esqueci minha senha
                    </h1>
                </div>

                <form method="POST" className="flex flex-col gap-6" onSubmit={handleSubmit(handleRequestPasswordReset)}>
                    <div className="flex flex-col gap-2 [&>label]:text-sm dark:[&>label]:text-slate-200">
                        <Label htmlFor="email">E-mail</Label>

                        <Input>
                            <Control
                                placeholder="Seu e-mail"
                                type="email"

                                {...register('email')}
                            />
                        </Input>

                        {errors.email && (
                            <span className="text-sm font-medium text-red-500">
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <Loader2 strokeWidth={3} className="animate-spin size-6" />
                        ) : (
                            <span className="text-base leading-6">
                                Recuperar minha senha
                            </span>
                        )}
                    </Button>
                </form>

                <a
                    href="/"
                    className="flex items-center justify-center w-full gap-2 mt-8 max-md:mt-6 text-gray-100 font-medium group"
                >
                    <ArrowLeft className="group-hover:-translate-x-2 transition size-6" />
                    Voltar para o login
                </a>
            </div>
        </>
    )
}