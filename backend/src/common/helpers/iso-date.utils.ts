export const getIsoDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};
