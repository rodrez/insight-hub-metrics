import { useState, useEffect } from "react";
import { db } from "@/lib/db";
import { executeWithRetry, LoadingStep } from "@/lib/utils/loadingRetry";
import { toast } from "@/components/ui/use-toast";

export function useDataInitialization() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeDB();
  }, []);

  const initializeDB = async () => {
    const initStep: LoadingStep = {
      name: "Database Initialization",
      action: async () => {
        try {
          console.log('Starting database initialization...');
          await db.init();
          console.log('Database initialization completed');
          setIsInitialized(true);
          return true;
        } catch (error) {
          console.error('Database initialization error:', error);
          toast({
            title: "Error",
            description: "Failed to initialize database",
            variant: "destructive",
          });
          return false;
        }
      }
    };

    await executeWithRetry(initStep);
  };

  return { isInitialized };
}