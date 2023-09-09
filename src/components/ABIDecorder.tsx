import { ChangeEvent, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Abi, Hex, isHex } from "viem";
import Contract from "./Contract";
import FunctionData from "./FunctionData";
import { Label } from "./ui/label";
import AbiInput from "./AbiInput";

const defAbi = JSON.parse(`[
  {
      "constant": false,
      "inputs": [
          {
              "name": "_sireId",
              "type": "uint256"
          },
          {
              "name": "_matronId",
              "type": "uint256"
          }
      ],
      "name": "bidOnSiringAuction",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
  }
]`);

const defHex =
  "0x594d81e500000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000009684d783363433c57767782c649954ce089976ac00000000000000000000000000000000000000000000000000000000000004d2";

const ABIDecoder = () => {
  const [abi, setABI] = useState<Abi>(defAbi);
  const [data, setData] = useState<Hex>(defHex);

  const handleDataChange = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isHex(value)) return;
    setData(value);
  };

  return (
    <div>
      <div className="flex gap-8">
        <div className="grid gap-2">
          <AbiInput onChange={setABI} />
          <Label>Input Data</Label>
          <Textarea
            placeholder="Input Data"
            value={data}
            onChange={handleDataChange}
            className="font-mono"
          />
        </div>
      </div>

      {abi && data && <FunctionData abi={abi} data={data} />}

      {abi && <Contract abi={abi} />}
    </div>
  );
};

export default ABIDecoder;
