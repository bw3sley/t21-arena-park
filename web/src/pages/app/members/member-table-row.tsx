import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { TableCell, TableRow } from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { getNameInitials } from "@/utils/get-name-initials";

import { Loader2, Pencil, Trash2 } from "lucide-react";

import { UpdateMemberDialog } from "./update-member-dialog";

import { Badge } from "@/components/ui/badge";

import { mapRole } from "@/utils/mappings/map-role";
import { mapArea } from "@/utils/mappings/map-area-name";

import { useMutation } from "@tanstack/react-query";

import { removeMember } from "@/api/remove-member";

import { toast } from "sonner";

import { queryClient } from "@/lib/react-query";

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

import { useState } from "react";

import { errorHandler } from "@/error-handler";

interface MemberTableRowsProps {
    member: {
        id: string,
        name: string,
        email: string,
        role: "ADMIN" | "MEMBER",
        phone: string | null,
        areas: ("UNSPECIFIED" | "PSYCHOLOGY" | "PHYSIOTHERAPY" | "NUTRITION" | "NURSING" | "PSYCHOPEDAGOGY" | "PHYSICAL_EDUCATION")[]
    }
}

export function MemberTableRow({ member }: MemberTableRowsProps) {
    const [open, setOpen] = useState(false);

    const [isUpdateMemberDialogOpen, setIsUpdateMemberDialogOpen] = useState(false);

    const { mutateAsync: removeMemberFn, isPending } = useMutation({
        mutationFn: removeMember,

        onSuccess: () => {
            toast.success("Voluntário removido com sucesso!");

            queryClient.invalidateQueries({
                queryKey: ["members"]
            })
        }
    })

    async function handleMemberRemotion(memberId: string) {
        try {
            await removeMemberFn({ memberId });
        }

        catch (error) { errorHandler(error) }
    }

    return (
        <TableRow className="group border-b border-slate-700">
            <TableCell>
                <div className="flex gap-4">
                    <div className="size-10 self-center rounded-full flex items-center justify-center border border-slate-700 bg-slate-600">
                        <span className="font-medium">{getNameInitials(member.name)}</span>
                    </div>

                    <div className="flex flex-col gap-.5">
                        <span className="text-slate-200 font-semibold text-md">{member.name}</span>

                        <span className="text-slate-500 text-md">{member.email}</span>
                    </div>

                    <div className="self-center">
                        <Badge className="border-slate-700 bg-slate-800/80 text-slate-300 text-[10px] font-medium">{mapRole(member.role)}</Badge>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                {member.phone ? member.phone : <span className="text-slate-400">Telefone não cadastrado</span>}
            </TableCell>

            <TableCell>
                <Dialog open={isUpdateMemberDialogOpen} onOpenChange={setIsUpdateMemberDialogOpen}>
                    <DialogTrigger asChild>
                        <div className="group-hover:flex hidden items-center justify-center">
                            <Button type="button" size="md" variant="link" className="gap-3 p-0">
                                <Pencil className="size-4" />

                                <span>Editar</span>
                            </Button>
                        </div>
                    </DialogTrigger>

                    <UpdateMemberDialog controller={setIsUpdateMemberDialogOpen} member={member} />
                </Dialog>
            </TableCell>

            <TableCell>
                {member.areas.length > 0 ? mapArea(member.areas) : <span className="text-slate-400">Nenhuma área vinculada nesse usuário</span>}
            </TableCell>

            <TableCell className="flex justify-center">
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogTrigger asChild>
                        <button
                            type="button"
                            title="Delete o usuário"
                            className="border gap-2 size-9 border-slate-800 rounded-md flex items-center justify-center disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed hover:enabled:bg-slate-700/60"
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
                                Esta ação não pode ser desfeita. Ao deletar o usuário, todos os dados associados a ele serão removidos permanentemente da plataforma.
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
                                    onClick={() => handleMemberRemotion(member.id)}
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