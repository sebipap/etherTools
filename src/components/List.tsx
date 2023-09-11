import { DotFilledIcon, DotIcon } from "@radix-ui/react-icons";
import { AbiStateMutability } from "abitype";
import { Button } from "./ui/button";
import { STATE_MUTABILITY_COLOR } from "@/lib/const";

type Props = {
  options: {
    value: string;
    label: string;
    stateMutability: AbiStateMutability;
  }[];
  value?: string;
  onChange: (value: string) => void;
  className?: string;
};

// const STATE_MUTABILITY_ICON = {
//   nonpayable: CircleBackslashIcon,
//   payable: PaperPlaneIcon,
//   view: EyeOpenIcon,
//   pure: ArrowRightIcon,
// } as const;

const List = ({ options, value: selectedOption, onChange }: Props) => {
  return (
    <div className="flex flex-col">
      {options.map(({ value, label, stateMutability }) => {
        const active = value === selectedOption;

        const Icon = active ? DotFilledIcon : DotIcon;
        return (
          <Button
            key={value}
            className={`align w-full justify-start text-left font-mono`}
            variant={active ? "outline" : "ghost"}
            onClick={() => {
              onChange(value);
            }}
          >
            <Icon
              className={`mr-2 h-4 w-4 `}
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
