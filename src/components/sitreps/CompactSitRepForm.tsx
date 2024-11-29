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
import { POCFields } from "./form/POCFields";
import { Contact } from "@/components/wiki/types/contact";

interface CompactSitRepFormProps {
  onSubmitSuccess: () => void;
  initialData?: SitRep;
}

export function CompactSitRepForm({ onSubmitSuccess, initialData }: CompactSitRepFormProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
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
  const [selectedDepartment, setSelectedDepartment] = useState<string>(initialData?.departmentId || "none");
  const [selectedPartner, setSelectedPartner] = useState<string>("none");
  const [status, setStatus] = useState<'pending-review' | 'ready' | 'submitted'>(
    initialData?.status || 'pending-review'
  );
  const [level, setLevel] = useState<"CEO" | "SVP" | "CTO">(
    initialData?.level || "SVP"
  );
  const [supportingTeams, setSupportingTeams] = useState<string[]>(initialData?.teams || []);
  const [contacts, setContacts] = useState<Contact[]>(
    initialData?.pointsOfContact?.map(poc => ({
      name: poc,
      role: "",
      email: "",
      phone: "",
    })) || []
  );

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects()
  });

  const { data: collaborators } = useQuery({
    queryKey: ['collaborators'],
    queryFn: () => db.getAllCollaborators()
  });

  const fortune30Partners = collaborators?.filter(c => c.type === 'fortune30') || [];
  const filteredInternalPartners = [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !summary) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
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
        departmentId: selectedDepartment !== "none" ? selectedDepartment : undefined,
        fortune30PartnerId: selectedFortune30 !== "none" ? selectedFortune30 : undefined,
        smePartnerId: selectedSME !== "none" ? selectedSME : undefined,
        teams: supportingTeams,
        pointsOfContact: contacts.map(c => c.name)
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
      
      if (!initialData) {
        setOpen(false);
      }
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
          <div className="grid gap-6 md:grid-cols-2">
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
            
            <RelationshipFields
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              selectedFortune30={selectedFortune30}
              setSelectedFortune30={setSelectedFortune30}
              selectedSME={selectedSME}
              setSelectedSME={setSelectedSME}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              selectedPartner={selectedPartner}
              setSelectedPartner={setSelectedPartner}
              projects={projects || []}
              fortune30Partners={fortune30Partners}
              filteredInternalPartners={filteredInternalPartners}
            />
          </div>

          <DepartmentFields
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            supportingTeams={supportingTeams}
            setSupportingTeams={setSupportingTeams}
          />

          <POCFields
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

      <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100">
        {initialData ? "Update Sitrep" : "Create Sitrep"}
      </Button>
    </form>
  );

  if (!initialData) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] p-6 bg-[#1A1F2C] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              {initialData ? "Edit Sitrep" : "Create New Sitrep"}
            </DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return formContent;
}
