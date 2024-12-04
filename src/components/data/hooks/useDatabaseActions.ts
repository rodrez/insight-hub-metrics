import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { DataQuantities } from "../types/dataTypes";

export function useDatabaseActions(onClear: () => Promise<void>, onPopulate: (quantities: DataQuantities) => Promise<void>) {
  const [error, setError] = useState<string | null>(null);
  const [showQuantityForm, setShowQuantityForm] = useState(false);
  const queryClient = useQueryClient();

  const handleClear = async () => {
    try {
      setError(null);
      await onClear();
      await queryClient.invalidateQueries({ queryKey: ['data-counts'] });
      queryClient.setQueryData(['data-counts'], {
        projects: 0,
        spis: 0,
        objectives: 0,
        sitreps: 0,
        fortune30: 0,
        internalPartners: 0,
        smePartners: 0
      });
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear database";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handlePopulate = async (quantities: DataQuantities) => {
    try {
      setError(null);
      await onPopulate(quantities);
      await queryClient.invalidateQueries({ queryKey: ['data-counts'] });
      setShowQuantityForm(false);
      toast({
        title: "Success",
        description: "Database populated successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to populate database";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return {
    error,
    showQuantityForm,
    setShowQuantityForm,
    handleClear,
    handlePopulate
  };
}