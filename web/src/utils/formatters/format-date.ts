export function formatDate(value: string) {
    const formattedValue = value
        .replace(/\D/g, '') // Remove todos os caracteres que não são dígitos
        .replace(/(\d{2})(\d)/, '$1/$2') // Adiciona barra após os primeiros 2 dígitos (dia)
        .replace(/(\d{2})(\d)/, '$1/$2') // Adiciona barra após os próximos 2 dígitos (mês)
        .replace(/(\d{4})\d+?$/, '$1') // Limita o ano a 4 dígitos
        .slice(0, 10); // Limita a 10 caracteres no total (incluindo as barras)

    if (formattedValue.length === 10) {
        const [day, month, year] = formattedValue.split("/").map(Number);
        const dateObject = new Date(year, month - 1, day);

        // Verifica se a data é válida
        if (
            dateObject.getFullYear() !== year ||
            dateObject.getMonth() !== month - 1 ||
            dateObject.getDate() !== day
        ) {
            return "";
        }
    }

    return formattedValue;
}
