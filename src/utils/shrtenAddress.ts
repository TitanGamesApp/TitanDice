export const shortenAddress = (address: string, chars: number) => {
  if (address) return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};
