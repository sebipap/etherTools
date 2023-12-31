import { AbiFunction, Address } from "abitype";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { STATE_MUTABILITY_COLOR } from "@/lib/const";
import Output from "./Output";
import { ConnectWallet } from "./Profile";
import { Hash } from "viem";
import { useToast } from "./ui/use-toast";
import { ArrowDownIcon, ClockIcon } from "@radix-ui/react-icons";

type Props = {
  functionABIs: AbiFunction[];
  address: string;
  functionSignature: string;
};

const Function = ({ functionABIs, address, functionSignature }: Props) => {
  // read from contract

  const functionABI = functionABIs?.find(({ name, inputs }) => {
    if (!functionSignature) return undefined;
    const [functionName, functionInputs] = functionSignature.split("(");

    const fInputs = functionInputs?.slice(0, -1);
    return (
      name === functionName &&
      (fInputs || "") === inputs.map(({ type }) => type).join(",")
    );
  });

  if (!functionABI) return;
  const { name, inputs, stateMutability, outputs } = functionABI;

  const { isConnected } = useAccount();

  const [args, setArgs] = useState<unknown[] | undefined>();
  const [hash, setHash] = useState<Hash | undefined>();

  useEffect(() => {
    setArgs(
      inputs.length === 0
        ? undefined
        : inputs.map(({ type }) =>
            type === "bigint"
              ? 0n
              : type === "string"
              ? ""
              : type === "address"
              ? "0x660e2fC185a9fFE722aF253329CEaAD4C9F6F928"
              : 0n
          )
    );
  }, [functionABI]);

  const { data: readData, isLoading: readLoading } = useContractRead({
    address: address as Address,
    abi: functionABIs as unknown[],
    functionName: functionABI.name,
    args,
    chainId: 10,
  });

  const {
    writeAsync,

    isLoading: writeLoading,
  } = useContractWrite({
    address: address as Address,
    abi: functionABIs as unknown[],
    functionName: functionABI.name,
  });

  const { status } = useWaitForTransaction({ hash });
  const { toast } = useToast();

  useEffect(() => {
    switch (status) {
      case "idle":
        break;
      case "loading":
        toast({ title: "TX pending ⌛" });
        break;
      case "success":
        toast({ title: "TX success ✅" });
        break;
      case "error":
        toast({ title: "TX error ❌" });

        break;
      default:
        break;
    }
  }, [status]);

  const handleSend = async () => {
    try {
      toast({ title: "Confirm TX in your wallet" });
      const { hash } = await writeAsync({
        args,
      });
      toast({ title: `TX confirmed with hash ${hash}` });
      setHash(hash);
    } catch {
      (err: unknown) => {
        toast({ title: "TX error", description: (err as Error).message });
      };
    } finally {
    }
  };

  const writeStatus = writeLoading
    ? status === "idle"
      ? "Confirm in wallet..."
      : status === "loading"
      ? "Loading"
      : status
    : "Send";

  return (
    <div className="w-full p-8">
      <Card className="">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-4 font-mono text-2xl">
            {name}{" "}
            <Badge
              variant="default"
              style={{
                backgroundColor: STATE_MUTABILITY_COLOR[stateMutability],
              }}
            >
              {stateMutability}
            </Badge>
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {inputs.map(({ type, name }, i) => (
            <div className="grid gap-2" key={name}>
              <Label className="font-mono">{name}</Label>
              <Input
                type="text"
                className="font-mono"
                value={args?.[i]?.toString()}
                onChange={({ target: { value } }) => {
                  const newArgs = [...(args || [])];
                  const current = type.includes("[]")
                    ? value.split(",")
                    : value;
                  newArgs[i] = current;
                  setArgs(newArgs);
                }}
                placeholder={`${type} ${name}`}
              />
            </div>
          ))}
          {readLoading ? <ClockIcon /> : <ArrowDownIcon />}
          {readLoading ? (
            <Skeleton className="h-4 w-20" />
          ) : readData !== undefined ? (
            <div className="gap-1 border p-2 font-mono">
              <Output outputs={outputs} data={readData} />
            </div>
          ) : null}
          {stateMutability !== "view" &&
            (isConnected ? (
              <Button onClick={handleSend}>{writeStatus}</Button>
            ) : (
              <ConnectWallet />
            ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Function;
