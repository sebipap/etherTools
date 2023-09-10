import {
  ArrowRightIcon,
  CircleBackslashIcon,
  DotFilledIcon,
  DotIcon,
  EyeOpenIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { AbiStateMutability } from "abitype";
import { Button } from "./ui/button";
import { CircleIcon } from "lucide-react";
import { STATE_MUTABILITY_COLOR } from "@/lib/const";

type Props = {
  options: {
    value: string;
    label: string;
    stateMutability: AbiStateMutability;
  }[];
  value?: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
};

const STATE_MUTABILITY_ICON = {
  nonpayable: CircleBackslashIcon,
  payable: PaperPlaneIcon,
  view: EyeOpenIcon,
  pure: ArrowRightIcon,
} as const;

const List = ({
  options,
  value: selectedOption,
  placeholder,
  onChange,
}: Props) => {
  return (
    <div className="flex flex-col">
      {options.map(({ value, label, stateMutability }) => {
        const active = value === selectedOption;

        const Icon = active ? DotFilledIcon : DotIcon;
        return (
          <Button
            className={`text-left align justify-start w-full font-mono `}
            variant={active ? "outline" : "ghost"}
            onClick={() => {
              onChange(value);
            }}
          >
            <Icon
              className={`w-4 h-4 mr-2 `}
              style={{
                color: STATE_MUTABILITY_COLOR[stateMutability],
              }}
            />
            {label}
          </Button>
        );
      })}
    </div>
  );
};

export default List;
