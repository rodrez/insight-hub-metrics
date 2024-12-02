import { format } from "date-fns";
import { Pen, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SitRep } from "@/lib/types/sitrep";
import { db } from "@/lib/db";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { StatusIcon } from "./card/StatusIcon";
import { LevelBadge } from "./card/LevelBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { CompactSitRepForm } from "./CompactSitRepForm";
import { POCDisplay } from "./card/POCDisplay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending-review':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'ready':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'pending-review':
        return 'Pending Review';
      case 'ready':
        return 'Ready';
      default:
        return status;
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

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{sitrep.title}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusBadgeColor(sitrep.status)} cursor-pointer hover:opacity-80`}
                    >
                      {getStatusLabel(sitrep.status)}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => handleStatusChange('pending-review')}>
                      Pending Review
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('ready')}>
                      Ready
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange('submitted')}>
                      Submitted
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <StatusIcon status={sitrep.status} />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditDialogOpen(true)}
                  className="text-muted-foreground hover:text-green-500 transition-colors"
                >
                  <Pen className="h-4 w-4" />
                </Button>
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

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