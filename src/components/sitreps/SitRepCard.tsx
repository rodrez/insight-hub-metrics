import { format } from "date-fns";
import { Pen, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SitRep } from "@/lib/types/sitrep";
import { db } from "@/lib/db";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { StatusIcon } from "./card/StatusIcon";
import { TeamBadges } from "./card/TeamBadges";
import { ContactBadges } from "./card/ContactBadges";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { CompactSitRepForm } from "./CompactSitRepForm";
import { DEPARTMENTS } from "@/lib/constants";
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
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

  const getDepartmentColor = (departmentId?: string) => {
    if (!departmentId) return '#333';
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    return department?.color || '#333';
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

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{format(new Date(sitrep.date), "MM/dd/yyyy")}</span>
              <span>{sitrep.level}</span>
            </div>

            {sitrep.poc && (
              <div 
                className="p-3 rounded-md"
                style={{ 
                  backgroundColor: `${getDepartmentColor(sitrep.pocDepartment)}15`,
                  borderLeft: `3px solid ${getDepartmentColor(sitrep.pocDepartment)}`
                }}
              >
                <p className="text-sm font-medium">Point of Contact</p>
                <p className="text-sm">{sitrep.poc}</p>
              </div>
            )}

            {(sitrep.fortune30PartnerId || sitrep.smePartnerId) && (
              <div className="space-y-2">
                {sitrep.fortune30PartnerId && (
                  <div className="p-3 rounded-md bg-blue-500/10 border-l-2 border-blue-500">
                    <p className="text-sm font-medium">Fortune 30 Partner</p>
                    <p className="text-sm">{sitrep.fortune30PartnerId}</p>
                  </div>
                )}
                {sitrep.smePartnerId && (
                  <div className="p-3 rounded-md bg-purple-500/10 border-l-2 border-purple-500">
                    <p className="text-sm font-medium">SME Partner</p>
                    <p className="text-sm">{sitrep.smePartnerId}</p>
                  </div>
                )}
              </div>
            )}

            {(sitrep.pointsOfContact?.length > 0 || sitrep.teams?.length > 0) && (
              <div className="space-y-3 pt-2">
                {sitrep.pointsOfContact && sitrep.pointsOfContact.length > 0 && (
                  <ContactBadges contacts={sitrep.pointsOfContact} />
                )}
                {sitrep.teams && sitrep.teams.length > 0 && (
                  <TeamBadges 
                    teams={sitrep.teams} 
                    keyTeam={sitrep.departmentId}
                    poc={sitrep.poc}
                    pocDepartment={sitrep.pocDepartment}
                  />
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