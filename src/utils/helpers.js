export const ensureArray = (data) => {
    // If data is null/undefined, return an empty array
    if (!data) return [];

    // If data is already an array, return it
    if (Array.isArray(data)) return data;

    // If data is not an array, wrap it in an array
    return [data];
};
