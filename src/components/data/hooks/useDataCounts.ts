import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { DataCounts } from "../types/dataTypes";
import { toast } from "@/components/ui/use-toast";

export function useDataCounts(isInitialized: boolean) {
  const queryClient = useQueryClient();

  const fetchDataCounts = async (): Promise<DataCounts> => {
    if (!isInitialized) {
      console.log('Database not initialized, returning empty counts');
      return {
        projects: 0,
        spis: 0,
        objectives: 0,
        sitreps: 0,
        fortune30: 0,
        internalPartners: 0,
        smePartners: 0,
        initiatives: 0
      };
    }
    
    try {
      console.log('Initializing database before fetching counts...');
      await db.init();
      console.log('Database initialized, proceeding to fetch counts');
      
      const [
        projects,
        spis,
        objectives,
        sitreps,
        collaborators,
        smePartners,
        initiatives
      ] = await Promise.all([
        db.getAllProjects().catch(e => {
          console.error('Error fetching projects:', e);
          return [];
        }),
        db.getAllSPIs().catch(e => {
          console.error('Error fetching SPIs:', e);
          return [];
        }),
        db.getAllObjectives().catch(e => {
          console.error('Error fetching objectives:', e);
          return [];
        }),
        db.getAllSitReps().catch(e => {
          console.error('Error fetching sitreps:', e);
          return [];
        }),
        db.getAllCollaborators().catch(e => {
          console.error('Error fetching collaborators:', e);
          return [];
        }),
        db.getAllSMEPartners().catch(e => {
          console.error('Error fetching SME partners:', e);
          return [];
        }),
        db.getAllInitiatives().catch(e => {
          console.error('Error fetching initiatives:', e);
          return [];
        })
      ]);

      console.log('All data fetched successfully, calculating counts');

      const counts = {
        projects: projects?.length || 0,
        spis: spis?.length || 0,
        objectives: objectives?.length || 0,
        sitreps: sitreps?.length || 0,
        fortune30: collaborators?.filter(c => c.type === 'fortune30')?.length || 0,
        internalPartners: collaborators?.filter(c => c.type === 'internal')?.length || 0,
        smePartners: smePartners?.length || 0,
        initiatives: initiatives?.length || 0
      };

      console.log('Calculated counts:', counts);
      return counts;
    } catch (error) {
      console.error('Error in fetchDataCounts:', error);
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
    smePartners: 0,
    initiatives: 0
  }, isLoading, refetch } = useQuery({
    queryKey: ['data-counts'],
    queryFn: fetchDataCounts,
    enabled: isInitialized,
    staleTime: 1000, // Reduce stale time to 1 second to ensure frequent updates
    refetchInterval: 2000, // Add polling every 2 seconds while the query is mounted
  });

  const updateDataCounts = async () => {
    await queryClient.invalidateQueries({ queryKey: ['data-counts'] });
    await refetch();
  };

  return { dataCounts, updateDataCounts, isLoading };
}