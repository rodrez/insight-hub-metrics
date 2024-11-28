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
        internalPartners: collaborators?.filter(c => c.type === 'other')?.length || 0,
        smePartners: smePartners?.length || 0
      };

      // Pre-cache individual counts
      Object.entries(counts).forEach(([key, value]) => {
        queryClient.setQueryData(['data-count', key], value);
      });

      return counts;
    } catch (error) {
      console.error('Error fetching data counts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data counts",
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
  }} = useQuery({
    queryKey: ['data-counts'],
    queryFn: fetchDataCounts,
    enabled: isInitialized,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });

  const updateDataCounts = async () => {
    await queryClient.invalidateQueries({ queryKey: ['data-counts'] });
  };

  return { dataCounts, updateDataCounts };
}