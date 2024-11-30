import { db } from "@/lib/db";
import { ErrorItem } from "@/lib/types/error";

export function useErrorStore() {
  const getAllErrors = async (): Promise<ErrorItem[]> => {
    return db.getAllErrors();
  };

  const deleteError = async (id: string): Promise<void> => {
    await db.deleteError(id);
  };

  const updateErrorStatus = async (id: string, status: 'pending' | 'resolved'): Promise<void> => {
    await db.updateErrorStatus(id, status);
  };

  const analyzeCodebase = async (): Promise<void> => {
    await db.analyzeCodebase();
  };

  return {
    getAllErrors,
    deleteError,
    updateErrorStatus,
    analyzeCodebase,
  };
}