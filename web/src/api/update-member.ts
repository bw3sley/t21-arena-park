import { api } from "@/lib/axios";

export type UpdateMemberBody = {
    memberId: string,

    name: string,
    email: string,
    phone: string | null,
    role: "ADMIN" | "MEMBER",
    areas: (
        | "UNSPECIFIED"
        | "PSYCHOLOGY"
        | "PHYSIOTHERAPY"
        | "NUTRITION"
        | "NURSING"
        | "PSYCHOPEDAGOGY"
        | "PHYSICAL_EDUCATION"
    )[]
}

export async function updateMember({ memberId, name, email, role, phone, areas }: UpdateMemberBody) {
    await api.put(`/members/${memberId}`, { name, email, phone, role, areas });
}