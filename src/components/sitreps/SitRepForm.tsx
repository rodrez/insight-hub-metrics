import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { internalPartners } from "@/components/data/internalPartners";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { RelationshipFields } from "./form/RelationshipFields";
import { ContentFields } from "./form/ContentFields";

interface SitRepFormProps {
  onSubmitSuccess: () => void;
}

export function SitRepForm({ onSubmitSuccess }: SitRepFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [update, setUpdate] = useState("");
  const [challenges, setChallenges] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("none");
  const [selectedFortune30, setSelectedFortune30] = useState<string>("none");
  const [selectedSME, setSelectedSME] = useState<string>("none");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("none");
  const [selectedPartner, setSelectedPartner] = useState<string>("none");
  const [status, setStatus] = useState<'pending-review' | 'ready' | 'submitted'>('pending-review');
  const [level, setLevel] = useState<"CEO" | "SVP" | "CTO">("SVP");

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects()
  });

  const { data: collaborators } = useQuery({
    queryKey: ['collaborators'],
    queryFn: () => db.getAllCollaborators()
  });

  const fortune30Partners = collaborators?.filter(c => c.type === 'fortune30') || [];
  const filteredInternalPartners = internalPartners.filter(
    p => p.department === selectedDepartment
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (summary.length > 500) {
      toast({
        title: "Error",
        description: "Summary must be 100 words or less",
        variant: "destructive"
      });
      return;
    }

    try {
      await db.addSitRep({
        id: `sitrep-${Date.now()}`,
        title,
        date: selectedDate?.toISOString() || new Date().toISOString(),
        spiId: "temp-spi-id",
        update,
        challenges,
        nextSteps,
        status,
        level,
        summary,
        projectId: selectedProject !== "none" ? selectedProject : undefined,
        departmentId: selectedDepartment !== "none" ? selectedDepartment : "default",
        fortune30PartnerId: selectedFortune30 !== "none" ? selectedFortune30 : undefined,
        smePartnerId: selectedSME !== "none" ? selectedSME : undefined
      });
      
      toast({
        title: "Success",
        description: "SitRep added successfully"
      });
      
      // Reset form
      setTitle("");
      setSummary("");
      setUpdate("");
      setChallenges("");
      setNextSteps("");
      setSelectedProject("none");
      setSelectedFortune30("none");
      setSelectedSME("none");
      setSelectedDepartment("none");
      setSelectedPartner("none");
      setStatus('pending-review');
      setLevel("SVP");
      
      onSubmitSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add SitRep",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <Button type="submit">Add SitRep</Button>
    </form>
  );
}