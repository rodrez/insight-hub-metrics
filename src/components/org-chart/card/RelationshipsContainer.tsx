import { RelationshipSection } from "./RelationshipSection";

interface RelationshipsContainerProps {
  fortune30Partners: any[];
  smePartners: any[];
  projects: any[];
  spis: any[];
  sitreps: any[];
  onItemClick: (type: string, id: string) => void;
  getDepartmentColor: (departmentId: string) => string;
}

export function RelationshipsContainer({
  fortune30Partners,
  smePartners,
  projects,
  spis,
  sitreps,
  onItemClick,
  getDepartmentColor
}: RelationshipsContainerProps) {
  return (
    <div className="space-y-4">
      {fortune30Partners && fortune30Partners.length > 0 && (
        <RelationshipSection
          title="Fortune 30 Partners"
          items={fortune30Partners}
          onItemClick={(id) => onItemClick('fortune30', id)}
          color="#8B5CF6"
          getDepartmentColor={getDepartmentColor}
        />
      )}

      {smePartners && smePartners.length > 0 && (
        <RelationshipSection
          title="SME Partners"
          items={smePartners}
          onItemClick={(id) => onItemClick('sme', id)}
          color="#6E59A5"
          getDepartmentColor={getDepartmentColor}
        />
      )}

      {projects && projects.length > 0 && (
        <RelationshipSection
          title="Projects"
          items={projects}
          onItemClick={(id) => onItemClick('project', id)}
          color="#4B5563"
          getDepartmentColor={getDepartmentColor}
        />
      )}

      {spis && spis.length > 0 && (
        <RelationshipSection
          title="SPIs"
          items={spis}
          onItemClick={(id) => onItemClick('spi', id)}
          badgeClassName="bg-emerald-500 hover:bg-emerald-600"
          getDepartmentColor={getDepartmentColor}
        />
      )}

      {sitreps && sitreps.length > 0 && (
        <RelationshipSection
          title="SitReps"
          items={sitreps}
          onItemClick={(id) => onItemClick('sitrep', id)}
          badgeClassName="bg-blue-500 hover:bg-blue-600"
          getDepartmentColor={getDepartmentColor}
        />
      )}
    </div>
  );
}