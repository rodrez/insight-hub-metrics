import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/db";
import { DEPARTMENTS } from "@/lib/constants";
import { internalPartners } from "@/components/data/internalPartners";
import { SitRepList } from "@/components/sitreps/SitRepList";
import { toast } from "@/components/ui/use-toast";

export default function SitReps() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [summary, setSummary] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedFortune30, setSelectedFortune30] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedPartner, setSelectedPartner] = useState<string>("");

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
        date: selectedDate?.toISOString() || new Date().toISOString(),
        summary,
        projectId: selectedProject,
        fortune30Id: selectedFortune30,
        departmentId: selectedDepartment,
        partnerId: selectedPartner
      });
      
      toast({
        title: "Success",
        description: "SitRep added successfully"
      });
      
      setSummary("");
      setSelectedProject("");
      setSelectedFortune30("");
      setSelectedDepartment("");
      setSelectedPartner("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add SitRep",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Situational Reports</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project (Optional)</label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {projects?.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Fortune 30 Partner (Optional)</label>
              <Select value={selectedFortune30} onValueChange={setSelectedFortune30}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Fortune 30 partner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {fortune30Partners.map(partner => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <Select value={selectedDepartment} onValueChange={(value) => {
                setSelectedDepartment(value);
                setSelectedPartner("");
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {DEPARTMENTS.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedDepartment && (
              <div>
                <label className="block text-sm font-medium mb-2">Internal Partner</label>
                <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an internal partner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {filteredInternalPartners.map(partner => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.name} - {partner.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Summary (100 words max)</label>
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Write your 3-sentence summary here..."
            className="h-32"
          />
        </div>

        <Button type="submit">Add SitRep</Button>
      </form>

      <SitRepList />
    </div>
  );
}