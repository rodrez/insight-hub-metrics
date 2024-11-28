import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { SPI } from "@/lib/types/spi";
import { scrollToProject } from "@/utils/scrollUtils";
import { useNavigate } from "react-router-dom";

export default function SPIPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [goals, setGoals] = useState("");
  const [expectedDate, setExpectedDate] = useState<Date | undefined>(new Date());
  const [actualDate, setActualDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<SPI['status']>("on-track");
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

  const { data: spis } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  const { data: sitreps } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
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
        projectId: selectedProject || undefined,
        fortune30Id: selectedFortune30 || undefined,
        departmentId: selectedDepartment || undefined,
        internalPartnerId: selectedPartner || undefined,
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
      setSelectedProject("");
      setSelectedFortune30("");
      setSelectedDepartment("");
      setSelectedPartner("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add SPI",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: SPI['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'delayed':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const viewSitrep = (sitrepId: string) => {
    navigate('/sitreps', { state: { highlightId: sitrepId } });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Schedule Performance Index</h1>
      
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
              <SelectItem value="">None</SelectItem>
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
              <SelectItem value="">None</SelectItem>
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
              <SelectItem value="">None</SelectItem>
              {/* Add department options */}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit">Add SPI</Button>
      </form>

      <div className="grid gap-6">
        {spis?.map((spi) => (
          <Card key={spi.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{spi.name}</CardTitle>
                <Badge className={getStatusColor(spi.status)}>
                  {spi.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Goals</h4>
                  <p className="text-sm text-muted-foreground">{spi.goals}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Dates</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Expected: </span>
                      {format(new Date(spi.expectedCompletionDate), 'PPP')}
                    </p>
                    {spi.actualCompletionDate && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Actual: </span>
                        {format(new Date(spi.actualCompletionDate), 'PPP')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {spi.sitrepIds.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Related SitReps</h4>
                  <div className="flex gap-2">
                    {spi.sitrepIds.map(sitrepId => {
                      const sitrep = sitreps?.find(s => s.id === sitrepId);
                      return sitrep ? (
                        <Button
                          key={sitrepId}
                          variant="outline"
                          size="sm"
                          onClick={() => viewSitrep(sitrepId)}
                        >
                          {format(new Date(sitrep.date), 'PP')}
                        </Button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}