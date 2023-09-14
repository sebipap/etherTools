import { AbiFunction } from "abitype";
import { useEffect, useMemo, useState } from "react";
import { Abi } from "viem";
import Function from "./Function";
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
import { CommitIcon, FileIcon } from "@radix-ui/react-icons";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import CommandPalette from "./CommandPalette";

const isAbi = (value: unknown): value is Abi => {
  if (!value) return false;
  if (!Array.isArray(value)) return false;
  return value.every((x) => {
    if (typeof x !== "object") return false;
    const { type } = x as {
      type: string;
    };
    return typeof type === "string";
  });
};

const localAbis = localStorage.getItem("abis");
const localContractName = localStorage.getItem("contractName");

const Contract = () => {
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
    if (localAbis) {
      try {
        const obj = JSON.parse(localAbis);
        setContracts(obj);
      } catch {
        console.log("Invalid ABI");
      }
    }
    if (localContractName) handleContractNameChange(localContractName);
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
    if (!Object.keys(contracts).length) return;
    setAbi(contracts[contractName].abi);
    setAddress(contracts[contractName].address);
    localStorage.setItem("abis", JSON.stringify(contracts));
  }, [contracts]);

  const handleContractNameChange = (name: string) => {
    setContractName(name);

    localStorage.setItem("contractName", name);
  };

  const save = () => {
    if (!abi) return;
    setContracts((prev) => ({
      ...prev,
      [contractName.toLowerCase()]: { abi, address },
    }));
    handleContractNameChange(contractName.toLowerCase());
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
      functionsABIs?.map(({ name, inputs, stateMutability }) => ({
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
        stateMutability,
      })),
    [functionsABIs]
  );

  const handleFunctionSignatureChange = (value: string) => {
    console.log({ value });
    setFunctionSignature(value);
  };

  return (
    <div>
      <div className="container flex flex-col items-start justify-between space-y-2 border-b py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <CommitIcon width={30} height={30} />
        <div className="ml-auto flex w-full space-x-2 sm:justify-end">
          <SearchSelect
            options={abiOptions}
            onChange={(value) => {
              handleContractNameChange(value);
              if (!contracts[value]) return;
              setAbi(contracts[value].abi);
              setAddress(contracts[value].address);
            }}
            value={contractName}
            placeholder="Select ABI"
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="flex gap-2">
                  New
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
                      className="col-span-3 max-h-[100px] font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">ABI</Label>
                    <Textarea
                      value={abiString}
                      onChange={(e) => setAbiString(e.target.value)}
                      className="col-span-3 max-h-[100px] font-mono"
                    />
                    <div className="grid gap-2">{abiString && error}</div>
                  </div>
                </form>
                <DialogFooter>
                  <DialogClose>
                    <Button type="submit" onClick={save}>
                      Save changes
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </SearchSelect>
          <CommandPalette
            value={functionSignature}
            onChange={handleFunctionSignatureChange}
            options={options || []}
          />
        </div>
      </div>

      <div className="space-y-1">
        {functionSignature && functionsABIs && (
          <Function
            address={address}
            functionSignature={functionSignature}
            functionABIs={functionsABIs}
          />
        )}
      </div>
    </div>
  );
};

export default Contract;
