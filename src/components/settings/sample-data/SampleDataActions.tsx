import { Button } from "@/components/ui/button";
import { Database, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SampleDataActionsProps {
  isClearing: boolean;
  isPopulating: boolean;
  onClear: () => Promise<void>;
  onPopulate: () => Promise<void>;
}

export function SampleDataActions({
  isClearing,
  isPopulating,
  onClear,
  onPopulate,
}: SampleDataActionsProps) {
  return (
    <div className="flex gap-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isClearing}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Database
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will clear all data from the database. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onClear}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onPopulate} disabled={isPopulating}>
              <Database className="h-4 w-4 mr-2" />
              {isPopulating ? "Generating..." : "Generate Sample Data"}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px] p-4">
            <p className="text-sm">This will generate sample data in the following order:</p>
            <ol className="list-decimal ml-4 mt-2 text-sm">
              <li>Generate Fortune 30 partners</li>
              <li>Create internal partners across departments</li>
              <li>Generate SME partners</li>
              <li>Create projects with assigned partners</li>
              <li>Generate SPIs for each project</li>
              <li>Create objectives</li>
              <li>Generate situation reports</li>
            </ol>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}