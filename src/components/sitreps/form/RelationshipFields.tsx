import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPARTMENTS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

interface RelationshipFieldsProps {
  selectedProject: string;
  setSelectedProject: (id: string) => void;
  selectedFortune30: string;
  setSelectedFortune30: (id: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (id: string) => void;
  selectedPartner: string;
  setSelectedPartner: (id: string) => void;
  selectedSME: string;
  setSelectedSME: (id: string) => void;
  projects: any[];
  fortune30Partners: any[];
  filteredInternalPartners: any[];
}

export function RelationshipFields({
  selectedProject,
  setSelectedProject,
  selectedFortune30,
  setSelectedFortune30,
  selectedDepartment,
  setSelectedDepartment,
  selectedPartner,
  setSelectedPartner,
  selectedSME,
  setSelectedSME,
  projects,
  fortune30Partners,
  filteredInternalPartners,
}: RelationshipFieldsProps) {
  const { data: smePartners = [] } = useQuery({
    queryKey: ['collaborators-sme'],
    queryFn: () => db.getAllSMEPartners(),
  });

  return (
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
        <label className="block text-sm font-medium mb-2">SME Partner (Optional)</label>
        <Select value={selectedSME} onValueChange={setSelectedSME}>
          <SelectTrigger>
            <SelectValue placeholder="Select an SME partner" />
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
  );
}