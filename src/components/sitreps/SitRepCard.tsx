import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { SitRep } from "@/lib/types/sitrep";
import { db } from "@/lib/db";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { CompactSitRepForm } from "./CompactSitRepForm";
import { POCDisplay } from "./card/POCDisplay";
import { LevelBadge } from "./card/LevelBadge";
import { SitRepHeader } from "./card/SitRepHeader";
import { Badge } from "@/components/ui/badge";
import { getAllRatMembers, getRatMemberRole } from "@/lib/services/data/utils/ratMemberUtils";

interface SitRepCardProps {
  sitrep: SitRep;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function SitRepCard({ sitrep, onEdit, onDelete }: SitRepCardProps) {
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: smePartner } = useQuery({
    queryKey: ['sme-partner', sitrep.smePartnerId],
    queryFn: async () => {
      if (!sitrep.smePartnerId || sitrep.smePartnerId === 'none') return null;
      const partner = await db.getSMEPartner(sitrep.smePartnerId);
      return partner || null;
    },
    enabled: !!sitrep.smePartnerId && sitrep.smePartnerId !== 'none'
  });

  const { data: fortune30Partner } = useQuery({
    queryKey: ['collaborators-fortune30', sitrep.fortune30PartnerId],
    queryFn: async () => {
      if (!sitrep.fortune30PartnerId || sitrep.fortune30PartnerId === 'none') return null;
      const allCollaborators = await db.getAllCollaborators();
      const partner = allCollaborators.find(c => 
        c.type === 'fortune30' && c.id === sitrep.fortune30PartnerId
      );
      return partner || null;
    },
    enabled: !!sitrep.fortune30PartnerId && sitrep.fortune30PartnerId !== 'none'
  });

  const handleDelete = () => {
    if (onDelete) {
      onDelete(sitrep.id);
    }
  };

  const handleStatusChange = async (newStatus: 'pending-review' | 'ready' | 'submitted') => {
    try {
      await db.updateSitRep(sitrep.id, { ...sitrep, status: newStatus });
      queryClient.invalidateQueries({ queryKey: ['sitreps'] });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const wordCount = sitrep.summary.split(/\s+/).filter(word => word.length > 0).length;

  const keyPOC = sitrep.poc && sitrep.pocDepartment ? {
    name: sitrep.poc,
    department: sitrep.pocDepartment
  } : undefined;

  const supportingPOCs = sitrep.pointsOfContact?.map(contact => ({
    name: contact,
    department: sitrep.teams?.[0] || ''
  })) || [];

  const ratMembers = getAllRatMembers();
  const displayMember = sitrep.ratMember || ratMembers[Math.floor(Math.random() * ratMembers.length)];
  const memberRole = getRatMemberRole(displayMember);

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <SitRepHeader
              title={sitrep.title}
              status={sitrep.status}
              ratMember={displayMember}
              onStatusChange={handleStatusChange}
              onEdit={() => setIsEditDialogOpen(true)}
              onDelete={onDelete ? handleDelete : undefined}
            />

            <p className="text-muted-foreground">{sitrep.summary}</p>

            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                {format(new Date(sitrep.date), "MM/dd/yyyy")}
              </span>
              {sitrep.level && <LevelBadge level={sitrep.level} />}
              <span className="text-xs text-muted-foreground">
                Word count: <span className="font-medium">{wordCount}/100</span>
              </span>
            </div>

            <POCDisplay keyPOC={keyPOC} supportingPOCs={supportingPOCs} />

            {(sitrep.fortune30PartnerId || sitrep.smePartnerId) && (
              <div className="flex flex-wrap gap-4 text-sm">
                {sitrep.fortune30PartnerId && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Fortune 30:</span>
                    <span style={{ color: fortune30Partner?.color || '#4B5563' }}>
                      {fortune30Partner?.name || 'Not found'}
                    </span>
                  </div>
                )}
                {sitrep.smePartnerId && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">SME:</span>
                    <span style={{ color: smePartner?.color || '#6E59A5' }}>
                      {smePartner ? smePartner.name : 'None'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] p-6 bg-[#1A1F2C] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Edit Sitrep
            </DialogTitle>
          </DialogHeader>
          <CompactSitRepForm
            initialData={sitrep}
            onSubmitSuccess={() => {
              setIsEditDialogOpen(false);
              queryClient.invalidateQueries({ queryKey: ['sitreps'] });
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}