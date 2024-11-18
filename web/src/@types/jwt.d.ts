export interface JWTPayload {
    sub: string;
    role: string;
    area: string[];
    iat: number;
    exp: number;
}