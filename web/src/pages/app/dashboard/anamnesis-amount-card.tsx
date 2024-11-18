import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";

import { FileHeart } from "lucide-react";

import { MetricCardSkeleton } from "./metric-card-skeleton";

import { getAnamnesisAmount } from "@/api/get-anamnesis-amount";

export function AnamnesisAmountCard() {
    const { data: anamnesisAmount } = useQuery({
        queryKey: ["metrics", "anamnesis-count"],
        queryFn: getAnamnesisAmount
    })

    return (
        <Card>
            <CardHeader className="flex-row space-y-0 items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Total de anamneses</CardTitle>

                <FileHeart className="size-5 text-slate-600" />
            </CardHeader>

            <CardContent className="space-y-1">
                {anamnesisAmount ? (
                    <span className="text-2xl font-bold tracking-tight">
                        {anamnesisAmount.amount.toLocaleString('pt-BR')}
                    </span>
                ) : (
                    <MetricCardSkeleton />
                )}
            </CardContent>
        </Card>
    )
}