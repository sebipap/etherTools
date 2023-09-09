import { Abi } from "abitype";
import { useEffect, useState } from "react";
import Search from "./Search";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

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

const AbiInput = ({ onChange }: { onChange: (abi: Abi) => void }) => {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [abis, setAbis] = useState<Record<string, Abi>>(
    JSON.parse(localStorage.getItem("abis") || "")
  );
  const [abi, setAbi] = useState<Abi>();
  const [contractName, setContractName] = useState<string>("");

  useEffect(() => {
    setError("");
    try {
      const abiObj = JSON.parse(input);
      if (!isAbi(abiObj)) throw new Error("Invalid ABI");
      onChange(abiObj);
      setAbi(abiObj);
    } catch (error) {
      setAbi(undefined);
      setError((error as Error).message);
    }
  }, [input]);

  useEffect(() => {
    localStorage.setItem("abis", JSON.stringify(abis));
  }, [abis]);

  const save = () => {
    if (!abi) return;
    setAbis((prev) => ({ ...prev, [contractName]: abi }));
    setContractName(contractName.toLowerCase());

    setInput("");
  };

  const abiOptions = Object.entries(abis).map(([name]) => ({
    value: name.toLowerCase(),
    label: name,
  }));

  return (
    <div>
      <Search
        options={abiOptions}
        onChange={(value) => {
          setContractName(value);
          if (!abis[value]) return;
          setAbi(abis[value]);
          onChange(abis[value]);
        }}
        value={contractName}
        placeholder="Select ABI"
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Load ABI</Button>
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
              <Label htmlFor="username" className="text-right">
                ABI
              </Label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="font-mono max-h-[100px] col-span-3"
              />
              <div className="grid gap-2">{input && error}</div>
            </div>
          </form>
          <DialogFooter>
            <Button type="submit" onClick={save}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AbiInput;
