import { getAthletesByGenderAmount } from "@/api/get-athletes-by-gender-amount";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";

import { BarChart, Loader2 } from "lucide-react";

import { ResponsiveContainer, Pie, PieChart, Cell } from "recharts";

import colors from "tailwindcss/colors";

const COLORS = [colors.lime[500], colors.sky[500]];

export function AthletesGenderAmountChart() {
    const { data: athletesGenderAmount } = useQuery({
        queryKey: ["metrics", "athletes-gender-amount"],
        queryFn: getAthletesByGenderAmount
    })

    return (
        <Card className="col-span-3">
            <CardHeader className="pb-8">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">Quantidade de atletas sexo</CardTitle>

                    <BarChart className="size-5 text-slate-600" />
                </div>
            </CardHeader>

            <CardContent>
                {athletesGenderAmount ? (
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart style={{ fontSize: 12 }}>
                            <Pie
                                data={athletesGenderAmount}
                                dataKey="amount"
                                nameKey="gender"
                                cx="50%"
                                cy="50%"
                                outerRadius={86}
                                innerRadius={64}
                                strokeWidth={8}
                                labelLine={false}
                                label={({
                                    cx,
                                    cy,
                                    midAngle,
                                    innerRadius,
                                    outerRadius,
                                    value,
                                    index,
                                }) => {
                                    const RADIAN = Math.PI / 180
                                    const radius =
                                        12 + innerRadius + (outerRadius - innerRadius)
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN)
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN)

                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            className="fill-slate-300 text-xs"
                                            textAnchor={x > cx ? "start" : "end"}
                                            dominantBaseline="central"
                                        >
                                            {athletesGenderAmount[index].gender.length > 12
                                                ? athletesGenderAmount[index].gender
                                                    .substring(0, 12)
                                                    .concat("...")
                                                : athletesGenderAmount[index].gender}{" "}
                                            ({value})
                                        </text>
                                    )
                                }}
                            >
                                {athletesGenderAmount.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index]}
                                        className="stroke-slate-900 hover:opacity-80"
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-[240px] w-full items-center justify-center">
                        <Loader2 className="size-8 animate-spin text-slate-600" />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}