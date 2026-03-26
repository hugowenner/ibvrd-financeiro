export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

export const formatDate = (dateString) => {
    if (!dateString) return '';

    // normaliza primeiro
    const clean = dateString.includes('T')
        ? dateString.split('T')[0]
        : dateString;

    const [year, month, day] = clean.split('-').map(Number);

    const date = new Date(Date.UTC(year, month - 1, day));

    return date.toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
    });
};