import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Database, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { QuantityInputs } from "./sample-data/QuantityInputs";
import { GeneratedCounts } from "./sample-data/GeneratedCounts";

interface DataCounts {
  projects: number;
  fortune30: number;
  internalPartners: number;
  smePartners: number;
  spis: number;
  objectives: number;
  sitreps: number;
}

export function SampleDataSettings() {
  const [isClearing, setIsClearing] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);
  const [quantities, setQuantities] = useState({
    projects: 5,
    fortune30: 5,
    internalPartners: 20,
    smePartners: 10,
    spis: 5,
    objectives: 3,
    sitreps: 5,
    collaborators: 0  // Added the missing collaborators field
  });
  const [generatedCounts, setGeneratedCounts] = useState<DataCounts | null>(null);

  const updateQuantity = (key: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setQuantities(prev => ({ ...prev, [key]: numValue }));
  };

  const clearDatabase = async () => {
    setIsClearing(true);
    try {
      await db.clear();
      await db.init();
      setGeneratedCounts(null);
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear database",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const populateDatabase = async () => {
    setIsPopulating(true);
    try {
      await db.populateSampleData(quantities);
      
      // Fetch actual counts after population
      const counts: DataCounts = {
        projects: (await db.getAllProjects()).length,
        spis: (await db.getAllSPIs()).length,
        objectives: (await db.getAllObjectives()).length,
        sitreps: (await db.getAllSitReps()).length,
        fortune30: (await db.getAllCollaborators()).filter(c => c.type === 'fortune30').length,
        internalPartners: (await db.getAllCollaborators()).filter(c => c.type === 'internal').length,
        smePartners: (await db.getAllSMEPartners()).length
      };

      setGeneratedCounts(counts);

      const mismatches = Object.entries(counts).filter(
        ([key, count]) => count !== quantities[key as keyof typeof quantities]
      );

      if (mismatches.length > 0) {
        toast({
          title: "Warning",
          description: "Some data quantities don't match requested amounts. Check the generated counts.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Sample data generated successfully with requested quantities",
        });
      }
    } catch (error) {
      console.error('Error populating database:', error);
      toast({
        title: "Error",
        description: "Failed to populate database",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <div className="space-y-6">
      <QuantityInputs quantities={quantities} onUpdate={updateQuantity} />

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
              <AlertDialogAction onClick={clearDatabase}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={populateDatabase} disabled={isPopulating}>
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

      {generatedCounts && (
        <GeneratedCounts counts={generatedCounts} requestedQuantities={quantities} />
      )}
    </div>
  );
}