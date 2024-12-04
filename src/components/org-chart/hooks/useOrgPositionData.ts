import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

export function useOrgPositionData(name: string) {
  const { data: allProjects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects', name],
    queryFn: async () => {
      const projects = await db.getAllProjects();
      return projects.filter(p => p.ratMember === name);
    }
  });

  const { data: allCollaborators = [], isLoading: collaboratorsLoading } = useQuery({
    queryKey: ['collaborators', name],
    queryFn: async () => {
      const collaborators = await db.getAllCollaborators();
      return collaborators.filter(c => c.ratMember === name && c.type === 'fortune30');
    }
  });

  const { data: allSMEPartners = [], isLoading: smeLoading } = useQuery({
    queryKey: ['sme-partners', name],
    queryFn: async () => {
      const partners = await db.getAllSMEPartners();
      return partners.filter(p => p.ratMember === name);
    }
  });

  const { data: allSPIs = [], isLoading: spisLoading } = useQuery({
    queryKey: ['spis', name],
    queryFn: async () => {
      const spis = await db.getAllSPIs();
      return spis.filter(spi => spi.ratMember === name);
    }
  });

  const { data: allSitReps = [], isLoading: sitrepsLoading } = useQuery({
    queryKey: ['sitreps', name],
    queryFn: async () => {
      const sitreps = await db.getAllSitReps();
      return sitreps.filter(sitrep => sitrep.ratMember === name);
    }
  });

  return {
    fortune30Partners: allCollaborators,
    smePartners: allSMEPartners,
    projects: allProjects,
    spis: allSPIs,
    sitreps: allSitReps,
    isLoading: projectsLoading || collaboratorsLoading || smeLoading || spisLoading || sitrepsLoading
  };
}