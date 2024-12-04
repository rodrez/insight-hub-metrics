class ConnectionManager {
  private connections: Set<IDBDatabase> = new Set();

  addConnection(db: IDBDatabase) {
    this.connections.add(db);
  }

  removeConnection(db: IDBDatabase) {
    this.connections.delete(db);
  }

  closeAllConnections() {
    this.connections.forEach(connection => {
      // Abort all transactions
      Array.from(connection.objectStoreNames).forEach(storeName => {
        const transaction = connection.transaction(storeName, 'readwrite');
        transaction.abort();
      });
      
      // Close connection
      connection.close();
    });
    
    this.connections.clear();
  }
}

export const connectionManager = new ConnectionManager();