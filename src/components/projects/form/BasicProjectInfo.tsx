import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEPARTMENTS } from "@/lib/constants";

interface BasicProjectInfoProps {
  name: string;
  setName: (value: string) => void;
  poc: string;
  setPoc: (value: string) => void;
  pocDepartment: string;
  setPocDepartment: (value: string) => void;
  techLead: string;
  setTechLead: (value: string) => void;
  techLeadDepartment: string;
  setTechLeadDepartment: (value: string) => void;
  budget: string;
  setBudget: (value: string) => void;
  ratMember: string;
  setRatMember: (value: string) => void;
}

const ORG_MEMBERS = [
  "Sarah Johnson",
  "Michael Chen",
  "Emily Rodriguez",
  "David Kim",
  "James Wilson",
  "Maria Garcia",
  "Robert Taylor"
];

export function BasicProjectInfo({
  name,
  setName,
  poc,
  setPoc,
  pocDepartment,
  setPocDepartment,
  techLead,
  setTechLead,
  techLeadDepartment,
  setTechLeadDepartment,
  budget,
  setBudget,
  ratMember,
  setRatMember
}: BasicProjectInfoProps) {
  return (
    <div className="space-y-4">
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
        <Label htmlFor="ratMember">RAT Member</Label>
        <Select value={ratMember} onValueChange={setRatMember}>
          <SelectTrigger>
            <SelectValue placeholder="Select RAT member" />
          </SelectTrigger>
          <SelectContent>
            {ORG_MEMBERS.map((member) => (
              <SelectItem key={member} value={member}>
                {member}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
    </div>
  );
}