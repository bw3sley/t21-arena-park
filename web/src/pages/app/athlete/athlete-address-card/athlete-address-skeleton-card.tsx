import { AddressSkeletonForm } from "./address-skeleton-form";

import { MapPin } from "lucide-react";

export function AthleteAddressSkeletonCard() {
    return (
        <div className="flex flex-col bg-slate-800 border border-slate-700 rounded p-6 relative gap-6">
            <div className="flex items-start gap-4">
                <div className="size-14 flex items-center border-slate-700 justify-center border rounded-full flex-shrink-0">
                    <MapPin className="size-7 text-slate-400" />
                </div>

                <div className="space-y-1">
                    <h2 className="font-bold text-xl">Endereço</h2>

                    <p className="text-slate-400 text-md text-justify">
                        Informe o endereço completo do atleta, garantindo que todos os dados estejam corretos para facilitar a logística e a comunicação durante o acompanhamento.
                    </p>
                </div>
            </div>

            <AddressSkeletonForm />
        </div>
    )
}