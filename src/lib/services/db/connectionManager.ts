class ConnectionManager {
  private connections: Set<IDBDatabase> = new Set();

  addConnection(db: IDBDatabase) {
    this.connections.add(db);
    console.log('Added new database connection');
  }

  removeConnection(db: IDBDatabase) {
    this.connections.delete(db);
    console.log('Removed database connection');
  }

  closeAllConnections() {
    console.log(`Closing ${this.connections.size} database connections...`);
    
    this.connections.forEach(connection => {
      try {
        // Abort all transactions
        Array.from(connection.objectStoreNames).forEach(storeName => {
          try {
            const transaction = connection.transaction(storeName, 'readwrite');
            transaction.abort();
          } catch (error) {
            console.warn(`Error aborting transaction for store ${storeName}:`, error);
          }
        });
        
        // Close connection
        connection.close();
        console.log('Successfully closed a database connection');
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    });
    
    this.connections.clear();
    console.log('All database connections closed');
  }
}

export const connectionManager = new ConnectionManager();