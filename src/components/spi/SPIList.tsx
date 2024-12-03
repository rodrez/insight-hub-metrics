import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { SPI } from "@/lib/types/spi";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Calendar, BadgeCheck, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SPIEditForm } from "./SPIEditForm";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { RelatedEntities } from "./card/RelatedEntities";
import { Badge } from "@/components/ui/badge";

export function SPIList() {
  const [statusColors, setStatusColors] = useState({
    completed: '#3B82F6',
    delayed: '#F59E0B',
    'on-track': '#10B981'
  });

  const [selectedSPI, setSelectedSPI] = useState<SPI | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('projectStatusColors');
    if (saved) {
      const colors = JSON.parse(saved);
      setStatusColors({
        completed: colors.find((c: any) => c.id === 'completed')?.color || '#3B82F6',
        delayed: colors.find((c: any) => c.id === 'delayed')?.color || '#F59E0B',
        'on-track': colors.find((c: any) => c.id === 'active')?.color || '#10B981'
      });
    }
  }, []);

  const { data: spis, refetch } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects()
  });

  const { data: collaborators } = useQuery({
    queryKey: ['collaborators'],
    queryFn: () => db.getAllCollaborators()
  });

  const handleDelete = async (id: string) => {
    try {
      await db.deleteSPI(id);
      refetch();
      toast({
        title: "Success",
        description: "SPI deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete SPI",
        variant: "destructive"
      });
    }
  };

  if (!spis) return null;

  return (
    <div className="space-y-2">
      {spis.map((spi, index) => {
        const spiNumber = index + 1;
        const relatedProject = projects?.find(p => p.id === spi.projectId);
        const fortune30Partner = collaborators?.find(c => 
          c.type === 'fortune30' && c.id === spi.fortune30PartnerId
        );

        return (
          <Card key={spi.id} className="overflow-hidden hover:shadow-sm transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between bg-background/50 backdrop-blur-sm py-3 px-4">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-medium">SPI {spiNumber}</CardTitle>
                  <Badge 
                    className={`flex items-center gap-1.5 ${
                      spi.ratMember 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-gray-500 hover:bg-gray-600'
                    }`}
                  >
                    {spi.ratMember ? (
                      <>
                        <BadgeCheck className="h-3.5 w-3.5" />
                        RAT: {spi.ratMember}
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3.5 w-3.5" />
                        RAT: Unassigned
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                  {spi.deliverable}
                </p>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedSPI(spi)}
                  className="text-gray-400 hover:text-green-500 hover:bg-green-50 transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(spi.id)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="py-3 px-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: statusColors[spi.status] }}
                    />
                    <span className="capitalize font-medium">{spi.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Expected: {format(new Date(spi.expectedCompletionDate), 'PP')}</span>
                  </div>
                  {spi.details && (
                    <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-md line-clamp-2">
                      {spi.details}
                    </p>
                  )}
                </div>
                <RelatedEntities
                  relatedProject={relatedProject}
                  fortune30Partner={fortune30Partner}
                  smePartnerId={spi.smePartnerId}
                  departmentId={spi.departmentId}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Dialog open={!!selectedSPI} onOpenChange={(open) => !open && setSelectedSPI(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit SPI</DialogTitle>
          </DialogHeader>
          {selectedSPI && (
            <SPIEditForm 
              spi={selectedSPI} 
              onSuccess={() => {
                setSelectedSPI(null);
                refetch();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}