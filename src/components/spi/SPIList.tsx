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
    <div className="space-y-4">
      {spis.map((spi, index) => {
        const spiNumber = index + 1;
        const relatedProject = projects?.find(p => p.id === spi.projectId);
        const fortune30Partner = collaborators?.find(c => 
          c.type === 'fortune30' && c.id === spi.fortune30PartnerId
        );

        return (
          <Card key={spi.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200 bg-background/95">
            <CardHeader className="flex flex-row items-start justify-between py-4 px-6 space-y-0">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-xl font-semibold">SPI {spiNumber}</CardTitle>
                  <Badge 
                    className={`flex items-center gap-1.5 text-sm ${
                      spi.ratMember 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-gray-500 hover:bg-gray-600'
                    }`}
                  >
                    {spi.ratMember ? (
                      <>
                        <BadgeCheck className="h-4 w-4" />
                        RAT: {spi.ratMember}
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        RAT: Unassigned
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-lg text-foreground/90 font-medium">
                  {spi.deliverable}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedSPI(spi)}
                  className="text-muted-foreground hover:text-green-500 hover:bg-green-50 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(spi.id)}
                  className="text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="py-4 px-6 grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: statusColors[spi.status] }}
                    />
                    <span className="capitalize text-lg font-medium">{spi.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Expected: {format(new Date(spi.expectedCompletionDate), 'PP')}</span>
                  </div>
                </div>
                {spi.details && (
                  <p className="text-base text-muted-foreground bg-muted/30 p-3 rounded-lg">
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