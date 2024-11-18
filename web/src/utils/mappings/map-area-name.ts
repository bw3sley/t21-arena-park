export enum Area {
    PSYCHOLOGY = "PSYCHOLOGY",
    NUTRITION = "NUTRITION",
    PHYSIOTHERAPY = "PHYSIOTHERAPY",
    NURSING = "NURSING",
    PSYCHOPEDAGOGY = "PSYCHOPEDAGOGY",
    PHYSICAL_EDUCATION = "PHYSICAL_EDUCATION"
}

export function mapArea(keys: string | string[]) {
    const map = {
        PSYCHOLOGY: "Psicologia",
        NUTRITION: "Nutrição",
        PHYSIOTHERAPY: "Fisioterapia",
        NURSING: "Enfermagem",
        PSYCHOPEDAGOGY: "Psicopedagogia",
        PHYSICAL_EDUCATION: "Educação Física"
    };

    if (typeof keys === "string") {
        return map[keys as keyof typeof map] || keys;
    } 
    
    else if (Array.isArray(keys)) {
        return keys.map(key => map[key as keyof typeof map] || key).join(", ");
    }

    return keys;
}
