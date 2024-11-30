import { ErrorItem } from '../../types/error';
import { BaseDBService } from './base/BaseDBService';
import { CodeAnalyzer } from '../error/CodeAnalyzer';

export class ErrorService extends BaseDBService {
  private codeAnalyzer: CodeAnalyzer;

  constructor() {
    super();
    this.codeAnalyzer = new CodeAnalyzer();
  }

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
      const errors = this.codeAnalyzer.analyzeCodebase();

      await this.performTransaction(
        'errors',
        'readwrite',
        store => {
          errors.forEach(error => store.put(error));
          return store.put(errors[0]); // Return a single request for typing
        }
      );
    } catch (error) {
      console.error('Failed to analyze codebase:', error);
      throw error;
    }
  }
}