import { toast } from "@/components/ui/use-toast";
import { DatabaseError } from '@/lib/utils/errorHandling';

export class ServiceInitializationManager {
  private static instance: ServiceInitializationManager;
  private initializationPromises: Map<string, Promise<void>> = new Map();
  private initializedServices: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): ServiceInitializationManager {
    if (!ServiceInitializationManager.instance) {
      ServiceInitializationManager.instance = new ServiceInitializationManager();
    }
    return ServiceInitializationManager.instance;
  }

  public async initializeService(serviceName: string, initFn: () => Promise<void>): Promise<void> {
    if (this.initializedServices.has(serviceName)) {
      return;
    }

    if (this.initializationPromises.has(serviceName)) {
      return this.initializationPromises.get(serviceName);
    }

    const initPromise = this.executeInitialization(serviceName, initFn);
    this.initializationPromises.set(serviceName, initPromise);

    try {
      await initPromise;
      this.initializedServices.add(serviceName);
    } catch (error) {
      this.initializationPromises.delete(serviceName);
      throw error;
    }
  }

  private async executeInitialization(serviceName: string, initFn: () => Promise<void>): Promise<void> {
    try {
      await initFn();
      console.log(`Service ${serviceName} initialized successfully`);
    } catch (error) {
      console.error(`Failed to initialize ${serviceName}:`, error);
      toast({
        title: "Initialization Error",
        description: `Failed to initialize ${serviceName}. Please try again.`,
        variant: "destructive",
      });
      throw new DatabaseError(`${serviceName} initialization failed`);
    }
  }

  public async reinitialize(): Promise<void> {
    this.initializedServices.clear();
    this.initializationPromises.clear();
    // Re-initialize core services
    await this.initializeService('IndexedDB', async () => {
      // Core initialization logic will be handled by the service itself
      console.log('Reinitializing core services...');
    });
  }

  public isServiceInitialized(serviceName: string): boolean {
    return this.initializedServices.has(serviceName);
  }

  public resetService(serviceName: string): void {
    this.initializedServices.delete(serviceName);
    this.initializationPromises.delete(serviceName);
  }
}