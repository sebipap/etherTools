import { CheckIcon } from "@radix-ui/react-icons";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type Props = {
  options: { value: string; label: string }[];
  value?: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
};

const Search = ({ options, value, placeholder, onChange }: Props) => {
  return (
    <div className="flex flex-col">
      {options.map((option) => {
        const hasParams = option.value.includes("(");

        return (
          <Button
            className="text-left align justify-start w-full font-mono"
            variant={"ghost"}
            onClick={() => {
              onChange(option.value);
            }}
            style={{
              color: hasParams ? "#77dd77" : "white",
            }}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
};

export default Search;
