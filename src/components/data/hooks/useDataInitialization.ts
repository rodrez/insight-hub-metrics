import { useState, useEffect } from "react";
import { db } from "@/lib/db";
import { executeWithRetry, LoadingStep } from "@/lib/utils/loadingRetry";
import { toast } from "@/components/ui/use-toast";
import { DatabaseError } from '@/lib/utils/errorHandling';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export function useDataInitialization() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [initializationError, setInitializationError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const initializeDB = async () => {
      const initStep: LoadingStep = {
        name: "Database Initialization",
        action: async () => {
          try {
            console.log('Starting database initialization attempt:', retryCount + 1);
            
            // Ensure any existing connections are properly closed
            if (db.getDatabase()) {
              console.log('Closing existing database connection');
              db.getDatabase()?.close();
            }

            // Initialize database structure
            await db.init();
            
            if (!isMounted) return false;
            
            console.log('Database initialization completed successfully');
            setIsInitialized(true);
            setInitializationError(null);
            
            if (retryCount > 0) {
              toast({
                title: "Success",
                description: "Database initialized successfully after retry",
              });
            }
            return true;
          } catch (error) {
            console.error('Database initialization error:', error);
            
            if (!isMounted) return false;
            
            if (retryCount < MAX_RETRIES) {
              setRetryCount(prev => prev + 1);
              setInitializationError(error instanceof Error ? error : new DatabaseError('Unknown initialization error'));
              
              toast({
                title: "Retrying",
                description: `Database initialization failed, retrying (${retryCount + 1}/${MAX_RETRIES})`,
              });
              
              // Add delay between retries
              await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
              return false;
            }
            
            toast({
              title: "Error",
              description: "Failed to initialize database after multiple attempts",
              variant: "destructive",
            });
            
            setInitializationError(error instanceof Error ? error : new DatabaseError('Failed to initialize after max retries'));
            return false;
          }
        }
      };

      await executeWithRetry(initStep);
    };

    initializeDB();

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  return { 
    isInitialized, 
    retryCount,
    error: initializationError
  };
}