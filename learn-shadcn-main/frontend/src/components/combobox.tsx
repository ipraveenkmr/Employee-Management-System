import { useEffect, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { Employee } from "./employee/table/details-columns"


export default function ComboboxDemo({ frameworks, handleUpdateSelectedValue }: {
  frameworks: Employee[],
  handleUpdateSelectedValue: (value: string) => void;
}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  useEffect(() => {
    if (value) {
      handleUpdateSelectedValue(value);
    } else {
      handleUpdateSelectedValue("");
    }
  }, [value])


  return (
    <div className="px-4 mb-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[24.2vw] justify-between"
          >
            {value
              ? frameworks.find((framework) => framework.email === value)?.email
              : "Select employee..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[24.2vw] p-0">
          <Command>
            <CommandInput placeholder="Search email..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.email}
                    value={framework.email}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {framework.email}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === framework.email ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
