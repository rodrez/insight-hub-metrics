import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";

interface OrgPosition {
  id: string;
  title: string;
  projects: string[];
  fortune30Partners: string[];
  smePartners: string[];
  spis: string[];
  sitreps: string[];
}

interface OrgPositionCardProps {
  title: string;
  width?: string;
}

export function OrgPositionCard({ title, width = "w-96" }: OrgPositionCardProps) {
  const [position, setPosition] = useState<OrgPosition>({
    id: crypto.randomUUID(),
    title,
    projects: [],
    fortune30Partners: [],
    smePartners: [],
    spis: [],
    sitreps: []
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects()
  });

  const { data: fortune30Partners = [] } = useQuery({
    queryKey: ['collaborators-fortune30'],
    queryFn: async () => {
      const allCollaborators = await db.getAllCollaborators();
      return allCollaborators.filter(c => c.type === 'fortune30');
    }
  });

  const { data: smePartners = [] } = useQuery({
    queryKey: ['sme-partners'],
    queryFn: () => db.getAllSMEPartners()
  });

  const { data: spis = [] } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  const { data: sitreps = [] } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

  const handleAdd = (type: keyof OrgPosition, value: string) => {
    if (Array.isArray(position[type]) && !position[type].includes(value)) {
      setPosition(prev => ({
        ...prev,
        [type]: [...prev[type], value]
      }));
      toast({
        title: "Added Successfully",
        description: `Added new ${type.replace(/([A-Z])/g, ' $1').toLowerCase()} relationship`
      });
    }
  };

  const handleRemove = (type: keyof OrgPosition, value: string) => {
    if (Array.isArray(position[type])) {
      setPosition(prev => ({
        ...prev,
        [type]: prev[type].filter(item => item !== value)
      }));
    }
  };

  const renderSelectionSection = (
    type: keyof OrgPosition,
    items: any[],
    getLabel: (item: any) => string,
    getValue: (item: any) => string
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Select
          onValueChange={(value) => handleAdd(type, value)}
          value=""
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Select ${type.replace(/([A-Z])/g, ' $1').toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {items.map(item => (
              <SelectItem key={getValue(item)} value={getValue(item)}>
                {getLabel(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap gap-2">
        {position[type].map(itemId => {
          const item = items.find(i => getValue(i) === itemId);
          return item ? (
            <Badge
              key={itemId}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {getLabel(item)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRemove(type, itemId)}
              />
            </Badge>
          ) : null;
        })}
      </div>
    </div>
  );

  return (
    <Card className={`${width} p-6 shadow-lg animate-fade-in`}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Projects</h3>
          {renderSelectionSection(
            'projects',
            projects,
            (project) => project.name,
            (project) => project.id
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Fortune 30 Partners</h3>
          {renderSelectionSection(
            'fortune30Partners',
            fortune30Partners,
            (partner) => partner.name,
            (partner) => partner.id
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">SME Partners</h3>
          {renderSelectionSection(
            'smePartners',
            smePartners,
            (partner) => partner.name,
            (partner) => partner.id
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">SPIs</h3>
          {renderSelectionSection(
            'spis',
            spis,
            (spi) => spi.name,
            (spi) => spi.id
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">SitReps</h3>
          {renderSelectionSection(
            'sitreps',
            sitreps,
            (sitrep) => sitrep.title,
            (sitrep) => sitrep.id
          )}
        </div>
      </div>
    </Card>
  );
}