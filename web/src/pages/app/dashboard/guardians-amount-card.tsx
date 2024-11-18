import { getGuardiansAmount } from "@/api/get-guardians-amount";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";

import { ShieldCheck } from "lucide-react";

import { MetricCardSkeleton } from "./metric-card-skeleton";

export function GuardiansAmountCard() {
    const { data: guardiansAmount } = useQuery({
        queryKey: ["metrics", "guardians-amount"],
        queryFn: getGuardiansAmount
    })
    return (
        <Card>
            <CardHeader className="flex-row space-y-0 items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Total de responsáveis</CardTitle>

                <ShieldCheck className="size-5 text-slate-600" />
            </CardHeader>

            <CardContent className="space-y-1">
                {guardiansAmount ? (
                    <span className="text-2xl font-bold tracking-tight">
                        {guardiansAmount.amount.toLocaleString('pt-BR')}
                    </span>
                ) : (
                    <MetricCardSkeleton />
                )}
            </CardContent>
        </Card>
    )
}