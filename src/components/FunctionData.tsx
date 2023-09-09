import { Abi, Hex, decodeFunctionData } from "viem";
import { useEffect, useState } from "react";

import Code from "./Code";

type FunctionData = {
  args: readonly unknown[] | undefined;
  functionName: string;
};

const FunctionData = ({ abi, data }: { abi: Abi; data: Hex }) => {
  const [functionData, setFunctionData] = useState<FunctionData>();

  useEffect(() => {
    try {
      setFunctionData(decodeFunctionData({ abi, data }));
    } catch {
      console.log("hello");
      setFunctionData(undefined);
    }
  }, [abi, data]);

  if (!functionData) return;
  const { args, functionName } = functionData;

  const stringifiedArgs = args?.map((a) => {
    switch (typeof a) {
      case "bigint":
        return a.toString();
      case "boolean":
      case "number":
      case "string":
        return JSON.stringify(a);

      default:
        break;
    }
  });

  return (
    <div className="flex flex-col gap-5 my-10">
      <div>
        <Code text={`${functionName}(${stringifiedArgs?.join(",")})`} />
      </div>
    </div>
  );
};

export default FunctionData;
