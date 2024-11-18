import { Button } from "@/components/ui/button";

import { Control, Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

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

import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { z } from "zod";

import { useMutation } from "@tanstack/react-query";

import { createAthlete } from "@/api/create-athlete";

import { errorHandler } from "@/error-handler";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

import { formatDate } from "@/utils/formatters/format-date";

import { useState } from "react";

import { toast } from "sonner";

import { queryClient } from "@/lib/react-query";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";

const athleteDialogFormSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório."),
    birthDate: z.string().min(10, "A data de nascimento é obrigatória e deve estar no formato dd/mm/aaaa."),
    handedness: z.enum(["RIGHT", "LEFT", "none"]).refine(value => value !== "none", { message: "Selecione uma lateralidade" }),
    gender: z.enum(["MALE", "FEMALE", "none"]).refine(value => value !== "none", { message: "Selecione um sexo" }),
    bloodType: z.enum([
        "A_POSITIVE",
        "A_NEGATIVE",
        "B_POSITIVE",
        "B_NEGATIVE",
        "AB_POSITIVE",
        "AB_NEGATIVE",
        "O_POSITIVE",
        "O_NEGATIVE",
        "none",
    ]).refine(value => value !== "none", { message: "Selecione um tipo sanguíneo" })
})

// type AthleteDialogForm = z.infer<typeof athleteDialogFormSchema>;

type AthleteDialogForm = {
    name: string;
    birthDate: string;
    handedness: "RIGHT" | "LEFT" | "none";
    gender: "MALE" | "FEMALE" | "none";
    bloodType:
    | "A_POSITIVE"
    | "A_NEGATIVE"
    | "B_POSITIVE"
    | "B_NEGATIVE"
    | "AB_POSITIVE"
    | "AB_NEGATIVE"
    | "O_POSITIVE"
    | "O_NEGATIVE"
    | "none";
};

interface AthleteDialogProps {
    controller: (open: boolean) => void
}

export function AthleteDialog({ controller }: AthleteDialogProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const [keepOpen, setKeepOpen] = useState(false);

    const { register, handleSubmit, setValue, control, reset, formState: { errors, isSubmitting } } = useForm<AthleteDialogForm>({
        resolver: zodResolver(athleteDialogFormSchema),

        defaultValues: {
            name: "",
            birthDate: "",
            handedness: "none",
            gender: "none",
            bloodType: "none"
        }
    })

    const { mutateAsync: createAthleteFn } = useMutation({
        mutationFn: createAthlete,

        onSuccess: () => {
            toast.success("Atleta criado com sucesso!");

            queryClient.invalidateQueries({
                queryKey: ["athletes"]
            })

            reset();

            if (!keepOpen) {
                controller(false);
            }
        }
    })

    async function handleNewAthlete(data: AthleteDialogForm) {
        try {
            createAthleteFn({
                name: data.name,
                birthDate: data.birthDate,
                handedness: data.handedness,
                gender: data.gender,
                bloodType: data.bloodType
            })
        }

        catch (error) { errorHandler(error) }
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Cadastro do atleta</DialogTitle>
                <DialogDescription>Cadastre as informações principais do atleta para iniciar o acompanhamento personalizado.</DialogDescription>
            </DialogHeader>

            <div>
                <form method="POST" id="new-athlete-form" autoComplete="off" className="flex flex-col gap-4" onSubmit={handleSubmit(handleNewAthlete)}>
                    <div className="flex flex-col gap-4 p-[2px] max-h-80 overflow-y-auto lg:max-h-96 xl:max-h-fit">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name" className="text-sm text-slate-200">
                                Nome
                            </Label>

                            <Input>
                                <Control
                                    type="text"
                                    id="name"
                                    className="text-sm"
                                    placeholder="Nome do atleta"

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
                            <Label htmlFor="birthDate" className="text-sm text-slate-200">
                                Data de nascimento
                            </Label>

                            <Popover>
                                <Input>
                                    <Control
                                        type="text"
                                        id="birthDate"
                                        placeholder="dd/mm/aaaa"
                                        className="text-sm"
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

                            {errors.birthDate && (
                                <span className="text-sm font-medium text-red-500">
                                    {errors.birthDate.message}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="handedness" className="text-sm text-slate-200">
                                Lateralidade
                            </Label>

                            <Controller
                                name="handedness"
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

                                            <SelectItem value="RIGHT">Destro</SelectItem>
                                            <SelectItem value="LEFT">Canhoto</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.handedness && (
                                <span className="text-sm font-medium text-red-500">
                                    {errors.handedness.message}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="gender" className="text-sm text-slate-200">
                                Sexo
                            </Label>

                            <Controller
                                name="gender"
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

                                            <SelectItem value="MALE">Masculino</SelectItem>
                                            <SelectItem value="FEMALE">Feminino</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            ></Controller>

                            {errors.gender && (
                                <span className="text-sm font-medium text-red-500">
                                    {errors.gender.message}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="bloodType" className="text-sm text-slate-200">
                                Tipo sanguíneo
                            </Label>

                            <Controller
                                name="bloodType"
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

                                            <SelectItem value="A_POSITIVE">A+</SelectItem>
                                            <SelectItem value="A_NEGATIVE">A-</SelectItem>
                                            <SelectItem value="B_POSITIVE">B+</SelectItem>
                                            <SelectItem value="B_NEGATIVE">B-</SelectItem>
                                            <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                                            <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                                            <SelectItem value="O_POSITIVE">O+</SelectItem>
                                            <SelectItem value="O_NEGATIVE">O-</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            ></Controller>

                            {errors.bloodType && (
                                <span className="text-sm font-medium text-red-500">
                                    {errors.bloodType.message}
                                </span>
                            )}
                        </div>
                    </div>
                </form>
            </div>

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

                    <Button type="submit" form="new-athlete-form" disabled={isSubmitting} size="sm" variant="primary">
                        {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <span>Cadastrar</span>}
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    )
}