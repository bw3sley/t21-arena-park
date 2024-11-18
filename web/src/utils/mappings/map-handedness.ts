export enum Handedness {
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}

export function mapHandedness(key: string) {
    const map = {
        RIGHT: "Destro",
        LEFT: "Canhoto"
    }

    return map[key as keyof typeof map];
}