import { api } from "@/lib/axios";

export type GetProfileResponse = {
    id: string,
    name: string,
    email: string,
    role: "ADMIN" | "MEMBER",
    avatarUrl: string | null,
    cpf: string | null,
    phone: string | null,
    gender: "MALE" | "FEMALE" | null,
    birthDate: string | null,
    areas: {
        name: "UNSPECIFIED" | 
        "PSYCHOLOGY" | 
        "PHYSIOTHERAPY" | 
        "NUTRITION" | 
        "NURSING" | 
        "PSYCHOPEDAGOGY" | 
        "PHYSICAL_EDUCATION"
    }[]
}

export async function getProfile() {
    const response = await api.get<GetProfileResponse>("/profile");

    return response.data;
}