import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { SPI } from "@/lib/types/spi";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

interface SPIFormProps {
  onSubmitSuccess: () => void;
}

export function SPIForm({ onSubmitSuccess }: SPIFormProps) {
  const [name, setName] = useState("");
  const [goals, setGoals] = useState("");
  const [expectedDate, setExpectedDate] = useState<Date | undefined>(new Date());
  const [actualDate, setActualDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<SPI['status']>("on-track");
  const [selectedProject, setSelectedProject] = useState<string>("none");
  const [selectedFortune30, setSelectedFortune30] = useState<string>("none");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("none");
  const [selectedPartner, setSelectedPartner] = useState<string>("none");

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
    if (!name || !goals || !expectedDate) {
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
        goals,
        expectedCompletionDate: expectedDate.toISOString(),
        actualCompletionDate: actualDate?.toISOString(),
        status,
        projectId: selectedProject !== "none" ? selectedProject : undefined,
        fortune30Id: selectedFortune30 !== "none" ? selectedFortune30 : undefined,
        departmentId: selectedDepartment !== "none" ? selectedDepartment : undefined,
        internalPartnerId: selectedPartner !== "none" ? selectedPartner : undefined,
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
      setGoals("");
      setExpectedDate(new Date());
      setActualDate(undefined);
      setStatus("on-track");
      setSelectedProject("none");
      setSelectedFortune30("none");
      setSelectedDepartment("none");
      setSelectedPartner("none");
      
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
            placeholder="Goals"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
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

          <div>
            <label className="block text-sm font-medium mb-2">Actual Completion Date (Optional)</label>
            <Calendar
              mode="single"
              selected={actualDate}
              onSelect={setActualDate}
              className="rounded-md border"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Select value={status} onValueChange={(value: SPI['status']) => setStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="on-track">On Track</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger>
            <SelectValue placeholder="Related Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {projects?.map(project => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedFortune30} onValueChange={setSelectedFortune30}>
          <SelectTrigger>
            <SelectValue placeholder="Fortune 30 Partner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {fortune30Partners.map(partner => (
              <SelectItem key={partner.id} value={partner.id}>
                {partner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger>
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {/* Add department options */}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit">Add SPI</Button>
    </form>
  );
}