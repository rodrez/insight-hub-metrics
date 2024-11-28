import { useState } from "react";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";

export function useDataClearing() {
  const [isClearing, setIsClearing] = useState(false);

  const clearDatabase = async () => {
    setIsClearing(true);
    try {
      await db.clear();
      await db.init();
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

  return { isClearing, clearDatabase };
}