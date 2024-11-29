import { useState, useEffect } from "react";
import { db } from "@/lib/db";
import { executeWithRetry, LoadingStep } from "@/lib/utils/loadingRetry";
import { toast } from "@/components/ui/use-toast";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export function useDataInitialization() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

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
          if (retryCount > 0) {
            toast({
              title: "Success",
              description: "Database initialized successfully after retry",
            });
          }
          return true;
        } catch (error) {
          console.error('Database initialization error:', error);
          
          if (retryCount < MAX_RETRIES) {
            setRetryCount(prev => prev + 1);
            toast({
              title: "Retrying",
              description: `Database initialization failed, retrying (${retryCount + 1}/${MAX_RETRIES})`,
            });
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return false;
          }
          
          toast({
            title: "Error",
            description: "Failed to initialize database after multiple attempts",
            variant: "destructive",
          });
          return false;
        }
      }
    };

    await executeWithRetry(initStep);
  };

  return { isInitialized, retryCount };
}