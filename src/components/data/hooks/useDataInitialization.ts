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
    console.log('Starting database initialization effect...');
    initializeDB();
  }, []);

  const initializeDB = async () => {
    console.log('Initializing database with retry mechanism...');
    const initStep: LoadingStep = {
      name: "Database Initialization",
      action: async () => {
        try {
          console.log('Attempting database initialization...');
          await db.init();
          console.log('Database initialization completed successfully');
          setIsInitialized(true);
          
          if (retryCount > 0) {
            toast({
              title: "Success",
              description: `Database initialized successfully after ${retryCount} retries`,
            });
          } else {
            toast({
              title: "Success",
              description: "Database initialized successfully",
            });
          }
          return true;
        } catch (error) {
          console.error('Database initialization error:', error);
          
          if (retryCount < MAX_RETRIES) {
            const nextRetryCount = retryCount + 1;
            setRetryCount(nextRetryCount);
            console.log(`Retrying initialization (attempt ${nextRetryCount}/${MAX_RETRIES})`);
            
            toast({
              title: "Retrying",
              description: `Database initialization failed, retrying (${nextRetryCount}/${MAX_RETRIES})`,
            });
            
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return false;
          }
          
          toast({
            title: "Error",
            description: `Failed to initialize database after ${MAX_RETRIES} attempts`,
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