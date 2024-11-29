import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { SitRep } from "@/lib/types/sitrep";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { RelationshipFields } from "./form/RelationshipFields";
import { ContentFields } from "./form/ContentFields";

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
  const [selectedDepartment, setSelectedDepartment] = useState<string>(initialData?.departmentId || "none");
  const [selectedPartner, setSelectedPartner] = useState<string>("none");
  const [status, setStatus] = useState<'pending-review' | 'ready' | 'submitted'>(
    initialData?.status || 'pending-review'
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
        summary,
        projectId: selectedProject !== "none" ? selectedProject : undefined,
        departmentId: selectedDepartment !== "none" ? selectedDepartment : undefined,
        fortune30PartnerId: selectedFortune30 !== "none" ? selectedFortune30 : undefined
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
      <div className="grid gap-6 md:grid-cols-2">
        <BasicInfoFields
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          title={title}
          setTitle={setTitle}
          status={status}
          setStatus={setStatus}
        />
        
        <RelationshipFields
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          selectedFortune30={selectedFortune30}
          setSelectedFortune30={setSelectedFortune30}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedPartner={selectedPartner}
          setSelectedPartner={setSelectedPartner}
          projects={projects || []}
          fortune30Partners={fortune30Partners}
          filteredInternalPartners={filteredInternalPartners}
        />
      </div>

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

      <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100">
        {initialData ? "Update Sitrep" : "Create Sitrep"}
      </Button>
    </form>
  );

  // For new sitrep creation, wrap in Dialog
  if (!initialData) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] w-[95vw] bg-[#1A1F2C] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Create New Sitrep
            </DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  // For editing, return just the form
  return formContent;
}