import { useForm } from "react-hook-form";

import { Control, Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { formatPostalCode } from "@/utils/formatters/format-postal-code";

import { Loader2 } from "lucide-react";

import { useMutation } from "@tanstack/react-query";

import { updateAddress } from "@/api/update-address";

import { toast } from "sonner";

import { errorHandler } from "@/error-handler";

const addressFormSchema = z.object({
    postalCode: z.string().nullable(),
    street: z.string().nullable(),
    number: z.string().nullable(),
    city: z.string().nullable(),
    country: z.string().nullable(),
    uf: z.string().nullable(),
    neighborhood: z.string().nullable(),
    complement: z.string().nullable()
})

type AddressForm = z.infer<typeof addressFormSchema>;

interface AddressFormProps extends AddressForm {
    athleteId: string
};

export function AddressForm({ athleteId, postalCode, street, city, complement, country, neighborhood, number, uf }: AddressFormProps) {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<AddressForm>({
        resolver: zodResolver(addressFormSchema),

        values: {
            postalCode: postalCode ?? null,
            city: city ?? null,
            complement: complement ?? null,
            country: country ?? null,
            neighborhood: neighborhood ?? null,
            number: number ?? null,
            street: street ?? null,
            uf: uf ?? null 
        }
    })

    const { mutateAsync: updateAddressFn } = useMutation({
        mutationFn: updateAddress,

        onSuccess: () => {
            toast.success("Endereço atualizado com sucesso!");
        }
    })

    async function handleAddressUpdate(data: AddressForm) {
        try {
            if (data) {
                await updateAddressFn({
                    postalCode: data.postalCode ?? null,
                    street: data.street ?? null,
                    city: data.city ?? null,
                    complement: data.complement ?? null,
                    country: data.country ?? null,
                    neighborhood: data.neighborhood ?? null,
                    number: data.number ?? null,
                    uf: data.uf ?? null,
                    
                    athleteId
                })
            }
        }

        catch (error) { errorHandler(error); }
    } 

    return (
        <form method="POST" onSubmit={handleSubmit(handleAddressUpdate)} className="flex flex-col gap-6 lg:gap-y-6 lg:gap-x-6">
            <section className="grid grid-cols-1 lg:grid-flow-col auto-cols-fr gap-4 lg:grid-cols-[180px_1fr]">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="postalCode" className="text-sm text-slate-200">
                        CEP
                    </Label>

                    <Input>
                        <Control 
                            type="text"
                            id="postalCode"
                            placeholder="99999-999"
                            maxLength={9}
                            onInput={(event) => event.currentTarget.value = formatPostalCode(event.currentTarget.value)}       
                            
                            {...register("postalCode")}
                        />
                    </Input>
                </div>
                
                <div className="flex flex-col gap-2">
                    <Label htmlFor="street" className="text-sm text-slate-200">
                        Rua
                    </Label>

                    <Input>
                        <Control 
                            type="text"
                            id="street"
                            placeholder="Nome da rua"
                            
                            {...register("street")}
                        />
                    </Input>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-flow-col auto-cols-fr gap-4 lg:grid-cols-[180px_1fr]">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="number" className="text-sm text-slate-200">
                        Número
                    </Label>

                    <Input>
                        <Control 
                            type="number"
                            id="number"
                            placeholder="000"

                            {...register("number")}
                        />
                    </Input>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="complement" className="text-sm text-slate-200">
                        Complemento
                    </Label>

                    <Input>
                        <Control 
                            type="text"
                            id="complement"
                            placeholder="Casa, Apto, etc"

                            {...register("complement")}
                        />
                    </Input>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-flow-col auto-cols-fr gap-4 lg:grid-cols-[1fr_1fr_80px]">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="neighborhood" className="text-sm text-slate-200">
                        Bairro
                    </Label>

                    <Input>
                        <Control 
                            type="text"
                            id="neighborhood"
                            placeholder="Nome do bairro"

                            {...register("neighborhood")}
                        />
                    </Input>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="city" className="text-sm text-slate-200">
                        Cidade
                    </Label>

                    <Input>
                        <Control 
                            type="text"
                            id="city"
                            placeholder="Nome da cidade"

                            {...register("city")}
                        />
                    </Input>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="uf" className="text-sm text-slate-200">
                        UF
                    </Label>

                    <Input>
                        <Control 
                            type="text"
                            id="uf"
                            placeholder="UF"

                            {...register("uf")}
                        />
                    </Input>
                </div>
            </section>

            <Button type="submit" size="md" variant="primary" className="self-end" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin size-5" /> : <span className="">Salvar</span>}
            </Button>
        </form>
    )
}