import { updateAthlete } from "@/api/update-athlete";

import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";

import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { Control, Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger 
} from "@/components/ui/popover";

import { 
    Select, 
    SelectItem, 
    SelectContent, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

import { errorHandler } from "@/error-handler";

import { queryClient } from "@/lib/react-query";

import { formatDate } from "@/utils/formatters/format-date";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";

import { format } from "date-fns";

import { CalendarIcon, Loader2 } from "lucide-react";

import { useState } from "react";

import { Controller, useForm } from "react-hook-form";

import { useParams } from "react-router-dom";

import { toast } from "sonner";

import { z } from "zod";

const athleteDialogFormSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório."),
    birthDate: z.string().min(10, "A data de nascimento é obrigatória e deve estar no formato DD/MM/AAAA."),
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
    name: string,
    birthDate: string,
    handedness: "RIGHT" | "LEFT",
    gender: "MALE" | "FEMALE",
    bloodType:
        "A_POSITIVE" |
        "A_NEGATIVE" |
        "B_POSITIVE" |
        "B_NEGATIVE" |
        "AB_POSITIVE" |
        "AB_NEGATIVE" |
        "O_POSITIVE" |
        "O_NEGATIVE"
}

interface AthleteDialogProps {
    controller: (open: boolean) => void,

    athlete: {
        id: string,
    
        name: string,
        birthDate: string,
        handedness: "RIGHT" | "LEFT",
        gender: "MALE" | "FEMALE",
        bloodType:
            "A_POSITIVE" |
            "A_NEGATIVE" |
            "B_POSITIVE" |
            "B_NEGATIVE" |
            "AB_POSITIVE" |
            "AB_NEGATIVE" |
            "O_POSITIVE" |
            "O_NEGATIVE"
    }
}

export function AthleteDialog({ controller, athlete }: AthleteDialogProps) {
    const { athleteId } = useParams();

    const [date, setDate] = useState<Date | undefined>(new Date());

    const { handleSubmit, register, setValue, control, formState: { errors, isSubmitting } } = useForm<AthleteDialogForm>({
        resolver: zodResolver(athleteDialogFormSchema),

        values: {
            name: athlete.name,
            birthDate: athlete.birthDate,
            handedness: athlete.handedness,
            gender: athlete.gender,
            bloodType: athlete.bloodType
        }
    })

    const { mutateAsync: updateAthleteFn } = useMutation({
        mutationFn: updateAthlete,

        onSuccess: () => {
            toast.success("Os dados do atleta foram atualizados com sucesso!");

            queryClient.invalidateQueries({
                queryKey: ["athletes", athleteId]
            })

            controller(false);
        }
    })

    async function handleAthleteEdition(data: AthleteDialogForm) {
        try {
            await updateAthleteFn({
                athleteId: athlete.id,

                name: data.name,
                birthDate: data.birthDate,
                handedness: data.handedness,
                bloodType: data.bloodType,
                gender: data.gender
            })
        }

        catch (error) { errorHandler(error) }
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edição de atleta</DialogTitle>
                <DialogDescription>Atualize os dados do atleta para manter o acompanhamento sempre preciso e atualizado.</DialogDescription>
            </DialogHeader>

            <form method="POST" id="athlete-form" className="flex flex-col gap-4" onSubmit={handleSubmit(handleAthleteEdition)}>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="name" className="text-sm text-slate-200">
                        Nome
                    </Label>

                    <Input>
                        <Control
                            placeholder="Nome do atleta"
                            type="text"
                            className="text-sm"
                            autoComplete="off"
                            id="name"
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
                                placeholder="DD/MM/AAAA"
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
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="handedness" className="text-sm text-slate-200">
                        Lateralidade
                    </Label>

                    <Controller
                        name="handedness"
                        control={control}
                        render={({ field: { onChange, value, disabled } }) => (
                            <Select
                                onValueChange={onChange}
                                value={value}
                                disabled={disabled}
                            >
                                <SelectTrigger className="h-12 w-full bg-slate-900 text-sm">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="none">Selecione uma opção</SelectItem>

                                    <SelectItem value="RIGHT">Destro</SelectItem>

                                    <SelectItem value="LEFT">Canhoto</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    ></Controller>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="gender" className="text-sm text-slate-200">
                        Genêro
                    </Label>

                    <Controller
                        name="gender"
                        control={control}
                        render={({ field: { onChange, value, disabled } }) => (
                            <Select
                                onValueChange={onChange}
                                value={value}
                                disabled={disabled}
                            >
                                <SelectTrigger className="h-12 w-full bg-slate-900 text-sm">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="none">Selecione uma opção</SelectItem>

                                    <SelectItem value="MALE">Masculino</SelectItem>

                                    <SelectItem value="FEMALE">Feminino</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    ></Controller>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="bloodType" className="text-sm text-slate-200">
                        Tipo sanguíneo
                    </Label>

                    <Controller
                        name="bloodType"
                        control={control}
                        render={({ field: { onChange, value, disabled } }) => (
                            <Select
                                onValueChange={onChange}
                                value={value}
                                disabled={disabled}
                            >
                                <SelectTrigger className="h-12 w-full  bg-slate-900 text-sm">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="none">Selecione uma opção</SelectItem>

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
                </div>
            </form>

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary" className="rounded-md" size="sm">
                        Fechar
                    </Button>
                </DialogClose>

                <Button type="submit" form="athlete-form" disabled={isSubmitting} size="sm" variant="primary">
                    {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <span>Atualizar</span>}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}