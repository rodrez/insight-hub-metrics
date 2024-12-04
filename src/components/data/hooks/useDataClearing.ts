import { useState } from "react";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { DatabaseClearingService } from "@/lib/services/db/DatabaseClearingService";
import { useQueryClient } from "@tanstack/react-query";

export function useDataClearing() {
  const [isClearing, setIsClearing] = useState(false);
  const queryClient = useQueryClient();

  const clearDatabase = async () => {
    setIsClearing(true);
    try {
      console.log('Starting database clearing process...');
      
      // Initialize database first
      await db.init();
      
      // Create a new instance of DatabaseClearingService
      const clearingService = new DatabaseClearingService((db as any).getDatabase());
      await clearingService.clearDatabase();
      
      // Clear all query cache
      queryClient.clear();
      
      // Reset all queries
      await queryClient.resetQueries();
      
      // Force a fresh initialization
      await db.init();
      
      console.log('Database clearing completed successfully');
      
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
      throw error;
    } finally {
      setIsClearing(false);
    }
  };

  return { isClearing, clearDatabase };
}