import { Card, CardContent } from "@/components/ui/card";
import WikiSection from "./WikiSection";
import { ComplianceChecklist } from "./ComplianceChecklist";

interface WikiContentProps {
  sections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  onSectionUpdate: (id: string, newContent: string) => void;
}

export function WikiContent({ sections, onSectionUpdate }: WikiContentProps) {
  return (
    <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.id} className="animate-fade-in">
            <CardContent className="pt-6">
              <WikiSection
                section={section}
                onSave={onSectionUpdate}
              />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="space-y-6">
        <ComplianceChecklist />
      </div>
    </div>
  );
}