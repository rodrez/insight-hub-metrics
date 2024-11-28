import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPARTMENTS } from "@/lib/constants";
import { Collaborator } from "@/lib/types/collaboration";
import { X } from "lucide-react";
import { useInternalPartners } from "@/hooks/useInternalPartners";

interface InternalPartnersSectionProps {
  partners: Collaborator[];
  onUpdate: (partners: Collaborator[]) => void;
  isEditing: boolean;
}

export function InternalPartnersSection({
  partners,
  onUpdate,
  isEditing
}: InternalPartnersSectionProps) {
  const {
    newPartnerName,
    setNewPartnerName,
    selectedDepartment,
    setSelectedDepartment,
    handleAddPartner,
    handleRemovePartner
  } = useInternalPartners(partners, onUpdate);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Internal Partners</h3>
      <div className="flex flex-wrap gap-2">
        {partners.map((partner) => (
          <div key={partner.id} className="flex items-center gap-1">
            <Badge
              style={{ backgroundColor: partner.color }}
              className="text-white"
            >
              {partner.name}
            </Badge>
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => handleRemovePartner(partner.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {isEditing && partners.length < 5 && (
        <div className="flex gap-2">
          <Input
            placeholder="Partner name"
            value={newPartnerName}
            onChange={(e) => setNewPartnerName(e.target.value)}
            className="max-w-[200px]"
          />
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[180px]">
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
          <Button onClick={handleAddPartner}>Add</Button>
        </div>
      )}
    </div>
  );
}