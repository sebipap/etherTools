import { WagmiConfig, createConfig, mainnet } from "wagmi";
import { createPublicClient, http } from "viem";
import ABIDecoder from "./components/ABIDecorder";

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
});

function App() {
  return (
    <WagmiConfig config={config}>
      <div className="px-10 pt-10 ">
        <ABIDecoder />
      </div>
    </WagmiConfig>
  );
}

export default App;
