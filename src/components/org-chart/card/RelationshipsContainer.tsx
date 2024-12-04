import { RelationshipSection } from "./RelationshipSection";

interface RelationshipsContainerProps {
  fortune30Partners: any[];
  smePartners: any[];
  projects: any[];
  spis: any[];
  sitreps: any[];
  onItemClick: (type: string, id: string) => void;
}

export function RelationshipsContainer({
  fortune30Partners,
  smePartners,
  projects,
  spis,
  sitreps,
  onItemClick
}: RelationshipsContainerProps) {
  console.log('RelationshipsContainer received:', {
    fortune30Partners,
    smePartners,
    projects,
    spis,
    sitreps
  });

  return (
    <div className="space-y-4">
      {fortune30Partners.length > 0 && (
        <RelationshipSection
          title="Fortune 30 Partners"
          items={fortune30Partners}
          onItemClick={(id) => onItemClick('fortune30', id)}
          color="#8B5CF6"
        />
      )}

      {smePartners.length > 0 && (
        <RelationshipSection
          title="SME Partners"
          items={smePartners}
          onItemClick={(id) => onItemClick('sme', id)}
          color="#6E59A5"
        />
      )}

      {projects.length > 0 && (
        <RelationshipSection
          title="Projects"
          items={projects}
          onItemClick={(id) => onItemClick('project', id)}
          color="#4B5563"
        />
      )}

      {spis.length > 0 && (
        <RelationshipSection
          title="SPIs"
          items={spis}
          onItemClick={(id) => onItemClick('spi', id)}
          badgeClassName="bg-emerald-500 hover:bg-emerald-600"
        />
      )}

      {sitreps.length > 0 && (
        <RelationshipSection
          title="SitReps"
          items={sitreps}
          onItemClick={(id) => onItemClick('sitrep', id)}
          badgeClassName="bg-blue-500 hover:bg-blue-600"
        />
      )}
    </div>
  );
}