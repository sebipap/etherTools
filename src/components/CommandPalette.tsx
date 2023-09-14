"use client";

import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DotFilledIcon, DotIcon } from "@radix-ui/react-icons";
import { STATE_MUTABILITY_COLOR } from "@/lib/const";
import { AbiStateMutability } from "abitype";
import { Button } from "./ui/button";

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

const CommandPalette = ({
  options,
  value: selectedOption,
  onChange,
}: Props) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="justify-start border p-2"
        variant="outline"
      >
        <p className="text-muted-foreground text-sm">
          Search function{" "}
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </p>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList onSelect={(e) => onChange(e.currentTarget.nodeName)}>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Functions">
            {options.map(({ value, stateMutability }) => {
              const active = value === selectedOption;
              const Icon = active ? DotFilledIcon : DotIcon;
              return (
                <CommandItem
                  onSelect={() => {
                    onChange(value);
                    setOpen(false);
                  }}
                >
                  <Icon
                    className="mr-2 h-4 w-4"
                    style={{
                      color: STATE_MUTABILITY_COLOR[stateMutability],
                    }}
                  />
                  <span className="font-mono">{value}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CommandPalette;
