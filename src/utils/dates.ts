export const getActualDate = () => {
    const now = new Date();
    const adjustedDate = new Date(now.getTime());
    return adjustedDate.toISOString();
}