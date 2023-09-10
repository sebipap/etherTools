import { AbiStateMutability } from "abitype";

export const STATE_MUTABILITY_COLOR: Record<AbiStateMutability, `#${string}`> =
  {
    nonpayable: "#eeeeee",
    payable: "#77dd77",
    view: "#0070ff",
    pure: "#7700ff",
  };
