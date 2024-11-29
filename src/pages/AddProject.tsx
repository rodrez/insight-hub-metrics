import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { DEPARTMENTS } from "@/lib/constants";
import { db } from "@/lib/db";
import { TechDomainSelect } from "@/components/projects/TechDomainSelect";
import { Textarea } from "@/components/ui/textarea";

export default function AddProject() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [poc, setPoc] = useState("");
  const [pocDepartment, setPocDepartment] = useState("");
  const [techLead, setTechLead] = useState("");
  const [techLeadDepartment, setTechLeadDepartment] = useState("");
  const [budget, setBudget] = useState("");
  const [techDomainId, setTechDomainId] = useState("");
  
  // NABC fields
  const [needs, setNeeds] = useState("");
  const [approach, setApproach] = useState("");
  const [benefits, setBenefits] = useState("");
  const [competition, setCompetition] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newProject = {
        id: `project-${Date.now()}`,
        name,
        poc,
        pocDepartment,
        techLead,
        techLeadDepartment,
        budget: Number(budget),
        spent: 0,
        status: 'active' as const,
        departmentId: pocDepartment,
        collaborators: [],
        techDomainId,
        nabc: {
          needs,
          approach,
          benefits,
          competition
        }
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
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="poc">Point of Contact</Label>
              <Input
                id="poc"
                value={poc}
                onChange={(e) => setPoc(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="pocDepartment">POC Department</Label>
              <Select value={pocDepartment} onValueChange={setPocDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="techLead">Tech Lead</Label>
              <Input
                id="techLead"
                value={techLead}
                onChange={(e) => setTechLead(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="techLeadDepartment">Tech Lead Department</Label>
              <Select value={techLeadDepartment} onValueChange={setTechLeadDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Tech Domain</Label>
              <TechDomainSelect
                value={techDomainId}
                onValueChange={setTechDomainId}
              />
            </div>

            <div className="space-y-4">
              <CardTitle className="text-lg">NABC Analysis</CardTitle>
              
              <div>
                <Label htmlFor="needs">Needs</Label>
                <Textarea
                  id="needs"
                  placeholder="What customer and market needs are being addressed?"
                  value={needs}
                  onChange={(e) => setNeeds(e.target.value)}
                  className="h-24"
                  required
                />
              </div>

              <div>
                <Label htmlFor="approach">Approach</Label>
                <Textarea
                  id="approach"
                  placeholder="How will these needs be met?"
                  value={approach}
                  onChange={(e) => setApproach(e.target.value)}
                  className="h-24"
                  required
                />
              </div>

              <div>
                <Label htmlFor="benefits">Benefits</Label>
                <Textarea
                  id="benefits"
                  placeholder="What are the quantifiable benefits?"
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  className="h-24"
                  required
                />
              </div>

              <div>
                <Label htmlFor="competition">Competition</Label>
                <Textarea
                  id="competition"
                  placeholder="How does this compare to competitive approaches?"
                  value={competition}
                  onChange={(e) => setCompetition(e.target.value)}
                  className="h-24"
                  required
                />
              </div>
            </div>

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