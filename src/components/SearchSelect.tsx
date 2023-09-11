/* eslint-disable tailwindcss/classnames-order */
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

type Props = {
  options: { value: string; label: string }[];
  value?: string;
  onChange: (value: string) => void;
  placeholder: string;
  children?: React.ReactNode;
};

const SearchSelect = ({
  options,
  value,
  placeholder,
  onChange,
  children,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" justify-between"
        >
          {value
            ? options.find((op) => op.value === value)?.label
            : placeholder}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 m-2 mt-0 flex flex-col gap-2">
        <Command className="overflow-scroll">
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandEmpty>Nothing found.</CommandEmpty>
          <CommandGroup className="max-h-[500px] overflow-scroll">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
                className="font-mono"
              >
                {option.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
          {children}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchSelect;
