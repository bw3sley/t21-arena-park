export enum BloodType {
    A_POSITIVE = "A_POSITIVE",
    A_NEGATIVE = "A_NEGATIVE",
    B_POSITIVE = "B_POSITIVE",
    B_NEGATIVE = "B_NEGATIVE",
    AB_POSITIVE = "AB_POSITIVE",
    AB_NEGATIVE = "AB_NEGATIVE",
    O_POSITIVE = "O_POSITIVE",
    O_NEGATIVE = "O_NEGATIVE"
}

export function mapBloodType(key: string) {
    const map = {
        A_POSITIVE: "A+",
        A_NEGATIVE: "A-",
        B_POSITIVE: "B+",
        B_NEGATIVE: "B-",
        AB_POSITIVE: "AB+",
        AB_NEGATIVE: "AB-",
        O_POSITIVE: "O+",
        O_NEGATIVE: "O-"
    }
    
    return map[key as keyof typeof map];
}
