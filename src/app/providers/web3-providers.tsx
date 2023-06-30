"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { ReactNode } from "react";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { SessionProvider } from "next-auth/react";

import { useTheme } from "next-themes";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, optimism, arbitrum } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

interface RainbowKitProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, optimism, arbitrum],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Test App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to The Test App",
});

export default function Web3Provider(props: RainbowKitProviderProps) {
  const { theme } = useTheme();
  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <RainbowKitProvider chains={chains}>
            {props.children}
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
