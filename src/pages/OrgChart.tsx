import { Network } from "lucide-react";
import { OrgPositionCard } from "@/components/org-chart/OrgPositionCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrgChartConnector } from "@/components/org-chart/OrgChartConnector";
import { useRef, useEffect, useState } from "react";

interface Position {
  x: number;
  y: number;
}

interface ConnectionPoint {
  id: string;
  position: Position;
}

export default function OrgChart() {
  const [connections, setConnections] = useState<ConnectionPoint[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateConnections = () => {
      const elements = document.querySelectorAll('[data-org-position]');
      const newConnections: ConnectionPoint[] = [];

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        
        if (containerRect) {
          newConnections.push({
            id: el.getAttribute('data-org-position') || '',
            position: {
              x: rect.left - containerRect.left + rect.width / 2,
              y: rect.top - containerRect.top + rect.height
            }
          });
        }
      });

      setConnections(newConnections);
    };

    updateConnections();
    window.addEventListener('resize', updateConnections);
    return () => window.removeEventListener('resize', updateConnections);
  }, []);

  const getConnectionPoint = (id: string) => 
    connections.find(c => c.id === id)?.position;

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-2 mb-8">
        <Network className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Organization Chart</h1>
      </div>
      
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="relative" ref={containerRef}>
          {/* Director Level */}
          <div className="flex justify-center mb-24">
            <div data-org-position="director">
              <OrgPositionCard 
                title="Director of Retail Innovation" 
                name="Sarah Johnson"
                width="w-[480px]"
              />
            </div>
          </div>

          {/* Senior Manager Level */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            <div data-org-position="senior-tech">
              <OrgPositionCard
                title="Senior Manager of Technology"
                name="Michael Chen"
                width="w-full"
              />
            </div>
            <div data-org-position="senior-rd">
              <OrgPositionCard
                title="Senior Manager of R&D"
                name="Emily Rodriguez"
                width="w-full"
              />
            </div>
            <div data-org-position="senior-software">
              <OrgPositionCard
                title="Senior Manager of Software"
                name="David Kim"
                width="w-full"
              />
            </div>
          </div>

          {/* Tech Lead Level */}
          <div className="grid md:grid-cols-3 gap-6">
            <div data-org-position="tech-ai">
              <OrgPositionCard
                title="Tech Lead of AI/ML"
                name="James Wilson"
                width="w-full"
              />
            </div>
            <div data-org-position="tech-analytics">
              <OrgPositionCard
                title="Tech Lead of Analytics"
                name="Maria Garcia"
                width="w-full"
              />
            </div>
            <div data-org-position="tech-infra">
              <OrgPositionCard
                title="Tech Lead of Infrastructure"
                name="Robert Taylor"
                width="w-full"
              />
            </div>
          </div>

          {/* Connectors */}
          {connections.length > 0 && getConnectionPoint('director') && (
            <>
              {/* Director to Senior Managers */}
              {['senior-tech', 'senior-rd', 'senior-software'].map((id) => {
                const fromPos = getConnectionPoint('director');
                const toPos = getConnectionPoint(id);
                if (fromPos && toPos) {
                  return (
                    <OrgChartConnector
                      key={`director-${id}`}
                      from={fromPos}
                      to={{ ...toPos, y: toPos.y - 180 }}
                    />
                  );
                }
                return null;
              })}

              {/* Senior Managers to Tech Leads */}
              {[
                ['senior-tech', 'tech-ai'],
                ['senior-rd', 'tech-analytics'],
                ['senior-software', 'tech-infra']
              ].map(([fromId, toId]) => {
                const fromPos = getConnectionPoint(fromId);
                const toPos = getConnectionPoint(toId);
                if (fromPos && toPos) {
                  return (
                    <OrgChartConnector
                      key={`${fromId}-${toId}`}
                      from={fromPos}
                      to={{ ...toPos, y: toPos.y - 180 }}
                    />
                  );
                }
                return null;
              })}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}