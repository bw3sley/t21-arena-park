import { getAthletesAmount } from "@/api/get-athletes-amount";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";

import { Users } from "lucide-react";

import { MetricCardSkeleton } from "./metric-card-skeleton";

export function AthletesAmountCard() {
    const { data: athletesAmount } = useQuery({
        queryKey: ["metrics", "athletes-amount"],
        queryFn: getAthletesAmount
    })

    return (
        <Card>
            <CardHeader className="flex-row space-y-0 items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Total de atletas</CardTitle>

                <Users className="size-5 text-slate-600" />
            </CardHeader>

            <CardContent className="space-y-1">
                {athletesAmount ? (
                    <span className="text-2xl font-bold tracking-tight">
                        {athletesAmount.amount.toLocaleString('pt-BR')}
                    </span>
                ) : (
                    <MetricCardSkeleton />
                )}
            </CardContent>
        </Card>
    )
}