export const formatNumber = (num: number) => {
  if (num < 1000) return num.toFixed(3); // Numbers less than 1000
  if (num >= 1000 && num < 1_000_000) return (num / 1000).toFixed(3) + "K"; // Numbers in thousands
  if (num >= 1_000_000 && num < 1_000_000_000)
    return (num / 1_000_000).toFixed(3) + "M"; // Numbers in millions
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(3) + "B"; // Numbers in billions
  return num.toString();
};
