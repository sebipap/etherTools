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
import { useContractRead } from "wagmi";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

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
  const { name, inputs, stateMutability } = functionABI;

  const [args, setArgs] = useState(
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

  console.log({ inputs });

  const { data, isLoading } = useContractRead({
    address: address as Address,
    abi: functionABIs as unknown[],
    functionName: functionABI.name,
    args,
    chainId: 10,
  });

  return (
    <div className="p-8 w-full">
      <Card className="">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-mono">{name}</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {inputs.map(({ type, name }, i) => (
            <div className="grid gap-2">
              <Label htmlFor="email">{name}</Label>
              <Input
                type="text"
                value={args?.[i]?.toString()}
                onChange={(e) => {
                  const newArgs = [...(args || [])];
                  newArgs[i] = e.target.value as any;
                  setArgs(newArgs);
                }}
                placeholder={`${type} ${name}`}
              />
            </div>
          ))}
          {inputs.length === (args?.length || 0) && isLoading ? (
            <Skeleton />
          ) : (
            <p className="overflow-scroll">{String(data)}</p>
          )}
          {stateMutability !== "view" && <Button>Send</Button>}
        </CardContent>
      </Card>
    </div>
  );
};

export default Function;
