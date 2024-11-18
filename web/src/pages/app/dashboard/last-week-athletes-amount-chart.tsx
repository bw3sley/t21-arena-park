import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
    ResponsiveContainer,
    LineChart,
    XAxis,
    YAxis,
    Line,
    CartesianGrid,
} from "recharts";

import { useQuery } from "@tanstack/react-query";

import { BarChart, Loader2 } from "lucide-react";

import colors from "tailwindcss/colors";

import { getLastWeekAthletesAmount } from "@/api/get-last-week-athletes-amount";

export function LastWeekAthletesAmountChart() {
    const { data: lastWeekAthletesAmount } = useQuery({
        queryKey: ["metrics", "last-week"],
        queryFn: getLastWeekAthletesAmount
    })

    return (
        <Card className="col-span-6 max-[1100px]:col-span-full">
            <CardHeader className="flex-row items-center justify-between pb-8">
                <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">Atletas da semana</CardTitle>

                    <CardDescription>Atletas cadastrados durante a última semana</CardDescription>
                </div>

                <BarChart className="size-5 text-slate-600" />
            </CardHeader>

            <CardContent>
                {lastWeekAthletesAmount ? (
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={lastWeekAthletesAmount} style={{ fontSize: 12 }}>
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                dy={16}
                            />

                            <YAxis
                                stroke="#888"
                                axisLine={false}
                                tickLine={false}
                                width={80}
                            />

                            <CartesianGrid vertical={false} className="stroke-slate-700" />

                            <Line
                                stroke={colors.lime[500]}
                                type="linear"
                                strokeWidth={2}
                                dataKey="count"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-[240px] w-full items-center justify-center">
                        <Loader2 className="size-8 animate-spin text-slate-700" />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}