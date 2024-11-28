import { Collaborator } from '@/lib/types/collaboration';
import { Department } from '@/lib/types';

// Track used names across all projects
const usedNames = new Set<string>();

export const clearUsedNames = () => {
  usedNames.clear();
};

export const assignCollaborators = (
  dept: Department,
  internalPartners: Collaborator[],
  fortune30Partners: Collaborator[]
) => {
  const deptPartners = internalPartners.filter(p => p.department === dept.id);
  
  if (deptPartners.length === 0) {
    console.warn(`No available partners for department ${dept.id}`);
    return null;
  }

  // Select POC from current department's partners
  const pocIndex = Math.floor(Math.random() * deptPartners.length);
  const pocPartner = deptPartners[pocIndex];
  
  if (!pocPartner) {
    console.warn(`No available POC partner for department ${dept.id}`);
    return null;
  }

  usedNames.add(pocPartner.name);
  
  // Select Tech Lead from partners not in usedNames
  const availableTechLeads = internalPartners.filter(p => 
    p.department !== dept.id && !usedNames.has(p.name)
  );

  if (availableTechLeads.length === 0) {
    console.warn(`No available Tech Lead for project in department ${dept.id}`);
    return null;
  }

  const techLeadIndex = Math.floor(Math.random() * availableTechLeads.length);
  const techLeadPartner = availableTechLeads[techLeadIndex];
  usedNames.add(techLeadPartner.name);
  
  // Select random internal partners
  const remainingPartners = internalPartners.filter(p => 
    !usedNames.has(p.name) && 
    p.id !== pocPartner.id && 
    p.id !== techLeadPartner.id
  );

  const selectedPartners = remainingPartners
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(3, remainingPartners.length));

  selectedPartners.forEach(partner => usedNames.add(partner.name));

  return {
    poc: pocPartner,
    techLead: techLeadPartner,
    internalPartners: selectedPartners,
    fortune30Partner: fortune30Partners[Math.floor(Math.random() * fortune30Partners.length)]
  };
};