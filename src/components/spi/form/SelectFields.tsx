import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DEPARTMENTS } from "@/lib/constants";
import { SPI } from "@/lib/types/spi";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { useEffect } from "react";

interface SelectFieldsProps {
  status: SPI['status'];
  setStatus: (value: SPI['status']) => void;
  selectedProject: string;
  setSelectedProject: (value: string) => void;
  selectedFortune30: string;
  setSelectedFortune30: (value: string) => void;
  selectedSME: string;
  setSelectedSME: (value: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (value: string) => void;
  projects?: any[];
  fortune30Partners?: any[];
}

export function SelectFields({
  status,
  setStatus,
  selectedProject,
  setSelectedProject,
  selectedFortune30,
  setSelectedFortune30,
  selectedSME,
  setSelectedSME,
  selectedDepartment,
  setSelectedDepartment,
  projects,
  fortune30Partners,
}: SelectFieldsProps) {
  const { data: smePartners = [] } = useQuery({
    queryKey: ['collaborators-sme'],
    queryFn: async () => {
      const smePartners = await db.getAllSMEPartners();
      if (smePartners && smePartners.length > 0) {
        return smePartners;
      }
      const allCollaborators = await db.getAllCollaborators();
      return allCollaborators.filter(c => c.type === 'sme');
    },
  });

  // Ensure initial value is set correctly
  useEffect(() => {
    if (selectedFortune30 === undefined) {
      setSelectedFortune30('none');
    }
  }, [selectedFortune30, setSelectedFortune30]);

  const handleFortune30Change = (value: string) => {
    setSelectedFortune30(value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value: SPI['status']) => setStatus(value)}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="on-track">On Track</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project">Related Project</Label>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger id="project">
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="fortune30">Fortune 30 Partner</Label>
        <Select 
          value={selectedFortune30 || 'none'} 
          onValueChange={handleFortune30Change}
        >
          <SelectTrigger id="fortune30">
            <SelectValue placeholder="Fortune 30 Partner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {fortune30Partners?.map(partner => (
              <SelectItem key={partner.id} value={partner.id}>
                {partner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sme">SME Partner</Label>
        <Select value={selectedSME} onValueChange={setSelectedSME}>
          <SelectTrigger id="sme">
            <SelectValue placeholder="SME Partner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {smePartners.map(partner => (
              <SelectItem key={partner.id} value={partner.id}>
                {partner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}