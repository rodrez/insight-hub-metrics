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
import { format } from "date-fns";

interface SPIEditFormProps {
  spi: SPI;
  onSuccess: () => void;
}

export function SPIEditForm({ spi, onSuccess }: SPIEditFormProps) {
  const [name, setName] = useState(spi.name);
  const [deliverable, setDeliverable] = useState(spi.deliverable);
  const [details, setDetails] = useState(spi.details || "");
  const [expectedDate, setExpectedDate] = useState<Date>(new Date(spi.expectedCompletionDate));
  const [status, setStatus] = useState<SPI['status']>(spi.status);
  const [selectedProject, setSelectedProject] = useState<string>(spi.projectId || "none");
  const [selectedFortune30, setSelectedFortune30] = useState<string>(spi.fortune30PartnerId || "none");
  const [selectedSME, setSelectedSME] = useState<string>(spi.smePartnerId || "none");
  const [selectedDepartment, setSelectedDepartment] = useState<string>(spi.departmentId);

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
      const updatedSPI: SPI = {
        ...spi,
        name,
        deliverable,
        details,
        expectedCompletionDate: expectedDate.toISOString(),
        status,
        projectId: selectedProject !== "none" ? selectedProject : undefined,
        departmentId: selectedDepartment !== "none" ? selectedDepartment : "default",
        smePartnerId: selectedSME !== "none" ? selectedSME : undefined,
        fortune30PartnerId: selectedFortune30 !== "none" ? selectedFortune30 : undefined,
      };

      await db.updateSPI(spi.id, updatedSPI);
      
      toast({
        title: "Success",
        description: "SPI updated successfully"
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update SPI",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              placeholder="SPI Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Deliverable</label>
            <Textarea
              placeholder="Deliverable"
              value={deliverable}
              onChange={(e) => setDeliverable(e.target.value)}
              className="h-32"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Details</label>
            <Textarea
              placeholder="Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="h-32"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Expected Completion Date</label>
            <div className="border rounded-md p-2">
              <Calendar
                mode="single"
                selected={expectedDate}
                onSelect={(date) => date && setExpectedDate(date)}
                className="rounded-md"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Current: {format(expectedDate, 'PPP')}
            </p>
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

      <Button type="submit">Update SPI</Button>
    </form>
  );
}