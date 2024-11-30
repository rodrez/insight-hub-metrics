import { Contact } from "@/lib/types/pointOfContact";
import { DEPARTMENTS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface TeamPOCFieldsProps {
  teamId: string;
  onPOCSelect: (teamId: string, contact: Contact) => void;
  selectedPOC?: Contact;
}

export function TeamPOCFields({ teamId, onPOCSelect, selectedPOC }: TeamPOCFieldsProps) {
  const { data: internalPartners = [] } = useQuery({
    queryKey: ['collaborators-internal'],
    queryFn: async () => {
      const allCollaborators = await db.getAllCollaborators();
      return allCollaborators.filter(c => c.type === 'internal');
    },
  });

  const teamPartners = internalPartners.filter(p => p.department === teamId);

  if (teamPartners.length === 0) {
    toast({
      title: "No POCs Available",
      description: `No points of contact found for ${DEPARTMENTS.find(d => d.id === teamId)?.name}`,
      variant: "destructive"
    });
    return null;
  }

  return (
    <div className="space-y-2">
      <Label>Team POC - {DEPARTMENTS.find(d => d.id === teamId)?.name}</Label>
      <Select
        value={selectedPOC?.name}
        onValueChange={(value) => {
          const partner = internalPartners.find(p => p.name === value);
          if (partner) {
            onPOCSelect(teamId, {
              name: partner.name,
              title: partner.role || "",
              email: partner.email || "",
              department: partner.department
            });
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select POC" />
        </SelectTrigger>
        <SelectContent>
          {teamPartners.map((partner) => (
            <SelectItem key={partner.id} value={partner.name}>
              {partner.name} ({partner.role})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}