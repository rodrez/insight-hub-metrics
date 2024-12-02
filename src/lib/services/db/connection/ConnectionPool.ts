import { DatabaseError } from '../../../utils/errorHandling';

export class ConnectionPool {
  private static instance: ConnectionPool;
  private connections: Map<string, IDBDatabase> = new Map();
  private maxConnections: number = 5;
  private connectionTimeout: number = 30000; // 30 seconds

  private constructor() {}

  static getInstance(): ConnectionPool {
    if (!ConnectionPool.instance) {
      ConnectionPool.instance = new ConnectionPool();
    }
    return ConnectionPool.instance;
  }

  async acquireConnection(dbName: string, version: number): Promise<IDBDatabase> {
    // Try to reuse an existing connection
    const existingConnection = this.connections.get(dbName);
    if (existingConnection && !this.isConnectionStale(existingConnection)) {
      return existingConnection;
    }

    // Clean up stale connections
    this.cleanupStaleConnections();

    // Check if we can create a new connection
    if (this.connections.size >= this.maxConnections) {
      throw new DatabaseError('Maximum connection limit reached');
    }

    // Create new connection
    const connection = await this.createConnection(dbName, version);
    const connectionId = `${dbName}_${Date.now()}`;
    this.connections.set(connectionId, connection);

    // Set up connection cleanup
    setTimeout(() => {
      this.releaseConnection(connectionId);
    }, this.connectionTimeout);

    return connection;
  }

  private async createConnection(dbName: string, version: number): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);

      request.onerror = () => {
        reject(new DatabaseError('Failed to open database connection'));
      };

      request.onsuccess = () => {
        const db = request.result;
        db.onclose = () => {
          this.connections.forEach((conn, id) => {
            if (conn === db) {
              this.connections.delete(id);
            }
          });
        };
        resolve(db);
      };
    });
  }

  private isConnectionStale(connection: IDBDatabase): boolean {
    try {
      // Test if connection is still valid
      const transaction = connection.transaction(['any'], 'readonly');
      transaction.abort();
      return false;
    } catch {
      return true;
    }
  }

  private cleanupStaleConnections() {
    this.connections.forEach((connection, id) => {
      if (this.isConnectionStale(connection)) {
        this.releaseConnection(id);
      }
    });
  }

  releaseConnection(connectionId: string) {
    const connection = this.connections.get(connectionId);
    if (connection) {
      try {
        connection.close();
      } catch (error) {
        console.warn('Error closing connection:', error);
      }
      this.connections.delete(connectionId);
    }
  }

  closeAllConnections() {
    this.connections.forEach((connection, id) => {
      this.releaseConnection(id);
    });
  }
}