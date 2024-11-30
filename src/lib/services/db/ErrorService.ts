import { ErrorItem } from '../../types/error';
import { BaseDBService } from './base/BaseDBService';
import { v4 as uuidv4 } from 'uuid';

export class ErrorService extends BaseDBService {
  async getAllErrors(): Promise<ErrorItem[]> {
    try {
      return await this.performTransaction<ErrorItem[]>(
        'errors',
        'readonly',
        store => store.getAll()
      );
    } catch (error) {
      console.error('Failed to get errors:', error);
      throw error;
    }
  }

  async deleteError(id: string): Promise<void> {
    try {
      await this.performTransaction(
        'errors',
        'readwrite',
        store => store.delete(id)
      );
    } catch (error) {
      console.error('Failed to delete error:', error);
      throw error;
    }
  }

  async updateErrorStatus(id: string, status: 'pending' | 'resolved'): Promise<void> {
    try {
      const error = await this.performTransaction<ErrorItem | undefined>(
        'errors',
        'readonly',
        store => store.get(id)
      );

      if (!error) {
        throw new Error('Error not found');
      }

      await this.performTransaction(
        'errors',
        'readwrite',
        store => store.put({ ...error, status })
      );
    } catch (error) {
      console.error('Failed to update error status:', error);
      throw error;
    }
  }

  async analyzeCodebase(): Promise<void> {
    try {
      const mockErrors: ErrorItem[] = [
        {
          id: uuidv4(),
          type: 'Performance',
          message: 'Large component not memoized causing unnecessary re-renders',
          stackTrace: 'src/components/LargeComponent.tsx:25',
          status: 'pending',
          timestamp: Date.now(),
          priority: 8
        },
        {
          id: uuidv4(),
          type: 'Security',
          message: 'Sensitive data exposed in localStorage',
          stackTrace: 'src/services/auth/AuthService.ts:42',
          status: 'pending',
          timestamp: Date.now(),
          priority: 9
        }
      ];

      await this.performTransaction(
        'errors',
        'readwrite',
        store => {
          mockErrors.forEach(error => store.put(error));
          return store.put(mockErrors[0]); // Return a single request for typing
        }
      );
    } catch (error) {
      console.error('Failed to analyze codebase:', error);
      throw error;
    }
  }
}