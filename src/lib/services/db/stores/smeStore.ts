import { Collaborator } from "@/lib/types";

export class SMEStore {
  constructor(private db: IDBDatabase) {}

  async getAllSMEPartners(): Promise<Collaborator[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction('smePartners', 'readonly');
      const store = transaction.objectStore('smePartners');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getSMEPartner(id: string): Promise<Collaborator | undefined> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction('smePartners', 'readonly');
      const store = transaction.objectStore('smePartners');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addSMEPartner(partner: Collaborator): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction('smePartners', 'readwrite');
      const store = transaction.objectStore('smePartners');
      const request = store.put(partner);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}