export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE"
}

export function mapGender(key: string) {
    const map = {
        MALE: "Masculino",
        FEMALE: "Feminino"
    }

    return map[key as keyof typeof map];
}
