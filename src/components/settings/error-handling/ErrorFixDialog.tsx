import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ErrorItem } from "@/lib/types/error";
import { useState, useEffect } from "react";

interface ErrorFixDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errors: ErrorItem[];
  onComplete: () => void;
}

export function ErrorFixDialog({ 
  open, 
  onOpenChange, 
  errors,
  onComplete 
}: ErrorFixDialogProps) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (open && errors.length > 0) {
      setLogs([
        "Starting error fix process...",
        `Found ${errors.length} errors to fix`,
        ...errors.map(error => `Analyzing error: ${error.message}`),
        "Running pre-fix validations...",
        "Checking for potential conflicts...",
        "Preparing fix strategy...",
      ]);
    }
  }, [open, errors]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Fixing Selected Errors</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {logs.map((log, index) => (
            <div
              key={index}
              className="text-sm font-mono mb-1 text-muted-foreground"
            >
              {log}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}