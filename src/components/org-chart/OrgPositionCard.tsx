import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RelationshipSelectionDialog } from "./RelationshipSelectionDialog";
import { RelationshipDisplay } from "./RelationshipDisplay";
import { OrgPosition } from "./types";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { getRatMemberInfo } from "@/lib/services/data/utils/ratMemberUtils";

interface OrgPositionCardProps {
  title: string;
  name: string;
  width?: string;
}

export function OrgPositionCard({ title, name, width = "w-96" }: OrgPositionCardProps) {
  const memberInfo = getRatMemberInfo(name);

  // Fetch Fortune 30 partners where this person is the RAT member
  const { data: fortune30Partners = [] } = useQuery({
    queryKey: ['fortune30-partners', name],
    queryFn: async () => {
      const allCollaborators = await db.getAllCollaborators();
      return allCollaborators.filter(c => 
        c.type === 'fortune30' && 
        c.ratMember === name
      );
    }
  });

  // Fetch projects where this person is the RAT member
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', name],
    queryFn: async () => {
      const allProjects = await db.getAllProjects();
      return allProjects.filter(p => p.ratMember === name);
    }
  });

  // Fetch SPIs where this person is the RAT member
  const { data: spis = [] } = useQuery({
    queryKey: ['spis', name],
    queryFn: async () => {
      const allSpis = await db.getAllSPIs();
      return allSpis.filter(spi => spi.ratMember === name);
    }
  });

  // Fetch SitReps where this person is the RAT member
  const { data: sitreps = [] } = useQuery({
    queryKey: ['sitreps', name],
    queryFn: async () => {
      const allSitreps = await db.getAllSitReps();
      return allSitreps.filter(sitrep => sitrep.ratMember === name);
    }
  });

  return (
    <Card className={`${width} p-6 space-y-4 bg-card/50 backdrop-blur-sm border-muted`}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{name}</p>
          {memberInfo?.expertise && (
            <Badge variant="secondary" className="mt-2">
              {memberInfo.expertise}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Fortune 30 Partners */}
        {fortune30Partners.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Fortune 30 Partners</h3>
            <div className="flex flex-wrap gap-2">
              {fortune30Partners.map(partner => (
                <Badge key={partner.id} variant="outline" style={{ borderColor: partner.color, color: partner.color }}>
                  {partner.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Projects</h3>
            <div className="flex flex-wrap gap-2">
              {projects.map(project => (
                <Badge key={project.id} className="bg-purple-600">
                  {project.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* SPIs */}
        {spis.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">SPIs</h3>
            <div className="flex flex-wrap gap-2">
              {spis.map(spi => (
                <Badge key={spi.id} variant="secondary">
                  {spi.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* SitReps */}
        {sitreps.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">SitReps</h3>
            <div className="flex flex-wrap gap-2">
              {sitreps.map(sitrep => (
                <Badge key={sitrep.id} variant="outline">
                  {sitrep.title}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}