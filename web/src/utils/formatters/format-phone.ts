export function formatPhone(value: string) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2') // Coloca os parênteses e espaço após o DDD
        .replace(/(\d{5})(\d)/, '$1-$2') // Coloca o traço após o quinto dígito
        .slice(0, 15) // Limita a 15 caracteres no total
}