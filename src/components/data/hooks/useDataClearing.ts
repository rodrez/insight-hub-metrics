import { useState } from "react";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";

export function useDataClearing() {
  const [isClearing, setIsClearing] = useState(false);

  const clearDatabase = async () => {
    setIsClearing(true);
    try {
      // Use the updated clear method which handles initialization internally
      await db.clear();
      
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (error) {
      console.error('Error clearing database:', error);
      toast({
        title: "Error",
        description: "Failed to clear database",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return { isClearing, clearDatabase };
}