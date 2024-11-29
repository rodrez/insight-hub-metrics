import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SampleDataSettings } from "@/components/settings/SampleDataSettings";
import { StatusColorSettings } from "@/components/settings/StatusColorSettings";
import { DepartmentSettings } from "@/components/settings/DepartmentSettings";
import { TechDomainSettings } from "@/components/settings/TechDomainSettings";
import { AgreementWarningSettings } from "@/components/settings/AgreementWarningSettings";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects()
  });

  const { data: collaborators = [] } = useQuery({
    queryKey: ['collaborators'],
    queryFn: () => db.getAllCollaborators()
  });

  const { data: spis = [] } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  const { data: objectives = [] } = useQuery({
    queryKey: ['objectives'],
    queryFn: () => db.getAllObjectives()
  });

  const { data: sitreps = [] } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

  const { data: smePartners = [] } = useQuery({
    queryKey: ['smePartners'],
    queryFn: () => db.getAllSMEPartners()
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="sample-data">
        <TabsList>
          <TabsTrigger value="sample-data">Sample Data</TabsTrigger>
          <TabsTrigger value="status-colors">Status Colors</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="tech-domains">Tech Domains</TabsTrigger>
          <TabsTrigger value="agreement-warnings">Agreement Warnings</TabsTrigger>
        </TabsList>
        <TabsContent value="sample-data" className="space-y-6">
          <SampleDataSettings />
          
          <Card>
            <CardHeader>
              <CardTitle>Current Database Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
                  <span className="font-medium">Projects</span>
                  <Badge variant="default">{projects.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
                  <span className="font-medium">Fortune 30 Partners</span>
                  <Badge variant="default">
                    {collaborators.filter(c => c.type === 'fortune30').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
                  <span className="font-medium">Internal Partners</span>
                  <Badge variant="default">
                    {collaborators.filter(c => c.type === 'other').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
                  <span className="font-medium">SME Partners</span>
                  <Badge variant="default">{smePartners.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
                  <span className="font-medium">SPIs</span>
                  <Badge variant="default">{spis.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
                  <span className="font-medium">Objectives</span>
                  <Badge variant="default">{objectives.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
                  <span className="font-medium">SitReps</span>
                  <Badge variant="default">{sitreps.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="status-colors">
          <StatusColorSettings />
        </TabsContent>
        <TabsContent value="departments">
          <DepartmentSettings />
        </TabsContent>
        <TabsContent value="tech-domains">
          <TechDomainSettings />
        </TabsContent>
        <TabsContent value="agreement-warnings">
          <AgreementWarningSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}