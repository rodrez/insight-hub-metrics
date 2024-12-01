import { Project } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

type SMEPartnersSectionProps = {
  project: Project;
  onUpdate: (project: Project) => void;
};

export function SMEPartnersSection({ project, onUpdate }: SMEPartnersSectionProps) {
  const { data: smePartners = [] } = useQuery({
    queryKey: ['sme-partners'],
    queryFn: () => db.getAllSMEPartners()
  });

  const handleAddSME = async (smeId: string) => {
    try {
      const selectedSME = smePartners.find(partner => partner.id === smeId);
      if (!selectedSME) return;

      const updatedCollaborators = [...project.collaborators];
      
      if (!updatedCollaborators.some(c => c.id === selectedSME.id)) {
        updatedCollaborators.push({
          id: selectedSME.id,
          name: selectedSME.name,
          email: selectedSME.email,
          role: selectedSME.role,
          department: selectedSME.department,
          projects: selectedSME.projects || [],
          lastActive: new Date().toISOString(),
          type: 'sme' as const
        });

        const updatedProject = {
          ...project,
          collaborators: updatedCollaborators
        };

        await db.addProject(updatedProject);
        onUpdate(updatedProject);
        toast({
          title: "Success",
          description: "SME partner added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add SME partner",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">SME Partners</CardTitle>
      </CardHeader>
      <CardContent>
        {project.collaborators?.some(c => c.type === 'sme') ? (
          <div className="space-y-2">
            {project.collaborators
              .filter(c => c.type === 'sme')
              .map(collaborator => (
                <div key={collaborator.id} className="p-2 border rounded">
                  {collaborator.name}
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-2">
            <Select onValueChange={handleAddSME}>
              <SelectTrigger>
                <SelectValue placeholder="Select SME partner" />
              </SelectTrigger>
              <SelectContent>
                {smePartners.map(partner => (
                  <SelectItem key={partner.id} value={partner.id}>
                    {partner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
}