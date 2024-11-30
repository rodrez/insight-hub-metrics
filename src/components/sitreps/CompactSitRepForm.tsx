import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { SitRep } from "@/lib/types/sitrep";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { RelationshipFields } from "./form/RelationshipFields";
import { ContentFields } from "./form/ContentFields";
import { DepartmentFields } from "./form/DepartmentFields";
import { Contact } from "@/lib/types/pointOfContact";
import { DateSelector } from "./form/DateSelector";
import { TeamPOCFields } from "./form/TeamPOCFields";

interface CompactSitRepFormProps {
  onSubmitSuccess: () => void;
  initialData?: SitRep;
}

export function CompactSitRepForm({ onSubmitSuccess, initialData }: CompactSitRepFormProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialData?.date ? new Date(initialData.date) : new Date()
  );
  const [title, setTitle] = useState(initialData?.title || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [update, setUpdate] = useState(initialData?.update || "");
  const [challenges, setChallenges] = useState(initialData?.challenges || "");
  const [nextSteps, setNextSteps] = useState(initialData?.nextSteps || "");
  const [selectedProject, setSelectedProject] = useState<string>(initialData?.projectId || "none");
  const [selectedFortune30, setSelectedFortune30] = useState<string>(initialData?.fortune30PartnerId || "none");
  const [selectedSME, setSelectedSME] = useState<string>(initialData?.smePartnerId || "none");
  const [selectedDepartment, setSelectedDepartment] = useState<string>(initialData?.departmentId || "");
  const [supportingTeams, setSupportingTeams] = useState<string[]>(initialData?.teams || []);
  const [teamPOCs, setTeamPOCs] = useState<Record<string, Contact>>({});
  const [status, setStatus] = useState<'pending-review' | 'ready' | 'submitted'>(initialData?.status || 'pending-review');
  const [level, setLevel] = useState<"CEO" | "SVP" | "CTO">(initialData?.level || "SVP");
  const [contacts, setContacts] = useState<Contact[]>([]);

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects()
  });

  const { data: collaborators = [] } = useQuery({
    queryKey: ['collaborators'],
    queryFn: () => db.getAllCollaborators()
  });

  const fortune30Partners = collaborators?.filter(c => c.type === 'fortune30') || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDepartment) {
      toast({
        title: "Error",
        description: "Please select a key department",
        variant: "destructive"
      });
      return;
    }

    // Validate POCs for supporting teams
    const missingPOCs = supportingTeams.filter(team => !teamPOCs[team]);
    if (missingPOCs.length > 0) {
      toast({
        title: "Error",
        description: "Please select POCs for all supporting teams",
        variant: "destructive"
      });
      return;
    }

    try {
      const sitrepData = {
        id: initialData?.id || `sitrep-${Date.now()}`,
        date: selectedDate?.toISOString() || new Date().toISOString(),
        spiId: initialData?.spiId || "temp-spi-id",
        title,
        update,
        challenges,
        nextSteps,
        status,
        level,
        summary,
        projectId: selectedProject !== "none" ? selectedProject : undefined,
        departmentId: selectedDepartment,
        fortune30PartnerId: selectedFortune30 !== "none" ? selectedFortune30 : undefined,
        smePartnerId: selectedSME !== "none" ? selectedSME : undefined,
        teams: supportingTeams,
        teamPOCs
      };

      if (initialData) {
        await db.updateSitRep(initialData.id, sitrepData);
        toast({
          title: "Success",
          description: "SitRep updated successfully"
        });
      } else {
        await db.addSitRep(sitrepData);
        toast({
          title: "Success",
          description: "SitRep added successfully"
        });
      }
      
      setOpen(false);
      onSubmitSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: initialData ? "Failed to update SitRep" : "Failed to add SitRep",
        variant: "destructive"
      });
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[calc(85vh-120px)] pr-4">
        <div className="space-y-6">
          <DateSelector date={selectedDate} onDateChange={(date) => date && setSelectedDate(date)} />
          
          <BasicInfoFields
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            title={title}
            setTitle={setTitle}
            status={status}
            setStatus={setStatus}
            level={level}
            setLevel={setLevel}
          />
          
          <DepartmentFields
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            supportingTeams={supportingTeams}
            setSupportingTeams={setSupportingTeams}
          />

          {supportingTeams.map((teamId) => (
            <TeamPOCFields
              key={teamId}
              teamId={teamId}
              onPOCSelect={(teamId, contact) => {
                setTeamPOCs(prev => ({
                  ...prev,
                  [teamId]: contact
                }));
              }}
              selectedPOC={teamPOCs[teamId]}
            />
          ))}

          <RelationshipFields
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            selectedFortune30={selectedFortune30}
            setSelectedFortune30={setSelectedFortune30}
            selectedSME={selectedSME}
            setSelectedSME={setSelectedSME}
            projects={projects}
            fortune30Partners={fortune30Partners}
            contacts={contacts}
            onContactsChange={setContacts}
          />

          <ContentFields
            summary={summary}
            setSummary={setSummary}
            update={update}
            setUpdate={setUpdate}
            challenges={challenges}
            setChallenges={setChallenges}
            nextSteps={nextSteps}
            setNextSteps={setNextSteps}
          />
        </div>
      </ScrollArea>

      <Button type="submit" className="w-full">
        {initialData ? "Update Sitrep" : "Create Sitrep"}
      </Button>
    </form>
  );

  if (!initialData) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Create New Sitrep</DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return formContent;
}