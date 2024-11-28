import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Database, Info, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExportActions } from "./actions/ExportActions";
import { BackupActions } from "./actions/BackupActions";

interface DatabaseActionsProps {
  isInitialized: boolean;
  isClearing: boolean;
  isPopulating: boolean;
  onClear: () => Promise<void>;
  onPopulate: () => Promise<void>;
}

export function DatabaseActions({ 
  isInitialized, 
  isClearing, 
  isPopulating,
  onClear,
  onPopulate
}: DatabaseActionsProps) {
  return (
    <div className="space-y-4">
      <TooltipProvider>
        <div className="flex flex-col gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={!isInitialized || isClearing}>
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
                <Button
                  onClick={onPopulate}
                  disabled={!isInitialized || isPopulating}
                  variant="outline"
                >
                  <Database className="h-4 w-4 mr-2" />
                  {isPopulating ? "Populating..." : "Populate Sample Data"}
                  <Info className="h-4 w-4 ml-2" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Populates the database with sample data including:</p>
                <ul className="list-disc ml-4 mt-2">
                  <li>Fortune 30 company collaborations</li>
                  <li>Internal department projects and partnerships</li>
                  <li>Project milestones and metrics</li>
                  <li>Detailed NABC analyses</li>
                  <li>Strategic Planning Initiatives (SPIs)</li>
                  <li>Project objectives and goals</li>
                  <li>Situation reports (SitReps)</li>
                  <li>Team configurations</li>
                  <li>Department-specific metrics</li>
                  <li>Project status and progress indicators</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <ExportActions isInitialized={isInitialized} />
          <BackupActions isInitialized={isInitialized} />
        </div>
      </TooltipProvider>
    </div>
  );
}