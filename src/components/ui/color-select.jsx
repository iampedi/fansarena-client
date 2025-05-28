import { useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { colors, colorClassMap } from "@/constants/colors";

export function ColorSelect({ value = [], onChange }) {
  const [inputValue, setInputValue] = useState("");
  const [openCombobox, setOpenCombobox] = useState(false);
  const inputRef = useRef(null);
  const selectedColors = value || [];

  const toggleColor = (color) => {
    const isSelected = selectedColors.includes(color.value);
    const newColors = isSelected
      ? selectedColors.filter((v) => v !== color.value)
      : [...selectedColors, color.value];
    onChange(newColors);
    inputRef?.current?.focus();
  };

  const filteredColors = inputValue
    ? colors.filter((color) =>
        color.label.toLowerCase().includes(inputValue.toLowerCase()),
      )
    : colors;

  return (
    <div className="flex flex-col-reverse">
      <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="text-foreground w-full justify-between"
          >
            <span className="truncate">
              {selectedColors.length === 0 && "Select Colors"}
              {selectedColors.length === 1 &&
                (colors.find((c) => c.value === selectedColors[0])?.label ||
                  selectedColors[0])}
              {selectedColors.length === 2 &&
                selectedColors
                  .map((v) => colors.find((c) => c.value === v)?.label || v)
                  .join(", ")}
              {selectedColors.length > 2 &&
                `${selectedColors.length} colors selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command loop>
            <CommandInput
              ref={inputRef}
              placeholder="Search color..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandGroup className="max-h-[145px] overflow-auto">
                {filteredColors.map((color) => {
                  const isActive = selectedColors.includes(color.value);
                  return (
                    <CommandItem
                      key={color.value}
                      value={color.label}
                      onSelect={() => toggleColor(color)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <div className="flex-1 capitalize">{color.label}</div>
                      <div
                        className={cn(
                          "border-muted h-4 w-4 rounded-full border",
                          colorClassMap[color.value]?.bg,
                          colorClassMap[color.value]?.border,
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedColors && selectedColors.length > 0 && (
        <div className="relative mb-2 flex gap-2 overflow-y-auto">
          {selectedColors.map((value) => {
            const colorObj = colors.find((c) => c.value === value);
            return (
              <Badge
                key={value}
                className={cn(
                  "flex items-center gap-2 rounded-sm px-2 py-1 capitalize",
                  colorClassMap[value]?.border,
                )}
                variant="outline"
              >
                <span
                  className={cn(
                    "mr-1 inline-block h-3 w-3 rounded-full border",
                    colorClassMap[value]?.bg,
                    colorClassMap[value]?.border,
                  )}
                />
                {colorObj?.label || value}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
