export function formatRg(value: string) {
    return value
        .replace(/\D/g, '') // Remove todos os caracteres que não são dígitos
        .replace(/(\d{2})(\d)/, '$1.$2') // Adiciona ponto após os primeiros 2 dígitos
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os próximos 3 dígitos
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Adiciona traço antes dos últimos 2 dígitos
        .slice(0, 12) // Limita a 12 caracteres no total (incluindo pontos e traço)
}