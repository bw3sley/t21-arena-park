import { Helmet } from "react-helmet-async";

import { AthletesAmountCard } from "./athletes-amount-card";
import { AnamnesisAmountCard } from "./anamnesis-amount-card";
import { AverageAgeAmountCard } from "./average-age-amount-card";
import { GuardiansAmountCard } from "./guardians-amount-card";

import { LastWeekAthletesAmountChart } from "./last-week-athletes-amount-chart";
import { AthletesGenderAmountChart } from "./athletes-gender-amount-chart";

export function Dashboard() {
    return (
        <>
            <Helmet title="Dashboard" />

            <div className="flex flex-col p-6 pb-10 gap-6 md:gap-10">
                <div className="flex flex-col gap-4">
                    <div className="space-y-2 mb-3">
                        <h1 className="text-3xl font-bold tracking-tight font-error">
                            Dashboard
                        </h1>

                        <p className="text-base text-slate-400">
                            Visualize as informações gerais dos seus atletas.
                        </p>
                    </div>

                    <div className="grid grid-cols-4 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1 gap-4">
                        <AthletesAmountCard />
                        <AnamnesisAmountCard />
                        <GuardiansAmountCard />
                        <AverageAgeAmountCard />
                    </div>

                    <div className="grid lg:grid-cols-9 max-[1100px]:grid-cols-1 lg:gap-4 gap-y-4">
                        <LastWeekAthletesAmountChart />
                        <AthletesGenderAmountChart />
                    </div>
                </div>
            </div>
        </>
    )
}