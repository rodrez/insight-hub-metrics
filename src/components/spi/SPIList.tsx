import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { SPI } from "@/lib/types/spi";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SPIEditForm } from "./SPIEditForm";
import { toast } from "@/components/ui/use-toast";

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
      {spis.map(spi => {
        const relatedProject = projects?.find(p => p.id === spi.projectId);
        const fortune30Partner = relatedProject?.collaborators.find(c => c.type === 'fortune30');
        const smePartner = relatedProject?.collaborators.find(c => c.type === 'sme');

        return (
          <Card key={spi.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{spi.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{spi.deliverable}</p>
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
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Status & Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: statusColors[spi.status] }}
                      />
                      <span className="capitalize">{spi.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{spi.details}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Related Entities</h4>
                  <div className="space-y-2 text-sm">
                    {relatedProject && (
                      <p>Project: <span className="text-muted-foreground">{relatedProject.name}</span></p>
                    )}
                    {fortune30Partner && (
                      <p>Fortune 30: <span className="text-muted-foreground">{fortune30Partner.name}</span></p>
                    )}
                    {smePartner && (
                      <p>SME: <span className="text-muted-foreground">{smePartner.name}</span></p>
                    )}
                    <p>Department: <span className="text-muted-foreground">{spi.departmentId}</span></p>
                  </div>
                </div>
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