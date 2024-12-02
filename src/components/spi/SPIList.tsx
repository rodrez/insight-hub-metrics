import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { SPI } from "@/lib/types/spi";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SPIEditForm } from "./SPIEditForm";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { RelatedEntities } from "./card/RelatedEntities";

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
          <Card key={spi.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between bg-background/50 backdrop-blur-sm">
              <div>
                <CardTitle className="text-xl font-bold">SPI {spiNumber}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{spi.deliverable}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setSelectedSPI(spi)}
                  className="text-gray-400 hover:text-green-500 hover:border-green-500 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleDelete(spi.id)}
                  className="text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: statusColors[spi.status] }}
                    />
                    <span className="capitalize font-medium">{spi.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Expected completion: {format(new Date(spi.expectedCompletionDate), 'PPP')}</span>
                  </div>
                  {spi.details && (
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">{spi.details}</p>
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