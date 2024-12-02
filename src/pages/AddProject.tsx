import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { TechDomainSelect } from "@/components/projects/TechDomainSelect";
import { BasicProjectInfo } from "@/components/projects/form/BasicProjectInfo";
import { NABCFields } from "@/components/projects/form/NABCFields";
import { SMEPartnerSelect } from "@/components/projects/form/SMEPartnerSelect";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { Project, Collaborator } from "@/lib/types";

export default function AddProject() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [poc, setPoc] = useState("");
  const [pocDepartment, setPocDepartment] = useState("");
  const [techLead, setTechLead] = useState("");
  const [techLeadDepartment, setTechLeadDepartment] = useState("");
  const [ratMember, setRatMember] = useState("");
  const [budget, setBudget] = useState("");
  const [techDomainId, setTechDomainId] = useState("");
  const [selectedSME, setSelectedSME] = useState("none");
  
  // NABC fields
  const [needs, setNeeds] = useState("");
  const [approach, setApproach] = useState("");
  const [benefits, setBenefits] = useState("");
  const [competition, setCompetition] = useState("");

  // Fetch SME partner details for the selected SME
  const { data: smePartners = [] } = useQuery({
    queryKey: ['sme-partners'],
    queryFn: () => db.getAllSMEPartners()
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const selectedSMEPartner = selectedSME !== 'none' 
        ? smePartners.find(partner => partner.id === selectedSME)
        : null;

      const collaborators: Collaborator[] = selectedSMEPartner 
        ? [{ 
            id: selectedSMEPartner.id,
            name: selectedSMEPartner.name,
            email: selectedSMEPartner.email,
            role: selectedSMEPartner.role,
            department: selectedSMEPartner.department,
            projects: selectedSMEPartner.projects || [],
            lastActive: new Date().toISOString(),
            type: 'sme' as const
          }]
        : [];

      const newProject: Project = {
        id: `project-${Date.now()}`,
        name,
        poc,
        pocDepartment,
        techLead,
        techLeadDepartment,
        ratMember,
        budget: Number(budget),
        spent: 0,
        status: 'active' as const,
        departmentId: pocDepartment,
        collaborators,
        techDomainId,
        nabc: {
          needs,
          approach,
          benefits,
          competition
        },
        milestones: [],
        metrics: []
      };

      await db.addProject(newProject);
      
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <BasicProjectInfo
              name={name}
              setName={setName}
              poc={poc}
              setPoc={setPoc}
              pocDepartment={pocDepartment}
              setPocDepartment={setPocDepartment}
              techLead={techLead}
              setTechLead={setTechLead}
              techLeadDepartment={techLeadDepartment}
              setTechLeadDepartment={setTechLeadDepartment}
              ratMember={ratMember}
              setRatMember={setRatMember}
              budget={budget}
              setBudget={setBudget}
            />

            <div>
              <Label>Tech Domain</Label>
              <TechDomainSelect
                value={techDomainId}
                onValueChange={setTechDomainId}
              />
            </div>

            <SMEPartnerSelect
              selectedSME={selectedSME}
              setSelectedSME={setSelectedSME}
            />

            <NABCFields
              needs={needs}
              setNeeds={setNeeds}
              approach={approach}
              setApproach={setApproach}
              benefits={benefits}
              setBenefits={setBenefits}
              competition={competition}
              setCompetition={setCompetition}
            />

            <div className="flex gap-4">
              <Button type="submit">Create Project</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}