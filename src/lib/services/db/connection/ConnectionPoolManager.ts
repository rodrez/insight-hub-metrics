import { DatabaseError } from '../../../utils/errorHandling';
import { toast } from "@/components/ui/use-toast";

export class ConnectionPoolManager {
  private static instance: ConnectionPoolManager;
  private connections: Map<string, IDBDatabase> = new Map();
  private readonly maxConnections: number = 5;
  private readonly connectionTimeout: number = 30000; // 30 seconds

  private constructor() {}

  static getInstance(): ConnectionPoolManager {
    if (!ConnectionPoolManager.instance) {
      ConnectionPoolManager.instance = new ConnectionPoolManager();
    }
    return ConnectionPoolManager.instance;
  }

  async acquireConnection(dbName: string, version: number): Promise<IDBDatabase> {
    console.log('Attempting to acquire connection for:', dbName);
    
    // Try to reuse an existing connection
    const existingConnection = this.getExistingConnection(dbName);
    if (existingConnection) {
      console.log('Reusing existing connection for:', dbName);
      return existingConnection;
    }

    // Check connection limit
    if (this.connections.size >= this.maxConnections) {
      console.warn('Connection pool limit reached, cleaning up inactive connections');
      this.cleanupInactiveConnections();
      
      if (this.connections.size >= this.maxConnections) {
        throw new DatabaseError('Maximum connection limit reached');
      }
    }

    // Create new connection
    console.log('Creating new connection for:', dbName);
    const connection = await this.createConnection(dbName, version);
    const connectionId = `${dbName}_${Date.now()}`;
    this.connections.set(connectionId, connection);

    // Set up connection monitoring
    this.monitorConnection(connectionId, connection);

    return connection;
  }

  private getExistingConnection(dbName: string): IDBDatabase | undefined {
    for (const [id, connection] of this.connections.entries()) {
      if (id.startsWith(dbName) && this.isConnectionActive(connection)) {
        return connection;
      }
    }
    return undefined;
  }

  private isConnectionActive(connection: IDBDatabase): boolean {
    try {
      // Test if connection is still valid with a read-only transaction
      const transaction = connection.transaction(['projects'], 'readonly');
      transaction.abort();
      return true;
    } catch {
      return false;
    }
  }

  private async createConnection(dbName: string, version: number): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);

      request.onerror = () => {
        console.error('Failed to open database connection:', request.error);
        reject(new DatabaseError('Failed to open database connection'));
      };

      request.onsuccess = () => {
        const db = request.result;
        console.log('Successfully created new connection');
        resolve(db);
      };

      request.onblocked = () => {
        console.warn('Database connection blocked - attempting to close other connections');
        this.closeAllConnections();
        reject(new DatabaseError('Database connection blocked'));
      };
    });
  }

  private monitorConnection(connectionId: string, connection: IDBDatabase): void {
    connection.onclose = () => {
      console.log('Connection closed:', connectionId);
      this.connections.delete(connectionId);
    };

    connection.onversionchange = () => {
      console.log('Database version changed, closing connection:', connectionId);
      this.releaseConnection(connectionId);
      toast({
        title: "Database Update Required",
        description: "Please reload the application",
        variant: "destructive",
      });
    };

    // Set up automatic cleanup after timeout
    setTimeout(() => {
      if (this.connections.has(connectionId)) {
        console.log('Connection timeout reached, releasing:', connectionId);
        this.releaseConnection(connectionId);
      }
    }, this.connectionTimeout);
  }

  private cleanupInactiveConnections(): void {
    console.log('Cleaning up inactive connections');
    for (const [id, connection] of this.connections.entries()) {
      if (!this.isConnectionActive(connection)) {
        this.releaseConnection(id);
      }
    }
  }

  releaseConnection(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (connection) {
      try {
        connection.close();
        console.log('Connection released:', connectionId);
      } catch (error) {
        console.warn('Error closing connection:', error);
      }
      this.connections.delete(connectionId);
    }
  }

  closeAllConnections(): void {
    console.log('Closing all database connections');
    this.connections.forEach((_, id) => this.releaseConnection(id));
  }
}