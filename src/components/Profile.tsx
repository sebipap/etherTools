import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Button } from "./ui/button";

function Profile() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  if (isConnected)
    return (
      <div>
        Connected to {address}
        <Button onClick={() => disconnect()}>Disconnect</Button>
      </div>
    );
  return <Button onClick={() => connect()}>Connect Wallet</Button>;
}

export default Profile;
