import { Project } from '@/lib/types';
import { ProjectPartnerBadge } from './ProjectPartnerBadge';
import { CollaboratorType } from '@/lib/types/collaboration';

interface ProjectCardPartnersProps {
  project: Project;
  getDepartmentColor: (departmentId: string) => string;
}

export function ProjectCardPartners({ project, getDepartmentColor }: ProjectCardPartnersProps) {
  const uniqueCollaborators = Array.from(
    new Set(
      project.collaborators
        .filter(collab => collab.type === 'fortune30')
        .map(collab => collab.id)
    )
  ).map(id => project.collaborators.find(collab => collab.id === id)!);

  const smeCollaborators = project.collaborators.filter(collab => collab.type === 'sme');

  const displayedPeople = new Set([project.poc, project.techLead]);

  const uniqueInternalPartners = Array.from(
    new Set(
      (project.internalPartners || [])
        .filter(partner => !displayedPeople.has(partner.name) && partner.type === 'internal')
        .map(partner => partner.id)
    )
  ).map(id => project.internalPartners?.find(partner => partner.id === id)!);

  return (
    <div className="space-y-2">
      <div>
        <div className="text-sm text-muted-foreground mb-1">Fortune 30 Partners:</div>
        <div className="flex flex-wrap gap-2">
          {uniqueCollaborators.map((collab) => (
            <ProjectPartnerBadge 
              key={`${project.id}-${collab.id}`}
              partner={{
                id: collab.id,
                name: collab.name,
                type: collab.type as CollaboratorType,
                department: collab.department
              }}
              departmentColor={getDepartmentColor(collab.department)}
            />
          ))}
        </div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground mb-1">Internal Partners:</div>
        <div className="flex flex-wrap gap-2">
          {uniqueInternalPartners.map((partner) => (
            <ProjectPartnerBadge 
              key={`${project.id}-${partner.id}`}
              partner={{
                id: partner.id,
                name: partner.name,
                type: partner.type as CollaboratorType,
                department: partner.department
              }}
              departmentColor={getDepartmentColor(partner.department)}
            />
          ))}
        </div>
      </div>
      {smeCollaborators.length > 0 && (
        <div>
          <div className="text-sm text-muted-foreground mb-1">Subject Matter Experts:</div>
          <div className="flex flex-wrap gap-2">
            {smeCollaborators.map((sme) => (
              <ProjectPartnerBadge 
                key={`${project.id}-${sme.id}`}
                partner={{
                  id: sme.id,
                  name: sme.name,
                  type: sme.type as CollaboratorType,
                  department: sme.department
                }}
                departmentColor={getDepartmentColor(sme.department)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}