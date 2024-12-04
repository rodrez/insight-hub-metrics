import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

export function useOrgPositionData(name: string) {
  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects()
  });

  const { data: allCollaborators = [] } = useQuery({
    queryKey: ['collaborators'],
    queryFn: () => db.getAllCollaborators()
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

  const fortune30Partners = allCollaborators.filter(c => 
    c.type === 'fortune30' && c.ratMember === name
  );

  const smePartners = allSMEPartners.filter(p => 
    p.ratMember === name
  );

  const projects = allProjects.filter(p => 
    p.ratMember === name
  );

  const spis = allSPIs.filter(spi => 
    spi.ratMember === name
  );

  const sitreps = allSitReps.filter(sitrep => 
    sitrep.ratMember === name
  );

  return {
    fortune30Partners,
    smePartners,
    projects,
    spis,
    sitreps,
    isLoading: false // Add proper loading state if needed
  };
}