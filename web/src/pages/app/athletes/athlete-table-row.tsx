import { useState } from "react";

import { removeAthlete } from "@/api/remove-athlete";

import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTrigger,
    AlertDialogContent, 
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

import { TableCell, TableRow } from "@/components/ui/table";

import { errorHandler } from "@/error-handler";

import { mapBloodType } from "@/utils/mappings/map-blood-type";
import { mapGender } from "@/utils/mappings/map-gender";
import { mapHandedness } from "@/utils/mappings/map-handedness";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Loader2, Search, Trash2 } from "lucide-react";

import { Link } from "react-router-dom";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface AthleteTableRowProps {
    athlete: {
        id: string,
        name: string,
        age: number,
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

export function AthleteTableRow({ athlete }: AthleteTableRowProps) {
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    const { mutateAsync: removeAthleteFn, isPending } = useMutation({
        mutationFn: removeAthlete,

        onSuccess: () => {
            toast.success("Atleta removido com sucesso!");

            queryClient.invalidateQueries({
                queryKey: ["athletes"]
            })

            setOpen(false);
        }
    })

    async function handleAthleteRemotion(athleteId: string) {
        try {
            await removeAthleteFn({ athleteId });
        }

        catch (error) { errorHandler(error) }
    }

    return (
        <TableRow>
            <TableCell className="flex items-center justify-center">
                <Link
                    to={`/athletes/${athlete.id}`}
                    className="size-9 border cursor-pointer border-slate-700 flex-shrink-0 rounded-md flex items-center justify-center hover:bg-slate-700/60"
                >
                    <Search className="size-4" />
                </Link>
            </TableCell>

            <TableCell>
                <div className="flex flex-col gap-0.5">
                    <span className="text-slate-300">{athlete.name}</span>
                </div>
            </TableCell>

            <TableCell className="text-slate-300 cursor-help">
                <time dateTime={athlete.birthDate} title={`Nascido em ${athlete.birthDate}`}>
                    {athlete.age} anos
                </time>
            </TableCell>

            <TableCell className="text-slate-300">{mapHandedness(athlete.handedness)}</TableCell>

            <TableCell className="text-slate-300">{mapGender(athlete.gender)}</TableCell>

            <TableCell className="text-slate-300">{mapBloodType(athlete.bloodType)}</TableCell>

            <TableCell className="">
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogTrigger asChild>
                        <button
                            type="button"
                            title="Delete o usuário"
                            className="border gap-2 size-9 border-slate-800 rounded-md flex items-center justify-center hover:bg-slate-700/60"
                        >
                            <Trash2 className="size-4" />
                        </button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Você tem certeza disso?
                            </AlertDialogTitle>
                            
                            <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Ao deletar o atleta, todos os dados associados a ele serão removidos permanentemente da plataforma.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                                <Button type="button" size="lg" variant="ghost">
                                    <span>Cancelar</span>
                                </Button>
                            </AlertDialogCancel>

                            <AlertDialogAction asChild>
                                <Button 
                                    type="button" 
                                    variant="primary" 
                                    size="lg"
                                    onClick={() => handleAthleteRemotion(athlete.id)}
                                >
                                    {isPending ? <Loader2 className="size-5" /> : <span>Continuar</span>}
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </TableCell>
        </TableRow>
    )
}