import { Project } from '@/lib/types';
import { ProjectPartnerBadge } from './ProjectPartnerBadge';
import { CollaboratorType } from '@/lib/types/collaboration';

interface ProjectCardPartnersProps {
  project: Project;
  getDepartmentColor: (departmentId: string) => string;
}

export function ProjectCardPartners({ project, getDepartmentColor }: ProjectCardPartnersProps) {
  // Get unique Fortune 30 partners
  const fortune30Partners = project.collaborators.filter(
    collab => collab.type === 'fortune30'
  );

  // Get unique internal partners
  const internalPartners = (project.internalPartners || []).filter(
    partner => partner.type === 'internal'
  );

  // Get SME partners
  const smePartners = project.collaborators.filter(
    collab => collab.type === 'sme'
  );

  const renderPartnerSection = (
    title: string,
    partners: Array<{ id: string; name: string; type: CollaboratorType; department: string }>,
    emptyMessage: string
  ) => (
    <div>
      <div className="text-sm text-muted-foreground mb-1">{title}:</div>
      <div className="flex flex-wrap gap-2">
        {partners.length > 0 ? (
          partners.map((partner) => (
            <ProjectPartnerBadge 
              key={`${project.id}-${partner.id}`}
              partner={partner}
              departmentColor={getDepartmentColor(partner.department)}
            />
          ))
        ) : (
          <span className="text-sm text-muted-foreground">{emptyMessage}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      {renderPartnerSection(
        'Fortune 30 Partners',
        fortune30Partners,
        'No Fortune 30 partners assigned'
      )}
      
      {renderPartnerSection(
        'Internal Partners',
        internalPartners,
        'No internal partners assigned'
      )}
      
      {renderPartnerSection(
        'Small Medium Enterprises',
        smePartners,
        'No SME partners assigned'
      )}
    </div>
  );
}