import { Helmet } from "react-helmet-async";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Pagination } from "@/components/pagination";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useSearchParams } from "react-router-dom";

import { z } from "zod";

import { useQuery } from "@tanstack/react-query";

import { getMembers } from "@/api/get-members";

import { MemberTableFilters } from "./member-table-filters";
import { MemberTableRow } from "./member-table-row";
import { MemberTableSkeleton } from "./member-table-skeleton";
import { NewMemberDialog } from "./new-member-dialog";

import clsx from "clsx";

import { Plus } from "lucide-react";

import { useState } from "react";

export function Members() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [isNewMemberDialogOpen, setIsNewMemberDialogOpen] = useState(false);

    const memberName = searchParams.get("memberName");
    const role = searchParams.get("role");

    const pageIndex = z.coerce.number().transform((page) => page - 1).parse(searchParams.get("page") ?? "1");

    const { data, isLoading: isLoadingMembers } = useQuery({
        queryKey: ["members", pageIndex, memberName, role],
        queryFn: () => getMembers({ pageIndex, memberName, role })
    })

    function handlePaginate(pageIndex: number) {
        setSearchParams((state) => {
            state.set("page", String(pageIndex + 1));

            return state;
        })
    }

    return (
        <>
            <Helmet title="Voluntários" />

            <div className="flex flex-col p-6 pb-10 gap-6 md:gap-10">
                <div className="flex flex-col gap-4">
                    <div className="space-y-2 mb-3">
                        <h1 className="text-3xl font-bold tracking-tight font-error">
                            Voluntários
                        </h1>

                        <p className="text-base text-slate-400">
                            Visualize as informações gerais dos seus voluntários.
                        </p>
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex flex-col lg:flex-row items-center justify-content gap-2">
                            <MemberTableFilters />

                            <Dialog open={isNewMemberDialogOpen} onOpenChange={setIsNewMemberDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button type="button" variant="primary" className="w-full lg:w-fit lg:mt-0" size="xs">
                                        <Plus className="size-4" />
                                        Cadastrar
                                    </Button>
                                </DialogTrigger>

                                <NewMemberDialog controller={setIsNewMemberDialogOpen} />
                            </Dialog>
                        </div>
                        
                        <div className="rounded-lg border overflow-y-hidden border-slate-700">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[400px]">Voluntário</TableHead>
                                        <TableHead className="w-[220px]">Telefone</TableHead>
                                        <TableHead className="w-[64px]"></TableHead>
                                        <TableHead className="w-[240px]">Área</TableHead>
                                        <TableHead className="w-[64px]"></TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {isLoadingMembers && <MemberTableSkeleton />}

                                    {data && data.members.length > 0 ? (
                                        data.members.map((member) => (
                                            <MemberTableRow key={member.id} member={member} />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className={clsx("text-center text-slate-400", isLoadingMembers && "hidden")}>
                                                Nenhum membro encontrado
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {data && data.members.length > 0 && (
                        <Pagination
                            onPageChange={handlePaginate}

                            pageIndex={data.meta.pageIndex}
                            perPage={data.meta.perPage}
                            totalCount={data.meta.totalCount}
                        />
                    )}
                </div>
            </div>
        </>
    )
}