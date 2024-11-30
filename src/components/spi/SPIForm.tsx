import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/components/ui/use-toast";
import { SPI } from "@/lib/types/spi";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { SelectFields } from "./form/SelectFields";

interface SPIFormProps {
  onSubmitSuccess: () => void;
}

export function SPIForm({ onSubmitSuccess }: SPIFormProps) {
  const [name, setName] = useState("");
  const [deliverable, setDeliverable] = useState("");
  const [details, setDetails] = useState("");
  const [expectedDate, setExpectedDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState<SPI['status']>("on-track");
  const [selectedProject, setSelectedProject] = useState<string>("none");
  const [selectedFortune30, setSelectedFortune30] = useState<string>("none");
  const [selectedSME, setSelectedSME] = useState<string>("none");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("none");

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects()
  });

  const { data: collaborators } = useQuery({
    queryKey: ['collaborators'],
    queryFn: () => db.getAllCollaborators()
  });

  const fortune30Partners = collaborators?.filter(c => c.type === 'fortune30') || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !deliverable || !expectedDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const newSPI: SPI = {
        id: `spi-${Date.now()}`,
        name,
        deliverable,
        details,
        expectedCompletionDate: expectedDate.toISOString(),
        status: 'on-track',
        projectId: selectedProject !== "none" ? selectedProject : undefined,
        departmentId: selectedDepartment !== "none" ? selectedDepartment : "default",
        smePartnerId: selectedSME !== "none" ? selectedSME : undefined,
        sitrepIds: [],
        createdAt: new Date().toISOString()
      };

      await db.addSPI(newSPI);
      
      toast({
        title: "Success",
        description: "SPI added successfully"
      });
      
      // Reset form
      setName("");
      setDeliverable("");
      setDetails("");
      setExpectedDate(new Date());
      setStatus("on-track");
      setSelectedProject("none");
      setSelectedFortune30("none");
      setSelectedSME("none");
      setSelectedDepartment("none");
      
      onSubmitSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add SPI",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Input
            placeholder="SPI Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="Deliverable"
            value={deliverable}
            onChange={(e) => setDeliverable(e.target.value)}
            className="h-32"
          />
          <Textarea
            placeholder="Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="h-32"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Expected Completion Date</label>
            <Calendar
              mode="single"
              selected={expectedDate}
              onSelect={setExpectedDate}
              className="rounded-md border"
            />
          </div>
        </div>
      </div>

      <SelectFields
        status={status}
        setStatus={setStatus}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        selectedFortune30={selectedFortune30}
        setSelectedFortune30={setSelectedFortune30}
        selectedSME={selectedSME}
        setSelectedSME={setSelectedSME}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        projects={projects}
        fortune30Partners={fortune30Partners}
      />

      <Button type="submit">Add SPI</Button>
    </form>
  );
}