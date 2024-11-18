export function formatCpf(value: string) {
    return value
        .replace(/\D/g, '') // Remove todos os caracteres que não são dígitos
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os primeiros 3 dígitos
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os próximos 3 dígitos
        .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Adiciona traço antes dos últimos 2 dígitos
        .slice(0, 14) // Limita a 14 caracteres no total (incluindo pontos e traço)
}