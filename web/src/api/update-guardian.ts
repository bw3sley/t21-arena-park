import { api } from "@/lib/axios";

export type UpdateGuardianBody = {
    athleteId: string,
    name: string | null,
    email: string | null, 
    rg: string | null,
    cpf: string | null,
    relationshipDegree: string | null,
    gender: "MALE" | "FEMALE" | null,
}

export async function updateGuardian({ athleteId, name, email, rg, cpf, relationshipDegree, gender }: UpdateGuardianBody) {
    await api.put(`/athletes/${athleteId}/guardian`, {
        name,
        email,
        rg,
        cpf,
        relationshipDegree,
        gender
    })
}