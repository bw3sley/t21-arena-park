import { api } from "@/lib/axios";

export type GetAthleteAnamnesisParams = {
    athleteId: string
}

export type GetAthleteAnamnesisResponse = {
    form: {
        id: string,

        title: string,
        slug: string,

        sections: {
            id: number,

            title: string,
            icon: string,

            questions: {
                id: number,

                title: string,
                type:
                "INPUT" |
                "CHECKBOX" |
                "SELECT" |
                "MULTI_SELECT" |
                "DATE" |
                "RADIO",

                description: string | null,
                observation: string | null,

                answer: string | string[] | null,

                options?: {
                    label: string,
                    value: string
                }[]
            }[]
        }[]
    },

    athlete: {
        id: string,

        name: string
    }
}


export async function getAthleteAnamnesis({ athleteId }: GetAthleteAnamnesisParams) {
    const slug = "anamnesis";

    const response = await api.get<GetAthleteAnamnesisResponse>(`/athletes/${athleteId}/forms/${slug}`);

    return response.data;
}