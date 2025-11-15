import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
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
import { trpc } from "@/lib/trpc";

interface ProductSelectorProps {
  value?: number | null;
  onChange: (value: number | null) => void;
  onAddNew?: () => void;
}

export function ProductSelector({ value, onChange, onAddNew }: ProductSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: products = [], isLoading } = trpc.products.list.useQuery();

  const selectedProduct = products.find((p) => p.id === value);

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(search) ||
      product.epaNumber?.toLowerCase().includes(search) ||
      product.manufacturer?.toLowerCase().includes(search) ||
      product.activeIngredients?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex-1 justify-between"
          >
            {selectedProduct ? (
              <span className="truncate">
                {selectedProduct.name}
                {selectedProduct.epaNumber && (
                  <span className="text-muted-foreground ml-2">
                    EPA {selectedProduct.epaNumber}
                  </span>
                )}
              </span>
            ) : (
              "Select product..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput
              placeholder="Search products..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? "Loading products..." : "No products found."}
              </CommandEmpty>
              <CommandGroup>
                {filteredProducts.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={String(product.id)}
                    onSelect={() => {
                      onChange(product.id === value ? null : product.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === product.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {product.epaNumber && `EPA ${product.epaNumber}`}
                        {product.manufacturer && ` • ${product.manufacturer}`}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {onAddNew && (
        <Button variant="outline" size="icon" onClick={onAddNew}>
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
