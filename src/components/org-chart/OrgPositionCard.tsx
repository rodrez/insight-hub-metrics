import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RelationshipSelectionDialog } from "./RelationshipSelectionDialog";
import { OrgPosition } from "./types";
import { getRatMemberInfo, getRatMemberRelationships } from "@/lib/services/data/utils/ratMemberUtils";
import { useNavigate } from "react-router-dom";
import { OrgPositionHeader } from "./card/OrgPositionHeader";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { RelationshipsContainer } from "./card/RelationshipsContainer";
import { useRelationshipUpdates } from "./hooks/useRelationshipUpdates";
import { toast } from "@/components/ui/use-toast";

interface OrgPositionCardProps {
  title: string;
  name: string;
  width?: string;
}

export function OrgPositionCard({ title, name, width = "w-96" }: OrgPositionCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const memberInfo = getRatMemberInfo(name);
  const navigate = useNavigate();
  const { handleSave } = useRelationshipUpdates();

  // Add retry logic and better error handling
  const { data: relationships, isLoading, error } = useQuery({
    queryKey: ['rat-member-relationships', name],
    queryFn: async () => {
      console.log('Fetching relationships for:', name);
      try {
        // Initialize relationships with empty arrays
        const defaultRelationships = {
          fortune30Partners: [],
          smePartners: [],
          projects: [],
          spis: [],
          sitreps: []
        };

        const data = await getRatMemberRelationships(name, db);
        console.log('Successfully fetched relationships for', name, ':', data);
        
        // Merge with defaults to ensure all properties exist
        return {
          ...defaultRelationships,
          ...data
        };
      } catch (error) {
        console.error('Error fetching relationships:', error);
        toast({
          title: "Error",
          description: "Failed to fetch relationships",
          variant: "destructive",
        });
        return {
          fortune30Partners: [],
          smePartners: [],
          projects: [],
          spis: [],
          sitreps: []
        };
      }
    },
    retry: 1
  });

  const handleItemClick = (type: string, id: string) => {
    console.log('Item clicked:', { type, id });
    switch (type) {
      case 'project':
        navigate('/', { state: { scrollToProject: id } });
        break;
      case 'fortune30':
        navigate('/collaborations', { state: { scrollToCollaborator: id } });
        break;
      case 'sme':
        navigate('/sme', { state: { scrollToPartner: id } });
        break;
      case 'spi':
        navigate('/spi', { state: { scrollToSPI: id } });
        break;
      case 'sitrep':
        navigate('/sitreps', { state: { scrollToSitRep: id } });
        break;
    }
  };

  if (isLoading) {
    return <Card className={`${width} p-6 animate-pulse`}>Loading...</Card>;
  }

  if (error) {
    console.error('Error in OrgPositionCard:', error);
    return (
      <Card className={`${width} p-6`}>
        <p className="text-sm text-muted-foreground">Unable to load relationships. Please try again later.</p>
      </Card>
    );
  }

  const position: OrgPosition = {
    id: name,
    title: title,
    projects: relationships?.projects?.map(p => p.id) || [],
    fortune30Partners: relationships?.fortune30Partners?.map(p => p.id) || [],
    smePartners: relationships?.smePartners?.map(p => p.id) || [],
    spis: relationships?.spis?.map(s => s.id) || [],
    sitreps: relationships?.sitreps?.map(s => s.id) || []
  };

  return (
    <Card className={`${width} p-6 space-y-4 bg-background/95 backdrop-blur-sm border-muted`}>
      <OrgPositionHeader 
        title={title}
        name={name}
        memberInfo={memberInfo}
        onEditClick={() => setIsDialogOpen(true)}
      />

      <RelationshipsContainer
        fortune30Partners={relationships?.fortune30Partners || []}
        smePartners={relationships?.smePartners || []}
        projects={relationships?.projects || []}
        spis={relationships?.spis || []}
        sitreps={relationships?.sitreps || []}
        onItemClick={handleItemClick}
      />

      <RelationshipSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        position={position}
        onSave={async (updatedPosition) => {
          console.log('Saving updated position:', updatedPosition);
          await handleSave(name, updatedPosition);
          setIsDialogOpen(false);
        }}
        allProjects={relationships?.projects || []}
        allFortune30Partners={relationships?.fortune30Partners || []}
        allSMEPartners={relationships?.smePartners || []}
        allSPIs={relationships?.spis || []}
        allSitReps={relationships?.sitreps || []}
      />
    </Card>
  );
}