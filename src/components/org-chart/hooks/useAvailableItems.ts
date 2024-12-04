import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

export function useAvailableItems() {
  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects()
  });

  const { data: allFortune30Partners = [] } = useQuery({
    queryKey: ['collaborators-fortune30'],
    queryFn: async () => {
      const collaborators = await db.getAllCollaborators();
      return collaborators.filter(c => c.type === 'fortune30');
    }
  });

  const { data: allSMEPartners = [] } = useQuery({
    queryKey: ['sme-partners'],
    queryFn: () => db.getAllSMEPartners()
  });

  const { data: allSPIs = [] } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  const { data: allSitReps = [] } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

  return {
    allProjects,
    allFortune30Partners,
    allSMEPartners,
    allSPIs,
    allSitReps
  };
}