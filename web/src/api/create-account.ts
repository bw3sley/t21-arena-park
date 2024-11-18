import { api } from "@/lib/axios";

export type CreateAccountBody = {
    name: string,
    email: string,
    phone: string | null,
    role: "ADMIN" | "MEMBER" | "none",
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

export async function createAccount({ name, email, phone, role, areas }: CreateAccountBody) {
    await api.post("/members", { name, email, phone, role, areas });
}