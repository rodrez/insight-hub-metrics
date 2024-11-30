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
      console.log('Fetching all errors from database...');
      await this.ensureInitialized();
      console.log('Database initialized, getting errors...');
      
      const errors = await this.performTransaction<ErrorItem[]>(
        'errors',
        'readonly',
        store => store.getAll()
      );
      console.log(`Successfully fetched ${errors.length} errors`);
      return errors;
    } catch (error) {
      console.error('Failed to get errors:', error);
      throw error;
    }
  }

  async deleteError(id: string): Promise<void> {
    try {
      console.log(`Attempting to delete error with ID: ${id}`);
      await this.ensureInitialized();
      await this.performTransaction(
        'errors',
        'readwrite',
        store => store.delete(id)
      );
      console.log('Error deleted successfully');
    } catch (error) {
      console.error('Failed to delete error:', error);
      throw error;
    }
  }

  async updateErrorStatus(id: string, status: 'pending' | 'resolved'): Promise<void> {
    try {
      console.log(`Updating error status for ID ${id} to ${status}`);
      await this.ensureInitialized();
      
      const error = await this.performTransaction<ErrorItem | undefined>(
        'errors',
        'readonly',
        store => store.get(id)
      );

      if (!error) {
        console.error('Error not found for status update');
        throw new Error('Error not found');
      }

      await this.performTransaction(
        'errors',
        'readwrite',
        store => store.put({ ...error, status })
      );
      console.log('Error status updated successfully');
    } catch (error) {
      console.error('Failed to update error status:', error);
      throw error;
    }
  }

  async analyzeCodebase(): Promise<void> {
    try {
      console.log('Starting codebase analysis...');
      await this.ensureInitialized();
      console.log('Database initialized for analysis');
      
      console.log('Clearing existing errors...');
      await this.clearErrors();
      console.log('Existing errors cleared successfully');
      
      console.log('Running code analysis...');
      const errors = await this.codeAnalyzer.analyzeCodebase();
      console.log(`Analysis complete. Found ${errors.length} issues.`);

      console.log('Storing new errors in database...');
      await this.performTransaction(
        'errors',
        'readwrite',
        store => {
          errors.forEach(error => {
            console.log(`Storing error: ${error.type} - ${error.message}`);
            store.put(error);
          });
          return store.put(errors[0]); // Return a single request for typing
        }
      );
      console.log('Successfully stored all errors in database');
    } catch (error) {
      console.error('Failed to analyze codebase:', error);
      console.error('Error details:', error instanceof Error ? error.message : error);
      throw error;
    }
  }

  private async clearErrors(): Promise<void> {
    try {
      console.log('Clearing all existing errors from database...');
      await this.ensureInitialized();
      await this.performTransaction(
        'errors',
        'readwrite',
        store => store.clear()
      );
      console.log('Successfully cleared all errors');
    } catch (error) {
      console.error('Failed to clear errors:', error);
      console.error('Error details:', error instanceof Error ? error.message : error);
      throw error;
    }
  }
}