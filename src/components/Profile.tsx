import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Button } from "./ui/button";

export const ConnectWallet = () => {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  return <Button onClick={() => connect()}>Connect Wallet</Button>;
};

function Profile() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected)
    return (
      <div>
        Connected to {address}
        <Button onClick={() => disconnect()}>Disconnect</Button>
      </div>
    );
  return <ConnectWallet />;
}

export default Profile;
