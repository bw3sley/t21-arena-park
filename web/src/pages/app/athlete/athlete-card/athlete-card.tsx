import { Button } from "@/components/ui/button";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { getNameInitials } from "@/utils/get-name-initials";

import { AthleteDialog } from "../athlete-dialog";

import { Plus } from "lucide-react";

import { mapBloodType } from "@/utils/mappings/map-blood-type";
import { mapHandedness } from "@/utils/mappings/map-handedness";
import { mapGender } from "@/utils/mappings/map-gender";

import { useState } from "react";

export interface AthleteCardProps {
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

export function AthleteCard({ athlete }: AthleteCardProps) {
    const [isAthleteDialogOpen, setIsAthleteDialogOpen] = useState(false);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex border border-slate-700 rounded flex-col p-0 relative overflow-hidden">
                <div className="h-40 w-full relative overflow-hidden">
                    <div className="h-full bg-lime-500">
                        <div className="flex items-center gap-2 absolute top-4 right-4 z-10">
                            <Dialog open={isAthleteDialogOpen} onOpenChange={setIsAthleteDialogOpen}>
                                <DialogTrigger asChild> 
                                    <Button type="button" size="xs" className="px-3">
                                        Editar
                                    </Button>
                                </DialogTrigger>

                                <AthleteDialog controller={setIsAthleteDialogOpen} athlete={athlete} />
                            </Dialog>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center -mt-20">
                    <div className="relative">
                        <span className="flex justify-center items-center text-slate-200 select-none w-[10rem] h-[10rem]">
                            <span className="rounded-full leading-1 text-5xl flex h-full w-full items-center justify-center bg-slate-600 font-medium">
                                {getNameInitials(athlete.name)}
                            </span>
                        </span>
                    </div>

                    <div className="flex flex-col gap-1 items-center pt-6 pb-20 w-full">
                        <div className="flex gap-2 items-center justify-center w-full">
                            <strong className="text-xl text-center">
                                {athlete.name}
                            </strong>
                        </div>

                        <div className="flex flex-col w-full items-center">
                            <span className="text-sm text-slate-400">
                                {athlete?.bloodType ? `O tipo sanguíneo é (${mapBloodType(athlete.bloodType)})` : 'Tipo sanguíneo a definir'}
                            </span>

                            <div className="flex flex-col w-full items-center">
                                <div className="flex gap-2 justify-center mt-2 items-center">
                                    {athlete?.gender ? <span>{mapGender(athlete.gender)}</span> : (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="px-3 gap-2"
                                                >
                                                    <Plus className="text-lime-400 size-5" />

                                                    <span className="shrink-0 text-gray-200">
                                                        Gênero
                                                    </span>
                                                </Button>
                                            </DialogTrigger>
                                        </Dialog>
                                    )}

                                    <span>|</span>

                                    {athlete?.handedness ? <span>{mapHandedness(athlete.handedness)}</span> : (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="px-3 gap-2"
                                                >
                                                    <Plus className="text-lime-400 size-5" />

                                                    <span className="shrink-0 text-gray-200">
                                                        Lateralidade
                                                    </span>
                                                </Button>
                                            </DialogTrigger>
                                        </Dialog>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full justify-center py-4 border-t border-slate-700 absolute bottom-0 left-0 opacity-100 visible transition-all ease-in-out duration-300">
                        {athlete?.birthDate ? (
                            <span className="text-xs text-slate-300">
                                Nascido em{' '}
                                
                                <time>
                                    {athlete.birthDate}
                                </time>
                            </span>
                        ) : (
                            <span className="text-xs text-slate-300">
                                Data de nascimento inválida
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}