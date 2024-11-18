export function formatPostalCode(value: string) {
    return value
        .replace(/\D/g, '') // Remove todos os caracteres que não são dígitos
        .replace(/(\d{5})(\d{1,3})$/, '$1-$2') // Adiciona traço após os primeiros 5 dígitos
        .slice(0, 9) // Limita a 9 caracteres no total (incluindo o traço)
}