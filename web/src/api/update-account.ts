import { api } from "@/lib/axios";

import { parse } from "date-fns";

export type UpdateAccountBody = {
    name: string,
    cpf: string | null,
    birthDate: string | null,
    gender: "MALE" | "FEMALE" | null,
    phone: string | null
}

export async function updateAccount({ name, cpf, birthDate, gender, phone }: UpdateAccountBody) {
    await api.put("/account", {
        name,
        cpf,
        birthDate: birthDate ? parse(birthDate, 'dd/MM/yyyy', new Date()).toISOString() : null,
        gender,
        phone
    })    
}