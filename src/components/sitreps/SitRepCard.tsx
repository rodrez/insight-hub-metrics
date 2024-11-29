import { format } from "date-fns";
import { Pen, Trash2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SitRep } from "@/lib/types/sitrep";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/db";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface SitRepCardProps {
  sitrep: SitRep;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function SitRepCard({ sitrep, onEdit, onDelete }: SitRepCardProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const getStatusIcon = () => {
    switch (sitrep.status) {
      case 'submitted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending-review':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'ready':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

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

  const getTeamBadgeColor = (team: string) => {
    switch (team.toLowerCase()) {
      case 'engineering':
        return 'bg-emerald-600 text-white';
      case 'operations':
        return 'bg-blue-500 text-white';
      case 'security':
        return 'bg-orange-500 text-white';
      case 'product':
        return 'bg-indigo-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const wordCount = sitrep.summary.split(/\s+/).filter(word => word.length > 0).length;
  const isWordCountValid = wordCount >= 100;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(sitrep.id);
      toast({
        title: "SitRep deleted",
        description: "The SitRep has been successfully deleted.",
      });
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(sitrep.id);
      toast({
        title: "Editing SitRep",
        description: "You can now edit the SitRep.",
      });
    }
  };

  const handleStatusChange = async (newStatus: 'pending-review' | 'ready' | 'submitted') => {
    try {
      await db.updateSitRep(sitrep.id, { ...sitrep, status: newStatus });
      queryClient.invalidateQueries({ queryKey: ['sitreps'] });
      toast({
        title: "Status updated",
        description: `SitRep status changed to ${newStatus.replace('-', ' ')}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-[#1A1F2C] text-white mb-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">{sitrep.title}</h3>
              <Select value={sitrep.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending-review">Pending Review</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                </SelectContent>
              </Select>
              {sitrep.level && (
                <Badge variant="outline" className="ml-2">
                  {sitrep.level} Level
                </Badge>
              )}
              {getStatusIcon()}
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEdit}
                  className="text-gray-400 hover:text-white"
                >
                  <Pen className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <p className="text-gray-300">{sitrep.summary}</p>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{format(new Date(sitrep.date), "MM/dd/yyyy")}</span>
            <span>{sitrep.level}</span>
            <span className={!isWordCountValid ? "text-yellow-500" : ""}>
              {wordCount} words {!isWordCountValid && "(minimum 100 words required)"}
            </span>
          </div>

          {(sitrep.pointsOfContact?.length > 0 || sitrep.teams?.length > 0) && (
            <div className="space-y-3 pt-2">
              {sitrep.pointsOfContact && sitrep.pointsOfContact.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Points of Contact:</p>
                  <div className="flex flex-wrap gap-2">
                    {sitrep.pointsOfContact.map((contact, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-emerald-600/20 text-emerald-400"
                      >
                        {contact}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {sitrep.teams && sitrep.teams.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Teams:</p>
                  <div className="flex flex-wrap gap-2">
                    {sitrep.teams.map((team, index) => (
                      <Badge
                        key={index}
                        className={getTeamBadgeColor(team)}
                      >
                        {team}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}