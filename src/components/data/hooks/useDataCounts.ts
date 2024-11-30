import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { DataCounts } from "../types/dataTypes";
import { toast } from "@/components/ui/use-toast";

export function useDataCounts(isInitialized: boolean) {
  const queryClient = useQueryClient();

  const fetchDataCounts = async (): Promise<DataCounts> => {
    if (!isInitialized) {
      return {
        projects: 0,
        spis: 0,
        objectives: 0,
        sitreps: 0,
        fortune30: 0,
        internalPartners: 0,
        smePartners: 0
      };
    }
    
    try {
      await db.init();
      
      const [
        projects,
        spis,
        objectives,
        sitreps,
        collaborators,
        smePartners
      ] = await Promise.all([
        db.getAllProjects(),
        db.getAllSPIs(),
        db.getAllObjectives(),
        db.getAllSitReps(),
        db.getAllCollaborators(),
        db.getAllSMEPartners()
      ]);

      const counts = {
        projects: projects?.length || 0,
        spis: spis?.length || 0,
        objectives: objectives?.length || 0,
        sitreps: sitreps?.length || 0,
        fortune30: collaborators?.filter(c => c.type === 'fortune30')?.length || 0,
        internalPartners: collaborators?.filter(c => c.type === 'internal')?.length || 0,
        smePartners: smePartners?.length || 0
      };

      // Update individual count queries
      Object.entries(counts).forEach(([key, value]) => {
        queryClient.setQueryData(['data-count', key], value);
      });

      return counts;
    } catch (error) {
      console.error('Error fetching data counts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data counts. Please ensure the database is properly initialized.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const { data: dataCounts = {
    projects: 0,
    spis: 0,
    objectives: 0,
    sitreps: 0,
    fortune30: 0,
    internalPartners: 0,
    smePartners: 0
  }, refetch } = useQuery({
    queryKey: ['data-counts'],
    queryFn: fetchDataCounts,
    enabled: isInitialized,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  const updateDataCounts = async () => {
    await queryClient.invalidateQueries({ queryKey: ['data-counts'] });
    // Also invalidate individual count queries
    Object.keys(dataCounts).forEach(key => {
      queryClient.invalidateQueries({ queryKey: ['data-count', key] });
    });
    await refetch();
  };

  return { dataCounts, updateDataCounts };
}