import { getAverageAgeAmount } from "@/api/get-average-age-amount";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";

import { PartyPopper } from "lucide-react";

import { MetricCardSkeleton } from "./metric-card-skeleton";

export function AverageAgeAmountCard() {
    const { data: averageAgeAmount } = useQuery({
        queryKey: ["metrics", "average-age-amount"],
        queryFn: getAverageAgeAmount
    })

    return (
        <Card>
            <CardHeader className="flex-row space-y-0 items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Idade média dos atletas</CardTitle>

                <PartyPopper className="size-5 text-slate-600" />
            </CardHeader>

            <CardContent className="space-y-1">
                {averageAgeAmount ? (
                    <span className="text-2xl font-bold tracking-tight">
                        {averageAgeAmount.amount.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
                    </span>
                ) : (
                    <MetricCardSkeleton />
                )}
            </CardContent>
        </Card>
    )
}