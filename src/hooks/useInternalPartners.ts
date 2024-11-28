import { useState } from "react";
import { Collaborator } from "@/lib/types/collaboration";
import { DEPARTMENTS } from "@/lib/constants";

export function useInternalPartners(
  initialPartners: Collaborator[],
  onUpdate: (partners: Collaborator[]) => void
) {
  const [newPartnerName, setNewPartnerName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const handleAddPartner = () => {
    if (!newPartnerName || !selectedDepartment || initialPartners.length >= 5) return;

    const department = DEPARTMENTS.find(d => d.id === selectedDepartment);
    const newPartner: Collaborator = {
      id: `internal-${Date.now()}`,
      name: newPartnerName,
      email: `${newPartnerName.toLowerCase().replace(/\s+/g, '.')}@company.com`,
      role: "Internal Partner",
      department: selectedDepartment,
      projects: [],
      lastActive: new Date().toISOString(),
      type: "other",
      color: department?.color
    };

    onUpdate([...initialPartners, newPartner]);
    setNewPartnerName("");
    setSelectedDepartment("");
  };

  const handleRemovePartner = (partnerId: string) => {
    onUpdate(initialPartners.filter(p => p.id !== partnerId));
  };

  return {
    newPartnerName,
    setNewPartnerName,
    selectedDepartment,
    setSelectedDepartment,
    handleAddPartner,
    handleRemovePartner
  };
}