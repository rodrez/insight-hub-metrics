import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Command } from "cmdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command as CommandPrimitive,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddTermDialogProps {
  onAddTerm: (term: { term: string; definition: string; category: string }) => void;
  existingCategories: string[];
}

export function AddTermDialog({ onAddTerm, existingCategories }: AddTermDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTerm, setNewTerm] = useState("");
  const [newDefinition, setNewDefinition] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [open, setOpen] = useState(false);

  const handleAddTerm = () => {
    onAddTerm({
      term: newTerm,
      definition: newDefinition,
      category: newCategory,
    });
    
    // Reset form
    setNewTerm("");
    setNewDefinition("");
    setNewCategory("");
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Term
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Term</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="term" className="text-sm font-medium">
              Term
            </label>
            <Input
              id="term"
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              placeholder="Enter term"
            />
          </div>
          <div>
            <label htmlFor="definition" className="text-sm font-medium">
              Definition
            </label>
            <Textarea
              id="definition"
              value={newDefinition}
              onChange={(e) => setNewDefinition(e.target.value)}
              placeholder="Enter definition"
            />
          </div>
          <div>
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {newCategory || "Select category..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <CommandPrimitive>
                  <CommandInput 
                    placeholder="Search or enter new category..." 
                    value={newCategory}
                    onValueChange={setNewCategory}
                  />
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {existingCategories.map((category) => (
                      <CommandItem
                        key={category}
                        value={category}
                        onSelect={(currentValue) => {
                          setNewCategory(currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            newCategory === category ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {category}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandPrimitive>
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={handleAddTerm} className="w-full">
            Add Term
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}