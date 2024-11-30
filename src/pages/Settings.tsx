import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SampleDataSettings } from "@/components/settings/SampleDataSettings";
import { StatusColorSettings } from "@/components/settings/StatusColorSettings";
import { DepartmentSettings } from "@/components/settings/DepartmentSettings";
import { TechDomainSettings } from "@/components/settings/TechDomainSettings";
import { AgreementWarningSettings } from "@/components/settings/AgreementWarningSettings";
import { Fortune30Settings } from "@/components/settings/partners/Fortune30Settings";
import { SMESettings } from "@/components/settings/partners/SMESettings";
import { BugFixesTab } from "@/components/settings/BugFixesTab";
import DataManagement from "@/components/data/DataManagement";

export default function Settings() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="sample-data">
        <TabsList>
          <TabsTrigger value="sample-data">Sample Data</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="status-colors">Status Colors</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="tech-domains">Tech Domains</TabsTrigger>
          <TabsTrigger value="fortune30">Fortune 30</TabsTrigger>
          <TabsTrigger value="sme">SME Partners</TabsTrigger>
          <TabsTrigger value="agreement-warnings">Agreement Warnings</TabsTrigger>
          <TabsTrigger value="bug-fixes">Bug Fixes</TabsTrigger>
        </TabsList>
        <TabsContent value="sample-data" className="space-y-6">
          <SampleDataSettings />
        </TabsContent>
        <TabsContent value="database">
          <DataManagement />
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
        <TabsContent value="fortune30">
          <Fortune30Settings />
        </TabsContent>
        <TabsContent value="sme">
          <SMESettings />
        </TabsContent>
        <TabsContent value="agreement-warnings">
          <AgreementWarningSettings />
        </TabsContent>
        <TabsContent value="bug-fixes">
          <BugFixesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}