import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/db';
import { toast } from '@/components/ui/use-toast';
import { RAT_MEMBERS } from '@/lib/services/data/utils/ratMemberUtils';
import { DEPARTMENTS } from '@/lib/constants';

interface RATMemberContextType {
  relationships: Record<string, any>;
  isLoading: boolean;
  error: Error | null;
  getDepartmentColor: (departmentId: string) => string;
}

const RATMemberContext = createContext<RATMemberContextType | undefined>(undefined);

export function RATMemberProvider({ children }: { children: React.ReactNode }) {
  const [relationships, setRelationships] = useState<Record<string, any>>({});

  const { isLoading, error } = useQuery({
    queryKey: ['rat-member-relationships'],
    queryFn: async () => {
      try {
        const allMembers = Object.keys(RAT_MEMBERS);
        const relationshipPromises = allMembers.map(async (member) => {
          const data = await db.getAllProjects();
          const fortune30 = await db.getAllCollaborators();
          const sme = await db.getAllSMEPartners();
          const spis = await db.getAllSPIs();
          const sitreps = await db.getAllSitReps();

          return {
            [member]: {
              projects: data.filter(p => p.ratMember === member),
              fortune30Partners: fortune30.filter(p => p.ratMember === member),
              smePartners: sme.filter(p => p.ratMember === member),
              spis: spis.filter(s => s.ratMember === member),
              sitreps: sitreps.filter(s => s.ratMember === member)
            }
          };
        });

        const results = await Promise.all(relationshipPromises);
        const combinedRelationships = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setRelationships(combinedRelationships);
        return combinedRelationships;
      } catch (error) {
        console.error('Error fetching RAT member relationships:', error);
        toast({
          title: "Error",
          description: "Failed to load organization data",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 2
  });

  const getDepartmentColor = (departmentId: string) => {
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    return department?.color || '#6E59A5';
  };

  return (
    <RATMemberContext.Provider value={{ relationships, isLoading, error, getDepartmentColor }}>
      {children}
    </RATMemberContext.Provider>
  );
}

export const useRATMember = () => {
  const context = useContext(RATMemberContext);
  if (context === undefined) {
    throw new Error('useRATMember must be used within a RATMemberProvider');
  }
  return context;
};