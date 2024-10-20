import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Stake from "./pages/Stake";
import Dice from "./pages/Dice";
import Burn from "./pages/Burn";

import { DiceProvider } from "./components/provider/DiceProvider";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { config } from "./web3/config/config";

import "@rainbow-me/rainbowkit/styles.css";
import "./App.css";

// 0. Setup queryClient
const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    if (!localStorage.getItem("isEnabledAnime"))
      localStorage.setItem("isEnabledAnime", "true");

    if (!localStorage.getItem("isEnabledSound"))
      localStorage.setItem("isEnabledSound", "true");
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <DiceProvider>
            <Routes>
              <Route path="/" element={<Dice />} />
              <Route path="/stake" element={<Stake />} />
              <Route path="/burn" element={<Burn />} />
              <Route path="*" element={<Dice />} />
            </Routes>
          </DiceProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
