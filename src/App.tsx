import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";

import Contract from "./components/Contract";
import { optimism } from "viem/chains";
import { publicProvider } from "wagmi/providers/public";

const { publicClient, webSocketPublicClient } = configureChains(
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
        <Contract />
      </div>
    </WagmiConfig>
  );
}

export default App;
