import { api } from "@/lib/axios";

export type UpdateAddressBody = {
    athleteId: string,
    street: string | null,
    neighborhood: string | null, 
    postalCode: string | null,
    complement: string | null,
    number: string | null,
    city: string | null,
    uf: string | null,
    country: string | null
}

export async function updateAddress({ athleteId, street, neighborhood, postalCode, complement, number, city, uf, country }: UpdateAddressBody) {
    await api.put(`/athletes/${athleteId}/address`, {
        street,
        neighborhood,
        postalCode,
        complement,
        number,
        city,
        uf,
        country
    })
}