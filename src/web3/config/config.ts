import { http, createConfig } from "wagmi";
import { mainnet, sepolia, bscTestnet, Chain, pulsechain } from "wagmi/chains";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  metaMaskWallet,
  injectedWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { Transport } from "viem";

export const supportedChains = [
  mainnet,
  sepolia,
  bscTestnet,
  pulsechain,
] as const;
export type SupportedChainId = (typeof supportedChains)[number]["id"];
export const supportedChainIds: SupportedChainId[] = supportedChains.map(
  (chain) => chain.id
);

const projectId = "fc4381821b719f8b31e23fb9db9540f8";

coinbaseWallet.preference = "all";

const customMainWallets = [
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
];

export const httpTransports: Record<Chain["id"], Transport> = {};
for (const chain of supportedChains) {
  httpTransports[chain.id] = http();
}

export const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: customMainWallets,
    },
  ],
  { projectId, appName: "Dice" }
);

export const config = createConfig({
  chains: supportedChains,
  connectors,
  transports: httpTransports,
});
