import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { createPublicClient, http } from "viem";
import ABIDecoder from "./components/ABIDecorder";
import { optimism } from "viem/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, optimism],
  [publicProvider()]
);
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

function App() {
  return (
    <WagmiConfig config={config}>
      <div className=" ">
        <ABIDecoder />
      </div>
    </WagmiConfig>
  );
}

export default App;
