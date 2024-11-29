import { Project } from '@/lib/types';
import { ProjectPartnerBadge } from './ProjectPartnerBadge';

interface ProjectCardPartnersProps {
  project: Project;
  getDepartmentColor: (departmentId: string) => string;
}

export function ProjectCardPartners({ project, getDepartmentColor }: ProjectCardPartnersProps) {
  // Get unique collaborators
  const uniqueCollaborators = Array.from(
    new Set(
      project.collaborators
        .filter(collab => collab.type === 'fortune30')
        .map(collab => collab.id)
    )
  ).map(id => project.collaborators.find(collab => collab.id === id)!);

  // Get SME collaborators
  const smeCollaborators = project.collaborators.filter(collab => collab.type === 'sme');

  // Create a Set of already displayed people (POC and Tech Lead)
  const displayedPeople = new Set([project.poc, project.techLead]);

  // Filter internal partners to exclude POC and Tech Lead
  const uniqueInternalPartners = Array.from(
    new Set(
      (project.internalPartners || [])
        .filter(partner => !displayedPeople.has(partner.name))
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
              partner={collab}
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
              partner={partner}
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
                partner={sme}
                departmentColor={getDepartmentColor(sme.department)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}