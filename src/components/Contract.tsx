import { type Abi } from "viem";
import Function from "./Function";
import { useState } from "react";

import { AbiFunction } from "abitype";
import Search from "./Search";

const Contract = ({ abi }: { abi: Abi }) => {
  const [functionSignature, setFunctionSignature] = useState<string>();

  const functionsABIs = abi.filter(
    (x): x is AbiFunction => x.type === "function"
  );

  const functionABI = functionsABIs.find(({ name, inputs }) => {
    if (!functionSignature) return undefined;
    const [functionName, functionInputs] = functionSignature.split(" ");

    console.log({ name, functionName, functionSignature, functionInputs });

    return name.toLowerCase() === functionName; //&& functionInputs === inputs.join(",");
  });

  const options = functionsABIs.map(({ name, inputs }) => ({
    value: `${name}-${inputs.map(({ type }) => type).join(",")}`,
    label: `${name} ${inputs.map(({ type }) => type).join(",")}`,
  }));

  return (
    <div className="flex gap-2 flex-wrap">
      <Search
        value={functionSignature}
        onChange={setFunctionSignature}
        options={options}
        placeholder="Select function"
      />
      {functionSignature && functionABI && <Function {...functionABI} />}
    </div>
  );
};

export default Contract;
