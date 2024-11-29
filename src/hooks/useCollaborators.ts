import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/db';
import { Collaborator, CollaboratorStats } from '@/lib/types/collaboration';

export function useCollaborators() {
  const { data: collaborators = [], isLoading } = useQuery({
    queryKey: ['collaborators'],
    queryFn: async () => {
      const allCollaborators = await db.getAllCollaborators();
      const smePartners = await db.getAllSMEPartners();
      return [...allCollaborators, ...smePartners];
    },
  });

  const stats: CollaboratorStats = {
    fortune30Count: collaborators.filter(c => c.type === 'fortune30').length,
    internalCount: collaborators.filter(c => c.type === 'internal').length,
    smeCount: collaborators.filter(c => c.type === 'sme').length,
    total: collaborators.length
  };

  const getCollaboratorsByType = (type: 'fortune30' | 'internal' | 'sme'): Collaborator[] => {
    return collaborators.filter(c => c.type === type);
  };

  return {
    collaborators,
    isLoading,
    stats,
    getCollaboratorsByType,
  };
}