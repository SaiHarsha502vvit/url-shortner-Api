export const hasExpired = (expirationDate) => {
    if (!expirationDate) return false;
    return new Date() > new Date(expirationDate);
};

export const calculateExpirationDate = (duration) => {
    const now = new Date();
    return new Date(now.getTime() + duration);
};