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
      connection.close();
    });
    this.connections.clear();
  }
}

export const connectionManager = new ConnectionManager();