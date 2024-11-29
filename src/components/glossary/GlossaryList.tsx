import { GlossaryItem } from "@/types/glossary";
import { Button } from "@/components/ui/button";
import { Pen, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GlossaryListProps {
  items: GlossaryItem[];
}

export function GlossaryList({ items }: GlossaryListProps) {
  const groupedItems = items.reduce((acc, item) => {
    const firstLetter = item.term[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(item);
    return acc;
  }, {} as Record<string, GlossaryItem[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedItems)
        .sort()
        .map(([letter, items]) => (
          <div key={letter}>
            <h2 className="text-2xl font-semibold mb-4">{letter}</h2>
            <div className="grid gap-4">
              {items.map((item) => (
                <div key={item.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{item.term}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.definition}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-green-500 transition-colors"
                            >
                              <Pen className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit term</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete term</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}