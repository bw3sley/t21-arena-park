import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Control, Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { zodResolver } from "@hookform/resolvers/zod";

import { CalendarIcon, ChevronRight, KeyRound, Loader2, Lock, Mail, UserRound } from "lucide-react";

import { Helmet } from "react-helmet-async";

import { Controller, useForm } from "react-hook-form";

import { z } from "zod";

import { AccountEmailDialog } from "./account-email-dialog";
import { AccountPasswordDialog } from "./account-password-dialog";

import { errorHandler } from "@/error-handler";

import { useMutation, useQuery } from "@tanstack/react-query";

import { updateAccount } from "@/api/update-account";
import { getProfile } from "@/api/get-profile";

import { formatDate } from "@/utils/formatters/format-date";
import { formatPhone } from "@/utils/formatters/format-phone";
import { formatCpf } from "@/utils/formatters/format-cpf";

import { useState } from "react";

import { toast } from "sonner";

import { queryClient } from "@/lib/react-query";
import { format } from "date-fns";

const accountFormSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    cpf: z.string().nullable(),
    birthDate: z.string().nullable(),
    phone: z.string().nullable(),
    gender: z.enum(["MALE", "FEMALE", "none"]).nullable()
})

type AccountForm = z.infer<typeof accountFormSchema>;

export function Account() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

    const { data: profile } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile
    })

    const { handleSubmit, register, setValue, control, formState: { errors, isSubmitting } } = useForm<AccountForm>({
        resolver: zodResolver(accountFormSchema),

        values: {
            name: profile?.name ?? "",
            cpf: profile?.cpf ?? "",
            phone: profile?.phone ?? "",
            gender: profile?.gender ?? "none",
            birthDate: profile?.birthDate ?? ""
        }
    })

    const { mutateAsync: updateAccountFn } = useMutation({
        mutationFn: updateAccount,

        onSuccess: () => {
            toast.success("Suas informações foram atualizadas com sucesso!");

            queryClient.invalidateQueries({
                queryKey: ["profile"]
            })
        }
    })

    async function handleAccountUpdate(data: AccountForm) {
        try {
            await updateAccountFn({
                name: data.name,
                cpf: data.cpf,
                birthDate: data.birthDate,
                gender: data.gender === "none" ? null : data.gender,
                phone: data.phone
            })
        }

        catch (error) { errorHandler(error) }
    }

    return (
        <>
            <Helmet title="Minha conta" />

            <div className="flex flex-col max-w-[1352px] p-6 pb-10 gap-10 mx-auto">
                <div className="grid items-start gap-y-10 gap-x-6 w-full mt-10 mx-auto mb-11">
                    <div className="col-span-full flex flex-col gap-1">
                        <h1 className="font-bold font-error text-2xl">Minha conta</h1>

                        <p className="text-sm text-slate-400">
                            Gerencie as informações da contas e dados pessoais.
                        </p>
                    </div>

                    <Tabs defaultValue="tab-auth" className="grid lg:grid-cols-[321px_1fr] items-start lg:gap-8">
                        <TabsList asChild className="">
                            <aside className="flex lg:flex-col">
                                <TabsTrigger value="tab-auth">
                                    <KeyRound className="size-5" />

                                    <span className="ml-3 mr-auto text-base hover:text-slate-300 hidden lg:inline">
                                        Dados de acesso
                                    </span>

                                    <ChevronRight className="size-4 hidden lg:inline" />
                                </TabsTrigger>

                                <TabsTrigger value="tab-personal">
                                    <UserRound className="size-5" />

                                    <span className="ml-3 mr-auto text-base hover:text-slate-300 hidden lg:inline">
                                        Dados pessoais
                                    </span>

                                    <ChevronRight className="size-4 hidden lg:inline" />
                                </TabsTrigger>
                            </aside>
                        </TabsList>

                        <main className="mt-10 lg:mt-0">
                            <TabsContent value="tab-auth">
                                <div className="flex items-center gap-3 mb-8">
                                    <KeyRound className="size-5" />

                                    <h2 className="text-xl">Dados de acesso</h2>
                                </div>

                                <div className="w-full flex flex-col gap-3">
                                    <div className="py-10 px-12 border border-slate-700 bg-slate-800 rounded-md">
                                        <section className="w-full flex flex-col gap-6 lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-y-6 lg:gap-x-3">
                                            <div className="flex flex-col gap-2">
                                                <Label
                                                    htmlFor="email"
                                                    className="inline-block text-slate-400"
                                                >
                                                    E-mail
                                                </Label>

                                                <div className="border-0 gap-1 flex items-center bg-slate-900 px-3 h-12 rounded-md opacity-90">
                                                    <Mail className="size-5 text-slate-600" />

                                                    <div
                                                        className="text-slate-400 w-full h-full flex items-center ml-2 cursor-not-allowed"
                                                        id="email"
                                                    >
                                                        {profile?.email}
                                                    </div>

                                                    <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                                                        <DialogTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className="text-sm text-lime-400"
                                                            >
                                                                Alterar
                                                            </button>
                                                        </DialogTrigger>

                                                        <AccountEmailDialog controller={setIsEmailDialogOpen} email={profile?.email!} />
                                                    </Dialog>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <Label
                                                    htmlFor="password"
                                                    className="inline-block text-slate-400"
                                                >
                                                    Senha
                                                </Label>

                                                <div className="border-0 flex items-center bg-slate-900 px-3 h-12 rounded-md opacity-90">
                                                    <Lock className="size-5 text-slate-600" />

                                                    <div className="text-slate-400 w-full h-full flex items-center ml-2 cursor-not-allowed">
                                                        •••••••••
                                                    </div>

                                                    <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                                                        <DialogTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className="text-sm text-lime-400"
                                                            >
                                                                Alterar
                                                            </button>
                                                        </DialogTrigger>

                                                        <AccountPasswordDialog controller={setIsPasswordDialogOpen} />
                                                    </Dialog>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="tab-personal">
                                <div className="flex items-center gap-3 mb-8">
                                    <UserRound className="size-5" />

                                    <h2 className="text-xl">Dados pessoais</h2>
                                </div>

                                <form method="POST" className="w-full flex flex-col gap-4" onSubmit={handleSubmit(handleAccountUpdate)}>
                                    <div className="py-10 px-12 border border-slate-700 bg-slate-800 rounded-md">
                                        <div className="w-full space-y-6">
                                            <section className="grid lg:grid-flow-col auto-cols-fr gap-4 lg:grid-cols-[2fr_1fr]">
                                                <div className="flex flex-col gap-2">
                                                    <Label
                                                        htmlFor="name"
                                                        className="inline-block text-slate-400"
                                                    >
                                                        Nome
                                                    </Label>

                                                    <Input variant="default">
                                                        <Control
                                                            type="text"
                                                            id="name"
                                                            placeholder="Digite seu nome"

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
                                                    <Label
                                                        htmlFor="cpf"
                                                        className="inline-block text-slate-400"
                                                    >
                                                        CPF
                                                    </Label>

                                                    <Input variant="default">
                                                        <Control
                                                            type="text"
                                                            id="cpf"
                                                            placeholder="999.999.999-99"
                                                            onInput={(event) => (event.currentTarget.value = formatCpf(event.currentTarget.value))}

                                                            {...register("cpf")}
                                                        />
                                                    </Input>
                                                </div>
                                            </section>

                                            <section className="grid lg:grid-flow-col auto-cols-fr gap-4 lg:grid-cols-[2fr_1fr]">
                                                <div className="grid lg:grid-flow-col auto-cols-fr gap-4 lg:grid-cols-[2fr_1fr]">
                                                    <div className="flex flex-col gap-2">
                                                        <Label
                                                            htmlFor="birthDate"
                                                            className="inline-block text-slate-400"
                                                        >
                                                            Data de nascimento
                                                        </Label>

                                                        <Popover>
                                                            <Input>
                                                                <Control
                                                                    type="text"
                                                                    id="birthDate"
                                                                    placeholder="DD/MM/AAAA"
                                                                    maxLength={10}
                                                                    onInput={(event) => (event.currentTarget.value = formatDate(event.currentTarget.value))}
                                                                    {...register("birthDate")}
                                                                />

                                                                <PopoverTrigger asChild className="cursor-pointer">
                                                                    <Button type="button" size="icon" className="size-8">
                                                                        <CalendarIcon className="size-4 text-slate-400" />
                                                                    </Button>
                                                                </PopoverTrigger>
                                                            </Input>

                                                            <PopoverContent align="end" className="w-fit">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={date}
                                                                    onSelect={(selectedDate) => {
                                                                        setDate(selectedDate);

                                                                        setValue("birthDate", selectedDate ? format(selectedDate, "dd/MM/yyyy") : "");
                                                                    }}
                                                                    disabled={{ after: new Date() }}
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <Label
                                                            htmlFor="gender"
                                                            className="inline-block text-slate-400"
                                                        >
                                                            Sexo
                                                        </Label>

                                                        <Controller
                                                            name="gender"
                                                            control={control}
                                                            render={({ field: { onChange, value, disabled } }) => (
                                                                <Select
                                                                    defaultValue="none"
                                                                    onValueChange={onChange}
                                                                    value={value === null ? "none" : value}
                                                                    disabled={disabled}
                                                                >
                                                                    <SelectTrigger className="h-12 w-full lg:w-[300px] bg-slate-900 text-base">
                                                                        <SelectValue />
                                                                    </SelectTrigger>

                                                                    <SelectContent>
                                                                        <SelectItem value="none">
                                                                            Selecione uma opção
                                                                        </SelectItem>

                                                                        <SelectItem value="MALE">
                                                                            Masculino
                                                                        </SelectItem>

                                                                        <SelectItem value="FEMALE">
                                                                            Feminino
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        ></Controller>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Label
                                                        htmlFor="phone"
                                                        className="inline-block text-slate-400"
                                                    >
                                                        Telefone
                                                    </Label>

                                                    <Input variant="default">
                                                        <Control
                                                            type="text"
                                                            id="phone"
                                                            maxLength={15}
                                                            placeholder="(99) 99999-9999"
                                                            onInput={(event) => (event.currentTarget.value = formatPhone(event.currentTarget.value))}

                                                            {...register("phone")}
                                                        />
                                                    </Input>
                                                </div>
                                            </section>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-fit self-end"
                                        size="lg"
                                        variant="primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <span>Salvar</span>}
                                    </Button>
                                </form>
                            </TabsContent>
                        </main>
                    </Tabs>
                </div>
            </div>
        </>
    )
}