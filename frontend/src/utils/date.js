export const normalizeDateString = (dateString) => {
    if (!dateString) return '';

    // remove hora se vier do backend
    if (dateString.includes('T')) return dateString.split('T')[0];
    if (dateString.includes(' ')) return dateString.split(' ')[0];

    return dateString;
};

export const parseDateSafe = (dateString) => {
    if (!dateString) return null;

    const clean = normalizeDateString(dateString);
    const [year, month, day] = clean.split('-').map(Number);

    // usa UTC pra NÃO sofrer timezone
    return new Date(Date.UTC(year, month - 1, day));
};