import { AbiFunction } from "abitype";
import { useEffect, useMemo, useState } from "react";
import { Abi, Hex } from "viem";

import { Card } from "./ui/card";
import Function from "./Function";
import Search from "./Search";
import SearchSelect from "./SearchSelect";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { FileIcon } from "@radix-ui/react-icons";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useNetwork, useSwitchNetwork } from "wagmi";

type Input<T> = {
  value: T;
  onChange: (value: T) => void;
};

const isAbi = (value: any): value is Abi => {
  if (!value) return false;
  return value.every((x: any) => {
    if (typeof x !== "object") return false;
    const { type } = x as {
      type: string;
    };
    return typeof type === "string";
  });
};

const local = localStorage.getItem("abis");

const ABIDecoder = () => {
  const [abiString, setAbiString] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [contracts, setContracts] = useState<
    Record<string, { abi: Abi; address: string }>
  >({});
  const [abi, setAbi] = useState<Abi>();
  const [contractName, setContractName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [functionSignature, setFunctionSignature] = useState<string>();

  useEffect(() => {
    if (!local) return;
    try {
      const obj = JSON.parse(local);
      setContracts(obj);
    } catch {
      console.log("Invalid ABI");
    }
  }, []);

  useEffect(() => {
    setError("");
    try {
      const abiObj = JSON.parse(abiString);
      if (!isAbi(abiObj)) throw new Error("Invalid ABI");
      setAbi(abiObj);
    } catch (error) {
      setAbi(undefined);
      setError((error as Error).message);
    }
  }, [abiString]);

  useEffect(() => {
    if (!contracts) return;
    const name = Object.keys(contracts)[0];
    if (!name) return;
    setAbi(contracts[name].abi);
    setAddress(contracts[name].address);
    setContractName(name);
    localStorage.setItem("abis", JSON.stringify(contracts));
  }, [contracts]);

  const save = () => {
    if (!abi) return;
    setContracts((prev) => ({
      ...prev,
      [contractName.toLowerCase()]: { abi, address },
    }));
    setContractName(contractName.toLowerCase());
    const { abi: abi_, address: address_ } =
      Object.entries(contracts).find(
        ([k]) => k.toLowerCase === contractName.toLowerCase
      )?.[1] || {};
    setAbi(abi_);
    if (address_) setAddress(address_);
    setAbiString("");
  };

  const abiOptions = Object.entries(contracts || {}).map(([name]) => ({
    value: name.toLowerCase(),
    label: name,
  }));

  // const handleDataChange = ({
  //   target: { value },
  // }: ChangeEvent<HTMLTextAreaElement>) => {
  //   if (!isHex(value)) return;
  //   setData(value);
  // };

  const functionsABIs = abi?.filter(
    (x): x is AbiFunction => x.type === "function"
  );

  const options = useMemo(
    () =>
      functionsABIs?.map(({ name, inputs }) => ({
        value: `${name}${
          inputs.length !== 0
            ? `(${inputs.map(({ type }) => type).join(",")})`
            : ""
        }`,
        label: `${name}${
          inputs.length !== 0
            ? `(${inputs.map(({ type }) => type).join(",")})`
            : ""
        }`,
      })),
    [functionsABIs]
  );

  const handleFunctionSignatureChange = (value: string) => {
    console.log({ value });
    setFunctionSignature(value);
  };

  return (
    <div className="flex w-[100vw] h-[100vw] overflow">
      <Card className="w-[300px] h-[100vh] overflow-scroll border-r flex flex-col gap-3">
        <div className="flex gap-2 p-4">
          {abiOptions.length > 0 && (
            <SearchSelect
              options={abiOptions}
              onChange={(value) => {
                setContractName(value);
                if (!contracts[value]) return;

                setAbi(contracts[value].abi);
                setAddress(contracts[value].address);
              }}
              value={contractName}
              placeholder="Select ABI"
            />
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                Load
                <FileIcon />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Load ABI</DialogTitle>
                <DialogDescription>
                  Upload an ABI to interact with a contract.
                </DialogDescription>
              </DialogHeader>
              <form
                className="grid gap-4 py-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  save();
                }}
              >
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={contractName}
                    onChange={(e) => setContractName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Address</Label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="font-mono max-h-[100px] col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">ABI</Label>
                  <Textarea
                    value={abiString}
                    onChange={(e) => setAbiString(e.target.value)}
                    className="font-mono max-h-[100px] col-span-3"
                  />
                  <div className="grid gap-2">{abiString && error}</div>
                </div>
              </form>
              <DialogFooter>
                <Button type="submit" onClick={save}>
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* chain input */}
        </div>
        {abi && (
          <div className="flex gap-2 flex-wrap border-t">
            <Search
              value={functionSignature}
              onChange={handleFunctionSignatureChange}
              options={options || []}
              placeholder="Select function"
            />
          </div>
        )}
      </Card>
      {functionSignature && functionsABIs && (
        <Function
          address={address}
          functionSignature={functionSignature}
          functionABIs={functionsABIs}
        />
      )}
    </div>
  );
};

export default ABIDecoder;
