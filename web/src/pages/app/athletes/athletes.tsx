import { getAthletes } from "@/api/get-athletes";

import { Pagination } from "@/components/pagination";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useQuery } from "@tanstack/react-query";

import { Helmet } from "react-helmet-async";

import { useSearchParams } from "react-router-dom";

import { z } from "zod";

import { AthleteTableSkeleton } from "./athlete-table-skeleton";
import { AthleteTableFilters } from "./athlete-table-filters";
import { AthleteTableRow } from "./athlete-table-row";
import { AthleteDialog } from "./athlete-dialog";

import clsx from "clsx";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";

import { useState } from "react";

export function Athletes() {
    const [isAthleteDialogOpen, setIsAthleteDialogOpen] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    const athleteName = searchParams.get("athleteName");
    const gender = searchParams.get("gender");

    const pageIndex = z.coerce.number().transform((page) => page - 1).parse(searchParams.get("page") ?? "1");

    const { data, isLoading: isLoadingAthletes } = useQuery({
        queryKey: ["athletes", pageIndex, athleteName, gender],
        queryFn: () => getAthletes({ pageIndex, athleteName, gender })
    })

    function handlePaginate(pageIndex: number) {
        setSearchParams((state) => {
            state.set("page", String(pageIndex + 1));

            return state;
        })
    }

    return (
        <>
            <Helmet title="Atletas" />

            <div className="flex flex-col p-6 pb-10 gap-6 md:gap-10">
                <div className="flex flex-col gap-4">
                    <div className="space-y-2 mb-3">
                        <h1 className="text-3xl font-bold tracking-tight font-error">
                            Atletas
                        </h1>

                        <p className="text-base text-slate-400">
                            Visualize as informações dos seus atletas cadastrados na plataforma.
                        </p>
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex flex-col gap-2 lg:flex-row items-center justify-between">
                            <AthleteTableFilters />

                            <Dialog open={isAthleteDialogOpen} onOpenChange={setIsAthleteDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button type="button" className="w-full lg:w-fit lg:mt-0" variant="primary" size="xs">
                                        <Plus className="size-4" />

                                        Cadastrar
                                    </Button>
                                </DialogTrigger>

                                <AthleteDialog controller={setIsAthleteDialogOpen} />
                            </Dialog>
                        </div>

                        <div className="rounded-lg border overflow-y-hidden border-slate-700">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[64px]"></TableHead>
                                        <TableHead className="w-[320px]">Nome</TableHead>
                                        <TableHead className="w-[140px]">Idade</TableHead>
                                        <TableHead className="w-[140px]">Lateralidade</TableHead>
                                        <TableHead className="w-[140px]">Sexo</TableHead>
                                        <TableHead className="w-[140px]">Tipo sanguíneo</TableHead>
                                        <TableHead className="w-[64px]"></TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {isLoadingAthletes && <AthleteTableSkeleton />}

                                    {data && data.athletes.length > 0 ? (
                                        data.athletes.map((athlete) => (
                                            <AthleteTableRow key={athlete.id} athlete={athlete} />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className={clsx("text-center text-slate-400", isLoadingAthletes && "hidden")}>
                                                Nenhum atleta encontrado
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {data && data?.athletes.length > 0 && (
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