import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { Skeleton } from "@/components/ui/skeleton";

import { Download } from "lucide-react";

import { AthleteTermsDialog } from "./athlete-terms-dialog";

import { useState } from "react";

interface AthleteTermsCardProps {
    isLoading: boolean,

    data: {
        guardian: {
            name: string,
            rg: string,
            cpf: string,
        },

        athlete: {
            name: string
        }
    }
}

export function AthleteTermsCard({ isLoading, data }: AthleteTermsCardProps) {
    const [isResponsibilityDialogOpen, setIsResponsibilityDialogOpen] = useState(false);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

    return (
        <div className="flex border border-slate-700 rounded gap-3 flex-col relative overflow-hidden py-6">
            <div className="flex items-center gap-3 px-6">
                <strong className="font-semibold">Termos</strong>
            </div>

            <ul className="flex flex-col px-4 list-disc">
                {isLoading ? <Skeleton className="h-6 m-2" /> : (
                    <Dialog open={isResponsibilityDialogOpen} onOpenChange={setIsResponsibilityDialogOpen}>
                        <DialogTrigger asChild>
                            <li className="group py-2 px-3 cursor-pointer text-slate-300 hover:bg-slate-800 rounded flex items-center justify-between transition-colors">
                                <div className="space-x-4 text-md">
                                    <span>&bull;</span>
                                    <span className="text-sm">Termo de responsabilidade</span>
                                </div>

                                <button
                                    type="button"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    <Download className="size-4" />
                                </button>
                            </li>
                        </DialogTrigger>

                        <AthleteTermsDialog key="RESPONSIBILITY" type="RESPONSIBILITY" controller={setIsResponsibilityDialogOpen} data={data} />
                    </Dialog>
                )}

                {isLoading ? <Skeleton className="h-6 mb-2 mx-2" /> : (
                    <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                        <DialogTrigger asChild>
                            <li className="group py-2 px-3 cursor-pointer text-slate-300 hover:bg-slate-800 rounded flex items-center justify-between transition-colors">
                                <div className="space-x-4 text-md">
                                    <span>&bull;</span>
                                    <span className="text-sm">Termo de imagem</span>
                                </div>

                                <button
                                    type="button"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    <Download className="size-4" />
                                </button>
                            </li>
                        </DialogTrigger>
                        
                        <AthleteTermsDialog key="IMAGE" type="IMAGE" controller={setIsImageDialogOpen} data={data} />
                    </Dialog>
                )}
            </ul>
        </div>
    )
}