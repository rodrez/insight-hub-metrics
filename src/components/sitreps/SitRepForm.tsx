import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { DEPARTMENTS } from "@/lib/constants";
import { internalPartners } from "@/components/data/internalPartners";

interface SitRepFormProps {
  onSubmitSuccess: () => void;
}

export function SitRepForm({ onSubmitSuccess }: SitRepFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [update, setUpdate] = useState("");
  const [challenges, setChallenges] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("none");
  const [selectedFortune30, setSelectedFortune30] = useState<string>("none");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("none");
  const [selectedPartner, setSelectedPartner] = useState<string>("none");
  const [status, setStatus] = useState<'on-track' | 'at-risk'>('on-track');

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
        summary,
        projectId: selectedProject !== "none" ? selectedProject : undefined,
        fortune30Id: selectedFortune30 !== "none" ? selectedFortune30 : undefined,
        departmentId: selectedDepartment !== "none" ? selectedDepartment : undefined,
        partnerId: selectedPartner !== "none" ? selectedPartner : undefined
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
      setSelectedDepartment("none");
      setSelectedPartner("none");
      setStatus('on-track');
      
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
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter sitrep title"
              required
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
                <SelectItem value="none">None</SelectItem>
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
                <SelectItem value="none">None</SelectItem>
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
              setSelectedPartner("none");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {DEPARTMENTS.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select value={status} onValueChange={(value: 'on-track' | 'at-risk') => setStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on-track">On Track</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedDepartment !== "none" && (
            <div>
              <label className="block text-sm font-medium mb-2">Internal Partner</label>
              <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an internal partner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
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
          placeholder="Write your summary here..."
          className="h-32"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Update</label>
        <Textarea
          value={update}
          onChange={(e) => setUpdate(e.target.value)}
          placeholder="Write your update here..."
          className="h-32"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Challenges</label>
        <Textarea
          value={challenges}
          onChange={(e) => setChallenges(e.target.value)}
          placeholder="Write your challenges here..."
          className="h-32"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Next Steps</label>
        <Textarea
          value={nextSteps}
          onChange={(e) => setNextSteps(e.target.value)}
          placeholder="Write your next steps here..."
          className="h-32"
        />
      </div>

      <Button type="submit">Add SitRep</Button>
    </form>
  );
}
